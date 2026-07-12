// FPMC — shared constants. Single source for contact + social endpoints.

export const CONTACT_EMAIL = "hello@fpmc.house";
export const MAILTO = `mailto:${CONTACT_EMAIL}`;

// Phone / WhatsApp (from the Impressum).
export const PHONE_DISPLAY = "+49 1556 7485270";
export const PHONE_E164 = "+4915567485270";
export const WHATSAPP = "https://wa.me/4915567485270";

// Handle map per Content Pack v2 (09.07.2026): @fpmc.club is superseded.
// TikTok handle provisional — confirm the final @handle before 15 Jul freeze.
export const SOCIALS = {
  youtube: "https://www.youtube.com/@fpmc-house",
  instagram: "https://www.instagram.com/fpmc.house",
  tiktok: "https://www.tiktok.com/@fpmc.house",
} as const;

// First chapter — teaser date (no name reveal before 22.07 per the tease rule).
export const FIRST_CHAPTER = "24.07.";
