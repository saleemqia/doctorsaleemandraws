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
    badge: "A moment for your smile",
    title: "Spin your luck",
    description: "Take a quick spin and see where it lands.",
    spin: "Spin the wheel",
    spinning: "Spinning…",
    left: "Your next spin could land somewhere new",
    today: "Thank you for visiting. It was not your turn this time. Please try your luck again tomorrow.",
    won: "Your spin selected a clinic surprise!",
    wonText: "Choose a free consultation or free scaling and polishing. Show this code when booking:",
    book: "Claim on WhatsApp",
    terms: "No payment is required. One spin per device per day. Book within 14 days. Treatment is provided only when clinically appropriate.",
    tip: "Keep smiling",
    gift: "Spin your luck",
    wheelLabels: ["Call 0750 781 6500", "Call 0778 166 5000", "Visit us", "Good luck", "Healthy teeth", "Spin your luck", "Visit doctorsaleem.com", "Keep smiling"],
    ready: "Ready to spin",
    error: "The wheel is unavailable right now. Please try again shortly.",
  },
  ar: {
    badge: "لحظة جميلة لابتسامتك",
    title: "جرّب حظك",
    description: "أدر العجلة سريعًا وشاهد أين ستتوقف.",
    spin: "أدر العجلة",
    spinning: "تدور العجلة…",
    left: "قد تتوقف محاولتك القادمة على شيء مختلف",
    today: "شكرًا لزيارتك. لم يحالفك الحظ هذه المرة. جرّب حظك مرة أخرى غدًا.",
    won: "اختارت العجلة مفاجأة من العيادة!",
    wonText: "اختر استشارة مجانية أو تنظيف وتلميع مجاني. أظهر هذا الرمز عند الحجز:",
    book: "احجز عبر واتساب",
    terms: "لا يلزم أي دفع. محاولة واحدة لكل جهاز يوميًا. احجز خلال 14 يومًا، ويُقدَّم العلاج فقط إذا كان مناسبًا بعد الفحص.",
    tip: "ابتسامة جميلة",
    gift: "جرّب حظك",
    wheelLabels: ["اتصل 0750 781 6500", "اتصل 0778 166 5000", "تفضل بزيارتنا", "حظ سعيد", "أسنان صحية", "جرّب حظك", "زر doctorsaleem.com", "ابتسم دائمًا"],
    ready: "جاهز للدوران",
    error: "العجلة غير متاحة الآن. حاول مرة أخرى بعد قليل.",
  },
  ku: {
    badge: "دەقا خۆش بۆ بزەیا تە",
    title: "بەختێ خۆ تاقی بکە",
    description: "عەجلێ بزویرینە و ببینە کو ل کوێ د وەستیت.",
    spin: "عەجلێ بچرخینە",
    spinning: "عەجل دچرخیت…",
    left: "چرخانا بهێت ڕەنگە ل شوینەکێ جیاواز بوەستیت",
    today: "سوپاس بۆ سەردانا تە. ڤێ جارێ بەخت دگەل تە نەبوو. سبە جارەکا دی بەختێ خۆ تاقی بکە.",
    won: "عەجل تشتەکێ تایبەت هەلبژارت!",
    wonText: "شێوەرەکا بەلاشان یان پاککرن و پۆلیشکرنا بەلاشان هەلبژێرە. ڤێ کودێ دەمێ حجزکرنێ نیشان بدە:",
    book: "ل ڕێیا واتساپێ دا حجز بکە",
    terms: "هیچ پارە پێدڤی نینە. یەک چرخان بۆ هەر ئامێرێ د رۆژێ دا. دناڤ 14 رۆژان دا حجز بکە، و چارەسەری تەنێ پشتی پشکنینێ دەمێ گونجایێ دهێتە کرن.",
    tip: "بزەیەکا جوان",
    gift: "بەختێ خۆ تاقی بکە",
    wheelLabels: ["پەیوەندی 0750 781 6500", "پەیوەندی 0778 166 5000", "سەردانا مە بکە", "بەختێ باش", "ددانێن ساخلەم", "بەختێ خۆ تاقی بکە", "سەردانا doctorsaleem.com بکە", "بزە بکە"],
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
  const testMode = new URLSearchParams(window.location.search).get("wheelTest") === "1";

  const load = async () => {
    try {
      const response = await fetch("/api/luck", { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Error("Unavailable");
      setStatus(await response.json() as WheelStatus);
    } catch {
      setMessage(text.error);
    }
  };

  useEffect(() => {
    if (testMode) setStatus({ ok: true, canSpin: true, spinsUntilGift: 0 });
    else void load();
  }, [language, testMode]);

  const spin = async () => {
    if (spinning || !status?.canSpin) return;
    setSpinning(true);
    setMessage("");
    try {
      let result: WheelStatus;
      if (testMode) {
        result = { ok: true, canSpin: true, spinsUntilGift: 0, winner: Math.random() < 0.2 };
      } else {
        const response = await fetch("/api/luck", { method: "POST", credentials: "same-origin" });
        if (!response.ok) throw new Error("Unavailable");
        result = await response.json() as WheelStatus;
      }
      setAngle((current) => current + 1440 + (result.winner ? 22 : 202));
      window.setTimeout(() => {
        setStatus(testMode ? { ...result, canSpin: true } : result);
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
      ? `مرحبًا، اختارت عجلة الحظ مفاجأة من عيادة د. سليم. رمزي: ${status?.claimCode}. أرغب بحجز استشارة مجانية أو تنظيف وتلميع مجاني.`
      : language === "ku"
        ? `سلاڤ، عەجلێ کلینیکا د. سليم تشتەکێ تایبەت بۆ من هەلبژارتیە. کودا من: ${status?.claimCode}. من دڤێت شێوەرەکا بەلاشان یان پاککرن و پۆلیشکرنا بەلاشان حجز بکەم.`
        : `Hello, my lucky wheel spin selected a clinic surprise at Doctor Saleem Andraws Dental Clinic. My code is ${status?.claimCode}. I would like to book a free consultation or free scaling and polishing.`,
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
              {text.wheelLabels.map((label, index) => (
                <span key={label} className="absolute left-1/2 top-1/2 w-[42%] -translate-y-1/2 origin-left text-center text-[10px] font-bold leading-tight text-sky-950 sm:text-xs" style={{ transform: `rotate(${index * 45 + 22.5}deg) translateX(22%)` }}>{label}</span>
              ))}
            </div>
            <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-primary text-center text-sm font-bold text-white shadow-lg"><Sparkles className="h-6 w-6" /><span className="sr-only">{text.gift}</span></div>
          </div>
          <button type="button" onClick={spin} disabled={!status?.canSpin || spinning} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-7 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">{spinning ? text.spinning : text.spin}</button>
        </div>
      </div>
    </section>
  );
}
