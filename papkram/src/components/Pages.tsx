import { useMemo, useState } from "react";
import { BLUR_THRESHOLD, sharpness, type Page, type Rect } from "../lib/media";
import { MAX_PAGES } from "../../api/_lib/schema";
import { usePicker } from "./usePicker";
import { AlertIcon, CameraIcon, CheckIcon, CloseIcon, MarkerIcon, UndoIcon } from "./icons";

type Props = {
  pages: Page[];
  onAddPage: (file: File) => void;
  onRemovePage: (id: string) => void;
  onRectsChange: (id: string, rects: Rect[]) => void;
  onConfirm: () => void;
  onCancel: () => void;
  adding: boolean;
};

/**
 * Review, redact and add pages — one screen for the whole "is this the letter I
 * meant to send?" step.
 *
 * Multi-page matters more here than it might look: a German Bescheid routinely
 * runs to six pages, and the Frist is as often in the Rechtsbehelfsbelehrung on
 * page four as it is on page one. Reading only the first page produces a
 * confident, complete-looking answer that is missing the deadline — worse than
 * no answer at all.
 *
 * Redaction rects live in each page's own pixel coordinates so they survive
 * rescaling; media.encodeAll() burns them into the JPEG, so what uploads is
 * flattened pixels rather than a removable overlay.
 */
