/* Build-time feature flags (Vite env — inlined at build; flipping one means
 * setting the env var in Vercel and redeploying, a deliberate release event). */
export const FLAGS = {
  /** Giveaway T&C: /teilnahmebedingungen + /terms routes and the footer links.
   *  Enable ONLY once (a) the merch addendum is signed, (b) placeholders are
   *  filled, (c) a lawyer has reviewed the copy. Set VITE_FLAG_GIVEAWAY_TERMS=1. */
  giveawayTerms: import.meta.env.VITE_FLAG_GIVEAWAY_TERMS === "1",
} as const;
