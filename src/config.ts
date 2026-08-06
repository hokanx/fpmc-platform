// FPMC — shared constants. Single source for contact, socials, the release and
// the real content the pages are built from. Nothing in here is invented: every
// value is either from the Impressum, the live site, or the brand vault.

export const CONTACT_EMAIL = "hello@fpmc.house";
export const MAILTO = `mailto:${CONTACT_EMAIL}`;

// Phone / WhatsApp (from the Impressum).
export const PHONE_DISPLAY = "+49 1556 7485270";
export const PHONE_E164 = "+4915567485270";
export const WHATSAPP = "https://wa.me/4915567485270";

// Handle map per Content Pack v2 (09.07.2026): sign-off is always fpmc.house.
// Platform-native handles: IG @fpmc.house · YT @fpmc-house · TikTok @fpmc.club.
export const SOCIALS = {
  youtube: "https://www.youtube.com/@fpmc-house",
  instagram: "https://www.instagram.com/fpmc.house",
  tiktok: "https://www.tiktok.com/@fpmc.club",
} as const;

export const SOCIAL_ROW = [
  { key: "instagram", label: "Instagram", handle: "@fpmc.house", href: SOCIALS.instagram },
  { key: "youtube", label: "YouTube", handle: "@fpmc-house", href: SOCIALS.youtube },
  { key: "tiktok", label: "TikTok", handle: "@fpmc.club", href: SOCIALS.tiktok },
] as const;

/* ------------------------------------------------------------------ release */

// First chapter — 07.08.2026, 16:00 German time (CEST = UTC+2).
export const RELEASE_AT = "2026-08-07T16:00:00+02:00";
export const RELEASE_DATE_LABEL = "07.08.2026";
export const RELEASE_TIME_LABEL = "16:00 Uhr";
export const FIRST_CHAPTER = "07.08.";

/** The premiere link goes live with the drop — kept null until it exists. */
export const PREMIERE_URL: string | null = null;

/* ----------------------------------------------------------------- giveaway */
// Facts confirmed by FPMC: 3 pieces, FPMC x Redstar Radi collab, runs on
// Instagram, date announced later. No terms are published here — the terms doc
// is still a draft pending legal review.
export const GIVEAWAY = {
  pieces: 3,
  item: "T-Shirt",
  collab: "FPMC × Redstar Radi",
  channel: "Instagram",
  channelHref: SOCIALS.instagram,
} as const;

/* -------------------------------------------------------------------- label */

export const ARTIST = {
  name: "Redstar Radi",
  instagram: "https://www.instagram.com/redstarradi",
  followers: 203532,
  note: "Fondateur du groupe RedStar",
} as const;

/* ---------------------------------------------------------------- portfolio */
// Live client websites built by FPMC.
export const WEBSITES = [
  {
    name: "Sacky Ink",
    kind: "Tattoo-Studio",
    city: "Bergisch Gladbach",
    href: "https://sacky-ink.higgsfield.app/",
  },
  {
    name: "Geuenich Immobilien",
    kind: "Immobilien",
    city: "Bergisch Gladbach",
    href: "https://geuenich-immobilien.higgsfield.app/",
  },
  {
    name: "ChiRi",
    kind: "Restaurant",
    city: "Bergisch Gladbach",
    href: "https://chiri-cinema.higgsfield.app/",
  },
  {
    name: "Lobby Shishalounge",
    kind: "Shisha-Lounge",
    city: "Köln-Mülheim",
    href: "https://lobby-shishalounge.higgsfield.app/",
  },
] as const;

/* --------------------------------------------------------------------- reels */
// Real reels from @fpmc.house, downloaded and re-encoded as silent preview
// loops. `plays` are the real view counts at the time of the build.
export type Reel = {
  code: string;
  caption: string;
  plays: number;
  href: string;
};

export const REELS: Record<string, Reel> = {
  radi: {
    code: "DbsUtDCOc1u",
    caption: "موسم الهجرة الي الشمال",
    plays: 9429,
    href: "https://www.instagram.com/reel/DbsUtDCOc1u/",
  },
  getReady1: {
    code: "DbadIv1oNpb",
    caption: "Get Ready",
    plays: 1208,
    href: "https://www.instagram.com/reel/DbadIv1oNpb/",
  },
  getReady2: {
    code: "DbQbtN2oXLZ",
    caption: "Get Ready",
    plays: 762,
    href: "https://www.instagram.com/reel/DbQbtN2oXLZ/",
  },
  iykyk: {
    code: "DbWTZsZxBWP",
    caption: "IYKYK",
    plays: 222,
    href: "https://www.instagram.com/reel/DbWTZsZxBWP/",
  },
};

export const reelSrc = (code: string) => `/media/reels/${code}.mp4`;
export const reelPoster = (code: string) => `/media/reels/${code}-poster.jpg`;
