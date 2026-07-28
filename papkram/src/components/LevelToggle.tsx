import { LEVELS, type Level } from "../../api/_lib/schema";

const COPY: Record<Level, { titel: string; hinweis: string }> = {
  einfach: { titel: "Einfache Sprache", hinweis: "Kurze Sätze" },
  leicht: { titel: "Leichte Sprache", hinweis: "Sehr kurze Sätze" },
};

type Props = {
  value: Level;
  onChange: (level: Level) => void;
  disabled?: boolean;
};

/**
 * Two reading levels, as a radio group rather than a switch — a switch gives no
 * clue what the other position is, and "off" is a bad way to describe a
 * language variety.
 */
export default function LevelToggle({ value, onChange, disabled }: Props) {
  return (
    <fieldset disabled={disabled} className="disabled:opacity-60">
      <legend className="text-sm font-bold text-ink-soft">
        Wie einfach soll der Text sein?
      </legend>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {LEVELS.map((level) => {
          const active = value === level;
          return (
            <label
              key={level}
              className={`flex min-h-[3.5rem] cursor-pointer flex-col justify-center rounded-card border-2 px-4 py-3 text-center ${
                active
                  ? "border-action bg-action text-white"
                  : "border-line-strong bg-surface text-ink"
              }`}
            >
              <input
                type="radio"
                name="level"
                value={level}
                checked={active}
                onChange={() => onChange(level)}
                className="sr-only"
              />
              <span className="font-bold">{COPY[level].titel}</span>
              <span className={active ? "text-white/85" : "text-ink-soft"}>
                {COPY[level].hinweis}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
