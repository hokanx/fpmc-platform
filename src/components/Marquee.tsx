// Infinite horizontal ticker. The track holds the phrase twice; the animation
// translates it -50% for a seamless loop. Decorative → aria-hidden.
export function Marquee({ text }: { text: string }) {
  const block = ` ${text} `.repeat(3);
  return (
    <div
      className="marquee border-y border-dotted border-light/20 py-5"
      aria-hidden="true"
    >
      <div className="marquee__track">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="font-display text-3xl uppercase tracking-tight text-light/85 sm:text-4xl"
          >
            {block}
          </span>
        ))}
      </div>
    </div>
  );
}
