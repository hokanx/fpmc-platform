// Legal copy for Impressum + Datenschutz.
// DE is the operative language; EN is a courtesy translation (AR falls back to EN).
// [[ ... ]] marks a value the owner must supply before go-live — rendered highlighted.

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = { title: string; updated?: string; sections: LegalSection[] };

type DocByLocale = { de: LegalDoc; en: LegalDoc };

export const IMPRESSUM: DocByLocale = {
  de: {
    title: "Impressum",
    sections: [
      {
        heading: "Angaben gemäß § 5 DDG",
        body: [
          "FPMC GbR\nVertreten durch die Gesellschafter: Jasper Beckmann, Saeed Marwush, Dilara Yurdadönen, Hazem Hokan\nFrankenforster Straße 2\n51427 Bergisch Gladbach\nDeutschland",
        ],
      },
      {
        heading: "Kontakt",
        body: ["E-Mail: hello@fpmc.house\nTelefon: +49 1556 7485270"],
      },
      {
        heading: "Haftung für Inhalte",
        body: [
          "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
        ],
      },
      {
        heading: "Haftung für Links",
        body: [
          "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
        ],
      },
      {
        heading: "Urheberrecht",
        body: [
          "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung.",
        ],
      },
    ],
  },
  en: {
    title: "Legal notice",
    sections: [
      {
        heading: "Information pursuant to § 5 DDG",
        body: [
          "FPMC GbR\nRepresented by the partners: Jasper Beckmann, Saeed Marwush, Dilara Yurdadönen, Hazem Hokan\nFrankenforster Straße 2\n51427 Bergisch Gladbach\nGermany",
        ],
      },
      {
        heading: "Contact",
        body: ["Email: hello@fpmc.house\nPhone: +49 1556 7485270"],
      },
      {
        heading: "Note",
        body: [
          "This English text is a courtesy translation. The German version of this legal notice is legally binding.",
        ],
      },
    ],
  },
};

export const DATENSCHUTZ: DocByLocale = {
  de: {
    title: "Datenschutzerklärung",
    updated: "Stand: Juli 2026",
    sections: [
      {
        heading: "Verantwortlicher",
        body: [
          "Verantwortlich für die Datenverarbeitung auf dieser Website:\nFPMC GbR, vertreten durch die Gesellschafter (siehe Impressum), Frankenforster Straße 2, 51427 Bergisch Gladbach.\nE-Mail: hello@fpmc.house",
        ],
      },
      {
        heading: "Grundsatz: Datenminimierung",
        body: [
          "Diese Website ist bewusst datensparsam gebaut. Es gibt keine Werbe- oder Analyse-Tracker, keine Tracking-Cookies und keine Einbindung von Drittanbieter-Diensten, die Ihre Daten auswerten.",
        ],
      },
      {
        heading: "Hosting",
        body: [
          "Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA, gehostet und über deren Content-Delivery-Netzwerk ausgeliefert. Beim Aufruf der Seiten verarbeitet der Server technisch notwendige Zugriffsdaten. Die Datenübermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln; es besteht ein Auftragsverarbeitungsvertrag mit dem Anbieter. Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und effizienten Bereitstellung (Art. 6 Abs. 1 lit. f DSGVO).",
        ],
      },
      {
        heading: "Server-Logdaten",
        body: [
          "Beim Aufruf verarbeitet der Hoster automatisch Informationen, die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite/Datei, übertragene Datenmenge, Referrer und User-Agent. Diese Daten dienen der technischen Auslieferung, Stabilität und Sicherheit der Website und werden nicht mit anderen Datenquellen zusammengeführt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.",
        ],
      },
      {
        heading: "Schriftarten (lokal gehostet)",
        body: [
          "Alle Schriftarten werden lokal von unserem Server ausgeliefert. Es besteht keine Verbindung zu Google Fonts oder anderen Schrift-CDNs; dabei werden keine Daten an Dritte übertragen.",
        ],
      },
      {
        heading: "Spracheinstellung (lokaler Speicher)",
        body: [
          "Ihre gewählte Sprache speichern wir im lokalen Speicher Ihres Browsers (Schlüssel „fpmc.locale“), damit die Seite Ihre Wahl beim nächsten Besuch beibehält. Dies ist rein funktional, dient keiner Nachverfolgung, wird nicht an Dritte übermittelt und kann jederzeit über die Einstellungen Ihres Browsers gelöscht werden.",
        ],
      },
      {
        heading: "Kontaktaufnahme",
        body: [
          "Wenn Sie uns per E-Mail (hello@fpmc.house) kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Die Daten werden gelöscht, sobald sie nicht mehr benötigt werden und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        ],
      },
      {
        heading: "Newsletter / E-Mail-Anmeldung",
        body: [
          "Eine E-Mail-Anmeldung ist derzeit noch nicht aktiv. Sobald sie eingeführt wird, erfolgt sie im Double-Opt-in-Verfahren mit ausdrücklicher Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Diese Datenschutzerklärung wird vorher entsprechend ergänzt.",
        ],
      },
      {
        heading: "Ihre Rechte",
        body: [
          "Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    updated: "As of: July 2026",
    sections: [
      {
        heading: "Controller",
        body: [
          "Controller for data processing on this website:\nFPMC GbR, represented by its partners (see legal notice), Frankenforster Straße 2, 51427 Bergisch Gladbach.\nEmail: hello@fpmc.house",
        ],
      },
      {
        heading: "Principle: data minimization",
        body: [
          "This website is built to be deliberately data-light. There are no advertising or analytics trackers, no tracking cookies, and no third-party services that evaluate your data.",
        ],
      },
      {
        heading: "Hosting",
        body: [
          "This website is hosted by Vercel Inc. (USA) and delivered via their content delivery network. When you open the site, the server processes technically necessary access data. Transfer to the USA is based on the EU Standard Contractual Clauses; a data processing agreement is in place. Legal basis: our legitimate interest in secure, efficient delivery (Art. 6(1)(f) GDPR).",
        ],
      },
      {
        heading: "Server log data",
        body: [
          "On access, the host automatically processes information your browser transmits: IP address, date and time, requested page/file, volume of data transferred, referrer and user agent. This serves technical delivery, stability and security, and is not merged with other sources. Legal basis: Art. 6(1)(f) GDPR.",
        ],
      },
      {
        heading: "Fonts (self-hosted)",
        body: [
          "All fonts are served locally from our own server. There is no connection to Google Fonts or any font CDN, and no data is transferred to third parties.",
        ],
      },
      {
        heading: "Language preference (local storage)",
        body: [
          "Your chosen language is stored in your browser's local storage (key “fpmc.locale”) so the site remembers it. This is purely functional, is not used for tracking, is not shared, and can be cleared anytime via your browser settings.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "If you email us (hello@fpmc.house) we process your details to handle the request. Legal basis: Art. 6(1)(b)/(f) GDPR. Data is deleted once no longer needed and no retention obligations apply.",
        ],
      },
      {
        heading: "Newsletter / email sign-up",
        body: [
          "Email sign-up is not yet active. Once introduced it will use a double-opt-in with explicit consent (Art. 6(1)(a) GDPR), and this policy will be updated beforehand.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction (Art. 18), data portability (Art. 20) and objection (Art. 21 GDPR). You may withdraw consent at any time with future effect, and you have the right to lodge a complaint with a supervisory authority.",
        ],
      },
      {
        heading: "Note",
        body: [
          "This English text is a courtesy translation. The German version of this privacy policy is legally binding.",
        ],
      },
    ],
  },
};
