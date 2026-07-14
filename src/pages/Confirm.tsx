/* Double-opt-in landing page. The confirmation email links here (?token=…);
 * a human click POSTs the token to /api/confirm — deliberately NOT confirmed on
 * page load: mail scanners prefetch links, and a GET-confirm would auto-fire. */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Reveal } from "../components/motion/Reveal";

type State = "idle" | "busy" | "ok" | "invalid" | "expired" | "error";

export function Confirm() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>(token ? "idle" : "invalid");
  useDocumentTitle(t("confirm.title"));

  const confirm = async () => {
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string };
      if (res.ok && data.status === "ok") setState("ok");
      else if (data.status === "expired") setState("expired");
      else if (data.status === "invalid") setState("invalid");
      else setState("error");
    } catch {
      setState("error");
    }
  };

  const done = state === "ok" || state === "invalid" || state === "expired" || state === "error";
  const headline =
    state === "ok"
      ? t("confirm.title.ok")
      : state === "expired"
        ? t("confirm.title.expired")
        : state === "invalid"
          ? t("confirm.title.invalid")
          : t("confirm.title");
  const body =
    state === "ok"
      ? t("confirm.body.ok")
      : state === "expired"
        ? t("confirm.body.expired")
        : state === "invalid"
          ? t("confirm.body.invalid")
          : state === "error"
            ? t("confirm.error")
            : t("confirm.body");

  return (
    <section className="px-5 py-28">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="eyebrow text-ash">FPMC</p>
        <h1 className="mt-6 text-2xl">{headline}</h1>
        <p className="mt-4 text-ash">{body}</p>
        <div className="mt-8 flex justify-center">
          {done ? (
            <Link to="/" className="btn">
              {t("confirm.back")}
            </Link>
          ) : (
            <button type="button" className="btn" onClick={confirm} disabled={state === "busy"}>
              {state === "busy" ? t("confirm.busy") : t("confirm.cta")}
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
