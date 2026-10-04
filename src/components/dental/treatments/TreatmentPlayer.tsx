import { useEffect, useRef, useState, type ComponentType } from "react";
import { Pause, Play, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { SceneProps } from "./scenes";

type L = "en" | "ar" | "ku";
export interface Step { title: Record<L, string>; text: Record<L, string> }

const STEP_MS = 4200;
const UI: Record<L, { play: string; pause: string; prev: string; next: string; again: string; step: string }> = {
  en: { play: "Play", pause: "Pause", prev: "Previous step", next: "Next step", again: "Watch again", step: "Step" },
  ar: { play: "تشغيل", pause: "إيقاف", prev: "الخطوة السابقة", next: "الخطوة التالية", again: "شاهد مرة أخرى", step: "الخطوة" },
  ku: { play: "لێدان", pause: "ڕاوەستان", prev: "قۆناغا بەری", next: "قۆناغا پاشی", again: "دیسان ببینە", step: "قۆناغ" },
};

// Plays one treatment animation: the drawing on one side, the numbered steps on the other.
// Starts by itself when it scrolls into view, stops at the last step.
const TreatmentPlayer = ({ Scene, steps, lang, label }: { Scene: ComponentType<SceneProps>; steps: Step[]; lang: L; label: string }) => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const ui = UI[lang];
  const last = steps.length - 1;

  // Start once, when the animation is on screen (not for visitors who prefer less motion).
  useEffect(() => {
    const el = boxRef.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        setPlaying(true);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (step >= last) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [playing, step, last]);

  const go = (s: number) => {
    setPlaying(false);
    setStep(Math.max(0, Math.min(last, s)));
  };

  return (
    <div ref={boxRef} className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-5 md:gap-8 items-start">
      <div className="relative">
        <svg viewBox="0 0 240 280" role="img" aria-label={`${label}: ${steps[step].title[lang]}`} className="w-full max-w-sm mx-auto rounded-2xl shadow-card border border-border bg-[#eef8ff]">
          <Scene step={step} lang={lang} />
        </svg>
        {/* progress bar */}
        <div className="max-w-sm mx-auto mt-3 flex gap-1.5" dir="ltr">
          {steps.map((_, i) => (
            <span key={i} className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <span
                className="block h-full bg-primary transition-all"
                style={{
                  width: i < step ? "100%" : i === step ? (playing ? "100%" : "100%") : "0%",
                  transitionDuration: i === step && playing ? `${STEP_MS}ms` : "300ms",
                  opacity: i <= step ? 1 : 0,
                }}
              />
            </span>
          ))}
        </div>
        <div className="max-w-sm mx-auto mt-3 flex items-center justify-center gap-2">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0} aria-label={ui.prev}
            className="p-2 rounded-full border border-border hover:bg-secondary disabled:opacity-40">
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          {step === last && !playing ? (
            <button type="button" onClick={() => { setStep(0); setPlaying(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold">
              <RotateCcw className="w-4 h-4" />{ui.again}
            </button>
          ) : (
            <button type="button" onClick={() => setPlaying((p) => !p)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? ui.pause : ui.play}
            </button>
          )}
          <button type="button" onClick={() => go(step + 1)} disabled={step === last} aria-label={ui.next}
            className="p-2 rounded-full border border-border hover:bg-secondary disabled:opacity-40">
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      <ol className="space-y-2" aria-live="polite">
        {steps.map((s, i) => {
          const on = i === step;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => go(i)}
                className={`w-full text-start flex gap-3 p-3 rounded-xl border transition-colors ${
                  on ? "bg-primary/10 border-primary/40" : "border-transparent hover:bg-secondary"
                }`}
              >
                <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                  on || i < step ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <span>
                  <span className={`block font-semibold ${on ? "text-primary" : "text-foreground"}`}>{s.title[lang]}</span>
                  <span className={`block text-sm leading-relaxed transition-all ${on ? "text-foreground mt-1" : "text-muted-foreground line-clamp-1"}`}>
                    {s.text[lang]}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default TreatmentPlayer;
