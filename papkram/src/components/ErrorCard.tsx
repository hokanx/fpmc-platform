import { AlertIcon } from "./icons";

type Props = {
  message: string;
  onRetry?: () => void;
  onRestart: () => void;
};

export default function ErrorCard({ message, onRetry, onRestart }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div
        role="alert"
        className="card border-2 border-urgent bg-urgent-bg flex items-start gap-3 text-ink"
      >
        <AlertIcon className="mt-1 h-7 w-7 shrink-0 text-urgent" />
        <div>
          <h2 className="text-xl font-bold">Das hat nicht geklappt</h2>
          <p className="mt-1">{message}</p>
        </div>
      </div>

      {onRetry && (
        <button type="button" className="btn-primary" onClick={onRetry}>
          Noch einmal versuchen
        </button>
      )}
      <button type="button" className="btn-secondary" onClick={onRestart}>
        Neuen Brief fotografieren
      </button>

      <p className="text-ink-soft">
        Tipp: Legen Sie den Brief flach hin. Sorgen Sie für gutes Licht. Fotografieren Sie den ganzen
        Brief von oben.
      </p>
    </div>
  );
}
