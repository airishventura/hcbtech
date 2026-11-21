import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Faq({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t hairline">
      {items.map((item, index) => {
        const expanded = open === index;
        return <div key={item.question} className="border-b hairline">
          <h3><button type="button" className="flex min-h-[72px] w-full items-center justify-between gap-5 py-5 text-left" onClick={() => setOpen(expanded ? null : index)} aria-expanded={expanded} aria-controls={`faq-${index}`}><span className="max-w-2xl text-[1.05rem] font-medium md:text-xl">{item.question}</span><motion.span animate={{ rotate: expanded ? 45 : 0 }} className="shrink-0"><Plus size={21} /></motion.span></button></h3>
          <AnimatePresence initial={false}>{expanded && <motion.div id={`faq-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }} className="overflow-hidden"><p className="max-w-3xl pb-7 pr-10 leading-relaxed text-steel-dark">{item.answer}</p></motion.div>}</AnimatePresence>
        </div>;
      })}
    </div>
  );
}
