# FPMC Crew Workspace — Concept Document (App)

As of: 06.07.2026 · v0.1 (draft, ready to refine) · Start no earlier than post-release 24.07. + retro

---

## 1 · Vision

An internal FPMC app connecting the team, all projects, the plan, the context and the files in one place — with Claude integrated directly. Everyone on the team sees live where the project stands; agents run in the background and report results back. The app replaces the interim setup (Datentresor + Claude project + calendar + WhatsApp) with a single surface.

**Not a separate product:** the Crew Workspace is a module of the FPMC Legacy platform (already in the blueprint) and runs on the same stack. Nothing gets built twice.

---

## 2 · Users & Roles

| Role | Who | Rights |
|---|---|---|
| Admin | Hazem | Everything: projects, agents, settings, members |
| Crew | Saeed, Dilara, Jasper | Own tasks, files, chat, approvals in their area |
| Artist (later) | e.g. Radi | Own project only: review links, approvals, dates |

Auth: Supabase Auth, invite-only. Row-level security per role (reuse the pattern from the commerce/partner schema).

---

## 3 · Modules (v1 scope)

1. **Dashboard** — live project state: milestones with status (from the orchestration plan), next hard deadlines, open dependencies ("waiting on..."), recent activity.
2. **Plan & Tasks** — the orchestration plan as a living structure: workstreams → milestones → tasks with owner, deadline, status. Checklists (QA gates) tickable in place, with four-eyes logic (second person confirms).
3. **Files** — metadata view onto the Datentresor (Supabase Storage for small items, references to iCloud/SSD for large media). Versioning visible, "signed" status on contracts.
4. **Team chat + Claude** — one channel per project. Claude as a participant via the Anthropic API: plan questions, document drafts, DE/EN/AR translation — with project context from the app.
5. **Agents** — defined background jobs with run log and feedback:
   - *Status reporter:* summarizes project state daily at 8:00 (push to all)
   - *QA checker:* verifies checklist completeness before each gate, flags gaps
   - *Content pipeline trigger:* kicks off the clip pipeline (Higgsfield API), reports results for approval
   - *Backup guard:* checks that full backups ran before gates
6. **Approvals** — central inbox: every publication/gate as an approval card (view → approve/reject with comment). Replaces approval chaos in chat.

**Not in v1:** client access, invoicing (stays in Köfman), calendar replacement (sync with system calendar is enough), built-in video editing.

---

## 4 · Architecture

- **Stack:** React/Vite + Supabase (EU) — identical to the platform; workspace as a protected `/crew` area behind auth
- **Mobile-first as a PWA** (home-screen install, push via Web Push) — no app-store dependency in v1
- **Claude integration:** Anthropic API (Messages), system prompt with project context from the DB; agents as scheduled edge functions (Supabase Cron) making API calls
- **Design:** Lichtspiel v2 (achromatic), components from the platform kit

## 5 · Data Model (sketch)

`crew_members` (role, contact) · `projects` · `milestones` (date, status, hard/soft) · `tasks` (owner, deadline, checklist JSON) · `approvals` (item, status, approver_1, approver_2) · `files_meta` (path/reference, version, signed) · `messages` (channel, author incl. "claude") · `agent_runs` (agent, input, output, status, feedback)

---

## 6 · Build Phases

- **P-A · Prototype (1–2 days):** clickable artifact prototype with Claude wired in — dashboard + plan + chat as a team demo, decision basis
- **P-B · MVP (1–2 weeks):** auth, dashboard, plan & tasks, approvals — on the platform base
- **P-C · Claude & agents:** chat integration, status reporter, QA checker
- **P-D · Pipelines:** Higgsfield connection, backup guard, artist role

## 7 · Open Questions (resolve before P-B)

1. Push channel: Web Push vs. email vs. both?
2. Agent budget: monthly API cost cap per agent?
3. Artist access already in v1 or only with the second artist project?
4. File strategy: how much in Supabase Storage vs. references only?

## 8 · Start Criterion

No earlier than after the 24 July release and the retro — the launch experience defines the real requirements. First step then: P-A prototype as an artifact in one session.

---

## 9 · Engines: Claude as brain, Higgsfield as hand (added 08.07.2026)

The app is the hub; intelligence and generation are plugged in as services.

**Context as data, not files.** The orchestration plan, release plan and drafts live in the DB as structured records (milestones, tasks, gates, dependencies) — this is what lets the app *reason* about "what's next" rather than just display documents. Source docs stay in the Datentresor; the app holds their structured state.

**Claude (Anthropic API) — the brain:**
- Reads live project state → answers "what's next," surfaces blocked items and approaching gates
- Drafts content, translations (DE/EN/AR), messages — with project context injected
- Powers the per-project chat and the Status-Reporter / QA-Checker agents

**Higgsfield (Higgsfield API) — the generation hand:**
- Called by the Content-Pipeline agent when a task requires an asset (tease insert, reframe, clip, dubbing)
- Every generation is logged against the task that requested it → full traceability
- Result lands in the Approvals inbox (four-eyes) before anything is considered done
- Tools mapped in `FPMC_Higgsfield-Supercomputer-Handoff`: generate_video/image, reframe, personal_clipper, virality_predictor, dubbing, upscale

**Loop:** plan (data) → Claude reasons next step → agent executes (Higgsfield / draft) → result to approval queue → human gate → state updates → next step. This closes the loop the user described: one place that holds context, knows what to do next, executes via Higgsfield, and tracks everything.

**Boundary:** neither Claude nor Higgsfield is the app; both are engines behind the FPMC hub (React/Vite + Supabase). Publishing authority stays with humans (four-eyes), not the agents.

**Build order unchanged:** after 24 July release + retro. P-A prototype first (clickable, Claude wired in), then MVP, then the Higgsfield pipeline integration (phase P-D).
