#!/usr/bin/env bash
# Lädt alle von damlakoeln.de eingebundenen Bilder in ./assets/ herunter und
# ersetzt die URLs in den HTML-Dateien durch lokale Pfade → Deliverables laufen offline.
# Aufruf: ./localize-assets.sh   (benötigt: bash, curl, grep, sed)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p assets

urls=$(grep -hoE "https://damlakoeln\.de/wp-content/uploads/[^'\")]+" ./*.html | sort -u)

for url in $urls; do
  file="assets/$(basename "$url")"
  if [ ! -f "$file" ]; then
    echo "→ $file"
    curl -sL -A "Mozilla/5.0" -o "$file" "$url" || { echo "  Fehler bei $url"; rm -f "$file"; continue; }
  fi
  esc=$(printf '%s' "$url" | sed 's/[&/\]/\\&/g')
  sed -i.bak "s|$esc|$file|g" ./*.html
done
rm -f ./*.html.bak
echo "Fertig. Bilder liegen in assets/, HTML-Dateien zeigen auf lokale Kopien."
