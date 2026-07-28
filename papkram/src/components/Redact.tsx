import { useRef, useState } from "react";
import type { Prepared, Rect } from "../lib/media";
import { CheckIcon, MarkerIcon, UndoIcon } from "./icons";

type Props = {
  prepared: Extract<Prepared, { kind: "image" }>;
  onConfirm: (rects: Rect[]) => void;
  onCancel: () => void;
};

/**
 * Optional privacy step: paint over your name and address before the photo
 * leaves the phone.
 *
 * Rects live in the prepared image's own pixel coordinates so they survive
 * rotation and rescaling of the on-screen preview; media.encode() burns them
 * into the JPEG, so what uploads is flattened pixels, not a removable overlay.
 */
export default function Redact({ prepared, onConfirm, onCancel }: Props) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const [drag, setDrag] = useState<Rect | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  /** Screen coordinates → image pixel coordinates. */
  const toImage = (clientX: number, clientY: number) => {
    const box = surfaceRef.current!.getBoundingClientRect();
    const x = ((clientX - box.left) / box.width) * prepared.width;
    const y = ((clientY - box.top) / box.height) * prepared.height;
    return {
      x: Math.max(0, Math.min(prepared.width, x)),
      y: Math.max(0, Math.min(prepared.height, y)),
    };
  };

  const rectFrom = (a: { x: number; y: number }, b: { x: number; y: number }): Rect => ({
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = toImage(e.clientX, e.clientY);
    setDrag(null);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    setDrag(rectFrom(start.current, toImage(e.clientX, e.clientY)));
  };

  const onPointerUp = () => {
    // Ignore stray taps — only a real drag creates a box.
    if (drag && drag.w > 8 && drag.h > 8) setRects((prev) => [...prev, drag]);
    start.current = null;
    setDrag(null);
  };

  /**
   * German business letters put the address in a standard window position
   * (DIN 5008: 20mm from the left, 45mm from the top, 85×40mm). One tap covers
   * it — and it gives keyboard and screen-reader users a way to redact without
   * dragging.
   */
  const addAddressField = () => {
    setRects((prev) => [
      ...prev,
      {
        x: prepared.width * 0.07,
        y: prepared.height * 0.13,
        w: prepared.width * 0.46,
        h: prepared.height * 0.15,
      },
    ]);
  };

  const preview = drag ? [...rects, drag] : rects;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold">Wollen Sie etwas abdecken?</h2>
        <p className="mt-2 text-ink-soft">
          Sie können Ihren Namen und Ihre Adresse schwarz machen. Ziehen Sie mit dem Finger über die
          Stelle. Der Brief wird dann ohne diese Stelle verschickt.
        </p>
        <p className="mt-2 text-ink-soft">Sie können diesen Schritt auch überspringen.</p>
      </div>

      <div
        ref={surfaceRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative touch-none select-none overflow-hidden rounded-card border-2 border-line-strong bg-surface"
        style={{ aspectRatio: `${prepared.width} / ${prepared.height}` }}
      >
        <img
          src={prepared.previewUrl}
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
              left: `${(r.x / prepared.width) * 100}%`,
              top: `${(r.y / prepared.height) * 100}%`,
              width: `${(r.w / prepared.width) * 100}%`,
              height: `${(r.h / prepared.height) * 100}%`,
            }}
          />
        ))}
      </div>

      <p aria-live="polite" className="text-ink-soft">
        {rects.length === 0
          ? "Noch nichts abgedeckt."
          : rects.length === 1
            ? "1 Stelle abgedeckt."
            : `${rects.length} Stellen abgedeckt.`}
      </p>

      <div className="flex flex-col gap-3">
        <button type="button" className="btn-secondary" onClick={addAddressField}>
          <MarkerIcon />
          Adress·feld abdecken
        </button>

        {rects.length > 0 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setRects((prev) => prev.slice(0, -1))}
          >
            <UndoIcon />
            Letzte Stelle wieder zeigen
          </button>
        )}

        <button type="button" className="btn-primary text-xl" onClick={() => onConfirm(rects)}>
          <CheckIcon className="h-7 w-7" />
          {rects.length > 0 ? "Weiter" : "Weiter ohne Abdecken"}
        </button>

        <button
          type="button"
          className="min-h-[3.5rem] font-bold text-action underline underline-offset-4"
          onClick={onCancel}
        >
          Anderes Foto nehmen
        </button>
      </div>
    </div>
  );
}
