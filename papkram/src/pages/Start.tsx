import { useCallback, useEffect, useRef, useState } from "react";
import type { Level, LetterResult, Media, OutLang } from "../../api/_lib/schema";
import { ApiFailure, uebersetzen, vereinfachen } from "../lib/api";
import { encode, MediaError, prepare, type Prepared, type Rect } from "../lib/media";
import { readLevel, writeLevel } from "../lib/prefs";
import { RTL_LANGS } from "../../api/_lib/schema";
import Capture from "../components/Capture";
import Redact from "../components/Redact";
import Processing from "../components/Processing";
import ActionBox from "../components/ActionBox";
import Summary from "../components/Summary";
import LevelToggle from "../components/LevelToggle";
import LanguagePicker from "../components/LanguagePicker";
import ErrorCard from "../components/ErrorCard";
import { CameraIcon } from "../components/icons";

type Phase = "start" | "redact" | "processing" | "result" | "error";

const MEDIA_MESSAGES: Record<MediaError["code"], string> = {
  too_large: "Das Bild ist zu groß. Bitte machen Sie ein neues Foto.",
  unsupported: "Diese Datei können wir nicht lesen. Nutzen Sie ein Foto oder eine PDF-Datei.",
  unreadable: "Dieses Bild konnten wir nicht öffnen. Bitte machen Sie ein neues Foto.",
};

/**
 * The whole letter flow lives in one component on one route.
 *
 * That is deliberate: the photo and the simplified letter exist only in memory,
 * and routing between steps would either lose them on a refresh or force them
 * into storage. Keeping the flow in component state means there is nowhere for
 * a letter to persist, which is the privacy promise made structural.
 */
export default function Start() {
  const [phase, setPhase] = useState<Phase>("start");
  const [level, setLevel] = useState<Level>(readLevel);
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [media, setMedia] = useState<Media | null>(null);
  /** The German result. Translations are always derived from this, never chained. */
  const [original, setOriginal] = useState<LetterResult | null>(null);
  const [shown, setShown] = useState<LetterResult | null>(null);
  const [translating, setTranslating] = useState(false);
  const [message, setMessage] = useState("");

  const abort = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Object URLs and decoded bitmaps are the two things that would otherwise leak.
  useEffect(() => {
    return () => {
      if (prepared?.kind === "image") {
        URL.revokeObjectURL(prepared.previewUrl);
        prepared.bitmap.close();
      }
    };
  }, [prepared]);

  useEffect(() => () => abort.current?.abort(), []);

  const run = useCallback(async (payload: Media, forLevel: Level) => {
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;

    setPhase("processing");
    try {
      const letter = await vereinfachen(payload, forLevel, controller.signal);
      setOriginal(letter);
      setShown(letter);
      setPhase("result");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMessage(err instanceof ApiFailure ? err.userMessage : "Da ist etwas schief gelaufen.");
      setPhase("error");
    }
  }, []);

  // Move focus to the result so a screen-reader user isn't left at the top of
  // the page wondering whether anything happened.
  useEffect(() => {
    if (phase === "result") resultRef.current?.focus();
  }, [phase]);

  const handlePick = async (file: File) => {
    try {
      const ready = await prepare(file);
      setPrepared(ready);

      if (ready.kind === "pdf") {
        // Nothing to redact in a PDF preview — go straight to processing.
        const encoded = await encode(ready);
        setMedia(encoded);
        void run(encoded, level);
        return;
      }
      setPhase("redact");
    } catch (err) {
      setMessage(
        err instanceof MediaError
          ? MEDIA_MESSAGES[err.code]
          : "Dieses Bild konnten wir nicht öffnen. Bitte machen Sie ein neues Foto.",
      );
      setPhase("error");
    }
  };

  const handleConfirm = async (rects: Rect[]) => {
    if (!prepared) return;
    try {
      const encoded = await encode(prepared, rects);
      setMedia(encoded);
      void run(encoded, level);
    } catch (err) {
      setMessage(
        err instanceof MediaError
          ? MEDIA_MESSAGES[err.code]
          : "Dieses Bild konnten wir nicht öffnen. Bitte machen Sie ein neues Foto.",
      );
      setPhase("error");
    }
  };

  const handleLevel = (next: Level) => {
    setLevel(next);
    writeLevel(next);
    // On the result screen, changing the level re-reads the same photo — the
    // user should not have to take it again to see the other reading level.
    if (phase === "result" && media) void run(media, next);
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
      if ((err as Error).name !== "AbortError") {
        setMessage(err instanceof ApiFailure ? err.userMessage : "Das Übersetzen hat nicht geklappt.");
        setPhase("error");
      }
    } finally {
      setTranslating(false);
    }
  };

  const reset = () => {
    abort.current?.abort();
    setPhase("start");
    setPrepared(null);
    setMedia(null);
    setOriginal(null);
    setShown(null);
    setMessage("");
  };

  if (phase === "processing") {
    return (
      <Processing
        onCancel={() => {
          abort.current?.abort();
          setPhase(prepared?.kind === "image" ? "redact" : "start");
        }}
      />
    );
  }

  if (phase === "error") {
    return (
      <ErrorCard
        message={message}
        onRetry={media ? () => void run(media, level) : undefined}
        onRestart={reset}
      />
    );
  }

  if (phase === "redact" && prepared?.kind === "image") {
    return <Redact prepared={prepared} onConfirm={handleConfirm} onCancel={reset} />;
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

        <div dir="ltr" className="flex flex-col gap-6 border-t border-line pt-6">
          <LanguagePicker current={shown.sprache} busy={translating} onPick={handleLanguage} />
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

      <Capture onPick={handlePick} busy={false} />

      <LevelToggle value={level} onChange={handleLevel} />

      <ul className="flex flex-col gap-2 text-ink-soft">
        <li>Kostenlos. Ohne Anmeldung.</li>
        <li>Ihr Brief wird nicht gespeichert.</li>
        <li>Sie können Ihren Namen vorher abdecken.</li>
      </ul>
    </div>
  );
}
