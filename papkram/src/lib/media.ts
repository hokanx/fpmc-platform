import {
  MAX_MEDIA_BYTES,
  MAX_TOTAL_BYTES,
  SUPPORTED_MEDIA,
  type Media,
} from "../../api/_lib/schema";

/**
 * Everything that happens to the letter before it leaves the phone.
 *
 * Downscaling is not only about upload speed: image tokens dominate the cost of
 * a request, and a photographed letter is high-contrast text that reads fine at
 * 1568px. Raise MAX_EDGE if cramped or low-light letters start showing up in the
 * model's `unklar` list.
 */
const MAX_EDGE = 1568;
const JPEG_QUALITY = 0.8;

/**
 * Fallback encodings, tried in order when a multi-page letter would exceed the
 * upload budget. Losing a little sharpness beats refusing to read page seven.
 */
const FALLBACKS: { edge: number; quality: number }[] = [
  { edge: 1568, quality: 0.7 },
  { edge: 1400, quality: 0.65 },
  { edge: 1200, quality: 0.6 },
  { edge: 1000, quality: 0.55 },
];

export type Prepared =
  | { kind: "image"; bitmap: ImageBitmap; width: number; height: number; previewUrl: string }
  | { kind: "pdf"; file: File; previewName: string };

/** One page of a letter, with any redaction boxes the reader drew on it. */
export type Page = { prepared: Prepared; rects: Rect[]; id: string };

/** A redaction box, in the prepared image's own pixel coordinates. */
export type Rect = { x: number; y: number; w: number; h: number };

export class MediaError extends Error {
  constructor(readonly code: "too_large" | "unsupported" | "unreadable") {
    super(code);
    this.name = "MediaError";
  }
}

export function isSupported(type: string): boolean {
  return (SUPPORTED_MEDIA as readonly string[]).includes(type);
}

export async function prepare(file: File): Promise<Prepared> {
  if (!isSupported(file.type)) throw new MediaError("unsupported");

  if (file.type === "application/pdf") {
    // Nothing to downscale, and nothing to redact — a PDF goes as-is.
    if (file.size > MAX_MEDIA_BYTES) throw new MediaError("too_large");
    return { kind: "pdf", file, previewName: file.name || "Dokument.pdf" };
  }

  let source: ImageBitmap;
  try {
    // `from-image` applies the EXIF orientation, so a photo taken sideways
    // isn't handed to the model upside down.
    source = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new MediaError("unreadable");
  }

  const { canvas, width, height } = drawScaled(source, MAX_EDGE);
  source.close();

  const blob = await toBlob(canvas, JPEG_QUALITY);
  const bitmap = await createImageBitmap(blob);
  return { kind: "image", bitmap, width, height, previewUrl: URL.createObjectURL(blob) };
}

function drawScaled(source: ImageBitmap, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(source.width, source.height));
  const width = Math.round(source.width * scale);
  const height = Math.round(source.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new MediaError("unreadable");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  return { canvas, ctx, width, height };
}

// --- blur detection ---------------------------------------------------------

/**
 * Variance of the Laplacian, the standard cheap sharpness estimate.
 *
 * A blurry photo is the most common way this app fails, and the failure is
 * expensive twice over: the reader waits, and we pay for a request that returns
 * a summary full of `unklar`. Catching it before upload costs nothing.
 *
 * Higher is sharper. Printed text photographed in focus scores well into the
 * hundreds; a visibly soft photo lands under 100.
 */
export function sharpness(prepared: Prepared): number | null {
  if (prepared.kind !== "image") return null;

  // 480px is plenty to judge focus and keeps this at a couple of milliseconds.
  const { canvas, ctx, width, height } = drawScaled(prepared.bitmap, 480);
  const { data } = ctx.getImageData(0, 0, width, height);
  canvas.width = canvas.height = 0; // let it go immediately

  const gray = new Float32Array(width * height);
  for (let i = 0; i < gray.length; i++) {
    const p = i * 4;
    gray[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
  }

  let sum = 0;
  let sumSquares = 0;
  let n = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const lap =
        gray[i - width] + gray[i + width] + gray[i - 1] + gray[i + 1] - 4 * gray[i];
      sum += lap;
      sumSquares += lap * lap;
      n++;
    }
  }
  if (n === 0) return null;

  const mean = sum / n;
  return sumSquares / n - mean * mean;
}

/**
 * Below this, warn.
 *
 * Measured against the test fixtures at 480px:
 *   clean scan                 3267
 *   realistic phone photo       563   (noise, skew, uneven light)
 *   mildly soft (σ≈1.6)         164   — still readable, deliberately not warned
 *   genuinely blurry (σ≈3.0)     34   — warned
 *
 * Set forgiving on purpose. A vision model reads mildly soft text fine, and a
 * false "this is blurry" on a photo that would have worked is worse than a
 * missed warning — the reader can always submit anyway, but being told to retake
 * a perfectly good photo is just an obstacle.
 */
export const BLUR_THRESHOLD = 90;

// --- encoding ---------------------------------------------------------------

/**
 * Burns redaction boxes into the pixels and encodes every page for upload,
 * stepping down quality until the whole letter fits the budget.
 *
 * The boxes are painted onto the bitmap, not overlaid in the DOM — what leaves
 * the device is a flattened JPEG with opaque black rectangles. There is no layer
 * for anyone downstream to peel off.
 */
export async function encodeAll(pages: Page[]): Promise<Media[]> {
  const attempts = [{ edge: MAX_EDGE, quality: JPEG_QUALITY }, ...FALLBACKS];

  for (const [index, attempt] of attempts.entries()) {
    const encoded = await Promise.all(pages.map((page) => encodeOne(page, attempt)));
    const total = encoded.reduce((sum, m) => sum + decodedBytes(m.data), 0);

    if (total <= MAX_TOTAL_BYTES) return encoded;

    // Out of fallbacks: the reader has photographed more than we can send in one
    // request, and the honest answer is to say so rather than silently drop pages.
    if (index === attempts.length - 1) throw new MediaError("too_large");
  }

  throw new MediaError("too_large");
}

async function encodeOne(page: Page, opts: { edge: number; quality: number }): Promise<Media> {
  const { prepared, rects } = page;

  if (prepared.kind === "pdf") {
    return { media_type: "application/pdf", data: await blobToBase64(prepared.file) };
  }

  const { canvas, ctx, width, height } = drawScaled(prepared.bitmap, opts.edge);

  // Rects are stored in the prepared image's coordinates; rescale them if this
  // attempt is drawing smaller, or the boxes would drift off the text they cover.
  const scale = width / prepared.width;
  ctx.fillStyle = "#000000";
  for (const r of rects) {
    ctx.fillRect(r.x * scale, r.y * scale, r.w * scale, r.h * scale);
  }
  void height;

  const blob = await toBlob(canvas, opts.quality);
  return { media_type: "image/jpeg", data: await blobToBase64(blob) };
}

const decodedBytes = (base64: string) => Math.floor((base64.length * 3) / 4);

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new MediaError("unreadable"))),
      "image/jpeg",
      quality,
    );
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new MediaError("unreadable"));
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:<type>;base64," prefix — the API wants raw base64.
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(blob);
  });
}

/** Frees the object URL and decoded bitmap behind a page. */
export function releasePage(page: Page): void {
  if (page.prepared.kind === "image") {
    URL.revokeObjectURL(page.prepared.previewUrl);
    page.prepared.bitmap.close();
  }
}
