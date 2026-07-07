# FPMC Website — Build-Spezifikation & Repo-Handoff

> **Zweck:** Repo-natives Arbeitsdokument für den Aufbau der FPMC-Website (Storefront + Plattform).
> Spiegelt den Blueprint (`FPMC_Website-Blueprint.docx`) in Markdown, damit er neben dem Code lebt
> und von Claude Code / Entwicklern direkt konsumiert werden kann.
>
> **Stand:** 27.06.2026 · Entwurf v1 · Vertraulich — nur für den internen Gebrauch
> **Basis:** selektiver Port der erprobten HOKAN-Komponenten (siehe `HOKAN_HANDOFF.md`)

---

## 0. Kurzfassung

Die FPMC-Website ist zweierlei zugleich: ein cinematic **Schaufenster (Storefront)** und eine
zugangsgeschützte **Plattform** für Kunden, Mitglieder und Partner. Der Plattform-Teil wird nicht von
Null gebaut, sondern übernimmt die bewährten Bausteine aus HOKAN: Zugriffs-/Rollenmodell, Kundenportal,
Mehrsprachigkeit inkl. Arabisch (RTL), Verträge/Rechnungen und die KI-Produktionspipeline.

**Grundsatzentscheidung:** Neues Repository, das die erprobten HOKAN-Teile selektiv übernimmt — ohne
Altlasten, ohne Plattform-Bindung, mit EU-Hosting und FPMC-Marke von Grund auf. Die vier bekannten
Sicherheitslücken werden beim Port **behoben, nicht vererbt**.

---

## 1. Zweck & Zielgruppen

Fünf klar getrennte Nutzergruppen. Jede sieht nur ihren Bereich; die Trennung erzwingt das Rollenmodell (§3).

| Zielgruppe | Bedarf |
|---|---|
| Öffentliche Besucher | Storefront, Showreel/Portfolio, Leistungen, Shop, Kurse — ohne Login |
| Kunden (KMU) | Projektübersicht, Meilensteine, Dateien, Freigaben, Auftragsbestätigung |
| Mitglieder / Artists | Profil, Branding-Kit, Pre-Release-Zugang, Asset-Bibliothek |
| Partner (Affiliate) | Referral-Code, vermittelte Leads, Pipeline, Provisionen |
| Kunden (Shop) | Leichter Customer-Tier: Bestellungen, Downloads, Kurszugang |
| Intern / Admin | Playbooks-Wissensbasis, Asset-Verwaltung, vollständiges Backoffice |

---

## 2. Surfaces & Sitemap

**Öffentlich (Storefront):** Startseite mit Showreel · Leistungen (B2B-KMU & Entertainment getrennt) ·
Portfolio · Shop · Kurse/Ebooks-Katalog · Pre-Release-Teaser · Kontakt · Rechtliches.

**Hinter Login (fünf Bereiche):** leichter Customer (Bestellungen/Downloads) · Kundenportal ·
Mitglieder-/Artist-Bereich · Partner-Dashboard · Intern/Admin.

**Aufteilung:** Eine Code-Basis, aber eine schnelle, SEO-freundliche öffentliche Schicht **vor** der
auth-geschützten App. Schaufenster bleibt schnell und indexierbar; die Plattform ist schwerer und geschützt.

---

## 3. Rollen- & Zugriffsmodell (Reuse aus HOKAN)

Direkt übernommen: Supabase Auth + RLS, Freigabe-Status (`pending` / `approved` / `rejected`) und die
Rollen. Neu: leichterer `customer`-Tier für Shop-Käufer.

| Rolle | Zugriff |
|---|---|
| `visitor` | Nur öffentliche Surfaces |
| `customer` | Eigene Bestellungen, gekaufte Downloads, Kurszugang |
| `client` (KMU) | Eigene Projekte, Dateien, Freigaben, Auftragsbestätigung |
| `member` / artist | Profil, Branding-Kit, Pre-Release, Asset-Bibliothek |
| `partner` | Eingeladen: Referral-Leads, Pipeline, Provisionen |
| `admin` / `owner` | Vollzugriff: Backoffice, Playbooks, Asset- & Nutzerverwaltung |

**Grundsatz:** Zugriff wird vergeben, nicht erraten. Jede Tabelle per RLS abgesichert; `partner` und
`member` sind **invite-only** (admin-angelegt).

---

## 4. Feature-Module

Status pro Modul: **Reuse** (aus HOKAN portiert) · **Reuse+** (portiert & erweitert) · **Neu**.

