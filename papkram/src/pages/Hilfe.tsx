import { Link } from "react-router-dom";

const SCHRITTE = [
  {
    titel: "Brief flach hinlegen",
    text: "Legen Sie den Brief auf einen Tisch. Sorgen Sie für gutes Licht. Kein Schatten auf dem Papier.",
  },
  {
    titel: "Foto von oben machen",
    text: "Halten Sie das Handy gerade über den Brief. Der ganze Brief muss auf das Bild passen.",
  },
  {
    titel: "Namen abdecken (wenn Sie wollen)",
    text: "Sie können Ihren Namen und Ihre Adresse schwarz machen. Papkram versteht den Brief trotzdem.",
  },
  {
    titel: "Kurz warten",
    text: "Papkram liest den Brief. Das dauert meistens weniger als eine Minute.",
  },
  {
    titel: "Antwort lesen",
    text: "Sie sehen: Worum geht es? Was müssen Sie tun? Bis wann? Und um wie viel Geld geht es?",
  },
];

export default function Hilfe() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">So geht's</h1>

      <ol className="flex flex-col gap-5">
        {SCHRITTE.map((schritt, i) => (
          <li key={schritt.titel} className="card flex gap-4">
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-action font-bold text-white"
            >
              {i + 1}
            </span>
            <div>
              <h2 className="text-xl font-bold">{schritt.titel}</h2>
              <p className="mt-1 text-ink-soft">{schritt.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <section>
        <h2 className="text-2xl font-bold">Was kann Papkram lesen?</h2>
        <ul className="mt-3 list-disc pl-5">
          <li>Briefe vom Amt, zum Beispiel vom Job·center oder vom Finanz·amt</li>
          <li>Briefe von der Kranken·kasse und von Versicherungen</li>
          <li>Rechnungen und Mahnungen</li>
          <li>Verträge und Briefe vom Vermieter</li>
          <li>Bei·packzettel von Medikamenten</li>
        </ul>
      </section>

      <section className="card bg-note-bg">
        <h2 className="text-2xl font-bold">Wichtig</h2>
        <p className="mt-2">
          Papkram erklärt, was im Brief steht. Papkram sagt Ihnen nicht, was Sie tun sollen. Das ist
          keine Rechts·beratung.
        </p>
        <p className="mt-2">
          Papkram kann Fehler machen. Prüfen Sie wichtige Sachen — zum Beispiel eine Frist oder einen
          Betrag — immer noch einmal im Brief nach.
        </p>
      </section>

      <Link to="/" className="btn-primary">
        Los geht's
      </Link>
    </div>
  );
}
