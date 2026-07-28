import { send, type Req, type Res } from "./_lib/http";
import { providerId } from "./_lib/provider";

/**
 * GET /api/info — which provider actually processes letters right now.
 *
 * /datenschutz reads this instead of hard-coding a provider name, so flipping
 * AI_PROVIDER can't leave the privacy page quietly lying about where letters
 * are sent. No secrets here — just the name of a configuration choice.
 */
export default function handler(req: Req, res: Res): void {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    send(res, 405, { error: "method_not_allowed" });
    return;
  }
  send(res, 200, { provider: providerId() });
}
