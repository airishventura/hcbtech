import { ContactShadows, Environment, Html, Lightformer, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Box3, Vector3, TOUCH } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Box, Download, Expand, Info, Layers3, LoaderCircle, Minimize, Pause, Play, RotateCcw, Tag, X } from "lucide-react";
import ExplodablePart from "./ExplodablePart";
import { useLanguage } from "../i18n/LanguageContext";
import type { Hotspot, Product } from "../data/products";

interface ViewerProps {
  glbUrl?: string | null;
  posterImage: string;
  family: Product["category"];
  drive?: "listrik" | "engine";
  hotspots?: Hotspot[];
  modelAccuracy?: Product["modelAccuracy"];
  productName: string;
}

class ViewerErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Steel({ color = "#8c9297", metalness = .72, roughness = .34 }: { color?: string; metalness?: number; roughness?: number }) {
  return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />;
}

function Beam({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={scale} /><Steel color="#737a7f" metalness={.45} roughness={.5} /></mesh>;
}

function Frame() {
  return <group name="frame">
    {[-.68, .68].flatMap((x) => [-.42, .42].map((z) => <Beam key={`${x}-${z}`} position={[x, .67, z]} scale={[.1, 1.3, .1]} />))}
    {[-.42, .42].flatMap((z) => [0.12, 1.23].map((y) => <Beam key={`${z}-${y}`} position={[0, y, z]} scale={[1.46, .1, .1]} />))}
    {[-.68, .68].flatMap((x) => [0.12, 1.23].map((y) => <Beam key={`${x}-${y}`} position={[x, y, 0]} scale={[.1, .1, .94]} />))}
  </group>;
}

function ElectricMotor({ position = [0, .48, 0] as [number, number, number] }) {
  return <group name="electric-motor" position={position}>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.24, .24, .62, 24]} /><Steel color="#777d80" metalness={.7} /></mesh>
    <mesh position={[-.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.26, .26, .1, 24]} /><Steel color="#62696d" /></mesh>
    <mesh position={[0, .28, 0]} castShadow><boxGeometry args={[.28, .16, .28]} /><Steel color="#858b8e" metalness={.5} /></mesh>
    {[-.18, -.06, .06, .18].map((x) => <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[.245, .012, 6, 24]} /><Steel color="#545b5f" /></mesh>)}
  </group>;
}

function Engine({ position = [0, .43, 0] as [number, number, number] }) {
  return <group name="engine" position={position}>
    <mesh position={[0, .19, 0]} castShadow><boxGeometry args={[.62, .28, .48]} /><Steel color="#d4cbb6" metalness={.15} roughness={.55} /></mesh>
    <mesh position={[0, -.07, 0]} castShadow><boxGeometry args={[.56, .3, .4]} /><Steel color="#343638" metalness={.45} /></mesh>
    <mesh position={[.34, -.04, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.22, .22, .12, 24]} /><Steel color="#a52a27" metalness={.25} roughness={.5} /></mesh>
    <mesh position={[0, .36, 0]}><cylinderGeometry args={[.06, .06, .05, 16]} /><Steel color="#262626" metalness={.3} /></mesh>
  </group>;
}

function Gearbox({ position = [-.35, 1.6, 0] as [number, number, number] }) {
  return <group name="gearbox" position={position}>
    <mesh castShadow><boxGeometry args={[.52, .58, .5]} /><Steel color="#435640" metalness={.4} roughness={.48} /></mesh>
    <mesh position={[0, .34, 0]}><boxGeometry args={[.42, .12, .4]} /><Steel color="#4b6045" metalness={.4} /></mesh>
    {[-.2, -.1, 0, .1, .2].map((x) => <mesh key={x} position={[x, 0, .27]}><boxGeometry args={[.035, .46, .05]} /><Steel color="#35472f" metalness={.35} /></mesh>)}
    <mesh position={[.31, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.09, .09, .5, 20]} /><Steel color="#a4aaad" /></mesh>
  </group>;
}

function Chute({ drum = false }: { drum?: boolean }) {
  return <group name="chute" position={drum ? [-.58, 1.13, .24] : [0, .97, .46]} rotation={drum ? [0, 0, -.32] : [.46, 0, 0]}>
    <mesh castShadow><boxGeometry args={drum ? [.76, .12, .55] : [.8, .08, .72]} /><Steel color="#969da1" metalness={.65} roughness={.38} /></mesh>
    {[-1, 1].map((side) => <mesh key={side} position={drum ? [0, .13, side * .27] : [side * .4, .12, 0]}><boxGeometry args={drum ? [.76, .26, .035] : [.035, .24, .72]} /><Steel color="#8c9397" /></mesh>)}
  </group>;
}

