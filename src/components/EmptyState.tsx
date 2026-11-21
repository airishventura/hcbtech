import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { duration, easeOut } from "../lib/motion";

interface EmptyStateProps {
  eyebrow: string;
  title: string;
  description: string;
  reassurance?: string;
  actions?: ReactNode;
  variant?: "search" | "media";
  compact?: boolean;
}

export default function EmptyState({ eyebrow, title, description, reassurance, actions, variant = "search", compact = false }: EmptyStateProps) {
  const reduced = useReducedMotion();
  const path = (delay: number) => ({
    initial: reduced ? false : { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: duration.reveal, delay, ease: easeOut },
  });
  return <div className={`grid items-center gap-8 border-y hairline ${compact ? "py-10" : "py-12 md:py-16"} md:grid-cols-[180px_1fr] md:gap-12`}>
    <motion.svg viewBox="0 0 220 180" className="mx-auto w-36 md:w-full" fill="none" aria-hidden="true">
      <motion.path d="M42 142H178M54 142V92M166 142V92M54 98H166" stroke="#8C9297" strokeWidth="1.5" {...path(0)} />
      {variant === "search" ? <>
        <motion.rect x="66" y="62" width="38" height="34" stroke="#171717" strokeWidth="1.5" {...path(.08)} />
        <motion.circle cx="128" cy="77" r="29" stroke="#171717" strokeWidth="1.5" {...path(.16)} />
        <motion.path d="M104 62L128 77M84 96V112H136M66 112H150L164 128H80z" stroke="#8C9297" strokeWidth="1.5" {...path(.24)} />
        <motion.circle cx="139" cy="105" r="35" stroke="#C92525" strokeWidth="2" {...path(.32)} />
        <motion.path d="M164 130L187 153" stroke="#C92525" strokeWidth="2" {...path(.4)} />
      </> : <>
        <motion.path d="M67 92V66C67 43 153 43 153 66V92M67 66C67 88 153 88 153 66M67 92C67 114 153 114 153 92" stroke="#171717" strokeWidth="1.5" {...path(.08)} />
        <motion.path d="M110 46V28M86 29H134M82 112L66 132H107M139 111L156 132H117" stroke="#8C9297" strokeWidth="1.5" {...path(.18)} />
        <motion.rect x="129" y="99" width="55" height="43" stroke="#C92525" strokeWidth="2" {...path(.28)} />
        <motion.path d="M137 132L149 119L158 127L166 117L178 132" stroke="#C92525" strokeWidth="1.5" {...path(.36)} />
      </>}
    </motion.svg>
    <div className="max-w-2xl text-center md:text-left">
      <motion.p initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }} className="mono mb-4 text-industrial">{eyebrow}</motion.p>
      <motion.h2 initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: duration.transition }} className="title-lg">{title}</motion.h2>
      <motion.p initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .26 }} className="mt-5 text-sm leading-7 text-steel-dark md:text-base">{description}</motion.p>
      {reassurance && <p className="mt-4 text-xs leading-6 text-steel-dark">{reassurance}</p>}
      {actions && <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .32 }} className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">{actions}</motion.div>}
    </div>
  </div>;
}
