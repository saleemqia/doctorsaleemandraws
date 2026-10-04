import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type L = "en" | "ar" | "ku";
type Topic = "care" | "gums" | "decay" | "sensitivity" | "food";

const TEXT: Record<L, { badge: string; title1: string; title2: string; intro: string; all: string; share: string; close: string }> = {
  en: {
    badge: "Infographics",
    title1: "Dental Health",
    title2: "in Pictures",
    intro: "Clear, one-page explanations of the most common dental questions. Tap any image to see it full size and share it.",
    all: "All",
    share: "Share on WhatsApp",
    close: "Close",
  },
  ar: {
    badge: "إنفوجرافيك",
    title1: "صحة أسنانك",
    title2: "بالصور",
    intro: "شرح واضح في صفحة واحدة لأكثر أسئلة الأسنان شيوعاً. اضغط على أي صورة لتراها بالحجم الكامل وتشاركها.",
    all: "الكل",
    share: "مشاركة على واتساب",
    close: "إغلاق",
  },
  ku: {
    badge: "ئینفۆگرافیک",
    title1: "ساخلەمیا ددانا",
    title2: "ب وێنە",
    intro: "ڕوونکرنەکا ئاشکەرا د پەڕەکێ دا بۆ پرسیارێن ددانا یێن هەرە بەربەلاڤ. کلیک ل سەر وێنەیەکێ بکە دا ب قەبارێ تەمام ببینی و پشک بکەی.",
    all: "هەمی",
    share: "پشککرن ل واتساپێ",
    close: "گرتن",
  },
};

const TOPICS: { id: Topic; label: Record<L, string> }[] = [
  { id: "care", label: { en: "Daily care", ar: "العناية اليومية", ku: "چاڤدێریا ڕۆژانە" } },
  { id: "gums", label: { en: "Gums", ar: "اللثة", ku: "پوک" } },
  { id: "decay", label: { en: "Tooth decay", ar: "التسوس", ku: "کڕمبوون" } },
  { id: "sensitivity", label: { en: "Sensitivity", ar: "الحساسية", ku: "هەستیاری" } },
  { id: "food", label: { en: "Food & kids", ar: "الغذاء والأطفال", ku: "خوارن و زارۆک" } },
];

// Files are in public/infographics/<name>.webp (full size) and <name>-thumb.webp.
export const INFOGRAPHICS: { name: string; topic: Topic; title: Record<L, string> }[] = [
  { name: "two-minute-routine", topic: "care", title: { en: "A 2-minute routine for a healthier smile", ar: "روتين دقيقتين لابتسامة أكثر صحة", ku: "ڕووتینێ ٢ خولەکان بۆ بزەیەکا ساخلەمتر" } },
  { name: "daily-care-essentials", topic: "care", title: { en: "Daily dental care essentials", ar: "أساسيات العناية اليومية (بالإنجليزية)", ku: "بنەمایێن چاڤدێریا ڕۆژانە (ب ئینگلیزی)" } },
  { name: "regular-checkup", topic: "care", title: { en: "Regular check-ups stop problems early", ar: "الفحص الدوري يحميك من المشاكل قبل حدوثها", ku: "پشکنینا هەمیکاتی کێشەیان پێش دەگرێ" } },
  { name: "dental-myths", topic: "care", title: { en: "Dental myths debunked", ar: "خرافات الأسنان المفضوحة", ku: "ئەفسانەیێن ددانا" } },
  { name: "gum-disease-signs", topic: "gums", title: { en: "Gum disease: the early signs matter", ar: "أمراض اللثة: العلامات المبكرة مهمة", ku: "نەخۆشیێن پوکێ: نیشانێن زوو گرنگن" } },
  { name: "gum-recession", topic: "gums", title: { en: "Healthy vs receded gums", ar: "اللثة السليمة واللثة المتراجعة", ku: "پوکا ساخلەم و پوکا پاشکەفتی" } },
  { name: "decay-stages", topic: "decay", title: { en: "Decay starts small, then reaches the nerve", ar: "التسوس يبدأ صغيراً ثم يتعمق إلى العصب", ku: "کڕمبوون بچووک دەستپێدکەت و دگەهیتە دەمارێ" } },
  { name: "small-cavity-big-pain", topic: "decay", title: { en: "A small cavity today, big pain tomorrow", ar: "تسوس صغير اليوم قد يصبح ألماً كبيراً غداً", ku: "کڕمبوونا بچووک ئەڤرۆ، ئێشا مەزن سوبەهی" } },
  { name: "sensitivity-causes", topic: "sensitivity", title: { en: "Tooth sensitivity: common causes", ar: "حساسية الأسنان: أسبابها الشائعة", ku: "هەستیاریا ددانا: ئەگەرێن بەربەلاڤ" } },
  { name: "sensitivity-cold-drinks", topic: "sensitivity", title: { en: "Why cold drinks hurt", ar: "لماذا تؤلم المشروبات الباردة", ku: "بۆچی ڤەخوارنێن سار ئێشێ دکەن" } },
  { name: "cold-sting", topic: "sensitivity", title: { en: "A sting with cold drinks?", ar: "تعاني من لسعة عند شرب الأشياء الباردة؟", ku: "هەست ب ساردیێ دکەی؟" } },
  { name: "food-for-teeth", topic: "food", title: { en: "Food for healthy teeth", ar: "التغذية لأسنان صحية", ku: "خوارن بۆ ددانێن ساخلەم" } },
  { name: "kids-healthy-smiles", topic: "food", title: { en: "Kids' guide to healthy smiles", ar: "دليل الأطفال لابتسامات صحية", ku: "ڕێبەرێ زارۆکان بۆ بزەیێن ساخلەم" } },
];

