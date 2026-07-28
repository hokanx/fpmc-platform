import { useCallback, useRef } from "react";
import { SUPPORTED_MEDIA } from "../../api/_lib/schema";

/**
 * The two ways a letter gets in: the camera, or a file.
 *
 * `capture="environment"` opens the rear camera directly on a phone. On desktop
 * the same input degrades to a file picker, so there is no branching and no
 * feature detection anywhere in the app.
 */
export function usePicker(onPick: (file: File) => void) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      // Reset so picking the same file twice still fires a change event —
      // otherwise re-photographing a page silently does nothing.
      event.target.value = "";
      if (file) onPick(file);
    },
    [onPick],
  );

  const inputs = (
    <>
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
    </>
  );

  return {
    inputs,
    openCamera: () => cameraRef.current?.click(),
    openFiles: () => fileRef.current?.click(),
  };
}
