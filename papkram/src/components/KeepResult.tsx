import { useState } from "react";
import type { LetterResult } from "../../api/_lib/schema";
import { canShare, copyToClipboard, print, share } from "../lib/keep";
import { CheckIcon, CopyIcon, PrintIcon, ShareIcon } from "./icons";

/**
 * Keep a copy — print (which is also "save as PDF" in every print dialogue),
 * copy the text, or hand it to the system share sheet.
 *
 * All three stay on the device. Nothing here uploads, and nothing here needs an
 * account, which is what lets the privacy page keep saying we store nothing.
 */
export default function KeepResult({ letter }: { letter: LetterResult }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (await copyToClipboard(letter)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    }
  };

  return (
    <section aria-labelledby="behalten-titel" className="print:hidden">
      <h2 id="behalten-titel" className="text-sm font-bold text-ink-soft">
        Antwort behalten
      </h2>

      <div className="mt-3 flex flex-col gap-3">
        <button type="button" className="btn-secondary" onClick={print}>
          <PrintIcon />
          Drucken oder als PDF speichern
        </button>

        <button type="button" className="btn-secondary" onClick={handleCopy}>
          {copied ? <CheckIcon className="text-good" /> : <CopyIcon />}
          {copied ? "Text kopiert" : "Text kopieren"}
        </button>

        {canShare() && (
          <button type="button" className="btn-secondary" onClick={() => void share(letter)}>
            <ShareIcon />
            Weitergeben
          </button>
        )}
      </div>

      {/* Politely load-bearing: someone who prints this to take to a
          Beratungsstelle should not be surprised later that it is gone. */}
      <p aria-live="polite" className="mt-3 text-ink-soft">
        {copied
          ? "Sie können den Text jetzt einfügen, zum Beispiel in eine Nachricht."
          : "Papkram speichert nichts. Wenn Sie die Seite schließen, ist die Antwort weg."}
      </p>
    </section>
  );
}