### 4.1 Plattform / Portal (Kunden / Mitglieder / Partner)
- [x] **Reuse:** Zugriffs-/Rollenmodell, Projekte, Meilensteine, Dateien (versioniert), Kommentare, Freigaben
- [ ] **Reuse+:** Mitglieder-/Artist-Profile als neue Entität auf dem bestehenden Nutzermodell
- [ ] **Neu:** Partner-Dashboard (§4.6) auf der bestehenden Lead → Vertrag-Kette

### 4.2 Merch / Collabs
- [ ] **Neu:** Storefront mit Produkten, Warenkorb, Checkout, Bestellungen
- [ ] **Engine:** Stripe + Stripe Tax (USt.), eigene Produkt-/Bestell-Tabellen in EU-Supabase
- [ ] **Logistik:** Print-on-Demand (z. B. Printful) hinter Stripe — kein Lager, kein Versand

### 4.3 Ebooks / Kurse
- [ ] **Start:** Gated Downloads — Ebooks & einfache Video-Kurse als berechtigungsgeschützte Dateien
- [ ] **Schema:** Entitlement-Layer von Anfang an **LMS-bereit**; Lektionen/Fortschritt/Quiz erst bei Bedarf
- [x] **Reuse:** Datei-/Upload-System und Zugriffsmodell aus HOKAN

### 4.4 Branding-Kit & Assets / Pre-Release
- [x] **Reuse:** Versionierte Uploads, Kategorien, zeitlich begrenzte Share-Links (durch Zugriffsmodell geschützt)
- [ ] **Pre-Release:** Mitglieder-gesteuerter Frühzugang — nur für berechtigte Rollen sichtbar

### 4.5 Playbooks & Strategie (intern)
- [x] **Reuse:** Bibliotheks-Muster aus HOKAN (Prompt-/Angle-/Style-Libraries) als team-interne Wissensbasis
- [ ] **Inhalt:** Die vorhandenen `.docx`-Playbooks werden der erste Bestand der Wissensbasis

### 4.6 Hand-Signatur / Auftragsbestätigung mit signiertem PDF
- [x] **Reuse (stärkster Match):** HOKANs Signatur-Stack — Signatur-Canvas, Base64-Ablage,
  Status-Wechsel (offen → signiert), markenkonformes zweisprachiges PDF, Bestätigungs-E-Mail
- [ ] **Anpassung:** Auftragsbestätigung als leichterer Dokumenttyp über dieselbe Maschinerie;
  Partner-Vereinbarungen laufen ebenfalls darüber

### 4.7 Affiliate / Partner (invite-only)
Kein E-Commerce-Affiliate, sondern ein **B2B-Vertriebs-Provisionsmodell**. Vermittelt werden hochwertige
Service-Deals (Website + KI-Agent + Ads), die über Wochen schließen — passt auf HOKANs
Lead → Kontakt → Vertrag → Zahlung-Kette.

- [ ] **Attribution per Lead, nicht per Klick:** Referral-Code pro Partner; vermittelte KMU treten als
  getaggter Lead ein. Provision entsteht erst beim **signierten Vertrag oder bezahlter Rechnung**
- [ ] **Invite-only:** geprüfte Vertriebspartner, admin-angelegt, eigenes Dashboard
  (vermittelte Leads, Pipeline-Stufe, Abschlüsse, Verdienst)
- [x] **Reuse:** Leads, Verträge, Zahlungen, Rollenmodell, Signatur-Flow
- [ ] **Später optional:** Referral-Codes beim Merch-/Kurs-Checkout auf der Commerce-Schicht

### 4.8 Backoffice (Reuse)
- [x] Verträge mit E-Signatur & zweisprachigem PDF, Rechnungen mit **19 % USt.** und deutscher
  Zahlenformatierung, Zahlungen, Ausgaben, fortlaufende Belegnummern, Audit-Trails — alles aus HOKAN portierbar

---

## 5. Technische Architektur

| Schicht | Entscheidung |
|---|---|
| Frontend | React + Vite (aus HOKAN), FPMC-Marke von Grund auf |
| Backend | Neues, **EU-gehostetes** Supabase-Projekt (Auth, Postgres, RLS, Storage) |
| Commerce | Stripe + Stripe Tax; eigene Produkt-/Bestell-/Entitlement-Tabellen in EU-Supabase |
| Logistik | Print-on-Demand (Printful o. ä.) hinter Stripe |
| KI | Eigener Anbieter statt Plattform-Gateway (Entkopplung von HOKAN) |
| E-Mail | Transaktional über eigene, markenkonforme Domain (kein Sandbox-Absender) |
| Repo | Neu — selektiver Port der erprobten HOKAN-Module |

