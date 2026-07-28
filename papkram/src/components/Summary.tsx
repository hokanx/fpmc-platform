import type { LetterResult } from "../../api/_lib/schema";
import { LABELS } from "../i18n/labels";
import { hilfeFor } from "../lib/hilfe";
import { AlertIcon } from "./icons";

/**
 * The summary, the glossary, what the model couldn't read, and the disclaimer.
 *
 * `zusammenfassung` is an array of sentences rather than a paragraph, and each
 * one gets its own line. That is a Leichte-Sprache requirement (DIN SPEC 33429:
 * one statement per line) and it reads better at the Einfache-Sprache level too.
 * It is also exactly the shape a read-aloud control would iterate over, which is
 * why the data keeps this form even though read-aloud isn't built yet.
 */
export default function Summary({ letter }: { letter: LetterResult }) {
  const l = LABELS[letter.sprache];
  const hilfe = hilfeFor(letter.art);

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="zusammenfassung-titel">
        <h2 id="zusammenfassung-titel" className="text-xl font-bold">
          {l.zusammenfassung}
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {letter.zusammenfassung.map((satz, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-action" />
              <span>{satz}</span>
            </li>
          ))}
        </ul>
      </section>

      {letter.schwierige_woerter.length > 0 && (
        <section aria-labelledby="woerter-titel">
          <h2 id="woerter-titel" className="text-xl font-bold">
            {l.schwereWoerter}
          </h2>
          <dl className="mt-3 flex flex-col gap-4">
            {letter.schwierige_woerter.map((w) => (
              <div key={w.wort} className="card">
                <dt className="font-bold">{w.wort}</dt>
                <dd className="mt-1 text-ink-soft">{w.erklaerung}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {letter.unklar.length > 0 && (
        <section aria-labelledby="unklar-titel" className="card bg-note-bg">
          <h2 id="unklar-titel" className="text-xl font-bold">
            {l.unklar}
          </h2>
          <ul className="mt-3 list-disc pl-5">
            {letter.unklar.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </section>
      )}

      {letter.hilfe_empfohlen && hilfe.length > 0 && (
        <section aria-labelledby="hilfe-titel">
          <h2 id="hilfe-titel" className="text-xl font-bold">
            {l.hilfe}
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {hilfe.map((h) => (
              <li key={h.name} className="card">
                <a
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-action underline underline-offset-4"
                >
                  {h.name}
                </a>
                <p className="mt-1 text-ink-soft">{h.was}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Never collapsible, never small print. If the app is going to be wrong
          about a deadline, this is the sentence that limits the damage. */}
      <p className="flex items-start gap-3 rounded-card border-2 border-line-strong p-4 text-ink-soft">
        <AlertIcon className="mt-1 h-5 w-5 shrink-0" />
        <span>{l.hinweis}</span>
      </p>
    </div>
  );
}
