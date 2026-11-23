import type { ReactNode } from "react";
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={className}>{children}</div>;
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
