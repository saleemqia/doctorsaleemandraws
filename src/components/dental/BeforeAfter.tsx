import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import before1 from "@/assets/gallery/ba-1-before.jpg";
import after1 from "@/assets/gallery/ba-1-after.jpg";

// Add more cases here: two photos of the same view (before, after) and a title key.
const CASES = [{ before: before1, after: after1, titleKey: "ba.case1" }];

const Slider = ({ before, after, label }: { before: string; after: string; label: string }) => {
  const { t } = useLanguage();
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={box}
      dir="ltr"
      className="relative w-full max-w-sm mx-auto aspect-[380/768] max-h-[70vh] rounded-3xl overflow-hidden shadow-xl border border-border select-none touch-pan-y cursor-ew-resize"
      onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); move(e.clientX); }}
      onPointerMove={(e) => { if (e.buttons || e.pointerType === "touch") move(e.clientX); }}
      role="img"
      aria-label={label}
    >
      <img src={after} alt={t("ba.after")} className="absolute inset-0 w-full h-full object-cover" draggable={false} loading="lazy" />
      <img src={before} alt={t("ba.before")} className="absolute inset-0 w-full h-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable={false} loading="lazy" />
      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold">{t("ba.before")}</span>
      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">{t("ba.after")}</span>
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,.5)]" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-primary">
          <MoveHorizontal className="w-5 h-5" />
        </span>
      </div>
      <input
        type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)}
        aria-label={t("ba.drag")} className="absolute inset-x-0 bottom-0 opacity-0 h-8 cursor-ew-resize"
      />
    </div>
  );
};

const BeforeAfter = ({ onBookingClick }: { onBookingClick?: () => void }) => {
  const { t } = useLanguage();
  return (
    <section id="before-after" className="py-16 md:py-24">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {t("ba.title1")} <span className="text-gradient">{t("ba.title2")}</span>
          </h2>
          <p className="text-muted-foreground">{t("ba.desc")}</p>
        </motion.div>
        <div className="grid gap-10">
          {CASES.map((c) => (
            <div key={c.titleKey} className="text-center">
              <Slider before={c.before} after={c.after} label={t(c.titleKey)} />
              <p className="mt-4 font-medium">{t(c.titleKey)}</p>
            </div>
          ))}
        </div>
        {onBookingClick && (
          <div className="text-center mt-8">
            <button onClick={onBookingClick} className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg">{t("ba.cta")}</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BeforeAfter;
