import { useEffect, useState } from "react";

/**
 * Angaben gemäß § 5 DDG (formerly § 5 TMG).
 *
 * The details come from server environment variables via /api/info rather than
 * living in this file. Two reasons: who legally operates Papkram is a decision
 * with liability attached and not something to guess at in source, and filling
 * it in should be a Vercel settings change rather than a code change and a
 * deploy. Until the variables are set, the page says plainly that it is
 * incomplete — a wrong Impressum is worse than an obviously missing one.
 */
type Impressum = Partial<{
  name: string;
  strasse: string;
  ort: string;
  land: string;
  email: string;
  vertreten: string;
  ustid: string;
}>;

const REQUIRED: (keyof Impressum)[] = ["name", "strasse", "ort", "email"];

export default function ImpressumPage() {
  const [data, setData] = useState<Impressum | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/info")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("info unavailable"))))
      .then((body: { impressum?: Impressum }) => alive && setData(body.impressum ?? {}))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  const missing = data ? REQUIRED.filter((field) => !data[field]) : [];
  const incomplete = data !== null && missing.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Impressum</h1>

      {incomplete && (
        <div role="note" className="card border-2 border-urgent bg-urgent-bg">
          <p className="font-bold">Dieses Impressum ist noch nicht vollständig.</p>
          <p className="mt-1">
            Es fehlen: <code className="font-bold">{missing.join(", ")}</code>. Setzen Sie die
            Umgebungs·variablen{" "}
            <code className="font-bold">
              {missing.map((f) => `IMPRESSUM_${f.toUpperCase()}`).join(", ")}
            </code>{" "}
            im Vercel-Projekt. Ohne vollständiges Impressum ist der Betrieb in Deutschland
            abmahnfähig.
          </p>
        </div>
      )}

      {failed && (
        <p className="card border-2 border-urgent bg-urgent-bg">
          Die Angaben können gerade nicht geladen werden. Bitte laden Sie die Seite neu.
        </p>
      )}

      {data && (
        <>
          <section>
            <h2 className="text-2xl font-bold">Angaben gemäß § 5 DDG</h2>
            <address className="mt-2 not-italic">
              {data.name ?? "—"}
              <br />
              {data.strasse ?? "—"}
              <br />
              {data.ort ?? "—"}
              {data.land && (
                <>
                  <br />
                  {data.land}
                </>
              )}
            </address>
          </section>

          {data.vertreten && (
            <section>
              <h2 className="text-2xl font-bold">Vertreten durch</h2>
              <p className="mt-2">{data.vertreten}</p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold">Kontakt</h2>
            <p className="mt-2">
              E-Mail:{" "}
              {data.email ? (
                <a
                  href={`mailto:${data.email}`}
                  className="font-bold text-action underline underline-offset-4"
                >
                  {data.email}
                </a>
              ) : (
                "—"
              )}
            </p>
          </section>

          {data.ustid && (
            <section>
              <h2 className="text-2xl font-bold">Umsatzsteuer-Identifikations·nummer</h2>
              <p className="mt-2">{data.ustid}</p>
            </section>
          )}
        </>
      )}

      <section>
        <h2 className="text-2xl font-bold">Haftung für Inhalte</h2>
        <p className="mt-2">
          Papkram fasst Briefe automatisch zusammen. Die Zusammenfassung kann Fehler enthalten. Sie
          ist keine Rechts·beratung, keine Steuer·beratung und keine medizinische Beratung. Maßgeblich
          ist immer der Original·brief.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Barriere·freiheit</h2>
        <p className="mt-2">
          Papkram ist so gebaut, dass es die Anforderungen der WCAG 2.2 Stufe AA erfüllen soll. Wenn
          Ihnen eine Barriere auffällt, schreiben Sie uns bitte
          {data?.email ? ` an ${data.email}` : ""}.
        </p>
      </section>
    </div>
  );
}