function DiscAssembly({ drive, exploded }: { drive: "listrik" | "engine"; exploded: boolean }) {
  return <group name="disc-assembly">
    <Frame />
    <ExplodablePart exploded={exploded} offset={[-.65, .35, -.15]}><Gearbox /></ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[.75, .25, 0]}><group name="disc-and-shaft" position={[.56, 1.6, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.57, .57, .075, 48]} /><Steel color="#777e82" metalness={.75} roughness={.38} /></mesh>
      <mesh position={[.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.11, .11, .2, 20]} /><Steel color="#555c60" /></mesh>
    </group></ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[0, .25, .55]}><group name="red-guide" position={[.32, 1.19, .16]} rotation={[0, 0, -.16]}><mesh><boxGeometry args={[.09, .68, .16]} /><Steel color="#b82727" metalness={.3} roughness={.48} /></mesh></group></ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[0, -.1, .8]}><Chute /></ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[0, -.05, -.75]}>{drive === "listrik" ? <ElectricMotor position={[-.23, .48, 0]} /> : <Engine position={[0, .45, 0]} />}</ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[-.55, 0, -.2]}><group name="belt-drive" position={[-.77, .9, 0]}>
      {[0, .48].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[y ? .15 : .11, y ? .15 : .11, .09, 24]} /><Steel color="#2d3032" metalness={.5} /></mesh>)}
      {[-.06, .06].map((z) => <mesh key={z} position={[0, .24, z]} rotation={[0, 0, -.08]}><boxGeometry args={[.035, .54, .025]} /><Steel color="#202122" metalness={.05} roughness={.8} /></mesh>)}
    </group></ExplodablePart>
  </group>;
}

function DrumAssembly({ drive, exploded }: { drive: "listrik" | "engine"; exploded: boolean }) {
  return <group name="drum-assembly">
    <Frame />
    <ExplodablePart exploded={exploded} offset={[0, .15, 0]}><group name="housing-body" position={[0, 1.62, 0]}><mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.55, .55, 1.32, 40, 1, false]} /><Steel color="#a8afb2" metalness={.82} roughness={.3} /></mesh></group></ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[0, .45, -.4]}><group name="guards" position={[0, 1.62, 0]}>{[-.68, .68].map((x) => <group key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}><mesh><torusGeometry args={[.55, .022, 8, 40]} /><Steel color="#bd2d2d" metalness={.2} roughness={.45} /></mesh></group>)}</group></ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[0, .75, 0]}><group name="hopper" position={[0, 1.62, 0]}><mesh position={[0, .64, 0]} castShadow><boxGeometry args={[.72, .18, .58]} /><Steel color="#979fa3" metalness={.7} /></mesh></group></ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[.65, .15, 0]}><group name="shaft-bearing" position={[0, 1.62, 0]}><mesh position={[.79, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.09, .09, .34, 20]} /><Steel color="#656c70" /></mesh><mesh position={[.72, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.17, .17, .12, 20]} /><Steel color="#485053" metalness={.65} /></mesh></group></ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[-.35, 0, .7]}><Chute drum /></ExplodablePart>
    <ExplodablePart exploded={exploded} offset={[0, -.05, -.75]}>{drive === "listrik" ? <ElectricMotor position={[0, .45, 0]} /> : <Engine position={[0, .43, 0]} />}</ExplodablePart>
  </group>;
}

function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const normalized = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const scale = 2.3 / Math.max(size.x, size.y, size.z, .001);
    clone.scale.setScalar(scale);
    clone.position.sub(center.multiplyScalar(scale));
    clone.position.y += 1.12;
    return clone;
  }, [scene]);
  return <primitive object={normalized} />;
}

