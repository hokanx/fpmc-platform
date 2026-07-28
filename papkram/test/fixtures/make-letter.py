#!/usr/bin/env python3
"""Render a realistic German Bewilligungsbescheid as a PNG test fixture.

Used to exercise the capture → redact → result flow without needing a real
letter (which would mean real personal data in the repo). The layout follows
DIN 5008 so the "Adress·feld abdecken" button lands where it should, and the
content is the kind of Behördendeutsch the app exists to untangle: passive
voice, nominalisations, a Rechtsbehelfsbelehrung, and a deadline stated two
different ways.

    pip install Pillow && python3 test/fixtures/make-letter.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent / "bescheid.png"

# A4 at ~150 dpi, close to a decent phone photo of a letter.
W, H = 1240, 1754
MM = W / 210.0  # pixels per millimetre

REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def main() -> None:
    img = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(img)

    f_small = font(REG, 17)
    f_body = font(REG, 21)
    f_bold = font(BOLD, 21)
    f_head = font(BOLD, 30)
    f_logo = font(BOLD, 34)

    left = 20 * MM
    right = W - 20 * MM

    # --- Absender / letterhead -------------------------------------------
    d.text((left, 15 * MM), "Jobcenter Köln", font=f_logo, fill=(0, 0, 0))
    d.line([(left, 24 * MM), (right, 24 * MM)], fill=(0, 0, 0), width=3)

    # --- Anschriftfeld (DIN 5008: 20mm left, 45mm top) --------------------
    d.text((left, 40 * MM), "Jobcenter Köln · 50667 Köln", font=f_small, fill=(90, 90, 90))
    y = 46 * MM
    for line in ["Frau", "Aylin Yıldırım", "Musterstraße 14", "51063 Köln"]:
        d.text((left, y), line, font=f_body, fill=(0, 0, 0))
        y += 8 * MM

    # --- Metadata block, right-aligned ------------------------------------
    meta = [
        ("Bedarfsgemeinschaft", "12345BG0067890"),
        ("Kundennummer", "550D0034567"),
        ("Datum", "14.07.2026"),
    ]
    y = 40 * MM
    for label, value in meta:
        d.text((right - 62 * MM, y), label, font=f_small, fill=(90, 90, 90))
        d.text((right - 62 * MM, y + 5 * MM), value, font=f_body, fill=(0, 0, 0), anchor="la")
        y += 12 * MM

    # --- Betreff -----------------------------------------------------------
    y = 92 * MM
    d.text((left, y), "Bewilligungsbescheid", font=f_head, fill=(0, 0, 0))
    y += 11 * MM
    d.text(
        (left, y),
        "Ihr Antrag auf Bürgergeld vom 02.06.2026",
        font=f_bold,
        fill=(0, 0, 0),
    )
    y += 12 * MM

    body = [
        "Sehr geehrte Frau Yıldırım,",
        "",
        "auf Ihren Antrag hin werden Ihnen für den Bewilligungszeitraum vom",
        "01.08.2026 bis 31.07.2027 Leistungen zur Sicherung des Lebens-",
        "unterhalts nach dem Zweiten Buch Sozialgesetzbuch (SGB II) in",
        "Höhe von monatlich 563,00 EUR bewilligt.",
        "",
        "Die Auszahlung erfolgt jeweils zum Monatsende auf das von Ihnen",
        "benannte Konto. Eine gesonderte Mitteilung ergeht nicht.",
        "",
        "Sie sind verpflichtet, uns alle Änderungen in Ihren persönlichen",
        "und wirtschaftlichen Verhältnissen unverzüglich mitzuteilen. Dies",
        "gilt insbesondere für die Aufnahme einer Erwerbstätigkeit sowie",
        "für Änderungen der Wohnverhältnisse.",
        "",
        "Zur abschließenden Prüfung Ihrer Hilfebedürftigkeit werden Sie",
        "gebeten, die beigefügte Anlage EK ausgefüllt und unterschrieben",
        "sowie die Kontoauszüge der letzten drei Monate einzureichen.",
    ]
    for line in body:
        d.text((left, y), line, font=f_body, fill=(0, 0, 0))
        y += 8 * MM

    # --- The deadline, stated two ways (relative and absolute) -------------
    y += 3 * MM
    d.rectangle([left - 3 * MM, y - 2 * MM, right, y + 20 * MM], outline=(0, 0, 0), width=2)
    d.text(
        (left, y + 1 * MM),
        "Die Unterlagen sind bis spätestens 21.08.2026 vorzulegen.",
        font=f_bold,
        fill=(0, 0, 0),
    )
    d.text(
        (left, y + 9 * MM),
        "Bei Nichtvorlage kann die Leistung vorläufig eingestellt werden.",
        font=f_body,
        fill=(0, 0, 0),
    )
    y += 26 * MM

    # --- Rechtsbehelfsbelehrung -------------------------------------------
    d.text((left, y), "Rechtsbehelfsbelehrung", font=f_bold, fill=(0, 0, 0))
    y += 9 * MM
    for line in [
        "Gegen diesen Bescheid kann innerhalb eines Monats nach Bekannt-",
        "gabe Widerspruch erhoben werden. Der Widerspruch ist schriftlich",
        "oder zur Niederschrift bei der oben genannten Stelle einzulegen.",
    ]:
        d.text((left, y), line, font=f_small, fill=(0, 0, 0))
        y += 6 * MM

    y += 8 * MM
    d.text((left, y), "Mit freundlichen Grüßen", font=f_body, fill=(0, 0, 0))
    d.text((left, y + 14 * MM), "i. A. Hoffmann", font=f_body, fill=(0, 0, 0))

    img.save(OUT)
    print(f"wrote {OUT} ({img.size[0]}×{img.size[1]})")


if __name__ == "__main__":
    main()
