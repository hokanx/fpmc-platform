export function ServiceCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="border border-graphite bg-carbon p-6 transition-colors hover:border-ash/50 sm:p-7">
      <h3 className="text-base leading-snug sm:text-lg">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ash">{body}</p>
    </article>
  );
}
