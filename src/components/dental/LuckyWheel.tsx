import { useEffect, useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_NUMBER } from "@/config/clinic";

type WheelStatus = {
  ok: boolean;
  canSpin: boolean;
  spinsUntilGift: number;
  winner?: boolean;
  claimCode?: string;
  validUntil?: string;
};

const copy = {
  en: {
    badge: "A clinic gift",
    title: "Try your luck",
    description: "Spin for a surprise clinic gift. A winner may receive a free consultation or scaling and polishing.",
    spin: "Spin the wheel",
    spinning: "Spinning…",
    left: "A surprise clinic gift could be next",
    today: "Thank you for visiting. Sorry, no clinic gift this time. Please try your luck again tomorrow.",
    won: "You won a clinic gift!",
    wonText: "Choose a free consultation or free scaling and polishing. Show this code when booking:",
    book: "Claim on WhatsApp",
    terms: "No payment is required. One spin per device per day. Prize must be booked within 14 days and treatment is provided only when clinically appropriate.",
    tip: "Keep smiling",
    gift: "Clinic gift",
    ready: "Ready to spin",
    error: "The wheel is unavailable right now. Please try again shortly.",
  },
  ar: {
    badge: "هدية من العيادة",
    title: "جرّب حظك",
    description: "أدر العجلة من أجل هدية مفاجأة من العيادة. قد يفوز الزائر باستشارة مجانية أو تنظيف وتلميع مجاني.",
    spin: "أدر العجلة",
    spinning: "تدور العجلة…",
    left: "قد تكون هدية مفاجأة من العيادة قريبة",
    today: "شكرًا لزيارتك. نعتذر، لم تربح هدية من العيادة هذه المرة. جرّب حظك مرة أخرى غدًا.",
    won: "لقد ربحت هدية من العيادة!",
    wonText: "اختر استشارة مجانية أو تنظيف وتلميع مجاني. أظهر هذا الرمز عند الحجز:",
    book: "احجز عبر واتساب",
    terms: "لا يلزم أي دفع. محاولة واحدة لكل جهاز يوميًا. يجب حجز الهدية خلال 14 يومًا، ويُقدَّم العلاج فقط إذا كان مناسبًا بعد الفحص.",
    tip: "ابتسامة جميلة",
    gift: "هدية العيادة",
    ready: "جاهز للدوران",
    error: "العجلة غير متاحة الآن. حاول مرة أخرى بعد قليل.",
  },
  ku: {
    badge: "دیاریا ژ کلینیکێ",
    title: "بەختێ خۆ تاقی بکە",
    description: "عەجلێ بۆ دیاریا نهێنی یا کلینیکێ بچرخینە. ڕەنگە سەرکەفتنێ شێوەرەکا بەلاشان یان پاککرن و پۆلیشکرنا بەلاشان بیت.",
    spin: "عەجلێ بچرخینە",
    spinning: "عەجل دچرخیت…",
    left: "دیاریا نهێنی یا کلینیکێ ڕەنگە نێزیک بیت",
    today: "سوپاس بۆ سەردانا تە. ببورە، ڤێ جارێ دیاریا کلینیکێ نەبرد. سبە جارەکا دی بەختێ خۆ تاقی بکە.",
    won: "تو دیاریا کلینیکێ برد!",
    wonText: "شێوەرەکا بەلاشان یان پاککرن و پۆلیشکرنا بەلاشان هەلبژێرە. ڤێ کودێ دەمێ حجزکرنێ نیشان بدە:",
    book: "ل ڕێیا واتساپێ دا حجز بکە",
    terms: "هیچ پارە پێدڤی نینە. یەک چرخان بۆ هەر ئامێرێ د رۆژێ دا. دیاری دناڤ 14 رۆژان دا حجز بکە، و چارەسەری تەنێ پشتی پشکنینێ دەمێ گونجایێ دهێتە کرن.",
    tip: "بزەیەکا جوان",
    gift: "دیاریا کلینیکێ",
    ready: "ئامادەیە بۆ چرخانێ",
    error: "عەجل نوکە بەردەست نینە. کەمێ پاشتر دوبارە هەوڵ بدە.",
  },
} as const;

