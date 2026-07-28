/**
 * Angaben gemäß § 5 DDG (früher § 5 TMG).
 *
 * The placeholders below are deliberate. Which legal entity operates Papkram is
 * a decision with liability attached — it is not the same entity as the one
 * that owns this repository unless someone says so. Fill these in before the
 * site goes public; an Impressum that names the wrong operator is worse than a
 * missing one.
 */
const BETREIBER = {
  name: "TODO: Name des Betreibers",
  strasse: "TODO: Straße und Hausnummer",
  ort: "TODO: PLZ und Ort",
  land: "Deutschland",
  email: "TODO: kontakt@…",
  vertreten: "TODO: Vertretungsberechtigte Person",
};

export default function Impressum() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Impressum</h1>

      <div
        role="note"
        className="card border-2 border-urgent bg-urgent-bg"
        data-testid="impressum-todo"
      >
        <p className="font-bold">
          Hinweis für den Betrieb: Dieses Impressum ist noch nicht ausgefüllt.
        </p>
        <p className="mt-1">
          Vor der Veröffentlichung müssen die Angaben in{" "}
          <code className="font-bold">src/pages/Impressum.tsx</code> ergänzt werden. Ohne
          vollständiges Impressum ist der Betrieb in Deutschland abmahnfähig.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold">Angaben gemäß § 5 DDG</h2>
        <address className="mt-2 not-italic">
          {BETREIBER.name}
          <br />
          {BETREIBER.strasse}
          <br />
          {BETREIBER.ort}
          <br />
          {BETREIBER.land}
        </address>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Vertreten durch</h2>
        <p className="mt-2">{BETREIBER.vertreten}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Kontakt</h2>
        <p className="mt-2">E-Mail: {BETREIBER.email}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Haftung für Inhalte</h2>
        <p className="mt-2">
          Papkram fasst Briefe automatisch zusammen. Die Zusammenfassung kann Fehler enthalten. Sie
          ist keine Rechts·beratung, keine Steuer·beratung und keine medizinische Beratung. Maßgeblich
          ist immer der Originalbrief.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Barriere·freiheit</h2>
        <p className="mt-2">
          Papkram ist so gebaut, dass es die Anforderungen der WCAG 2.2 Stufe AA erfüllen soll.
          Wenn Ihnen eine Barriere auffällt, schreiben Sie uns bitte an {BETREIBER.email}.
        </p>
      </section>
    </div>
  );
}
