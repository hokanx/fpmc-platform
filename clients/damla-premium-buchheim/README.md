# Damla Premium Buchheim — Brand-Paket

Fünf eigenständige HTML-Deliverables nach dem „Claude Fable 5 for Brands"-Workflow,
gebaut mit den **echten Daten** von [damlakoeln.de](https://damlakoeln.de)
(komplette Speisekarte mit Preisen, Stand Juli 2026, echte Food-Fotos, Original-Logo).

| Datei | Deliverable | Workflow-Track |
|---|---|---|
| `index.html` | Animierte Brand-Website (One-Pager, DE) | 2 — Branded Website |
| `puzzle.html` | „Das Baklava-Puzzle" — 3×3 Schiebepuzzle mit echten Gerichten, Drag-&-Drop für eigene Fotos | 1 — Interactive Brand Experience |
| `display-loop.html` | In-Store-Display-Loop (läuft unbeaufsichtigt, Kapitel + Fortschrittsleiste, Hoch-/Querformat) | 3 — Product Display Loop |
| `loyalty.html` | „Damla Club" Treueprogramm-Demo (Punkte = „Tropfen", Stufen, Prämien, localStorage) | 4 — Loyalty Program |
| `configurator.html` | Baklava-Teller-Konfigurator (Größe, 9 echte Sorten, Extras, Live-Preis) | 5 — Product Configurator |

## Nutzung

Jede Datei einzeln im Browser öffnen (Doppelklick). Keine Build-Tools, keine externen
Bibliotheken — HTML/CSS/JS in einer Datei.

- **Display-Loop:** im Browser `F11` (Vollbild) auf dem Bildschirm im Laden laufen lassen.
- **Loyalty & Puzzle:** merken sich Stand/Bestzeit im Browser (`localStorage`); Reset-Knopf vorhanden.
- **Konfigurator:** CTA wählt die Restaurantnummer (`tel:`-Link); die Bestellzusammenfassung liegt im Tooltip des Buttons.

## Bilder

Fotos und Logo werden direkt von `damlakoeln.de` geladen (eigene Bilder des Kunden).
Online funktioniert alles sofort; offline greift ein Fallback (Logo wird ausgeblendet,
Kacheln zeigen Platzhalter). Für eine **vollständig offline-fähige** Version:

```bash
./localize-assets.sh   # lädt alle Bilder nach assets/ und schreibt die HTML-Dateien um
```

## Marken-Basis (Recherche)

- **Marke:** Damla (türkisch „Tropfen") · Premium Baklava · Kazım Usta, seit 1993 (Gaziantep → Köln)
- **Standort:** Modemannstraße 3, 51065 Köln (Buchheim) · Tel. 0175 2354282
- **Öffnungszeiten:** Mo–Do & So 09–23 Uhr, Fr–Sa 09–01 Uhr
- **Positionierung:** 100 % halal, alkoholfrei, familienfreundlich; Serpme Kahvaltı, Grill, Künefe, Baklava aus eigener Backstube
- **Rechtsträger (Impressum damlakoeln.de):** Royal Baklava e.K., Claudiastr. 8, 51149 Köln, HRB 33831 (AG Köln)
- **Design-System:** Void-Schwarz `#0A0908` · Creme `#F3EDE2` · Gold `#C9A44C` · Pistazie `#A3B18A`; Serifen-Display (Georgia-Stack), Tropfen/Raute „◆" als Markenmotiv
