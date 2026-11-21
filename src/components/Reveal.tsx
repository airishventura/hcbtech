import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { duration, easeOut } from "../lib/motion";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 56, clipPath: "inset(0 0 18% 0)" }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: duration.reveal, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function SectionIntro({ number, eyebrow, title, body, light = false }: { number: string; eyebrow: string; title: string; body?: string; light?: boolean }) {
  return (
    <Reveal>
      <div className={`grid gap-10 border-t pt-6 md:grid-cols-12 md:gap-8 ${light ? "hairline-light border-t" : "hairline border-t"}`}>
        <div className="md:col-span-3">
          <p className={`mono ${light ? "text-ivory/60" : "text-steel-dark"}`}><span className="text-industrial">{number}</span> / {eyebrow}</p>
        </div>
        <div className="md:col-span-9">
          <h2 className={`display-md max-w-5xl ${light ? "text-ivory" : "text-graphite"}`}>{title}</h2>
          {body && <p className={`body-lg mt-8 max-w-2xl ${light ? "text-ivory/65" : "text-steel-dark"}`}>{body}</p>}
        </div>
      </div>
    </Reveal>
  );
}
