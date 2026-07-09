import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Count-up when scrolled into view. Handles "0", "4", "100%", "48h" — animates the
// numeric part, preserves any prefix/suffix. Reduced-motion → renders final value.
export function Counter({ value, className }: { value: string; className?: string }) {
  const parts = String(value).match(/^(\D*?)(\d+)(\D*)$/);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const target = parts ? parseInt(parts[2], 10) : 0;
  const [n, setN] = useState(reduce ? target : 0);

  const hasNumber = !!parts;
  useEffect(() => {
    if (!hasNumber || reduce || !inView || target === 0) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, hasNumber]);

  if (!parts) return <div className={className}>{value}</div>;
  return (
    <div ref={ref} className={className}>
      {parts[1]}
      {n}
      {parts[3]}
    </div>
  );
}
