import { usePicker } from "./usePicker";
import { CameraIcon, FileIcon } from "./icons";

type Props = {
  onPick: (file: File) => void;
  busy: boolean;
};

/** The start screen: one big button, one small one, nothing else to decide. */
export default function Capture({ onPick, busy }: Props) {
  const { inputs, openCamera, openFiles } = usePicker(onPick);

  return (
    <div className="flex flex-col gap-4">
      {inputs}

      <button type="button" className="btn-primary text-xl" disabled={busy} onClick={openCamera}>
        <CameraIcon className="h-7 w-7" />
        Brief fotografieren
      </button>

      <button type="button" className="btn-secondary" disabled={busy} onClick={openFiles}>
        <FileIcon />
        Bild oder PDF auswählen
      </button>
    </div>
  );
}
