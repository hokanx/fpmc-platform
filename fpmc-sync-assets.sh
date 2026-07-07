#!/usr/bin/env bash
# ============================================================
#  FPMC ASSET SYNC — generate anywhere, save + backup in one go
# ============================================================
#  What this does (in plain words):
#    1. Takes one or more Higgsfield CDN links (your generated
#       videos/images).
#    2. Downloads them into 04_Media/incoming/<today's date>/
#    3. Saves them into your git history (add + commit + push)
#       so the 3-2-1 backup rule is respected automatically.
#
#  How to use it:
#    Option A — paste links directly:
#       ./fpmc-sync-assets.sh "https://d8j0ntlcm91z4.cloudfront.net/....mp4" "https://....png"
#
#    Option B — put one link per line in a file called urls.txt
#       (in the same folder), then just run:
#       ./fpmc-sync-assets.sh
#
#  First time only: make it executable with
#       chmod +x fpmc-sync-assets.sh
#
#  Tip: you don't even need to run this yourself — tell Claude
#  Code: "Run fpmc-sync-assets.sh with these links: ..." and it
#  will handle everything, including fixing any errors.
# ============================================================

set -e  # stop immediately if anything fails — no half-done syncs

# ---------- 1. Where are we? ----------
# The script must run inside your FPMC project repo.
if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  echo "❌ This folder is not a git repository."
  echo "   Open a terminal INSIDE your FPMC project folder and try again."
  exit 1
fi
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# ---------- 2. Collect the links ----------
URLS=("$@")
if [ ${#URLS[@]} -eq 0 ] && [ -f "urls.txt" ]; then
  # Read non-empty lines from urls.txt
  while IFS= read -r line; do
    [ -n "$line" ] && URLS+=("$line")
  done < urls.txt
fi

if [ ${#URLS[@]} -eq 0 ]; then
  echo "❌ No links given."
  echo "   Either:  ./fpmc-sync-assets.sh \"<link1>\" \"<link2>\""
  echo "   Or:      put links (one per line) into urls.txt and run again."
  exit 1
fi

# ---------- 3. Make today's incoming folder ----------
TODAY="$(date +%Y-%m-%d)"
DEST="04_Media/incoming/$TODAY"
mkdir -p "$DEST"
echo "📁 Saving into: $DEST"

# ---------- 4. Download every file ----------
COUNT=0
for URL in "${URLS[@]}"; do
  # Keep the original filename from the link; strip any ?query part
  FILENAME="$(basename "${URL%%\?*}")"
  echo "⬇️  Downloading: $FILENAME"
  if curl -fL --retry 3 -o "$DEST/$FILENAME" "$URL"; then
    COUNT=$((COUNT+1))
  else
    echo "⚠️  Could not download: $URL  (skipped, continuing)"
  fi
done

if [ $COUNT -eq 0 ]; then
  echo "❌ Nothing was downloaded — nothing to commit."
  exit 1
fi

# ---------- 5. Commit + push (the backup step) ----------
git add "$DEST"
git commit -m "media: sync $COUNT Higgsfield asset(s) — $TODAY"
git push

echo ""
echo "✅ Done. $COUNT file(s) saved to $DEST, committed and pushed."
echo "   Local copy ✔  ·  Git remote copy ✔  ·  (Cloud drive = your 3rd copy)"
echo "   Reminder: drag the folder to your cloud drive to complete 3-2-1."
