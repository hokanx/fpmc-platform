import type { LetterResult } from "../../api/_lib/schema";
import { formatBetrag, fristInfo } from "../lib/frist";
import { LABELS } from "../i18n/labels";
import { CheckIcon, ClockIcon, EuroIcon } from "./icons";

/**
 * The answer to "do I need to worry about this?", above everything else.
 *
 * German official post is deadline-driven — a Widerspruchsfrist you miss costs
 * real money — so the deadline, the amount and the required action are pulled
 * out of the prose and put where they cannot be skimmed past.
 *
 * Colour never carries the meaning on its own: an urgent deadline is red AND
 * says "Noch 3 Tage", and the amount says "Sie müssen zahlen" rather than
 * relying on a plus or minus sign.
 */
export default function ActionBox({ letter }: { letter: LetterResult }) {
  const l = LABELS[letter.sprache];
  const frist = fristInfo(letter.frist, letter.sprache);

  const urgent = frist?.status === "abgelaufen" || frist?.status === "heute" || frist?.status === "knapp";

  return (
    <section
      aria-labelledby="aktion-titel"
      className="card border-2 border-ink bg-note-bg flex flex-col gap-5"
    >
      <div>
        <h2 id="aktion-titel" className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          {l.worum}
        </h2>
        <p className="mt-1 text-2xl font-bold">{letter.worum_geht_es}</p>
        {letter.absender && (
          <p className="mt-2 text-ink-soft">
            {l.von}: <span className="font-bold text-ink">{letter.absender}</span>
          </p>
        )}
      </div>

      <div className="border-t border-line-strong pt-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-soft">{l.aktion}</h3>
        {letter.aktion ? (
          <p className="mt-1 text-xl font-bold">{letter.aktion}</p>
        ) : (
          <p className="mt-1 flex items-center gap-2 text-xl font-bold text-good">
            <CheckIcon className="h-6 w-6 shrink-0" />
            {l.keineAktion}
          </p>
        )}
      </div>

      {(frist || letter.frist_text) && (
        <div
          className={`flex items-start gap-3 rounded-card p-4 ${
            urgent ? "bg-urgent-bg text-urgent" : "bg-surface text-ink"
          }`}
        >
          <ClockIcon className="mt-0.5 h-6 w-6 shrink-0" />
          <div>
            <p className="text-sm font-bold uppercase tracking-wide">{l.frist}</p>
            {frist ? (
              <>
                <p className="text-xl font-bold">{frist.text}</p>
                <p className={urgent ? "text-urgent" : "text-ink-soft"}>{frist.datum}</p>
              </>
            ) : (
              /* No concrete date on the page — show the letter's own wording
                 rather than inventing a calendar date from "within 4 weeks". */
              <p className="text-xl font-bold">{letter.frist_text}</p>
            )}
          </div>
        </div>
      )}

      {letter.betrag && (
        <div className="flex items-start gap-3 rounded-card bg-surface p-4">
          <EuroIcon className="mt-0.5 h-6 w-6 shrink-0" />
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
              {letter.betrag.richtung === "zahlen" ? l.zahlen : l.erhalten}
            </p>
            <p
              className={`text-2xl font-bold ${
                letter.betrag.richtung === "zahlen" ? "text-urgent" : "text-good"
              }`}
            >
              {formatBetrag(letter.betrag.wert, letter.betrag.waehrung, letter.sprache)}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
