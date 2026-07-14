/* Giveaway T&C — flag-gated: renders 404 until VITE_FLAG_GIVEAWAY_TERMS=1
 * (merch addendum signed + placeholders filled + lawyer review, see src/flags.ts). */
import { FLAGS } from "../flags";
import { LegalPage } from "./legal/LegalPage";
import { GIVEAWAY_TERMS } from "./legal/giveawayContent";
import { NotFound } from "./NotFound";

export function Terms() {
  if (!FLAGS.giveawayTerms) return <NotFound />;
  return <LegalPage doc={GIVEAWAY_TERMS} />;
}
