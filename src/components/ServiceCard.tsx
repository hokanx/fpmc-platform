export function ServiceCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="card h-full p-6 transition-colors hover:border-ash/50 sm:p-7">
      <h3>{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ash">{body}</p>
    </article>
  );
}
