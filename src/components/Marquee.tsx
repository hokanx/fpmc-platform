import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

// Infinite ticker (CSS-animated track) that skews with scroll velocity — it
// leans as you scroll, settling when you stop. Decorative → aria-hidden.
export function Marquee({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useSpring(
    useTransform(velocity, [-2500, 0, 2500], [-8, 0, 8], { clamp: false }),
    { damping: 40, stiffness: 300 },
  );

  const block = ` ${text} `.repeat(3);
  const spans = [0, 1].map((i) => (
    <span
      key={i}
      className="font-display text-3xl uppercase tracking-tight text-light/85 sm:text-4xl"
    >
      {block}
    </span>
  ));

  return (
    <div
      className="marquee border-y border-dotted border-light/20 py-5"
      aria-hidden="true"
    >
      <motion.div style={reduce ? undefined : { skewX: skew }}>
        <div className="marquee__track">{spans}</div>
      </motion.div>
    </div>
  );
}