interface SceneProps extends ViewerProps { rotationY: number; annotations: boolean; exploded: boolean; onHotspot: (hotspot: Hotspot) => void; controls: React.RefObject<OrbitControlsImpl | null>; controlsActive: boolean; }
function Scene({ glbUrl, family, drive = "listrik", hotspots = [], rotationY, annotations, exploded, onHotspot, controls, controlsActive }: SceneProps) {
  const { t } = useLanguage();
  const { gl } = useThree();
  // OrbitControls writes touch-action during connect. Keep its target on the
  // canvas and restore vertical scrolling until the user activates rotation.
  useEffect(() => {
    gl.domElement.style.touchAction = controlsActive ? "none" : "pan-y";
  }, [gl, controlsActive]);
  return <>
    <color attach="background" args={["#e8e4dc"]} />
    <ambientLight intensity={.8} />
    <directionalLight position={[3, 6, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
    <Environment resolution={64}>
      <Lightformer form="rect" intensity={2} position={[0, 4, 3]} scale={[4, 4, 1]} />
      <Lightformer form="rect" intensity={1.4} position={[-4, 2, 1]} rotation={[0, Math.PI / 2, 0]} scale={[3, 3, 1]} />
    </Environment>
    <group rotation={[0, rotationY, 0]} position={[0, -.05, 0]}>
      {glbUrl ? <Suspense fallback={null}><GLBModel url={glbUrl} /></Suspense> : family === "piringan-gearbox" ? <DiscAssembly drive={drive} exploded={exploded} /> : <DrumAssembly drive={drive} exploded={exploded} />}
      {annotations && hotspots.map((hotspot, index) => <Html key={hotspot.id} position={hotspot.position} center distanceFactor={7} zIndexRange={[10, 0]}>
        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ivory bg-industrial font-mono text-[11px] text-white shadow-lg" onClick={() => onHotspot(hotspot)} aria-label={t("Anotasi {index}: {label}", { index: index + 1, label: hotspot.label })}>{index + 1}</button>
      </Html>)}
    </group>
    <ContactShadows position={[0, .01, 0]} opacity={.35} scale={5} blur={2.4} far={3.5} frames={1} />
    <OrbitControls ref={controls} domElement={gl.domElement} makeDefault enabled={controlsActive} enablePan={false} enableDamping={false} minDistance={3.1} maxDistance={6.2} minPolarAngle={Math.PI * .2} maxPolarAngle={Math.PI * .58} target={[0, 1.12, 0]} touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }} />
  </>;
}

function LoadingProgress() {
  const { t } = useLanguage();
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className="absolute inset-x-0 bottom-0 z-20 bg-graphite/90 p-3 text-ivory" role="status"><div className="mb-2 flex justify-between"><span className="mono">{t("Memuat model 3D")}</span><span className="mono">{Math.round(progress)}%</span></div><div className="h-1 bg-ivory/20"><div className="h-full bg-industrial transition-[width]" style={{ width: `${progress}%` }} /></div></div>;
}

