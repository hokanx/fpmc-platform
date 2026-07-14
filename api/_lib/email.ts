/* Double-opt-in confirmation email — DE/EN/AR, achromatic (Lichtspiel), inline styles,
 * no external assets, system font stack (self-hosted webfonts don't apply to email).
 * TEASE RULE (until 22.07): no artist name, no explicit release date — "Erstes Kapitel: 24.07."
 * is the maximum. Keep it that way here. */

type Copy = {
  subject: string;
  preheader: string;
  headline: string;
  body: string;
  cta: string;
  fallback: string;
  ignore: string;
  footer: string;
};

const COPY: Record<string, Copy> = {
  de: {
    subject: "Bitte bestätige deine Anmeldung — FPMC",
    preheader: "Ein Klick, und du stehst auf der Liste für die Premiere.",
    headline: "Fast geschafft.",
    body: "Du hast dich auf fpmc.house für Premiere-Updates eingetragen. Bestätige deine Anmeldung — erst dann bist du auf der Liste. Erstes Kapitel: 24.07.",
    cta: "Anmeldung bestätigen",
    fallback: "Falls der Button nicht funktioniert, öffne diesen Link:",
    ignore: "Wenn du das nicht warst, ignoriere diese E-Mail einfach — ohne Bestätigung passiert nichts.",
    footer: "FPMC – Film Production Music Club GbR · Bergisch Gladbach, Deutschland · hello@fpmc.house",
  },
  en: {
    subject: "Please confirm your signup — FPMC",
    preheader: "One click and you're on the premiere list.",
    headline: "Almost there.",
    body: "You signed up for premiere updates on fpmc.house. Confirm your signup — only then are you on the list. First chapter: 24.07.",
    cta: "Confirm signup",
    fallback: "If the button doesn't work, open this link:",
    ignore: "If this wasn't you, simply ignore this email — nothing happens without confirmation.",
    footer: "FPMC – Film Production Music Club GbR · Bergisch Gladbach, Germany · hello@fpmc.house",
  },
  ar: {
    subject: "يرجى تأكيد اشتراكك — FPMC",
    preheader: "نقرة واحدة وتكون على قائمة العرض الأول.",
    headline: "خطوة أخيرة.",
    body: "لقد سجّلت على fpmc.house لتصلك أخبار العرض الأول. أكّد اشتراكك — عندها فقط تكون على القائمة. الفصل الأول: 24.07.",
    cta: "تأكيد الاشتراك",
    fallback: "إذا لم يعمل الزر، افتح هذا الرابط:",
    ignore: "إذا لم تكن أنت من سجّل، تجاهل هذه الرسالة ببساطة — لن يحدث شيء دون تأكيد.",
    footer: "FPMC – Film Production Music Club GbR · بيرغيش غلادباخ، ألمانيا · hello@fpmc.house",
  },
};

export function emailFor(locale: string, confirmUrl: string): { subject: string; html: string; text: string } {
  const c = COPY[locale] ?? COPY.de;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const font = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const html = `<!doctype html>
<html lang="${locale}" dir="${dir}">
<body style="margin:0;padding:0;background:#0a0a0a;">
  <div style="display:none;max-height:0;overflow:hidden;">${c.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
    <tr><td align="center" style="padding:48px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#141414;border:1px solid #1f1f1f;border-radius:6px;">
        <tr><td dir="${dir}" style="padding:40px 32px;font-family:${font};color:#f2f2f2;">
          <p style="margin:0 0 24px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#8a8a8a;">FPMC</p>
          <h1 style="margin:0 0 16px;font-size:26px;font-weight:600;color:#f2f2f2;">${c.headline}</h1>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#8a8a8a;">${c.body}</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border:1px solid #f2f2f2;border-radius:999px;">
            <a href="${confirmUrl}" style="display:inline-block;padding:12px 32px;font-family:${font};font-size:14px;color:#f2f2f2;text-decoration:none;">${c.cta}</a>
          </td></tr></table>
          <p style="margin:28px 0 4px;font-size:12px;color:#8a8a8a;">${c.fallback}</p>
          <p style="margin:0 0 28px;font-size:12px;word-break:break-all;"><a href="${confirmUrl}" style="color:#8a8a8a;">${confirmUrl}</a></p>
          <p style="margin:0;font-size:12px;line-height:1.6;color:#8a8a8a;">${c.ignore}</p>
        </td></tr>
      </table>
      <p dir="${dir}" style="margin:24px 0 0;font-family:${font};font-size:11px;color:#8a8a8a;">${c.footer}</p>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `${c.headline}

${c.body}

${c.cta}: ${confirmUrl}

${c.ignore}

${c.footer}`;

  return { subject: c.subject, html, text };
}
