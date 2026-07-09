import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// Mask-wipe reveal: content rises and un-clips as it enters view (not a plain fade).
const variants: Variants = {
  hidden: { opacity: 0, y: 30, clipPath: "inset(0 0 100% 0)" },
  shown: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.85, ease: [0.16, 0.7, 0.2, 1] },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
