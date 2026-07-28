import { useCallback, useEffect, useRef, useState } from "react";
import type { Level, LetterResult, Media, OutLang } from "../../api/_lib/schema";
import { MAX_PAGES, RTL_LANGS } from "../../api/_lib/schema";
import { ApiFailure, uebersetzen, vereinfachen } from "../lib/api";
import { encodeAll, MediaError, prepare, releasePage, type Page } from "../lib/media";
import { readLevel, writeLevel } from "../lib/prefs";
import Capture from "../components/Capture";
import Pages from "../components/Pages";
import Processing from "../components/Processing";
import ActionBox from "../components/ActionBox";
import Summary from "../components/Summary";
import LevelToggle from "../components/LevelToggle";
import LanguagePicker from "../components/LanguagePicker";
import KeepResult from "../components/KeepResult";
import ErrorCard from "../components/ErrorCard";
import { CameraIcon } from "../components/icons";

type Phase = "start" | "pages" | "processing" | "result" | "error";

const MEDIA_MESSAGES: Record<MediaError["code"], string> = {
  too_large: "Die Fotos sind zusammen zu groß. Bitte schicken Sie weniger Seiten auf einmal.",
  unsupported: "Diese Datei können wir nicht lesen. Nutzen Sie ein Foto oder eine PDF-Datei.",
  unreadable: "Dieses Bild konnten wir nicht öffnen. Bitte machen Sie ein neues Foto.",
};

let pageCounter = 0;

/**
 * The whole letter flow lives in one component on one route.
 *
 * That is deliberate: the photos and the simplified letter exist only in memory,
 * and routing between steps would either lose them on a refresh or force them
 * into storage. Keeping the flow in component state means there is nowhere for a
 * letter to persist, which is the privacy promise made structural.
 */
