# FPMC · Higgsfield Supercomputer — Content Generation Handoff

Status: 08.07.2026 · v1 · Aligned to Launch Orchestration v7 & Release Plan (Friday, 24 July 2026)
Scope: all AI-generated content for the Radi launch campaign. Execution brief for the Higgsfield agentic system.

---

## 0 · Mission

Generate and process the visual/audio content for FPMC's public launch — the FPMC × Radi release on **Friday 24 July 2026, 18:00 CEST (YouTube Premiere)**. Brand: FPMC — Film Production Music Club, at the intersection of film, music and AI, bridging DACH and MENA. The narrative spine is **Tunisia → Cologne**, one artist bridging two rap cultures.

The Supercomputer produces the **[G] self-generated** assets and the **post-processing** of the cutter's footage. It does NOT replace the human cutter (Dennis) who delivers the MV and raw BTS/podcast edits.

---

## 1 · Non-negotiable guardrails

- **Design: Lichtspiel v2 — fully achromatic.** Void black `#0A0A0A`, monochrome, film grain, volumetric haze, deep vignette. No color accent. Motion slow and confident (drifts, rack focus, luminance) — never bounces/spins.
- **Tease rule (hard):** before **22 July**, NO Radi name, NO release date, NO recognizable face in any public asset. Curiosity is the product.
- **Radi's likeness:** only after his written image approval. Until then, real people appear ONLY from cleared cutter footage (batch-review gated) — never AI-generated as his face. Generated human shots stay silhouette/unidentifiable.
- **Bilingual/trilingual:** core assets DE/EN; MENA delivery via AR dubbing.
- **Backup:** every output → Datentresor `04_Marke_FPMC` + manifest. Higgsfield/CDN is not storage.
- **Review gates:** batch 1 material clears 16 Jul, batch 2 clears 21 Jul. Nothing publishes before its gate.

---

## 2 · Tools & agents to use (Higgsfield capability map)

| Capability | Use in this campaign |
|---|---|
| **generate_video** (Seedance 2.0) | Logo sting, hero loop, tease inserts, section b-roll. Hero-image trick: one reference frame on every clip. std, 1080p, no audio, ~8s. |
| **generate_image** | Countdown graphics, date-announce cards, merch-reveal frame, thumbnail/story backdrops. |
| **reframe** | 16:9 master → 9:16 for Reels/TikTok/Shorts on all cutter footage and MV clips. |
| **upscale_video / upscale_image** | Quality lift on hero + showpiece renders before web compression. |
| **personal_clipper** | Podcast full-cut (YouTube) → vertical clips with subtitles. Core of the sustain phase. |
| **virality_predictor** | Run on every finished teaser/clip BEFORE scheduling. Post only top 2–3 variants. |
| **dubbing** | Podcast + core clips → AR (MENA) and EN. The language pipeline. |
| **remove_background** | Logo/subject compositing for graphics and merch mockups. |
| **motion_control** | Animate a still (e.g. approved artist image, release phase only) with controlled camera move. |
| **shorts_studio** | Restyle a source video into stylized shorts if extra tease variants are needed. |
| **video_analysis** | Scene-by-scene pass on the MV to auto-find hook moments for clip selection. |

---

## 3 · Pipelines (agentic chains — set once, run per asset)

**A · Clip pipeline (sustain + release):**
long-form on YouTube (unlisted) → `personal_clipper` (9:16, subtitles, brand font) → `virality_predictor` → schedule top clips → log links in the content calendar.

**B · Language pipeline (both markets):**
final clip → `dubbing` (AR / EN) → human QA by native speakers (Saeed AR, Hazem AR, Jasper FR) → market-split delivery (DACH accounts vs MENA).

**C · Reframe pipeline (all cutter footage):**
Dennis's 16:9 master → `reframe` 9:16 → add logo sting + watermark → QA gate → schedule.

**D · Hero/showpiece pipeline (website Track 2):**
hero still locked → `generate_video` 2–3 takes → `upscale_video` → compress for web → hand to website build.

---

## 4 · Content plan by phase (aligned to v7)

### Tease · 16–18 Jul  (material = batch 1, cleared 16 Jul)
- 3 silent cinematic snippets, 9:16, no context/name/face. Source: Dennis teaser snippets **intercut with** generated inserts (VU-meter, silhouette, tape reels — already generated). 
- Tools: `reframe` on Dennis footage → intercut generated inserts → logo sting → `virality_predictor` before each post.
- Guardrail: nothing identifies the artist. Pure atmosphere.

### Reveal · 19–21 Jul
- BTS drops (arrival/studio), studio moments, story carousel Tunisia→Cologne.
- Tools: `reframe` + grade to Lichtspiel on Dennis's BTS rough cut; `generate_image` for story-carousel frames; `dubbing` for AR versions.

### Countdown · 22–23 Jul  (name + date now allowed)
- Date-announce card, podcast trailer, merch-reveal graphic, giveaway announcement, YouTube Premiere countdown.
- Tools: `generate_image` (date/merch cards), `reframe` (podcast trailer to 9:16), sting transitions.

### Release · 24 Jul, 18:00 CEST
- MV Premiere. 3–4 vertical MV clips for cross-posting.
- Tools: `video_analysis` on final MV → pick hook moments → `reframe` → sting/watermark → schedule.

### Sustain · from 27 Jul
- Podcast episode + clips, BTS long-form, winner announce, FPMC Music track debut.
- Tools: full **Clip pipeline** + **Language pipeline** on the podcast; `personal_clipper` does the heavy lifting.

---

## 5 · Already generated (reuse — do not regenerate)

In `04_Marke_FPMC` / repo `assets/`, with job IDs in the WS2 Asset Manifest:
- Logo sting (2 variants), logo-anchored hero loop (2 variants)
- Tease inserts A/B/C (VU meter, silhouette, tape reels)
- Backdrop stills (2), static kit (profile/banner/watermark/templates)

Use these first. Generate new only for: countdown/date/merch graphics, the website showpiece hero, and any reframed cutter footage.

---

## 6 · Opening prompt for the Supercomputer session

> Execute the FPMC launch content generation per `FPMC_Higgsfield-Supercomputer-Handoff.md`, aligned to Launch Orchestration v7 and the 24 July release. Work phase by phase (tease → reveal → countdown → release → sustain). For each asset: reuse existing generated assets first (see §5), then generate only what's missing, in Lichtspiel v2 (achromatic, grain, haze, slow motion). Respect the tease rule — no artist name/date/face before 22 July — and use only cleared cutter footage for real people. Run virality_predictor before finalizing any teaser, and the dubbing pipeline for AR/EN. After each asset, output the job ID and the target filename so it can be filed in the Datentresor. Start with the tease-phase assets (needed by 15 July in the scheduler).

---

## 7 · Success criteria

- All tease/reveal/countdown assets produced, QA-passed, in the scheduler by **15 July**.
- Every teaser passed through virality_predictor; only top variants scheduled.
- AR versions exist for all core posts (MENA delivery).
- Every asset filed in the Datentresor with job ID + filename.
- Zero artist-identifying content public before 22 July.