export default function Pages({
  pages,
  onAddPage,
  onRemovePage,
  onRectsChange,
  onConfirm,
  onCancel,
  adding,
}: Props) {
  const [current, setCurrent] = useState(0);
  const { inputs, openCamera } = usePicker(onAddPage);

  const index = Math.min(current, pages.length - 1);
  const page = pages[index];
  const multi = pages.length > 1;
  const full = pages.length >= MAX_PAGES;

  if (!page) return null;

  return (
    <div className="flex flex-col gap-5">
      {inputs}

      <div>
        <h2 className="text-2xl font-bold">
          {multi ? `Seite ${index + 1} von ${pages.length}` : "Ist der Brief gut zu lesen?"}
        </h2>
        <p className="mt-2 text-ink-soft">
          Sie können Ihren Namen und Ihre Adresse schwarz machen. Ziehen Sie mit dem Finger über die
          Stelle.
        </p>
        <p className="mt-2 text-ink-soft">
          Ihr Name steht oft noch an einer zweiten Stelle — zum Beispiel in der Anrede. Schauen Sie
          kurz nach.
        </p>
      </div>

      <PageEditor
        key={page.id}
        page={page}
        onRectsChange={(rects) => onRectsChange(page.id, rects)}
      />

      {multi && (
        <PageStrip
          pages={pages}
          index={index}
          onSelect={setCurrent}
          onRemove={(id) => {
            onRemovePage(id);
            setCurrent((c) => Math.max(0, c - 1));
          }}
        />
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="btn-secondary"
          disabled={full || adding}
          onClick={openCamera}
        >
          <CameraIcon />
          {adding ? "Wird geladen …" : "Noch eine Seite fotografieren"}
        </button>
        {full && (
          <p className="text-ink-soft">
            Mehr als {MAX_PAGES} Seiten gehen nicht auf einmal. Schicken Sie den Rest danach.
          </p>
        )}

        <button type="button" className="btn-primary text-xl" onClick={onConfirm} disabled={adding}>
          <CheckIcon className="h-7 w-7" />
          {multi ? `${pages.length} Seiten erklären` : "Brief erklären"}
        </button>

        <button
          type="button"
          className="min-h-14 font-bold text-action underline underline-offset-4"
          onClick={onCancel}
        >
          Von vorne anfangen
        </button>
      </div>
    </div>
  );
}

// --- one page ---------------------------------------------------------------

function PageEditor({ page, onRectsChange }: { page: Page; onRectsChange: (r: Rect[]) => void }) {
  const [drag, setDrag] = useState<Rect | null>(null);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [surface, setSurface] = useState<HTMLDivElement | null>(null);

  // Blur is judged once per page, not on every render — it decodes pixels.
  const blur = useMemo(() => {
    const score = sharpness(page.prepared);
    return score !== null && score < BLUR_THRESHOLD;
  }, [page.prepared]);

  if (page.prepared.kind === "pdf") {
    return (
      <div className="card flex items-center gap-3">
        <CheckIcon className="h-7 w-7 shrink-0 text-good" />
        <div>
          <p className="font-bold">{page.prepared.previewName}</p>
          <p className="text-ink-soft">PDF-Dateien werden ganz gelesen.</p>
        </div>
      </div>
    );
  }

  const { width, height, previewUrl, bitmap } = page.prepared;
  void bitmap;

  const toImage = (clientX: number, clientY: number) => {
    const box = surface!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(width, ((clientX - box.left) / box.width) * width)),
      y: Math.max(0, Math.min(height, ((clientY - box.top) / box.height) * height)),
    };
  };

  const rectFrom = (a: { x: number; y: number }, b: { x: number; y: number }): Rect => ({
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  });

  /**
   * German business letters put the address in a standard window position
   * (DIN 5008: 20mm from the left, 45mm from the top, 85×40mm). One tap covers
   * it — and it gives keyboard and screen-reader users a way to redact without
   * dragging, which a drag-only interface would deny them entirely.
   */
  const addAddressField = () =>
    onRectsChange([
      ...page.rects,
      { x: width * 0.07, y: height * 0.13, w: width * 0.46, h: height * 0.15 },
    ]);

  const preview = drag ? [...page.rects, drag] : page.rects;

  return (
    <div className="flex flex-col gap-4">
      {blur && (
        <p role="status" className="card flex items-start gap-3 border-2 border-urgent bg-urgent-bg">
          <AlertIcon className="mt-1 h-6 w-6 shrink-0 text-urgent" />
          <span>
            <strong>Das Foto sieht unscharf aus.</strong> Vielleicht kann Papkram den Text nicht
            lesen. Machen Sie am besten ein neues Foto — mit mehr Licht und ruhiger Hand.
          </span>
        </p>
      )}

      <div
        ref={setSurface}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setStart(toImage(e.clientX, e.clientY));
          setDrag(null);
        }}
        onPointerMove={(e) => {
          if (start) setDrag(rectFrom(start, toImage(e.clientX, e.clientY)));
        }}
        onPointerUp={() => {
          // Ignore stray taps — only a real drag creates a box.
          if (drag && drag.w > 8 && drag.h > 8) onRectsChange([...page.rects, drag]);
          setStart(null);
          setDrag(null);
        }}
        onPointerCancel={() => {
          setStart(null);
          setDrag(null);
        }}
        className="relative touch-none select-none overflow-hidden rounded-card border-2 border-line-strong bg-surface"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <img
          src={previewUrl}
          alt="Ihr Brief. Ziehen Sie über die Stellen, die Sie abdecken wollen."
          className="pointer-events-none h-full w-full object-contain"
          draggable={false}
        />
        {preview.map((r, i) => (
          <div
            key={i}
            aria-hidden
            className="pointer-events-none absolute bg-black"
            style={{
              left: `${(r.x / width) * 100}%`,
              top: `${(r.y / height) * 100}%`,
              width: `${(r.w / width) * 100}%`,
              height: `${(r.h / height) * 100}%`,
            }}
          />
        ))}
      </div>

      <p aria-live="polite" className="text-ink-soft">
        {page.rects.length === 0
          ? "Auf dieser Seite ist nichts abgedeckt."
          : page.rects.length === 1
            ? "1 Stelle abgedeckt."
            : `${page.rects.length} Stellen abgedeckt.`}
      </p>

      <div className="flex flex-col gap-3">
        <button type="button" className="btn-secondary" onClick={addAddressField}>
          <MarkerIcon />
          Adress·feld abdecken
        </button>
        {page.rects.length > 0 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onRectsChange(page.rects.slice(0, -1))}
          >
            <UndoIcon />
            Letzte Stelle wieder zeigen
          </button>
        )}
      </div>
    </div>
  );
}

// --- page thumbnails --------------------------------------------------------

function PageStrip({
  pages,
  index,
  onSelect,
  onRemove,
}: {
  pages: Page[];
  index: number;
  onSelect: (i: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <nav aria-label="Seiten" className="flex gap-3 overflow-x-auto pb-2">
      {pages.map((page, i) => (
        <div key={page.id} className="relative shrink-0">
          <button
            type="button"
            onClick={() => onSelect(i)}
            aria-current={i === index ? "true" : undefined}
            className={`flex h-24 w-20 items-center justify-center overflow-hidden rounded-card border-2 bg-surface ${
              i === index ? "border-action" : "border-line-strong"
            }`}
          >
            {page.prepared.kind === "image" ? (
              <img
                src={page.prepared.previewUrl}
                alt={`Seite ${i + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="px-1 text-center text-sm font-bold">PDF</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onRemove(page.id)}
            aria-label={`Seite ${i + 1} entfernen`}
            className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-line-strong bg-surface text-ink"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </nav>
  );
}