export default function LuckyWheel() {
  const { language, dir } = useLanguage();
  const text = copy[language];
  const [status, setStatus] = useState<WheelStatus | null>(null);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const response = await fetch("/api/luck", { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Error("Unavailable");
      setStatus(await response.json() as WheelStatus);
    } catch {
      setMessage(text.error);
    }
  };

  useEffect(() => { void load(); }, [language]);

  const spin = async () => {
    if (spinning || !status?.canSpin) return;
    setSpinning(true);
    setMessage("");
    try {
      const response = await fetch("/api/luck", { method: "POST", credentials: "same-origin" });
      if (!response.ok) throw new Error("Unavailable");
      const result = await response.json() as WheelStatus;
      setAngle((current) => current + 1440 + (result.winner ? 22 : 202));
      window.setTimeout(() => {
        setStatus(result);
        setMessage(result.winner ? text.won : text.today);
        setSpinning(false);
      }, 2200);
    } catch {
      setMessage(text.error);
      setSpinning(false);
    }
  };

  const claimText = encodeURIComponent(
    language === "ar"
      ? `مرحبًا، ربحت هدية عجلة الحظ من عيادة د. سليم. رمز الهدية: ${status?.claimCode}. أرغب بحجز استشارة مجانية أو تنظيف وتلميع مجاني.`
      : language === "ku"
        ? `سلاڤ، من دیاریا عەجلێ یا کلینیکا د. سەلیم بردیە. کودا دیاریێ: ${status?.claimCode}. من دڤێت شێوەرەکا بەلاشان یان پاککرن و پۆلیشکرنا بەلاشان حجز بکەم.`
        : `Hello, I won a lucky-wheel clinic gift from Doctor Saleem Andraws Dental Clinic. My gift code is ${status?.claimCode}. I would like to book a free consultation or free scaling and polishing.`,
  );

  return (
    <section id="lucky-wheel" className="border-y border-amber-200 bg-gradient-to-br from-amber-50 via-sky-50 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-9 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-16">
        <div className={dir === "rtl" ? "md:order-2" : ""}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">{text.badge}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{text.title}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{text.description}</p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-white/90 p-4 shadow-sm">
            <p className="flex items-center gap-2 font-semibold text-foreground"><Gift className="h-5 w-5 text-amber-600" />{status ? text.left : text.ready}</p>
          </div>
          {message && <p role="status" className={`mt-5 rounded-xl px-4 py-3 text-sm leading-relaxed ${status?.winner ? "bg-emerald-100 text-emerald-950" : "bg-sky-100 text-sky-950"}`}>{message}</p>}
          {status?.winner && status.claimCode && <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4"><p className="text-sm text-muted-foreground">{text.wonText}</p><p className="mt-2 font-mono text-xl font-bold tracking-wider text-emerald-700">{status.claimCode}</p><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${claimText}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90">{text.book}</a></div>}
          <p className="mt-5 max-w-xl text-xs leading-relaxed text-muted-foreground">{text.terms}</p>
        </div>
        <div className={`mx-auto flex w-full max-w-sm flex-col items-center ${dir === "rtl" ? "md:order-1" : ""}`}>
          <div className="relative h-72 w-72 sm:h-80 sm:w-80">
            <span aria-hidden="true" className="absolute left-1/2 top-[-9px] z-10 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[26px] border-x-transparent border-t-primary drop-shadow-sm" />
            <div className="absolute inset-0 overflow-hidden rounded-full border-8 border-white shadow-[0_14px_38px_-12px_rgba(14,116,144,0.45)]" style={{ transform: `rotate(${angle}deg)`, transition: spinning ? "transform 2.2s cubic-bezier(.16,.77,.18,1)" : "none", background: "conic-gradient(#0ea5e9 0deg 45deg,#fbbf24 45deg 90deg,#38bdf8 90deg 135deg,#fde68a 135deg 180deg,#0ea5e9 180deg 225deg,#fbbf24 225deg 270deg,#38bdf8 270deg 315deg,#fde68a 315deg 360deg)" }}>
              <span className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-bold text-sky-950">{text.gift}</span>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-sky-950">{text.tip}</span>
            </div>
            <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-primary text-center text-sm font-bold text-white shadow-lg"><Sparkles className="h-6 w-6" /><span className="sr-only">{text.gift}</span></div>
          </div>
          <button type="button" onClick={spin} disabled={!status?.canSpin || spinning} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-7 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">{spinning ? text.spinning : text.spin}</button>
        </div>
      </div>
    </section>
  );
}
