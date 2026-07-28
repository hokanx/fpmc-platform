#!/usr/bin/env python3
"""Generate the PWA icons.

Kept in the repo so the icons can be regenerated rather than being opaque
binaries nobody can change. Requires Pillow:

    pip install Pillow && python3 tools/make-icons.py

The mark is a sheet of paper with a folded corner and two short, heavy lines —
"a letter, but shorter". It has to survive being 48px on a home screen, so
there is no fine detail and no text.
"""

from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public" / "icons"

ACTION = (20, 82, 125)  # --color-action
PAPER = (251, 250, 247)  # --color-paper
INK_SOFT = (74, 80, 88)  # --color-ink-soft


def rounded(size: int, radius_ratio: float) -> Image.Image:
    """Blue rounded-square background."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * radius_ratio), fill=ACTION)
    return img


def draw_sheet(img: Image.Image, inset: float) -> None:
    """Paper sheet with a folded top-right corner, centred in the safe area."""
    size = img.size[0]
    d = ImageDraw.Draw(img)

    w = size * (1 - 2 * inset)
    h = w * 1.24
    x0 = (size - w) / 2
    y0 = (size - h) / 2
    x1, y1 = x0 + w, y0 + h
    fold = w * 0.3

    d.polygon(
        [(x0, y0), (x1 - fold, y0), (x1, y0 + fold), (x1, y1), (x0, y1)],
        fill=PAPER,
    )
    # The folded corner, a shade darker so it reads at small sizes.
    d.polygon([(x1 - fold, y0), (x1, y0 + fold), (x1 - fold, y0 + fold)], fill=INK_SOFT)

    # Two heavy lines: the "made shorter" idea, legible at 48px.
    bar_h = h * 0.115
    left = x0 + w * 0.15
    for i, frac in enumerate((0.62, 0.4)):
        top = y0 + h * (0.46 + i * 0.23)
        d.rounded_rectangle(
            [left, top, left + w * frac, top + bar_h],
            radius=bar_h / 2,
            fill=ACTION,
        )


def build(size: int, *, maskable: bool) -> Image.Image:
    # Maskable icons get cropped to a circle by the launcher, so the artwork
    # has to stay inside the middle 80%.
    img = rounded(size, 0.5 if maskable else 0.22)
    draw_sheet(img, inset=0.30 if maskable else 0.22)
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    build(192, maskable=False).save(OUT / "icon-192.png")
    build(512, maskable=False).save(OUT / "icon-512.png")
    build(512, maskable=True).save(OUT / "icon-maskable-512.png")
    print(f"wrote 3 icons to {OUT}")


if __name__ == "__main__":
    main()
