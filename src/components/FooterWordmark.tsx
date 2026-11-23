import { Component, lazy, Suspense, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

const Dotmark = lazy(() => import("./FramerDotmark"));

function StillWordmark() {
  const id = `wordmark-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return <svg viewBox="0 0 1400 280" width="1400" height="280" className="footer-wordmark-still" aria-hidden="true">
    <defs><pattern id={id} patternUnits="userSpaceOnUse" width="5" height="5"><circle cx="2.5" cy="2.5" r="1.8" fill="currentColor" /></pattern></defs>
    <text x="50%" y="74%" textAnchor="middle" textLength="1320" lengthAdjust="spacingAndGlyphs" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="265" letterSpacing="-12" fill={`url(#${id})`}>HCBTECH</text>
  </svg>;
}

class WordmarkBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="h-full" data-wordmark-fallback><StillWordmark /></div> : this.props.children; }
}

export default function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!ref.current) return;
    if (!("IntersectionObserver" in window)) { setNearby(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      setNearby(true);
      observer.disconnect();
    }, { rootMargin: "400px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="footer-wordmark" data-footer-wordmark>
    <span className="sr-only">HCBTECH</span>
    <div aria-hidden="true" className="footer-wordmark-art">
      {nearby && !reducedMotion ? <WordmarkBoundary><Suspense fallback={<StillWordmark />}><Dotmark
        word="HCBTECH" fonts={{ font: { fontFamily: "Space Grotesk", fontWeight: 700, letterSpacing: "-0.055em" } }}
        colors={{ dots: "#F2F0EB" }} dots={{ size: 4, spacing: 1.5 }}
        swirl={{ mode: "off", strength: 25 }} advanced={{ radius: 90 }}
        style={{ width: "100%", height: "100%" }}
      /></Suspense></WordmarkBoundary> : <StillWordmark />}
    </div>
  </div>;
}
