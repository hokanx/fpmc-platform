/* Shared premiere email-capture form (double opt-in, step 1).
 * Used by the "/" ReleaseTeaser and (compact) by /links — one form pattern, per repo rules.
 * GDPR: explicit consent checkbox (required) linking to /datenschutz; honeypot for bots. */
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { useI18n } from "../i18n";

async function submitLead(
  email: string,
  locale: string,
  consent: boolean,
  website: string,
): Promise<boolean> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, locale, consent, website }),
  });
  return res.ok;
}

export function LeadCapture({ compact }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot — humans never see it

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !consent || state === "busy") return;
    setState("busy");
    try {
      const ok = await submitLead(email, locale, consent, website);
      setState(ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return <p style={{ color: "var(--light)", margin: 0 }}>{t("cin.release.done")}</p>;
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        gap: "0.8rem",
        maxWidth: compact ? "100%" : 460,
        margin: "0 auto",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/* honeypot — visually hidden, ignored by humans, filled by bots */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <input
        className="fpmc-input"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("cin.release.email")}
        aria-label={t("cin.release.email")}
        style={{ flex: "1 1 240px" }}
      />
      <button type="submit" className="fpmc-cta-ghost" disabled={state === "busy" || !consent}>
        {t("cin.release.notify")}
      </button>
      <label
        style={{
          display: "flex",
          gap: "0.6rem",
          alignItems: "flex-start",
          width: "100%",
          textAlign: "start",
          color: "var(--ash)",
          fontSize: "0.8rem",
          lineHeight: 1.5,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          style={{ marginTop: "0.2rem", accentColor: "var(--light)" }}
        />
        <span>
          {t("lead.consent")}{" "}
          <Link to="/datenschutz" style={{ color: "var(--light)" }}>
            {t("lead.consent.link")}
          </Link>
        </span>
      </label>
      {state === "error" ? (
        <p style={{ color: "var(--ash)", fontSize: "0.85rem", width: "100%", margin: 0 }}>
          {t("cin.release.error")}
        </p>
      ) : null}
    </form>
  );
}