function supportsWebGL() {
  try { const canvas = document.createElement("canvas"); return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")); } catch { return false; }
}

export default function MachineViewer(props: ViewerProps) {
  const { t } = useLanguage();
  const wrapper = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controls = useRef<OrbitControlsImpl>(null);
  const [annotations, setAnnotations] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const [rotationY, setRotationY] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [webgl, setWebgl] = useState(() => supportsWebGL());
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [controlsActive, setControlsActive] = useState(() => !window.matchMedia("(pointer: coarse)").matches);
  const coarse = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);

  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(element);
    const visibility = () => setPageVisible(!document.hidden);
    const full = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("fullscreenchange", full);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); document.removeEventListener("fullscreenchange", full); };
  }, []);

  useEffect(() => {
    if (!fullscreen || document.fullscreenElement) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [fullscreen]);

  useEffect(() => {
    if (!exportStatus) return;
    const timeout = window.setTimeout(() => setExportStatus(""), 4500);
    return () => window.clearTimeout(timeout);
  }, [exportStatus]);

  const reset = () => { setRotationY(0); controls.current?.reset(); setActiveHotspot(null); };
  const exportView = async () => {
    const source = canvasRef.current;
    if (!source || exporting) { setExportStatus(t("Canvas belum siap. Tunggu model selesai ditampilkan lalu coba lagi.")); return; }
    setExporting(true);
    setExportStatus(t("Membuat PNG dari tampilan kamera saat ini…"));
    try {
      const output = document.createElement("canvas");
      const footerHeight = Math.max(96, Math.round(source.width * .1));
      output.width = source.width;
      output.height = source.height + footerHeight;
      const context = output.getContext("2d");
      if (!context) throw new Error("Canvas 2D tidak tersedia");
      context.fillStyle = "#e8e4dc";
      context.fillRect(0, 0, output.width, output.height);
      context.drawImage(source, 0, 0);
      context.fillStyle = "#171717";
      context.fillRect(0, source.height, output.width, footerHeight);
      const titleSize = Math.max(17, Math.round(source.width * .019));
      const noteSize = Math.max(11, Math.round(source.width * .011));
      const padding = Math.max(20, Math.round(source.width * .025));
      context.fillStyle = "#F2F0EB";
      context.font = `500 ${titleSize}px "Space Grotesk", sans-serif`;
      context.textBaseline = "top";
      context.fillText(`HCBTECH — ${props.productName}`, padding, source.height + padding * .65, output.width - padding * 2);
      context.fillStyle = "#C92525";
      context.font = `500 ${noteSize}px "IBM Plex Mono", monospace`;
      const modelNote = props.glbUrl && props.modelAccuracy === "geometry-verified" ? t("GEOMETRI TERVERIFIKASI / BUKAN SERTIFIKASI PERFORMANSI") : t("APROKSIMASI 3D / BUKAN GAMBAR TEKNIK");
      context.fillText(`${modelNote}${exploded ? ` / ${t("POSISI PISAH SKEMATIK")}` : ""}`, padding, source.height + padding * .65 + titleSize * 1.65, output.width - padding * 2);
      const blob = await new Promise<Blob>((resolve, reject) => output.toBlob((result) => result ? resolve(result) : reject(new Error("PNG tidak dapat dibuat")), "image/png"));
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const filename = props.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      anchor.href = url;
      anchor.download = `hcbtech-${filename || "mesin"}-${exploded ? "pisah" : "utuh"}.png`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportStatus(t("PNG berhasil dibuat. Jika ingin dikirim ke WhatsApp, lampirkan file tersebut secara manual."));
    } catch {
      setExportStatus(t("Tampilan tidak dapat diekspor pada browser ini. Anda tetap dapat menggunakan screenshot perangkat."));
    } finally {
      setExporting(false);
    }
  };
  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch { setFullscreen(false); }
      return;
    }
    if (fullscreen) { setFullscreen(false); return; }
    if (!wrapper.current?.requestFullscreen) { setFullscreen(true); return; }
    try { await wrapper.current.requestFullscreen(); } catch { setFullscreen(true); }
  };
  const fallback = <div className="relative flex h-full min-h-[420px] flex-col bg-[#e8e4dc]"><img src={props.posterImage} alt={t("Poster {name}; viewer 3D tidak tersedia", { name: props.productName })} className="min-h-0 flex-1 object-cover" /><div className="bg-graphite p-4 text-ivory"><p className="mono mb-2 text-industrial">{t("3D tidak dapat ditampilkan")}</p><p className="text-sm text-ivory/70">{t("Browser atau perangkat tidak mendukung WebGL, atau model gagal dimuat. Foto/visualisasi dan seluruh spesifikasi tetap dapat dibaca.")}</p></div></div>;

  if (!webgl) return fallback;
  return <div ref={wrapper} className={`viewer-touch min-w-0 max-w-full overflow-hidden bg-[#e8e4dc] focus-visible:outline-2 focus-visible:outline-industrial ${fullscreen ? "fixed inset-0 z-[100] h-[100svh] w-screen" : "relative h-full min-h-[460px]"}`} tabIndex={0} aria-label={t("Viewer 3D {name}. Gunakan tombol panah kiri dan kanan untuk memutar, E untuk pisah komponen, R untuk reset.", { name: props.productName })} onKeyDown={(event) => {
    if (event.key === "Escape" && fullscreen && !document.fullscreenElement) setFullscreen(false);
    if (event.key === "ArrowLeft") { event.preventDefault(); setRotationY((value) => value - .16); }
    if (event.key === "ArrowRight") { event.preventDefault(); setRotationY((value) => value + .16); }
    if (event.key.toLowerCase() === "e" && !props.glbUrl) { setExploded((value) => !value); setActiveHotspot(null); }
    if (event.key.toLowerCase() === "r") reset();
  }}>
    <div className="absolute left-3 top-3 z-20 max-w-[calc(100%-210px)]"><span className="media-label">{exploded ? t("Exploded skematik / bukan urutan bongkar") : props.glbUrl && props.modelAccuracy === "geometry-verified" ? t("Model geometri terverifikasi") : t("Aproksimasi 3D / belum terverifikasi")}</span></div>
    <div className="absolute right-3 top-3 z-20 flex gap-1">
      {!props.glbUrl && <button type="button" className={`icon-button h-11 min-h-11 w-11 ${exploded ? "bg-graphite text-ivory" : "bg-ivory/90"}`} onClick={() => { setExploded((value) => !value); setActiveHotspot(null); }} aria-pressed={exploded} aria-label={exploded ? t("Satukan kembali komponen") : t("Pisahkan komponen")} title={t("Pisah komponen skematik (E)")}><Layers3 size={17} /></button>}
      {Boolean(props.hotspots?.length) && <button type="button" className="icon-button h-11 min-h-11 w-11 bg-ivory/90" onClick={() => setAnnotations((value) => !value)} aria-pressed={annotations && !exploded} aria-label={annotations ? t("Sembunyikan anotasi") : t("Tampilkan anotasi")} disabled={exploded} title={exploded ? t("Anotasi disembunyikan saat komponen dipisahkan") : undefined}>{annotations ? <Tag size={16} /> : <X size={16} />}</button>}
      <button type="button" className="icon-button h-11 min-h-11 w-11 bg-ivory/90" onClick={reset} aria-label={t("Reset kamera")}><RotateCcw size={16} /></button>
      <button type="button" className="icon-button h-11 min-h-11 w-11 bg-ivory/90" onClick={toggleFullscreen} aria-label={fullscreen ? t("Keluar layar penuh") : t("Buka layar penuh")}>{fullscreen ? <Minimize size={16} /> : <Expand size={16} />}</button>
    </div>
    <ViewerErrorBoundary fallback={fallback}>
      <Canvas frameloop={inView && pageVisible ? "demand" : "never"} dpr={[1, 1.5]} camera={{ position: [3.4, 2.55, 4.1], fov: 38, near: .1, far: 100 }} shadows gl={{ antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: true }} style={{ touchAction: controlsActive ? "none" : "pan-y" }} onCreated={({ gl }) => { canvasRef.current = gl.domElement; gl.domElement.addEventListener("webglcontextlost", () => setWebgl(false), { once: true }); }}>
        <Scene {...props} rotationY={rotationY} exploded={exploded} annotations={annotations && !exploded && Boolean(props.hotspots?.length)} onHotspot={setActiveHotspot} controls={controls} controlsActive={controlsActive} />
      </Canvas>
    </ViewerErrorBoundary>
    <LoadingProgress />
    {coarse && <div className="absolute inset-x-0 bottom-16 z-20 flex justify-center"><button type="button" className="btn btn-dark min-h-12 py-2" onClick={() => setControlsActive((value) => !value)}>{controlsActive ? <Pause size={14} /> : <Play size={14} />}{controlsActive ? t("Kunci putar & lanjut scroll") : t("Aktifkan putar 3D")}</button></div>}
    <div className="absolute inset-x-0 bottom-0 z-10 flex min-h-12 items-center justify-between gap-3 border-t hairline bg-ivory/95 px-3">
      <p className="mono flex min-w-0 items-center gap-2 text-steel-dark"><Box size={14} />{coarse ? t("Dua jari untuk zoom") : t("Drag putar · scroll zoom · ← → keyboard")}</p>
      <div className="flex shrink-0 items-center gap-3"><span className="mono hidden text-steel-dark xl:inline">{props.glbUrl ? "R = reset" : exploded ? t("E = satukan") : t("E = pisah · R = reset")}</span><button type="button" className="mono inline-flex min-h-11 items-center gap-2 px-2 text-graphite hover:text-industrial disabled:opacity-45" onClick={exportView} disabled={exporting} aria-label={t("Unduh tampilan 3D sebagai PNG")}>{exporting ? <LoaderCircle size={15} className="loader-ring" /> : <Download size={15} />}{exporting ? t("Membuat…") : "PNG"}</button></div>
    </div>
    {exportStatus && <div role="status" aria-live="polite" className="absolute left-3 top-20 z-40 max-w-xs border-l-2 border-industrial bg-graphite p-4 text-xs leading-relaxed text-ivory shadow-xl">{exportStatus}</div>}
    {activeHotspot && <div className="absolute bottom-16 left-3 right-3 z-30 border-l-2 border-industrial bg-graphite p-4 text-ivory shadow-xl" role="status"><div className="flex items-start justify-between gap-4"><div><p className="mono mb-1 text-industrial">{activeHotspot.status === "observed" ? t("Observasi visual") : t("Perlu konfirmasi")}</p><h3 className="font-medium">{activeHotspot.label}</h3><p className="mt-2 text-xs leading-relaxed text-ivory/65">{activeHotspot.description}</p></div><button type="button" className="mono min-h-11 px-2" onClick={() => setActiveHotspot(null)}>{t("Tutup")}</button></div></div>}
    {!props.glbUrl && <div className="pointer-events-none absolute bottom-14 right-3 z-10 hidden max-w-[210px] items-start gap-2 text-[10px] leading-relaxed text-steel-dark md:flex"><Info size={13} className="mt-0.5 shrink-0" />{exploded ? t("Posisi pisah hanya untuk orientasi visual, bukan panduan bongkar.") : t("Model komponen bersifat skematik, tidak untuk fabrikasi.")}</div>}
  </div>;
}