**Bewusst nicht übernommen:** Plattform-Bindung (Lovable-Skript, Tagger, KI-Gateway), Alt-Seiten-Wildwuchs,
doppelte i18n-/Toast-Pfade, abgeschaltete Lint-Regel.

---

## 6. Marken- & Designsystem

HOKAN ist monochrom-dunkel; FPMC ist Navy/Gold. Token-Muster (zentrale Markenquelle) wird übernommen,
alle Werte ausgetauscht.

| Element | FPMC-Wert |
|---|---|
| Primärfarbe (Navy) | `#1F3A5F` |
| Akzent (Gold) | `#C8A24B` |
| Display-Schrift | Cinzel (Versalien), Pinyon Script (Akzente) |
| Fließtext | Arial; Code: Consolas |
| Bewegtbild | Higgsfield-Motion-Loops als Marken-Signatur |

**Achtung beim Port:** HOKANs fest verdrahteter weißer CTA-Button und die Dark-Mode-`!important`-
Überschreibungen kollidieren mit der FPMC-Palette und werden ersetzt.

---

## 7. Mehrsprachigkeit (i18n)

Direkt übernommen: vier Sprachen (**DE/EN/AR/NL**), RTL-Spiegelung für Arabisch, arabische PDF-Aufbereitung
(Amiri-Font, bidi). Die genuin schwierigen Arabisch-Teile sind damit bereits gelöst.

- DE als Standard; AR mit vollständigem RTL-Layout
- Flache Übersetzungsschlüssel, in allen Sprachdateien synchron pflegen

---

## 8. Datensicherheit & DSGVO

FPMC-Standards gelten ab P0. Beim Port werden HOKANs bekannte Schwachstellen behoben, nicht vererbt.

**Zu beheben beim Port:** unauthentifizierte KI-Passthrough-Route · Sandbox-E-Mail-Absender ·
fehlende Idempotenz bei Zahlungserinnerungen · fest verdrahtete Admin-Adresse.

- EU-Rechenzentrum (Supabase-Region in der EU)
- RLS auf jeder Tabelle; Zugriff strikt rollenbasiert
- 3-2-1-Backups, Versionierung, Restore-Tests — gemäß bestehendem Datensicherungs-Playbook
- AVV mit Dienstleistern (Stripe, Print-on-Demand); Datenminimierung

---

## 9. KI-Funktionen

- **Reuse:** Pipeline **Blueprint → Angle → Creative** ist faktisch der Motor des 48-Stunden-KI-Werbevideo-
  Angebots. *Hinweis:* In HOKAN ist nur Stufe 1 an die Oberfläche angebunden, Stufe 2 ist deployt, aber nicht
  verdrahtet — diese Lücke wird geschlossen.
- **Optional:** KI-Empfang aus dem Website-Workflow-Playbook als kundenseitiger digitaler Empfang in der
  Markenstimme.

---

## 10. Build-Phasen (P0–P6)

Modelliert nach dem bestehenden Website-Workflow-Playbook. Jede Phase endet mit gesichertem,
versioniertem Stand.

| Phase | Inhalt | Ergebnis |
|---|---|---|
| **P0** | Setup, EU-Supabase, Repo, Marken-Tokens | Repo + Zugangsverwaltung, Erst-Commit |
| **P1** | Schema-Port (Zugriff, Rollen, Projekte, Dateien, Verträge, Zahlungen) | Migrierte DB, RLS geprüft |
| **P2** | Portal-Port + i18n/RTL + Signatur/PDF | Funktionierendes Kunden-/Mitglieder-Portal |
| **P3** | Storefront-Neubau (Showreel, Portfolio, Higgsfield) | Cinematic öffentliche Schicht |
| **P4** | Commerce: Merch + Kurse + Entitlements (Stripe/EU) | Shop & Katalog live-fähig |
| **P5** | Partner-Dashboard + KI-Pipeline (Stufe 1+2) | Affiliate- & KI-Funktionen |
| **P6** | QA, SEO, Sicherheits-Härtung, Go-Live | Vollbackup + Release-Tag |

---

## 11. Offene Entscheidung (Platzhalter)

**Provisionsmodell Partner:** rein geschäftlich, noch festzulegen. Sinnvoller Startwert: einmalige Provision
als Prozentsatz des Erstauftragswerts (z. B. **10–15 %**) ODER Prozentsatz des Monatsretainers für die
ersten N Monate. Am Strukturaufbau ändert die genaue Zahl nichts — sie wird später eingesetzt.

---

*Ende der Spezifikation.*
