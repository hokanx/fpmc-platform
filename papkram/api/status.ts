import { send, type Req, type Res } from "./_lib/http";
import { providerId } from "./_lib/provider";

/**
 * GET /api/status — is this deployment actually set up?
 *
 * Configuration mistakes here fail quietly and late: a missing API key looks
 * like "the app is broken", a missing Impressum is a legal problem nobody
 * notices, and an unset Upstash pair means rate limiting silently isn't real.
 * This turns all of that into one URL to open after deploying.
 *
 * **It only ever reports booleans.** No key, no token, no URL, no address is
 * returned — only whether something is set. Everything it reveals is either
 * already public (the provider is named on /datenschutz, the Impressum is public
 * by law) or is a yes/no about our own configuration hygiene.
 */

type Severity = "blocker" | "before_public" | "recommended";

type Check = {
  id: string;
  ok: boolean;
  severity: Severity;
  label: string;
  /** How to fix it. Omitted once the check passes, so a green line can't read like a red one. */
  fix?: string;
};

const isSet = (name: string) => Boolean(process.env[name]?.trim());

export default function handler(req: Req, res: Res): void {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    send(res, 405, { error: "method_not_allowed" });
    return;
  }

  const provider = providerId();
  const keyName = provider === "mistral" ? "MISTRAL_API_KEY" : "ANTHROPIC_API_KEY";

  const impressumFields = ["NAME", "STRASSE", "ORT", "EMAIL"];
  const missingImpressum = impressumFields.filter((f) => !isSet(`IMPRESSUM_${f}`));

  const raw: (Check & { fix: string })[] = [
    {
      id: "provider_key",
      ok: isSet(keyName),
      severity: "blocker",
      label: `API key for ${provider} is set`,
      fix: `Set ${keyName} in the Vercel project's environment variables, then redeploy.`,
    },
    {
      id: "impressum",
      ok: missingImpressum.length === 0,
      severity: "before_public",
      label: "Impressum complete (§ 5 DDG)",
      fix: `Set ${missingImpressum.map((f) => `IMPRESSUM_${f}`).join(", ")}, then redeploy.`,
    },
    {
      id: "shared_rate_limit",
      ok: isSet("UPSTASH_REDIS_REST_URL") && isSet("UPSTASH_REDIS_REST_TOKEN"),
      severity: "recommended",
      label: "Rate limiting shared across instances",
      fix:
        "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. Without them the limit is " +
        "counted per serverless instance and resets on cold starts — a speed bump, not a control.",
    },
    {
      id: "spend_cap",
      ok: process.env.DAILY_REQUEST_CAP?.trim() !== "0",
      severity: "recommended",
      label: "Daily spend cap active",
      fix: "DAILY_REQUEST_CAP is 0, which disables the cap. Set a number, or unset it for the default of 2000.",
    },
    {
      id: "error_reporting",
      ok: isSet("ERROR_WEBHOOK_URL"),
      severity: "recommended",
      label: "Errors forwarded to a webhook",
      fix: "Optional. Set ERROR_WEBHOOK_URL for alerts; otherwise errors only reach Vercel's logs.",
    },
  ];

  const checks: Check[] = raw.map(({ fix, ...check }) => (check.ok ? check : { ...check, fix }));

  const blockers = checks.filter((c) => c.severity === "blocker" && !c.ok);
  const beforePublic = checks.filter((c) => c.severity === "before_public" && !c.ok);

  send(res, 200, {
    provider,
    runnable: blockers.length === 0,
    publishable: blockers.length === 0 && beforePublic.length === 0,
    checks,
  });
}
