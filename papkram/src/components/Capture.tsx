import { useRef } from "react";
import { CameraIcon, FileIcon } from "./icons";
import { SUPPORTED_MEDIA } from "../../api/_lib/schema";

type Props = {
  onPick: (file: File) => void;
  busy: boolean;
};

/**
 * The whole start screen: one big button, one small one.
 *
 * `capture="environment"` opens the rear camera straight away on a phone. On
 * desktop the same input degrades to a file picker, so there is no branching
 * and no feature detection.
 */
export default function Capture({ onPick, busy }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so picking the same file twice still fires a change event.
    event.target.value = "";
    if (file) onPick(file);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handle}
        tabIndex={-1}
        aria-hidden
      />
      <input
        ref={fileRef}
        type="file"
        accept={SUPPORTED_MEDIA.join(",")}
        className="sr-only"
        onChange={handle}
        tabIndex={-1}
        aria-hidden
      />

      <button
        type="button"
        className="btn-primary text-xl"
        disabled={busy}
        onClick={() => cameraRef.current?.click()}
      >
        <CameraIcon className="h-7 w-7" />
        Brief fotografieren
      </button>

      <button
        type="button"
        className="btn-secondary"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
      >
        <FileIcon />
        Bild oder PDF auswählen
      </button>
    </div>
  );
}
