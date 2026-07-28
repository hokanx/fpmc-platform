import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Diese Seite gibt es nicht</h1>
      <p className="text-xl">Vielleicht haben Sie sich vertippt. Gehen Sie zurück zum Anfang.</p>
      <Link to="/" className="btn-primary">
        Zur Startseite
      </Link>
    </div>
  );
}
