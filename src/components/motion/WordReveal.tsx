import { createElement } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// Headline that wipes in word-by-word (each word masked, sliding up, staggered).
// Uppercase display type has no descenders, so overflow masking is clean.
const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};
const word: Variants = {
  hidden: { y: "115%" },
  shown: { y: "0%", transition: { duration: 0.7, ease: [0.16, 0.7, 0.2, 1] } },
};

export function WordReveal({
  text,
  className,
  as = "h2",
}: {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, { className }, text);

  const words = text.split(" ");
  return createElement(
    as,
    { className },
    <motion.span
      className="inline"
      variants={container}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.2em] align-bottom [margin-bottom:-0.2em]"
        >
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>,
  );
}
