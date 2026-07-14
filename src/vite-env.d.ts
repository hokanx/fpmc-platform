/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "1" enables the giveaway T&C routes + footer links (see src/flags.ts). */
  readonly VITE_FLAG_GIVEAWAY_TERMS?: string;
}
