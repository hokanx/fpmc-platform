import { useEffect, useState } from "react";

type Provider = "anthropic" | "mistral";

const PROVIDER_TEXT: Record<Provider, { name: string; ort: string; hinweis: string }> = {
  anthropic: {
    name: "Anthropic",
    ort: "in den USA",
    hinweis:
      "Mit Anthropic gibt es einen Vertrag zur Auftrags·verarbeitung. Anthropic darf Ihren Brief nicht zum Trainieren von KI benutzen.",
  },
  mistral: {
    name: "Mistral AI",
    ort: "in der Europäischen Union",
    hinweis:
      "Mit Mistral gibt es einen Vertrag zur Auftrags·verarbeitung. Ihr Brief verlässt die EU nicht.",
  },
};

/**
 * The privacy page reads the live provider from /api/info rather than hard-
 * coding it. Flipping AI_PROVIDER in Vercel therefore cannot leave this page
 * quietly claiming letters go somewhere they no longer go.
 */
export default function Datenschutz() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/info")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("info unavailable"))))
      .then((data: { provider?: string }) => {
        if (!alive) return;
        setProvider(data.provider === "mistral" ? "mistral" : "anthropic");
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  const p = provider ? PROVIDER_TEXT[provider] : null;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Daten·schutz</h1>

      <section className="card border-2 border-ink bg-note-bg">
        <h2 className="text-2xl font-bold">Das Wichtigste in einfacher Sprache</h2>
        <ul className="mt-3 flex flex-col gap-2">
          <li>Wir speichern Ihren Brief nicht.</li>
          <li>Wir wissen nicht, wer Sie sind.</li>
          <li>Sie müssen sich nicht anmelden.</li>
          <li>Wir setzen keine Werbe·cookies und zählen Sie nicht.</li>
          <li>Sie können Ihren Namen vorher schwarz machen.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Was mit Ihrem Foto passiert</h2>
        <ol className="mt-3 flex flex-col gap-3">
          <li>
            <strong>1. Auf Ihrem Handy.</strong> Das Foto wird kleiner gemacht. Wenn Sie etwas
            abdecken, werden die schwarzen Stellen fest ins Bild gerechnet. Der Teil unter dem
            Schwarz verlässt Ihr Handy nicht.
          </li>
          <li>
            <strong>2. Auf dem Weg.</strong> Das Foto wird verschlüsselt übertragen.
          </li>
          <li>
            <strong>3. Beim Lesen.</strong> Ein KI-Dienst liest das Foto und schreibt die
            Zusammenfassung. Danach wird das Foto weggeworfen.
          </li>
          <li>
            <strong>4. Danach.</strong> Es gibt keine Datenbank und keine Datei mit Ihrem Brief. Wenn
            Sie die Seite schließen, ist alles weg.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Wer den Brief liest</h2>
        {p ? (
          <>
            <p className="mt-2">
              Zum Lesen nutzen wir den Dienst <strong>{p.name}</strong>. Die Computer von {p.name}{" "}
              stehen {p.ort}.
            </p>
            <p className="mt-2">{p.hinweis}</p>
          </>
        ) : failed ? (
          <p className="mt-2">
            Die Angabe zum KI-Dienst kann gerade nicht geladen werden. Bitte laden Sie die Seite neu.
          </p>
        ) : (
          <p className="mt-2 text-ink-soft">Wird geladen …</p>
        )}
        <p className="mt-2">
          Der Dienst bekommt nur das Bild. Er bekommt keinen Namen, keine E-Mail und keine
          IP-Adresse von Ihnen.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Was wir kurz speichern</h2>
        <p className="mt-2">
          Wir merken uns für kurze Zeit, wie oft von einer Internet·adresse (IP-Adresse) Briefe
          geschickt werden. Das schützt vor Missbrauch. Diese Zahl steht nur im Arbeits·speicher und
          ist nach spätestens einer Stunde weg. Sie wird nicht mit Ihrem Brief verbunden.
        </p>
        <p className="mt-2">
          Auf Ihrem Gerät merkt sich Papkram nur eine einzige Sache: ob Sie „Einfache Sprache" oder
          „Leichte Sprache" gewählt haben. Das ist kein Cookie und geht nicht an uns.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Ihre Rechte</h2>
        <p className="mt-2">
          Nach der Daten·schutz-Grund·verordnung (DSGVO) haben Sie das Recht auf Auskunft, Löschung
          und Widerspruch. Weil wir nichts über Sie speichern, gibt es aber nichts, worüber wir
          Auskunft geben oder was wir löschen könnten.
        </p>
        <p className="mt-2">
          Fragen zum Daten·schutz? Die Kontakt·daten stehen im{" "}
          <a href="/impressum" className="font-bold text-action underline underline-offset-4">
            Impressum
          </a>
          .
        </p>
      </section>
    </div>
  );
}
