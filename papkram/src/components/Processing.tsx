import { useEffect, useState } from "react";

/**
 * A 20–40 second wait needs to say what is happening, not just spin.
 *
 * The stages are honest about the order of work (read the page, then rewrite
 * it), and the last one admits it is taking a while rather than pretending
 * otherwise. Silence here reads as "it broke".
 */
const STAGES = [
  { after: 0, text: "Das Bild wird hochgeladen …" },
  { after: 3000, text: "Der Text wird gelesen …" },
  { after: 9000, text: "Der Brief wird einfacher gemacht …" },
  { after: 20000, text: "Fast fertig. Dieser Brief ist etwas länger …" },
] as const;

export default function Processing({ onCancel }: { onCancel: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = STAGES.map((s, i) =>
      s.after === 0 ? null : window.setTimeout(() => setStage(i), s.after),
    );
    return () => timers.forEach((t) => t !== null && window.clearTimeout(t));
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div
        aria-hidden
        className="h-14 w-14 animate-spin rounded-full border-4 border-line border-t-action motion-reduce:animate-none"
      />
      {/* The status text is the accessible progress indicator — the spinner is decorative. */}
      <p role="status" aria-live="polite" className="text-xl font-bold">
        {STAGES[stage].text}
      </p>
      <p className="text-ink-soft">Das dauert meistens weniger als eine Minute.</p>

      <button
        type="button"
        className="min-h-[3.5rem] font-bold text-action underline underline-offset-4"
        onClick={onCancel}
      >
        Abbrechen
      </button>
    </div>
  );
}