export default function Start() {
  const [phase, setPhase] = useState<Phase>("start");
  const [level, setLevel] = useState<Level>(readLevel);
  const [pages, setPages] = useState<Page[]>([]);
  const [adding, setAdding] = useState(false);
  /** Kept so a level change can re-run without re-photographing the letter. */
  const [encoded, setEncoded] = useState<Media[] | null>(null);
  /** The German result. Translations are always derived from this, never chained. */
  const [original, setOriginal] = useState<LetterResult | null>(null);
  const [shown, setShown] = useState<LetterResult | null>(null);
  const [translating, setTranslating] = useState(false);
  const [message, setMessage] = useState("");

  const abort = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  // Held in a ref so the unmount cleanup sees the latest pages without
  // re-running (and releasing them) on every edit.
  const pagesRef = useRef<Page[]>([]);
  pagesRef.current = pages;

  useEffect(() => {
    return () => {
      abort.current?.abort();
      pagesRef.current.forEach(releasePage);
    };
  }, []);

  const fail = useCallback((err: unknown) => {
    setMessage(
      err instanceof MediaError
        ? MEDIA_MESSAGES[err.code]
        : err instanceof ApiFailure
          ? err.userMessage
          : "Da ist etwas schief gelaufen. Bitte versuchen Sie es noch einmal.",
    );
    setPhase("error");
  }, []);

  const run = useCallback(
    async (media: Media[], forLevel: Level) => {
      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;

      setPhase("processing");
      try {
        const letter = await vereinfachen(media, forLevel, controller.signal);
        setOriginal(letter);
        setShown(letter);
        setPhase("result");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        fail(err);
      }
    },
    [fail],
  );

  // Move focus to the result so a screen-reader user isn't left at the top of
  // the page wondering whether anything happened.
  useEffect(() => {
    if (phase === "result") resultRef.current?.focus();
  }, [phase]);

  const addPage = async (file: File) => {
    setAdding(true);
    try {
      const prepared = await prepare(file);
      setPages((prev) =>
        prev.length >= MAX_PAGES ? prev : [...prev, { prepared, rects: [], id: `p${++pageCounter}` }],
      );
      setPhase("pages");
    } catch (err) {
      fail(err);
    } finally {
      setAdding(false);
    }
  };

  const removePage = (id: string) => {
    setPages((prev) => {
      const page = prev.find((p) => p.id === id);
      if (page) releasePage(page);
      const next = prev.filter((p) => p.id !== id);
      if (next.length === 0) setPhase("start");
      return next;
    });
  };

  const submit = async () => {
    try {
      // Encoding happens here, not per page, because the quality has to be
      // chosen against the whole letter's size budget — see encodeAll().
      const media = await encodeAll(pages);
      setEncoded(media);
      void run(media, level);
    } catch (err) {
      fail(err);
    }
  };

  const handleLevel = (next: Level) => {
    setLevel(next);
    writeLevel(next);
    // On the result screen, changing the level re-reads the same photos — the
    // reader should not have to take them again to see the other reading level.
    if (phase === "result" && encoded) void run(encoded, next);
  };

  const handleLanguage = async (lang: OutLang) => {
    if (!original) return;
    if (lang === "de") {
      setShown(original);
      return;
    }

    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;

    setTranslating(true);
    try {
      // Always translate from the German original, never from another
      // translation — round-tripping through a third language loses detail fast.
      setShown(await uebersetzen(original, lang, level, controller.signal));
    } catch (err) {
      if ((err as Error).name !== "AbortError") fail(err);
    } finally {
      setTranslating(false);
    }
  };

  const reset = () => {
    abort.current?.abort();
    pages.forEach(releasePage);
    setPages([]);
    setEncoded(null);
    setOriginal(null);
    setShown(null);
    setMessage("");
    setPhase("start");
  };

  if (phase === "processing") {
    return (
      <Processing
        pages={pages.length}
        onCancel={() => {
          abort.current?.abort();
          setPhase(pages.length > 0 ? "pages" : "start");
        }}
      />
    );
  }

  if (phase === "error") {
    return (
      <ErrorCard
        message={message}
        onRetry={encoded ? () => void run(encoded, level) : undefined}
        onBack={pages.length > 0 ? () => setPhase("pages") : undefined}
        onRestart={reset}
      />
    );
  }

  if (phase === "pages" && pages.length > 0) {
    return (
      <Pages
        pages={pages}
        adding={adding}
        onAddPage={(file) => void addPage(file)}
        onRemovePage={removePage}
        onRectsChange={(id, rects) =>
          setPages((prev) => prev.map((p) => (p.id === id ? { ...p, rects } : p)))
        }
        onConfirm={() => void submit()}
        onCancel={reset}
      />
    );
  }

  if (phase === "result" && shown) {
    const dir = RTL_LANGS.includes(shown.sprache) ? "rtl" : "ltr";
    return (
      <div className="flex flex-col gap-8">
        <div
          ref={resultRef}
          tabIndex={-1}
          lang={shown.sprache}
          dir={dir}
          className="flex flex-col gap-8 outline-none"
        >
          <ActionBox letter={shown} />
          <Summary letter={shown} />
        </div>

        <div dir="ltr" className="flex flex-col gap-6 border-t border-line pt-6 print:hidden">
          <LanguagePicker current={shown.sprache} busy={translating} onPick={handleLanguage} />
          <KeepResult letter={shown} />
          <LevelToggle value={level} onChange={handleLevel} disabled={translating} />
          <button type="button" className="btn-primary" onClick={reset}>
            <CameraIcon />
            Neuen Brief fotografieren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Schwerer Brief?</h1>
        <p className="mt-3 text-xl">
          Machen Sie ein Foto. Papkram sagt Ihnen in einfachen Worten, worum es geht und was Sie tun
          müssen.
        </p>
      </div>

      <Capture onPick={(file) => void addPage(file)} busy={adding} />

      <section className="card bg-note-bg">
        <h2 className="font-bold">So wird das Foto gut</h2>
        <ul className="mt-2 flex flex-col gap-1 text-ink-soft">
          <li>Legen Sie den Brief flach auf einen Tisch.</li>
          <li>Sorgen Sie für gutes Licht. Kein Schatten auf dem Papier.</li>
          <li>Halten Sie das Handy gerade darüber.</li>
          <li>Hat der Brief mehrere Seiten? Sie können danach weitere Seiten dazutun.</li>
        </ul>
      </section>

      <LevelToggle value={level} onChange={handleLevel} />

      <ul className="flex flex-col gap-2 text-ink-soft">
        <li>Kostenlos. Ohne Anmeldung.</li>
        <li>Ihr Brief wird nicht gespeichert.</li>
        <li>Sie können Ihren Namen vorher abdecken.</li>
      </ul>
    </div>
  );
}
