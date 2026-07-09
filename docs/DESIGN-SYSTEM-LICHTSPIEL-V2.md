# FPMC Design System — Lichtspiel v2 (locked)

Status: locked decision. **Supersedes Blueprint §6 (Navy/Gold)** for all web UI.
The idea: light against darkness — a projector beam in a dark cinema. Everything on the web surface is achromatic; the brand appears through light, typography and motion, not color.

> ## Update — Lichtspiel v2 · Poster edition (2026-07, owner-approved)
> The site now expresses Lichtspiel through a **poster structure** (adapted from a
> maximalist single-accent-on-dark reference), while keeping the **achromatic rule intact**:
> - **Colour:** unchanged — void/carbon/graphite/ash/light, **no hue**. `--light` is the single "accent".
> - **Display type:** **Antonio** (condensed grotesque, self-hosted OFL) replaces Cinzel on the web —
>   UPPERCASE, poster-scale (`clamp()` up to ~13rem), negative tracking, tight leading. Body stays **Inter**.
>   (Cinzel/Pinyon remain valid for print.) The old "Cinzel ≤96px" cap applies to the retired display face only.
> - **Shape language:** controls (buttons/badges/inputs) are **full pills**; cards `6px`; **dotted `--light` rules**
>   separate sections; flat surfaces, **no shadows** (depth via the void→carbon→graphite step).
> - **Motion & imagery:** unchanged — slow projector-beam; Higgsfield cinematic stills/loops behind poster type.
>
> The base spec below still governs colour, motion and a11y. Where it names Cinzel as the web display
> face or a 96px cap, the Poster edition supersedes it for the live site.

## Color tokens (web)
| Token | Value | Use |
|---|---|---|
| `--void` | `#0A0A0A` | Page background |
| `--carbon` | `#141414` | Raised surfaces, cards |
| `--graphite` | `#1F1F1F` | Borders, dividers |
| `--ash` | `#8A8A8A` | Secondary text |
| `--light` | `#F2F2F2` | Primary text, the "beam" |

**Navy `#1F3A5F` and Gold `#C8A24B` are logo/print only. They never appear in web UI** — no buttons, no accents, no hover states.

## Typography (all self-hosted, OFL — no Google Fonts CDN)
| Role | Font | Rules |
|---|---|---|
| Display | Cinzel | UPPERCASE, hard cap **96px**, tracking neutral-to-positive only (never negative) |
| Body | Inter | Weight **300**, 16–18px base, generous line-height (1.6+) |
| Accent | Pinyon Script | Rare, single words/lines only — never paragraphs |
| Arabic | Amiri (display/formal), Noto Naskh Arabic (body) | Full RTL mirroring |

## Motion
- Higgsfield loops are the brand's moving signature (hero background, tease phase)
- Motion is slow and confident: drifts, rack focus, luminance — never bounces, never spins
- Respect `prefers-reduced-motion`: static poster frame fallback

## Components
- Buttons: outlined in `--light` on `--void`, fill inverts on hover (light bg, void text)
- Focus states: 1px `--light` outline, visible always (a11y)
- Cards: `--carbon` on `--void`, 1px `--graphite` border, no shadows (light does the depth)

## Do / Don't
- DO let black space breathe — density is the enemy
- DON'T introduce any hue anywhere in the UI
- DON'T use negative tracking on Cinzel or exceed 96px
- DON'T load fonts from third-party CDNs (GDPR)
