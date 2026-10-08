import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Download, Eraser, Paintbrush, RotateCcw, Calendar, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { PHONES } from "@/config/clinic";
import { track } from "@/lib/track";

interface Props { onBookingClick: () => void }

const MAX = 960; // longest side of the working image, in pixels
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// A whitening preview that runs entirely in the browser: the photo is never uploaded.
// The visitor paints over the teeth; inside the painted area only tooth-coloured pixels are brightened
// (reds of lips and gums and dark mouth interior are left alone). It is an approximation, not a promise.
const SmilePreview = ({ onBookingClick }: Props) => {
  const { t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLCanvasElement>(null);
  const before = useRef<HTMLCanvasElement>(null);
  const base = useRef<ImageData | null>(null);
  const mask = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef(0);
  const [ready, setReady] = useState(false);
  const [strength, setStrength] = useState(65);
  const [brush, setBrush] = useState(26);
  const [erase, setErase] = useState(false);
  const [split, setSplit] = useState(50);
  const [error, setError] = useState("");
  const [painted, setPainted] = useState(false);

  const render = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const c = out.current, b = base.current, m = mask.current;
      if (!c || !b || !m) return;
      const w = b.width, h = b.height;
      const res = new ImageData(new Uint8ClampedArray(b.data), w, h);
      const md = m.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, w, h).data;
      const k = strength / 100, d = res.data;
      for (let i = 0; i < d.length; i += 4) {
        const a = md[i + 3]; if (!a) continue;
        const r = d[i], g = d[i + 1], bl = d[i + 2];
        const l = (Math.max(r, g, bl) + Math.min(r, g, bl)) / 510;
        const red = (r - g) / 255;                            // lips and gums are strongly red (r far above g); teeth, even yellow ones, are not
        const tooth = clamp(1 - Math.max(0, red - 0.06) * 5) * clamp((l - 0.22) / 0.25);   // dark mouth interior is left alone
        const wgt = (a / 255) * tooth * k;
        if (wgt <= 0.003) continue;
        const avg = (r + g + bl) / 3;
        const yellow = (r + g) / 2 - bl;                       // teeth look yellow when blue is low
        let nr = r + (avg - r) * 0.55 * wgt, ng = g + (avg - g) * 0.55 * wgt, nb = bl + (avg - bl) * 0.55 * wgt;
        nb += Math.max(0, yellow) * 0.5 * wgt;
        const lift = 0.34 * wgt;
        nr += (255 - nr) * lift; ng += (255 - ng) * lift; nb += (255 - nb) * lift;
        d[i] = nr; d[i + 1] = ng; d[i + 2] = nb;
      }
      c.getContext("2d")!.putImageData(res, 0, 0);
    });
  }, [strength]);

  useEffect(() => { if (ready) render(); }, [ready, render]);

  const load = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      const sc = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
      const w = Math.round(bmp.width * sc), h = Math.round(bmp.height * sc);
      for (const c of [out.current, before.current]) if (c) { c.width = w; c.height = h; }
      const ctx = before.current!.getContext("2d")!; ctx.drawImage(bmp, 0, 0, w, h);
      base.current = ctx.getImageData(0, 0, w, h);
      const m = document.createElement("canvas"); m.width = w; m.height = h; mask.current = m;
      setPainted(false); setSplit(50); setReady(true); render();
      track("smile_preview", "photo");
    } catch { setError(t("smile.error")); }
  };

  const paint = (e: React.PointerEvent<HTMLDivElement>) => {
    const c = out.current, m = mask.current; if (!c || !m || e.buttons === 0 && e.pointerType === "mouse") return;
    const r = c.getBoundingClientRect(), sx = c.width / r.width;
    const x = (e.clientX - r.left) * sx, y = (e.clientY - r.top) * sx, rad = brush * sx * 0.5 + 4;
    const ctx = m.getContext("2d")!;
    if (erase) { ctx.globalCompositeOperation = "destination-out"; } else { ctx.globalCompositeOperation = "source-over"; }
    const gr = ctx.createRadialGradient(x, y, rad * 0.35, x, y, rad);
    gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    if (!painted) setPainted(true);
    render();
  };

  const reset = () => { const m = mask.current; if (m) m.getContext("2d")!.clearRect(0, 0, m.width, m.height); setPainted(false); render(); };
  const save = () => { out.current?.toBlob((b) => { if (!b) return; const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "my-smile-preview.jpg"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); track("smile_preview", "save"); }, "image/jpeg", 0.92); };

  const shades = [{ k: "natural", v: 40 }, { k: "bright", v: 65 }, { k: "hollywood", v: 100 }];

  return (
    <section id="smile" className="relative overflow-hidden bg-gradient-to-b from-background via-[hsl(44_100%_96%)] to-background py-16 md:py-24">
      <div className="container px-4 sm:px-6 lg:px-14">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
          <p className="mb-3 inline-flex rounded-full bg-[hsl(var(--sun)/0.3)] px-4 py-1 text-sm font-semibold text-[hsl(var(--ink))]">✨ {t("smile.badge")}</p>
          <h2 className="mb-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{t("smile.title1")} <span className="text-gradient">{t("smile.title2")}</span></h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{t("smile.desc")}</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="rounded-[2rem] border border-border bg-white p-3 shadow-elevated sm:p-4">
            {!ready && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed border-[hsl(var(--aqua)/0.6)] bg-secondary/50 text-primary transition-colors hover:bg-secondary">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-card"><Camera className="h-8 w-8" /></span>
                <span className="px-4 text-lg font-semibold">{t("smile.upload")}</span>
                <span className="px-6 text-sm text-muted-foreground">{t("smile.step1")}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { load(e.target.files?.[0]); e.target.value = ""; }} />
            <div className={ready ? "" : "hidden"}>
              <div dir="ltr" className="relative touch-none select-none overflow-hidden rounded-[1.5rem] bg-black/5"
                onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); paint(e); }} onPointerMove={paint}>
                <canvas ref={out} className="block h-auto w-full" />
                <canvas ref={before} className="pointer-events-none absolute inset-0 h-full w-full" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }} />
                <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${split}%` }} />
                <span className="pointer-events-none absolute start-2 top-2 rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-bold text-white">{t("smile.before")}</span>
                <span className="pointer-events-none absolute end-2 top-2 rounded-full bg-[hsl(var(--sun))] px-2.5 py-0.5 text-xs font-bold text-[hsl(var(--ink))]">{t("smile.after")}</span>
                {!painted && <span className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto w-max max-w-[90%] rounded-full bg-white/90 px-4 py-1.5 text-center text-sm font-semibold text-primary shadow">{t("smile.step2")}</span>}
              </div>
              <label className="mt-3 block text-xs font-semibold text-muted-foreground">{t("smile.compare")}
                <input dir="ltr" type="range" min={0} max={100} value={split} onChange={(e) => setSplit(+e.target.value)} className="mt-1 w-full accent-[hsl(var(--primary))]" />
              </label>
            </div>
            {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-white p-5 shadow-card">
              <div className="mb-4 flex flex-wrap gap-2">
                {shades.map((s) => (
                  <button key={s.k} type="button" onClick={() => setStrength(s.v)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${strength === s.v ? "border-transparent bg-primary text-white" : "border-border bg-white text-foreground hover:bg-secondary"}`}>
                    {t(`smile.shade.${s.k}`)}
                  </button>
                ))}
              </div>
              <label className="mb-4 block text-sm font-semibold">{t("smile.whiten")}: {strength}%
                <input type="range" min={0} max={100} value={strength} onChange={(e) => setStrength(+e.target.value)} className="mt-1 w-full accent-[hsl(var(--primary))]" />
              </label>
              <label className="mb-4 block text-sm font-semibold">{t("smile.brush")}
                <input type="range" min={10} max={70} value={brush} onChange={(e) => setBrush(+e.target.value)} className="mt-1 w-full accent-[hsl(var(--primary))]" />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant={erase ? "outline" : "default"} onClick={() => setErase(false)} disabled={!ready} className="gap-1.5 rounded-full"><Paintbrush className="h-4 w-4" />{t("smile.paint")}</Button>
                <Button type="button" size="sm" variant={erase ? "default" : "outline"} onClick={() => setErase(true)} disabled={!ready} className="gap-1.5 rounded-full"><Eraser className="h-4 w-4" />{t("smile.erase")}</Button>
                <Button type="button" size="sm" variant="outline" onClick={reset} disabled={!ready} className="gap-1.5 rounded-full"><RotateCcw className="h-4 w-4" />{t("smile.clear")}</Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()} className="gap-1.5 rounded-full"><Camera className="h-4 w-4" />{t("smile.change")}</Button>
                <Button type="button" size="sm" variant="outline" onClick={save} disabled={!ready} className="gap-1.5 rounded-full"><Download className="h-4 w-4" />{t("smile.save")}</Button>
              </div>
            </div>

            <div className="rounded-3xl bg-secondary/70 p-5 text-sm leading-relaxed">
              <p className="mb-2 flex items-start gap-2 font-medium"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(160_70%_30%)]" />{t("smile.privacy")}</p>
              <p className="text-muted-foreground">{t("smile.disclaimer")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => { track("smile_preview", "book"); onBookingClick(); }} className="gap-2 rounded-full bg-[hsl(var(--sun))] text-[hsl(var(--ink))] hover:bg-[hsl(41_100%_68%)]"><Calendar className="h-4 w-4" />{t("smile.book")}</Button>
                <Button asChild variant="outline" className="gap-2 rounded-full">
                  <a href={`https://wa.me/${PHONES[0].whatsapp}?text=${encodeURIComponent(t("smile.waText"))}`} target="_blank" rel="noopener noreferrer" onClick={() => track("smile_preview", "whatsapp")}><MessageCircle className="h-4 w-4" />{t("smile.send")}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmilePreview;
