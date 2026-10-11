import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Download, Eraser, Paintbrush, RotateCcw, Calendar, MessageCircle, ShieldCheck, Move, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { PHONES } from "@/config/clinic";
import { track } from "@/lib/track";

interface Props { onBookingClick: () => void }

const MAX = 960; // longest side of the working image, in pixels
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

type Mode = "whiten" | "design";
type Shape = "square" | "oval" | "soft";
type Tool = "paint" | "erase" | "move";
interface Tpl { cx: number; cy: number; w: number; h: number; curve: number; rot: number }

// Shade of the designed teeth: [cervical (near the gum), body, incisal edge].
const SHADES: Record<string, [string, string, string]> = {
  natural: ["#E6D9C2", "#F6F0E4", "#E3E6E8"],
  bright: ["#ECE4D6", "#FBF8F2", "#E8ECEF"],
  hollywood: ["#EEF0F1", "#FEFEFE", "#ECF1F5"],
};
// Upper teeth from the midline outwards: central, lateral, canine, two premolars (golden-proportion widths).
const WIDTH = [1, 0.618, 0.42, 0.3, 0.24];
const LEN = [1, 0.82, 0.92, 0.8, 0.72];

/** Draws an ideal upper smile (10 teeth) centred on tpl, in image pixels. */
function drawSmile(ctx: CanvasRenderingContext2D, tpl: Tpl, shape: Shape, shade: string) {
  const [cerv, body, edge] = SHADES[shade] || SHADES.hollywood;
  const half = WIDTH.reduce((a, b) => a + b, 0), u = tpl.w / 2 / half;
  const rIncisal = shape === "square" ? 0.14 : shape === "oval" ? 0.46 : 0.28;
  ctx.save();
  ctx.translate(tpl.cx, tpl.cy); ctx.rotate((tpl.rot * Math.PI) / 180);
  for (const side of [-1, 1]) {
    let x = 0;
    WIDTH.forEach((wr, i) => {
      const tw = wr * u, len = LEN[i] * tpl.h;
      const xc = side * (x + tw / 2), rel = (x + tw / 2) / (tpl.w / 2);
      const lift = tpl.curve * tpl.h * 0.45 * rel * rel;                 // teeth rise towards the corners: the smile arc
      const top = -tpl.h / 2 - lift * 0.35 + (i === 1 ? tpl.h * 0.04 : 0), bot = top + len - lift * 0.65;
      const x0 = xc - tw / 2, inset = tw * 0.05, rt = tw * 0.3, rb = tw * rIncisal;
      const p = new Path2D();
      p.moveTo(x0 + inset, top + rt); p.quadraticCurveTo(x0 + inset, top, x0 + inset + rt, top);
      p.lineTo(x0 + tw - inset - rt, top); p.quadraticCurveTo(x0 + tw - inset, top, x0 + tw - inset, top + rt);
      p.lineTo(x0 + tw, bot - rb); p.quadraticCurveTo(x0 + tw, bot, x0 + tw - rb, bot);
      p.lineTo(x0 + rb, bot); p.quadraticCurveTo(x0, bot, x0, bot - rb); p.closePath();
      const g = ctx.createLinearGradient(0, top, 0, bot);
      g.addColorStop(0, cerv); g.addColorStop(0.28, body); g.addColorStop(0.82, body); g.addColorStop(1, edge);
      ctx.fillStyle = g; ctx.fill(p);
      const depth = Math.min(0.42, i * 0.09);                            // back teeth sit deeper in the mouth: a little darker
      if (depth) { ctx.fillStyle = `rgba(70,60,50,${depth})`; ctx.fill(p); }
      const hl = ctx.createRadialGradient(xc - side * tw * 0.12, top + len * 0.38, 0, xc, top + len * 0.4, tw * 0.7);
      hl.addColorStop(0, "rgba(255,255,255,0.55)"); hl.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hl; ctx.fill(p);
      ctx.strokeStyle = "rgba(110,95,80,0.35)"; ctx.lineWidth = Math.max(1, tw * 0.035); ctx.stroke(p);
      x += tw;
    });
  }
  ctx.restore();
}

