import { Fragment } from "react";
import { useI18n } from "../../i18n";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { Reveal } from "../../components/motion/Reveal";
import { WordReveal } from "../../components/motion/WordReveal";
import { Stagger, StaggerItem } from "../../components/motion/Stagger";
import type { LegalDoc } from "./legalContent";

// Renders a paragraph, highlighting any [[placeholder]] the owner still owes.
function renderParagraph(text: string) {
  const parts = text.split(/(\[\[[^\]]*\]\])/g);
  return parts.map((part, i) => {
    if (/^\[\[[^\]]*\]\]$/.test(part)) {
      return (
        <mark
          key={i}
          className="rounded-sm border border-ash/60 bg-transparent px-1 text-ash"
          title="Placeholder — to be supplied before go-live"
        >
          {part}
        </mark>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function LegalPage({ doc }: { doc: { de: LegalDoc; en: LegalDoc } }) {
  const { locale } = useI18n();
  const content = locale === "de" ? doc.de : doc.en; // AR falls back to EN
  useDocumentTitle(content.title);

  return (
    <section className="px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <WordReveal as="h1" className="text-3xl text-balance sm:text-4xl" text={content.title} />
        {content.updated && (
          <Reveal>
            <p className="mt-3 text-sm text-ash">{content.updated}</p>
          </Reveal>
        )}

        <Stagger className="mt-10 space-y-9">
          {content.sections.map((section) => (
            <StaggerItem key={section.heading}>
              <h2 className="text-base sm:text-lg">{section.heading}</h2>
              {section.body.map((para, i) => (
                <p
                  key={i}
                  className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ash"
                >
                  {renderParagraph(para)}
                </p>
              ))}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
