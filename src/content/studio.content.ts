/**
 * FPMC — /studio services route copy
 * Door 2 (SMB services). DE = primary, EN = toggle.
 *
 * VOICE (enforce when editing):
 *  - short, powerful sentences · benefit before feature · no fluff
 *  - no superlatives without proof · one voice everywhere
 *  - confident · warm · real. A crew, not an agency.
 *  - AI shows up as speed + price, never as a buzzword.
 *  - Hero limits: headline ≤7 words · subline ≤15 · CTA ≤3.
 *  - Banned: innovativ, maßgeschneiderte Lösungen, ganzheitlich, Synergien,
 *    "Ihr zuverlässiger Partner", "Qualität die überzeugt", exclamation-hype, emoji.
 *
 * NOTE: "4 Sprachen" counter is a client-serving claim (DE/EN/AR/TR).
 *       The crew collectively also covers FR/NL/SQ — adjust if useful.
 */

export const studioContent = {
  de: {
    nav: { services: "Leistungen", work: "Arbeiten", pricing: "Preise", contact: "Kontakt", cta: "Anfragen" },

    hero: {
      headline: "Websites, Film & Sound. In 7 Tagen live.",
      subline: "Wir kommen aus echter Filmproduktion — und bauen mit KI, was Agenturen Wochen kostet.",
      badges: ["Faire Preise", "Änderungen in Stunden", "Alles im Haus"],
      ctaPrimary: "Jetzt anfragen",
      ctaSecondary: "Preise ansehen",
    },

    why: {
      headline: "Warum überhaupt eine Website?",
      sub: "Sechs Gründe. Tipp einen an.",
      reasons: [
        { label: "Sichtbarkeit", line: "Gefunden werden, wenn Kunden suchen." },
        { label: "Vertrauen", line: "Ein Auftritt, der zu deiner Arbeit passt." },
        { label: "Buchungen", line: "Anfragen rund um die Uhr, ohne Anruf." },
        { label: "Google", line: "Oben stehen, wo entschieden wird." },
        { label: "Social-Hub", line: "Ein Ort, auf den alle Kanäle zeigen." },
        { label: "Rund um die Uhr", line: "Die Seite arbeitet, auch nachts." },
      ],
    },

    crew: {
      headline: "Vier Leute. Ein Team. Keine Agentur.",
      sub: "Film, Sound, Business und KI — alles im Haus.",
      members: [
        { name: "Saeed", role: "Film & Regie. SAE-Diplom, echte Produktionen.", langs: "AR · DE · EN" },
        { name: "Dilara", role: "Finanzen & Organisation. Struktur hinter der Kreativität.", langs: "DE · EN · TR" },
        { name: "Jasper", role: "Sound & Musikproduktion. Audio-Diplom, Producer.", langs: "DE · EN · FR" },
        { name: "Hazem", role: "KI, Design & Marketing. Baut und erzählt.", langs: "AR · DE · EN · NL" },
      ],
      counters: [
        { value: "0", label: "versteckte Kosten" },
        { value: "100%", label: "im Haus" },
        { value: "4", label: "Sprachen" },
        { value: "48h", label: "Video-Lieferung" },
      ],
    },

    showreel: {
      headline: "Seiten, die man anfassen kann.",
      sub: "Jedes Projekt ist live. Tipp drauf, sieh selbst.",
    },

    how: {
      headline: "So läuft's ab.",
      steps: [
        { title: "Kurzes Gespräch", line: "15 Minuten. Wir hören zu." },
        { title: "Konzept in 48h", line: "Du siehst, wohin es geht." },
        { title: "Wir bauen", line: "Du machst dein Geschäft, wir den Rest." },
        { title: "Live in 7 Tagen", line: "Deine Seite geht online." },
        { title: "Änderungen in Stunden", line: "Kein Ticket-System. Kurze Wege." },
      ],
    },

    pricing: {
      headline: "Klare Preise. Keine Überraschungen.",
      sub: "Einmalig, kein Zwangs-Abo, kostenlose Erstberatung.",
      tiers: [
        { name: "Simple", price: "ab 1.499 €", line: "One-Pager mit Kino-Hero, mobil perfekt, in 7 Tagen live.", highlight: false },
        { name: "Professional", price: "ab 2.999 €", line: "Scroll-Hero, 3 Clips, volle Struktur, SEO-Basis, DE + 1 Sprache.", highlight: true, tag: "Beliebt" },
        { name: "Cinematic", price: "ab 4.999 €", line: "5-Clip-Journey, HUD, Sound-Design-Option, DE / AR / EN.", highlight: false },
      ],
      addons: [
        { name: "Spec-Ad-Paket", price: "ab 899 €", line: "3 KI-Werbeclips inkl. Ton & Voiceover. In 48h." },
        { name: "Digital Boost", price: "monatlich", line: "Pflege + 3 Clips im Monat. Der laufende Schub." },
      ],
      footnote: "Alles einmalig · kein Zwangs-Abo · kostenlose Erstberatung.",
    },

    entertainment: {
      headline: "Wir machen auch Musik.",
      body: "Musikvideos, Sound-Design, eigene Produktionen — die Brücke zwischen DACH und der arabischen Welt. Das hört man.",
      cta: "Musik ansehen",
    },

    proof: {
      headline: "Ehrlich statt aufgeblasen.",
      body: "Auswahl aus aktiven Projekten. Kundenstimmen folgen, sobald die ersten Seiten ein paar Wochen laufen.",
    },

    faq: {
      headline: "Kurz erklärt.",
      items: [
        { q: "Was kostet das?", a: "Ab 1.499 € einmalig. Endpreis nach dem Erstgespräch — keine versteckten Kosten." },
        { q: "Wie lange dauert es?", a: "Sieben Tage bis live, sobald wir deine Inhalte haben." },
        { q: "Was braucht ihr von mir?", a: "Ein kurzes Briefing, deine Logos und Fotos, deine Freigaben. Den Rest machen wir." },
        { q: "Wem gehört die Seite?", a: "Dir. Voller Zugang, keine Abhängigkeit von uns." },
        { q: "Und das Hosting?", a: "Schnell und sicher in der EU. Wir richten alles ein." },
        { q: "KI — ist das erlaubt?", a: "Ja. KI ist unser Werkzeug. Konzept, Schnitt und Qualität kommen von uns." },
      ],
    },

    contact: {
      headline: "Lass uns kurz reden.",
      sub: "Antwort in Minuten auf WhatsApp. Oder füll das Formular aus — wir melden uns.",
      whatsapp: "Direkt auf WhatsApp",
      form: {
        need: { label: "Worum geht's?", options: ["Website", "Video", "Sound / Musik", "Weiß noch nicht"] },
        pkg: { label: "Welches Paket?", options: ["Simple", "Professional", "Cinematic", "Spec-Ad", "Unsicher"] },
        start: { label: "Wann?", options: ["So schnell wie möglich", "Diesen Monat", "Schaue mich erst um"] },
        name: "Name",
        email: "E-Mail",
        phone: "Telefon",
        message: "Nachricht (optional)",
        consent: "Ich stimme der Verarbeitung meiner Angaben laut Datenschutz zu.",
        submit: "Anfrage senden",
        success: "Angekommen. Wir melden uns in Kürze.",
      },
      footer: { impressum: "Impressum", datenschutz: "Datenschutz", legal: "FPMC GbR · Bergisch Gladbach" },
    },
  },

  en: {
    nav: { services: "Services", work: "Work", pricing: "Pricing", contact: "Contact", cta: "Get in touch" },

    hero: {
      headline: "Websites, film & sound. Live in 7 days.",
      subline: "We come from real film production — and build with AI what agencies bill weeks for.",
      badges: ["Fair prices", "Changes in hours", "Everything in-house"],
      ctaPrimary: "Get in touch",
      ctaSecondary: "See pricing",
    },

    why: {
      headline: "Why a website at all?",
      sub: "Six reasons. Tap one.",
      reasons: [
        { label: "Visibility", line: "Get found when customers are looking." },
        { label: "Trust", line: "A presence that matches your work." },
        { label: "Bookings", line: "Enquiries around the clock, no phone call." },
        { label: "Google", line: "Rank where the decision gets made." },
        { label: "Social hub", line: "One place every channel points to." },
        { label: "Around the clock", line: "The site works while you sleep." },
      ],
    },

    crew: {
      headline: "Four people. One team. Not an agency.",
      sub: "Film, sound, business and AI — all in-house.",
      members: [
        { name: "Saeed", role: "Film & directing. SAE diploma, real productions.", langs: "AR · DE · EN" },
        { name: "Dilara", role: "Finance & operations. Structure behind the craft.", langs: "DE · EN · TR" },
        { name: "Jasper", role: "Sound & music production. Audio diploma, producer.", langs: "DE · EN · FR" },
        { name: "Hazem", role: "AI, design & marketing. Builds it and tells it.", langs: "AR · DE · EN · NL" },
      ],
      counters: [
        { value: "0", label: "hidden costs" },
        { value: "100%", label: "in-house" },
        { value: "4", label: "languages" },
        { value: "48h", label: "video delivery" },
      ],
    },

    showreel: {
      headline: "Sites you can actually touch.",
      sub: "Every project is live. Tap in, see for yourself.",
    },

    how: {
      headline: "How it works.",
      steps: [
        { title: "A short call", line: "15 minutes. We listen." },
        { title: "Concept in 48h", line: "You see where it's going." },
        { title: "We build", line: "You run your business, we handle the rest." },
        { title: "Live in 7 days", line: "Your site goes online." },
        { title: "Changes in hours", line: "No ticket system. Short paths." },
      ],
    },

    pricing: {
      headline: "Clear prices. No surprises.",
      sub: "One-time, no forced subscription, free first consult.",
      tiers: [
        { name: "Simple", price: "from €1,499", line: "One-pager with a cinematic hero, mobile-perfect, live in 7 days.", highlight: false },
        { name: "Professional", price: "from €2,999", line: "Scroll hero, 3 clips, full structure, SEO basics, DE + 1 language.", highlight: true, tag: "Popular" },
        { name: "Cinematic", price: "from €4,999", line: "5-clip journey, HUD, sound-design option, DE / AR / EN.", highlight: false },
      ],
      addons: [
        { name: "Spec-Ad pack", price: "from €899", line: "3 AI ad clips incl. sound & voiceover. In 48h." },
        { name: "Digital Boost", price: "monthly", line: "Maintenance + 3 clips a month. The steady push." },
      ],
      footnote: "All one-time · no forced subscription · free consultation.",
    },

    entertainment: {
      headline: "We make music too.",
      body: "Music videos, sound design, our own productions — the bridge between the German-speaking world and the Arab one. You can hear it.",
      cta: "See the music",
    },

    proof: {
      headline: "Honest, not inflated.",
      body: "A selection from active projects. Client reviews follow once the first sites have run a few weeks.",
    },

    faq: {
      headline: "In short.",
      items: [
        { q: "What does it cost?", a: "From €1,499 one-time. Final price after the first call — no hidden costs." },
        { q: "How long does it take?", a: "Seven days to live, once we have your content." },
        { q: "What do you need from me?", a: "A short brief, your logos and photos, your sign-offs. We do the rest." },
        { q: "Who owns the site?", a: "You do. Full access, no dependency on us." },
        { q: "And hosting?", a: "Fast and secure in the EU. We set it all up." },
        { q: "AI — is that allowed?", a: "Yes. AI is our tool. Concept, edit and quality come from us." },
      ],
    },

    contact: {
      headline: "Let's talk, briefly.",
      sub: "Reply in minutes on WhatsApp. Or fill the form — we'll come back to you.",
      whatsapp: "Straight to WhatsApp",
      form: {
        need: { label: "What's it about?", options: ["Website", "Video", "Sound / Music", "Not sure yet"] },
        pkg: { label: "Which package?", options: ["Simple", "Professional", "Cinematic", "Spec-Ad", "Unsure"] },
        start: { label: "When?", options: ["As soon as possible", "This month", "Just looking around"] },
        name: "Name",
        email: "Email",
        phone: "Phone",
        message: "Message (optional)",
        consent: "I agree to my details being processed per the privacy policy.",
        submit: "Send enquiry",
        success: "Got it. We'll be in touch shortly.",
      },
      footer: { impressum: "Imprint", datenschutz: "Privacy", legal: "FPMC GbR · Bergisch Gladbach" },
    },
  },
} as const;