const Infographics = () => {
  const { language, dir } = useLanguage();
  const lang = language as L;
  const c = TEXT[lang];
  const [topic, setTopic] = useState<Topic | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const shown = topic ? INFOGRAPHICS.filter((i) => i.topic === topic) : INFOGRAPHICS;

  const step = (d: number) => setOpen((i) => (i === null ? i : (i + d + shown.length) % shown.length));

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(dir === "rtl" ? -1 : 1);
      if (e.key === "ArrowLeft") step(dir === "rtl" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dir, shown.length]);

  const current = open === null ? null : shown[open];
  const shareUrl = current
    ? `https://wa.me/?text=${encodeURIComponent(`${current.title[lang]} — https://www.doctorsaleem.com/infographics/${current.name}.webp`)}`
    : "";

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
      active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:bg-primary/10"
    }`;

  return (
    <section id="infographics" className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Lightbulb className="w-4 h-4" />
            {c.badge}
          </span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {c.title1} <span className="text-gradient">{c.title2}</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">{c.intro}</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button type="button" className={chip(topic === null)} onClick={() => setTopic(null)}>
            {c.all} ({INFOGRAPHICS.length})
          </button>
          {TOPICS.map((t) => (
            <button key={t.id} type="button" className={chip(topic === t.id)} onClick={() => setTopic(t.id)}>
              {t.label[lang]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {shown.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setOpen(i)}
              className="group text-start rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-card transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                <img
                  src={`/infographics/${p.name}-thumb.webp`}
                  alt={p.title[lang]}
                  loading="lazy"
                  decoding="async"
                  width={440}
                  height={587}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="p-2.5 sm:p-3 text-sm font-semibold text-foreground leading-snug">{p.title[lang]}</p>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-label={current.title[lang]}
            className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-3 sm:p-6"
            onClick={() => setOpen(null)}
          >
            <button type="button" aria-label={c.close} onClick={() => setOpen(null)}
              className="absolute top-3 end-3 p-2 rounded-full bg-white/15 text-white hover:bg-white/25 z-10">
              <X className="w-6 h-6" />
            </button>
            <div className="relative flex items-center justify-center w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <button type="button" aria-label="Previous" onClick={() => step(-1)}
                className="absolute start-1 sm:-start-14 p-2 rounded-full bg-black/55 sm:bg-white/15 text-white hover:bg-white/25 z-10">
                <ChevronLeft className="w-7 h-7 rtl:rotate-180" />
              </button>
              <img
                key={current.name}
                src={`/infographics/${current.name}.webp`}
                alt={current.title[lang]}
                className="max-h-[80vh] w-auto max-w-full rounded-xl shadow-2xl"
              />
              <button type="button" aria-label="Next" onClick={() => step(1)}
                className="absolute end-1 sm:-end-14 p-2 rounded-full bg-black/55 sm:bg-white/15 text-white hover:bg-white/25 z-10">
                <ChevronRight className="w-7 h-7 rtl:rotate-180" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <span className="text-white font-semibold">{current.title[lang]}</span>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white text-sm font-semibold px-4 py-2">
                <Share2 className="w-4 h-4" />
                {c.share}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Infographics;
