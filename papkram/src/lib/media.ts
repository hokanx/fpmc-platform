import { MAX_MEDIA_BYTES, SUPPORTED_MEDIA, type Media } from "../../api/_lib/schema";

/**
 * Everything that happens to the letter before it leaves the phone.
 *
 * Downscaling here is not only about upload speed: image tokens dominate the
 * cost of a request, and a photographed letter is high-contrast text that reads
 * fine at 1568px. Raise MAX_EDGE if cramped or low-light letters start showing
 * up in the model's `unklar` list.
 */
const MAX_EDGE = 1568;
const JPEG_QUALITY = 0.8;

export type Prepared =
  | { kind: "image"; bitmap: ImageBitmap; width: number; height: number; previewUrl: string }
  | { kind: "pdf"; file: File; previewName: string };

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

  const scale = Math.min(1, MAX_EDGE / Math.max(source.width, source.height));
  const width = Math.round(source.width * scale);
  const height = Math.round(source.height * scale);

  if (scale === 1) {
    return { kind: "image", bitmap: source, width, height, previewUrl: URL.createObjectURL(file) };
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new MediaError("unreadable");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  source.close();

  const blob = await toBlob(canvas);
  const bitmap = await createImageBitmap(blob);
  return { kind: "image", bitmap, width, height, previewUrl: URL.createObjectURL(blob) };
}

/** A redaction box, in the prepared image's own pixel coordinates. */
export type Rect = { x: number; y: number; w: number; h: number };

/**
 * Burns the redaction boxes into the pixels and encodes for upload.
 *
 * The boxes are painted onto the bitmap, not overlaid in the DOM — what leaves
 * the device is a flattened JPEG with opaque black rectangles. There is no
 * layer for anyone downstream to peel off.
 */
export async function encode(prepared: Prepared, rects: Rect[] = []): Promise<Media> {
  if (prepared.kind === "pdf") {
    return { media_type: "application/pdf", data: await fileToBase64(prepared.file) };
  }

  const canvas = document.createElement("canvas");
  canvas.width = prepared.width;
  canvas.height = prepared.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new MediaError("unreadable");

  ctx.drawImage(prepared.bitmap, 0, 0);
  ctx.fillStyle = "#000000";
  for (const r of rects) ctx.fillRect(r.x, r.y, r.w, r.h);

  const blob = await toBlob(canvas);
  if (blob.size > MAX_MEDIA_BYTES) throw new MediaError("too_large");
  return { media_type: "image/jpeg", data: await blobToBase64(blob) };
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new MediaError("unreadable"))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}

const fileToBase64 = (file: File) => blobToBase64(file);

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
