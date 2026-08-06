/* Email capture for news + drops. Posts to /api/leads (Brevo, optional
 * Supabase mirror). Single opt-in capture here; the double-opt-in confirmation
 * is handled on the Brevo side before anything is sent.
 */
import { useState } from "react";

import { useI18n } from "../i18n";

type State = "idle" | "sending" | "done" | "error";

export function NotifyForm() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="fpmc-form-msg">{t("cin.release.done")}</p>;
  }

  return (
    <form className="fpmc-form" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="fpmc-notify-email">
        {t("cin.release.email")}
      </label>
      <input
        id="fpmc-notify-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        placeholder={t("cin.release.email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="fpmc-cta fpmc-cta--release" disabled={state === "sending"}>
        {t("cin.release.notify")}
      </button>
      {state === "error" ? <p className="fpmc-form-msg">{t("cin.release.error")}</p> : null}
    </form>
  );
}
