import { Plus } from "lucide-react";
export default function Faq({ items }: { items: { question: string; answer: string }[] }) {
  return <div className="border-t hairline">{items.map((item, index) => <details key={item.question} className="faq-item border-b hairline" open={index === 0}>
    <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-5 py-5"><h3 className="max-w-2xl text-[1.05rem] font-medium md:text-xl">{item.question}</h3><Plus size={21} className="faq-toggle shrink-0" aria-hidden="true" /></summary>
    <p className="max-w-3xl pb-7 pr-6 leading-relaxed text-steel-dark">{item.answer}</p>
  </details>)}</div>;
}