// A smile preview that runs entirely in the browser: the photo is never uploaded.
// Whitening: inside the painted area only tooth-coloured pixels are brightened (lips, gums and the dark mouth are left alone).
// Hollywood smile design: an ideal set of upper teeth is drawn and shown only inside the painted area, so the lips stay in front.
// It is an approximation, not a promise.
const SmilePreview = ({ onBookingClick }: Props) => {
  const { t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLCanvasElement>(null);
  const before = useRef<HTMLCanvasElement>(null);
  const base = useRef<ImageData | null>(null);
  const mask = useRef<HTMLCanvasElement | null>(null);
  const layer = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("whiten");
  const [strength, setStrength] = useState(65);
  const [brush, setBrush] = useState(26);
  const [tool, setTool] = useState<Tool>("paint");
  const [split, setSplit] = useState(50);
  const [error, setError] = useState("");
  const [painted, setPainted] = useState(false);
  const [shape, setShape] = useState<Shape>("soft");
  const [shade, setShade] = useState("hollywood");
  const [tpl, setTpl] = useState<Tpl>({ cx: 0, cy: 0, w: 100, h: 40, curve: 0.5, rot: 0 });

  const render = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const c = out.current, b = base.current, m = mask.current;
      if (!c || !b || !m) return;
      const w = b.width, h = b.height;
      const res = new ImageData(new Uint8ClampedArray(b.data), w, h);
      const md = m.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, w, h).data;
      const k = (mode === "design" ? 85 : strength) / 100, d = res.data;
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
      const ctx = c.getContext("2d")!;
      ctx.putImageData(res, 0, 0);
      if (mode === "design") {
        const L = layer.current || (layer.current = document.createElement("canvas"));
        L.width = w; L.height = h;
        const lc = L.getContext("2d")!;
        drawSmile(lc, tpl, shape, shade);
        if (painted) { lc.globalCompositeOperation = "destination-in"; lc.drawImage(m, 0, 0); lc.globalCompositeOperation = "source-over"; }
        ctx.globalAlpha = painted ? 0.97 : 0.8; ctx.drawImage(L, 0, 0); ctx.globalAlpha = 1;
      }
    });
  }, [strength, mode, tpl, shape, shade, painted]);

  useEffect(() => { if (ready) render(); }, [ready, render]);

  /** Places the new smile over the painted area (or the middle of the photo if nothing is painted). */
  const fit = useCallback(() => {
    const m = mask.current, b = base.current; if (!m || !b) return;
    const w = m.width, h = m.height, md = m.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, w, h).data;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (md[(y * w + x) * 4 + 3] > 60) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) setTpl((p) => ({ ...p, cx: w / 2, cy: h / 2, w: w * 0.42, h: w * 0.1 }));
    else {            // upper teeth start at the top of the painted area; a central incisor is about 1.25× as long as it is wide
      const bw = x1 - x0, bh = y1 - y0, th = Math.min(bh * 0.9, bw * 0.24);
      setTpl((p) => ({ ...p, cx: (x0 + x1) / 2, cy: y0 + bh * 0.04 + th / 2, w: bw * 0.98, h: th }));
    }
  }, []);

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
      setPainted(false); setSplit(50); setTool("paint"); setTpl({ cx: w / 2, cy: h / 2, w: w * 0.42, h: w * 0.1, curve: 0.5, rot: 0 }); setReady(true); render();
      track("smile_preview", "photo");
    } catch { setError(t("smile.error")); }
  };

  const toImage = (e: React.PointerEvent) => {
    const c = out.current!, r = c.getBoundingClientRect(), sx = c.width / r.width;
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sx, sx };
  };
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    if (tool === "move") { const p = toImage(e); drag.current = { x: p.x, y: p.y }; return; }
    paint(e, true);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tool === "move") {
      if (!drag.current) return; const p = toImage(e), d = drag.current;
      setTpl((o) => ({ ...o, cx: o.cx + p.x - d.x, cy: o.cy + p.y - d.y })); drag.current = { x: p.x, y: p.y }; return;
    }
    paint(e, false);
  };
  const paint = (e: React.PointerEvent<HTMLDivElement>, first: boolean) => {
    const m = mask.current; if (!out.current || !m || (!first && e.buttons === 0 && e.pointerType === "mouse")) return;
    const { x, y, sx } = toImage(e), rad = brush * sx * 0.5 + 4;
    const ctx = m.getContext("2d")!;
    ctx.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over";
    const gr = ctx.createRadialGradient(x, y, rad * 0.35, x, y, rad);
    gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    if (!painted) setPainted(true);
    render();
  };

  const reset = () => { const m = mask.current; if (m) m.getContext("2d")!.clearRect(0, 0, m.width, m.height); setPainted(false); setTool("paint"); render(); };
  const save = () => { out.current?.toBlob((b) => { if (!b) return; const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "my-smile-preview.jpg"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); track("smile_preview", "save"); }, "image/jpeg", 0.92); };
  const pickMode = (m: Mode) => {
    setMode(m); track("smile_preview", m);
    if (m === "design") { fit(); if (painted) setTool("move"); } else if (tool === "move") setTool("paint");
  };

  const shades = [{ k: "natural", v: 40 }, { k: "bright", v: 65 }, { k: "hollywood", v: 100 }];
  const chip = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${on ? "border-transparent bg-primary text-white" : "border-border bg-white text-foreground hover:bg-secondary"}`;
  const range = (label: string, value: number, min: number, max: number, step: number, set: (v: number) => void) => (
    <label className="mb-3 block text-sm font-semibold">{label}
      <input dir="ltr" type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} disabled={!ready} className="mt-1 w-full accent-[hsl(var(--primary))]" />
    </label>
  );
  const iw = base.current?.width || 1000;

  return (
    <section id="smile" className="relative overflow-hidden bg-gradient-to-b from-background via-[hsl(44_100%_96%)] to-background py-16 md:py-24">
      <div className="container px-4 sm:px-6 lg:px-14">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
          <p className="mb-3 inline-flex rounded-full bg-[hsl(var(--sun)/0.3)] px-4 py-1 text-sm font-semibold text-[hsl(var(--ink))]">✨ {t("smile.badge")}</p>
          <h2 className="mb-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{t("smile.title1")} <span className="text-gradient">{t("smile.title2")}</span></h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{t("smile.desc")}</p>
        </div>

        <div className="mx-auto mb-6 flex max-w-md rounded-full border border-border bg-white p-1 shadow-card" role="tablist">
          {(["whiten", "design"] as Mode[]).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => pickMode(m)}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${mode === m ? "bg-primary text-white shadow" : "text-foreground hover:bg-secondary"}`}>
              {m === "whiten" ? "✨ " : "😁 "}{t(`smile.mode.${m}`)}
            </button>
          ))}
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
              <div dir="ltr" className={`relative touch-none select-none overflow-hidden rounded-[1.5rem] bg-black/5 ${tool === "move" ? "cursor-move" : "cursor-crosshair"}`}
                onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
                <canvas ref={out} className="block h-auto w-full" />
                <canvas ref={before} className="pointer-events-none absolute inset-0 h-full w-full" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }} />
                <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${split}%` }} />
                <span className="pointer-events-none absolute start-2 top-2 rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-bold text-white">{t("smile.before")}</span>
                <span className="pointer-events-none absolute end-2 top-2 rounded-full bg-[hsl(var(--sun))] px-2.5 py-0.5 text-xs font-bold text-[hsl(var(--ink))]">{t("smile.after")}</span>
                {!painted && <span className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto w-max max-w-[90%] rounded-full bg-white/90 px-4 py-1.5 text-center text-sm font-semibold text-primary shadow">{mode === "design" ? t("smile.design.hint") : t("smile.step2")}</span>}
              </div>
              <label className="mt-3 block text-xs font-semibold text-muted-foreground">{t("smile.compare")}
                <input dir="ltr" type="range" min={0} max={100} value={split} onChange={(e) => setSplit(+e.target.value)} className="mt-1 w-full accent-[hsl(var(--primary))]" />
              </label>
            </div>
            {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-white p-5 shadow-card">
              {mode === "whiten" ? (
                <>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {shades.map((s) => (
                      <button key={s.k} type="button" onClick={() => setStrength(s.v)} className={chip(strength === s.v)}>{t(`smile.shade.${s.k}`)}</button>
                    ))}
                  </div>
                  {range(`${t("smile.whiten")}: ${strength}%`, strength, 0, 100, 1, setStrength)}
                </>
              ) : (
                <>
                  <p className="mb-1 text-sm font-semibold">{t("smile.color")}</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {shades.map((s) => <button key={s.k} type="button" onClick={() => setShade(s.k)} className={chip(shade === s.k)}>{t(`smile.shade.${s.k}`)}</button>)}
                  </div>
                  <p className="mb-1 text-sm font-semibold">{t("smile.shape")}</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(["square", "oval", "soft"] as Shape[]).map((s) => <button key={s} type="button" onClick={() => setShape(s)} className={chip(shape === s)}>{t(`smile.shape.${s}`)}</button>)}
                  </div>
                  {range(t("smile.size"), Math.round(tpl.w), Math.round(iw * 0.1), Math.round(iw * 0.95), 1, (v) => setTpl((p) => ({ ...p, w: v })))}
                  {range(t("smile.height"), Math.round(tpl.h), Math.round(iw * 0.03), Math.round(iw * 0.4), 1, (v) => setTpl((p) => ({ ...p, h: v })))}
                  {range(t("smile.curve"), tpl.curve, 0, 1, 0.05, (v) => setTpl((p) => ({ ...p, curve: v })))}
                  {range(t("smile.rotate"), tpl.rot, -15, 15, 0.5, (v) => setTpl((p) => ({ ...p, rot: v })))}
                </>
              )}
              {range(t("smile.brush"), brush, 10, 70, 1, setBrush)}
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant={tool === "paint" ? "default" : "outline"} onClick={() => setTool("paint")} disabled={!ready} className="gap-1.5 rounded-full"><Paintbrush className="h-4 w-4" />{t("smile.paint")}</Button>
                <Button type="button" size="sm" variant={tool === "erase" ? "default" : "outline"} onClick={() => setTool("erase")} disabled={!ready} className="gap-1.5 rounded-full"><Eraser className="h-4 w-4" />{t("smile.erase")}</Button>
                {mode === "design" && <Button type="button" size="sm" variant={tool === "move" ? "default" : "outline"} onClick={() => setTool("move")} disabled={!ready} className="gap-1.5 rounded-full"><Move className="h-4 w-4" />{t("smile.move")}</Button>}
                <Button type="button" size="sm" variant="outline" onClick={reset} disabled={!ready} className="gap-1.5 rounded-full"><RotateCcw className="h-4 w-4" />{t("smile.clear")}</Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {mode === "design" && <Button type="button" size="sm" variant="outline" onClick={fit} disabled={!ready} className="gap-1.5 rounded-full"><Scan className="h-4 w-4" />{t("smile.fit")}</Button>}
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
