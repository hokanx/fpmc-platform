import type { OutLang } from "../../api/_lib/schema";

/**
 * UI chrome around the result, in every language the summary can be translated
 * into. Without this, a Turkish reader would get Turkish content under German
 * headings — which is roughly half a translation.
 *
 * Note the day-count phrasings: Russian and Ukrainian have three-way plural
 * agreement for numerals, so those use the "Days remaining: 5" construction,
 * which is idiomatic and sidesteps agreement entirely.
 */
export type Labels = {
  von: string;
  worum: string;
  aktion: string;
  keineAktion: string;
  frist: string;
  zahlen: string;
  erhalten: string;
  zusammenfassung: string;
  schwereWoerter: string;
  unklar: string;
  hinweis: string;
  hilfe: string;
  spracheWaehlen: string;
  originalDeutsch: string;
  uebersetzen: string;
  fristHeute: string;
  fristAbgelaufen: (n: number) => string;
  fristNoch: (n: number) => string;
};

export const LABELS: Record<OutLang, Labels> = {
  de: {
    von: "Von",
    worum: "Worum geht es?",
    aktion: "Was müssen Sie tun?",
    keineAktion: "Sie müssen nichts tun.",
    frist: "Frist",
    zahlen: "Sie müssen zahlen",
    erhalten: "Sie bekommen Geld",
    zusammenfassung: "Der Brief in einfachen Worten",
    schwereWoerter: "Schwere Wörter erklärt",
    unklar: "Das konnten wir nicht lesen",
    hinweis:
      "Das ist keine Rechts·beratung. Papkram kann Fehler machen. Prüfen Sie wichtige Sachen im Brief nach.",
    hilfe: "Hier bekommen Sie kostenlose Hilfe",
    spracheWaehlen: "In einer anderen Sprache lesen",
    originalDeutsch: "Deutsch",
    uebersetzen: "Wird übersetzt …",
    fristHeute: "Die Frist ist heute",
    fristAbgelaufen: (n) => (n === 1 ? "Die Frist war gestern" : `Die Frist war vor ${n} Tagen`),
    fristNoch: (n) => (n === 1 ? "Noch 1 Tag" : `Noch ${n} Tage`),
  },
  en: {
    von: "From",
    worum: "What is this about?",
    aktion: "What do you need to do?",
    keineAktion: "You do not need to do anything.",
    frist: "Deadline",
    zahlen: "You have to pay",
    erhalten: "You will receive money",
    zusammenfassung: "The letter in simple words",
    schwereWoerter: "Difficult words explained",
    unklar: "We could not read this",
    hinweis:
      "This is not legal advice. Papkram can make mistakes. Please check important details in the letter itself.",
    hilfe: "Free help is available here",
    spracheWaehlen: "Read in another language",
    originalDeutsch: "German",
    uebersetzen: "Translating …",
    fristHeute: "The deadline is today",
    fristAbgelaufen: (n) => (n === 1 ? "The deadline was yesterday" : `The deadline was ${n} days ago`),
    fristNoch: (n) => (n === 1 ? "1 day left" : `${n} days left`),
  },
  tr: {
    von: "Gönderen",
    worum: "Konu nedir?",
    aktion: "Ne yapmanız gerekiyor?",
    keineAktion: "Yapmanız gereken bir şey yok.",
    frist: "Son tarih",
    zahlen: "Ödeme yapmanız gerekiyor",
    erhalten: "Para alacaksınız",
    zusammenfassung: "Mektup basit kelimelerle",
    schwereWoerter: "Zor kelimelerin açıklaması",
    unklar: "Bunu okuyamadık",
    hinweis:
      "Bu hukuki danışmanlık değildir. Papkram hata yapabilir. Önemli bilgileri mektubun kendisinden kontrol edin.",
    hilfe: "Buradan ücretsiz yardım alabilirsiniz",
    spracheWaehlen: "Başka bir dilde okuyun",
    originalDeutsch: "Almanca",
    uebersetzen: "Çevriliyor …",
    fristHeute: "Son tarih bugün",
    fristAbgelaufen: (n) => (n === 1 ? "Son tarih dündü" : `Son tarih ${n} gün önceydi`),
    fristNoch: (n) => (n === 1 ? "1 gün kaldı" : `${n} gün kaldı`),
  },
  ar: {
    von: "المُرسِل",
    worum: "عن ماذا يدور هذا الخطاب؟",
    aktion: "ماذا عليك أن تفعل؟",
    keineAktion: "لا يتوجب عليك فعل أي شيء.",
    frist: "الموعد النهائي",
    zahlen: "عليك أن تدفع",
    erhalten: "سوف تستلم مبلغًا",
    zusammenfassung: "الخطاب بكلمات بسيطة",
    schwereWoerter: "شرح الكلمات الصعبة",
    unklar: "لم نتمكن من قراءة هذا",
    hinweis:
      "هذه ليست استشارة قانونية. قد يُخطئ تطبيق Papkram. يرجى التحقق من المعلومات المهمة في الخطاب نفسه.",
    hilfe: "يمكنك الحصول على مساعدة مجانية هنا",
    spracheWaehlen: "اقرأ بلغة أخرى",
    originalDeutsch: "الألمانية",
    uebersetzen: "جارٍ الترجمة …",
    fristHeute: "الموعد النهائي هو اليوم",
    fristAbgelaufen: (n) => `انقضى الموعد النهائي قبل ${n} يومًا`,
    fristNoch: (n) => `الأيام المتبقية: ${n}`,
  },
  uk: {
    von: "Від кого",
    worum: "Про що йдеться?",
    aktion: "Що вам потрібно зробити?",
    keineAktion: "Вам нічого не потрібно робити.",
    frist: "Термін",
    zahlen: "Вам потрібно заплатити",
    erhalten: "Ви отримаєте гроші",
    zusammenfassung: "Лист простими словами",
    schwereWoerter: "Пояснення складних слів",
    unklar: "Це нам не вдалося прочитати",
    hinweis:
      "Це не юридична консультація. Papkram може помилятися. Перевіряйте важливі дані в самому листі.",
    hilfe: "Тут можна отримати безкоштовну допомогу",
    spracheWaehlen: "Читати іншою мовою",
    originalDeutsch: "Німецька",
    uebersetzen: "Перекладаємо …",
    fristHeute: "Термін спливає сьогодні",
    fristAbgelaufen: (n) => `Термін минув. Днів тому: ${n}`,
    fristNoch: (n) => `Залишилося днів: ${n}`,
  },
  ru: {
    von: "От кого",
    worum: "О чём это письмо?",
    aktion: "Что вам нужно сделать?",
    keineAktion: "Вам ничего не нужно делать.",
    frist: "Срок",
    zahlen: "Вам нужно заплатить",
    erhalten: "Вы получите деньги",
    zusammenfassung: "Письмо простыми словами",
    schwereWoerter: "Объяснение сложных слов",
    unklar: "Это нам не удалось прочитать",
    hinweis:
      "Это не юридическая консультация. Papkram может ошибаться. Проверяйте важные данные в самом письме.",
    hilfe: "Здесь можно получить бесплатную помощь",
    spracheWaehlen: "Читать на другом языке",
    originalDeutsch: "Немецкий",
    uebersetzen: "Переводим …",
    fristHeute: "Срок истекает сегодня",
    fristAbgelaufen: (n) => `Срок истёк. Дней назад: ${n}`,
    fristNoch: (n) => `Осталось дней: ${n}`,
  },
};

/** Endonyms — a language picker is useless if you can't read your own language's name in it. */
export const LANG_NAMES: Record<OutLang, string> = {
  de: "Deutsch",
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
  uk: "Українська",
  ru: "Русский",
};

/** BCP-47 tags for Intl date and number formatting. */
export const LOCALES: Record<OutLang, string> = {
  de: "de-DE",
  en: "en-GB",
  tr: "tr-TR",
  ar: "ar",
  uk: "uk-UA",
  ru: "ru-RU",
};
