# Damla Premium Buchheim — Demo & Pitch

Konzept-Demo für **Damla Premium Buchheim** (Modemannstraße 3, 51065 Köln · damlakoeln.de),
gebaut nach dem Marken-Workflow aus `brand_workflow.pdf` („How to Use Claude Fable 5 for Brands").

## Dateien

| Datei | Was es ist |
|---|---|
| `pitch.html` | Animierte Präsentation auf Deutsch, 9 Folien. Pfeiltasten / Leertaste / Scroll / Swipe. Verlinkt auf das Demo. |
| `konfigurator.html` | Interaktives Demo: Baklava-Box-Konfigurator mit Live-Vorschau, Live-Preis und Bestell-CTA. |

Beide sind **einzelne, in sich geschlossene HTML-Dateien** — kein Server, kein Build,
keine externen Requests. Doppelklick genügt; direkt an den Kunden übergebbar.

Empfohlener Einstieg: `pitch.html` öffnen, auf Folie 5 auf „Live-Demo öffnen" klicken.

## Umgesetzte Workflow-Module

Der Workflow beschreibt fünf Module. Umgesetzt ist Modul **05 (Produkt-Konfigurator)**,
angewandt auf Baklava-Boxen; die übrigen vier sind im Pitch als Ausbaustufen dargestellt.

## Marken-Setup

- **Farben**: Void `#140E08`, Gold `#D4AF57` / `#EBD79A`, Pistazie `#8FB25E`, Creme `#F3E9D8`
- **Typo**: Cormorant Garamond (Display, kursiv für Akzente) · Inter (Fließtext) — mit System-Fallbacks, keine CDN-Requests
- **Motion**: ruhig und hochwertig; `prefers-reduced-motion` wird respektiert

## Hinweis zu Inhalten

Sorten, Preise und Paketpreise sind **Beispielwerte** für die Demo — recherchiert aus
öffentlichen Quellen, nicht von Damla bestätigt. Vor einer echten Präsentation mit
den tatsächlichen Sorten und Preisen ersetzen (`SIZES`, `SORTS`, `EXTRAS`,
`PER_PIECE_PREMIUM` in `konfigurator.html`).

Der Bestell-CTA zeigt aktuell eine Zusammenfassung als Dialog; in der Live-Version
würde er an WhatsApp Business oder das Bestellsystem gehen.
