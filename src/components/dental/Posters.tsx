import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

type L = "en" | "ar" | "ku";

const TEXT: Record<L, { badge: string; title1: string; title2: string; intro: string; showAll: string; showLess: string; share: string; close: string }> = {
  en: {
    badge: "Educational",
    title1: "Learn With Us:",
    title2: "Posters for Kids",
    intro: "Simple, colourful tips for children and parents. Tap a poster to see it full size and share it.",
    showAll: "Show all posters",
    showLess: "Show fewer",
    share: "Share on WhatsApp",
    close: "Close",
  },
  ar: {
    badge: "تعليمي",
    title1: "تعلّم معنا:",
    title2: "ملصقات توعوية للأطفال",
    intro: "نصائح بسيطة وملوّنة للأطفال والأهل. اضغط على أي ملصق لتراه بالحجم الكامل وتشاركه.",
    showAll: "عرض كل الملصقات",
    showLess: "عرض أقل",
    share: "مشاركة على واتساب",
    close: "إغلاق",
  },
  ku: {
    badge: "فێرکاری",
    title1: "دگەل مە فێربە:",
    title2: "پۆستەر بۆ زارۆکان",
    intro: "شیرەتێن سادە و ڕەنگین بۆ زارۆک و دەیک و بابان. کلیک ل سەر پۆستەرەکێ بکە دا ب قەبارێ تەمام ببینی و پشک بکەی.",
    showAll: "هەمی پۆستەران نیشان بدە",
    showLess: "کێمتر نیشان بدە",
    share: "پشککرن ل واتساپێ",
    close: "گرتن",
  },
};

// Files are in public/posters/<name>.webp (full size) and <name>-thumb.webp.
const POSTERS: { name: string; title: Record<L, string> }[] = [
  { name: "loose-tooth", title: { en: "Goodbye, wobbly tooth!", ar: "سنّي المتحرك وداعاً", ku: "ددانێ لڤۆک، ب خاترا تە" } },
  { name: "cavity-monster", title: { en: "Beat the cavity monster", ar: "اهزم وحش التسوس", ku: "دڕندێ کڕمبوونێ بشکێنە" } },
  { name: "fluoride-toothpaste", title: { en: "Fluoride toothpaste: the right way", ar: "المعجون السحري المقوي", ku: "مەعجوونا فلۆرایدێ یا بهێزکەر" } },
  { name: "bedtime-bottle", title: { en: "Careful with the bedtime bottle", ar: "زجاجتي في وقت النوم بحذر", ku: "شیشا شەڤێ ب هشیاری" } },
  { name: "dental-emergency", title: { en: "Don't worry, we're here to help", ar: "لا تقلق، نحن هنا للمساعدة", ku: "نەترسە، ئەم ل ڤێرێ بۆ هاریکاریێ" } },
  { name: "thumb-sucking", title: { en: "Goodbye, thumb-sucking", ar: "وداعاً لعادة مص الإصبع", ku: "ب خاترا تە مژینا تبلێ" } },
  { name: "new-teeth", title: { en: "New teeth are arriving", ar: "ضيوف جدد في فمي", ku: "میڤانێن نوی د دەڤێ من دا" } },
  { name: "month-of-smiles", title: { en: "A month of happy smiles", ar: "شهر كامل من الابتسامات السعيدة", ku: "هەیڤەکا تەمام ژ بزەیێن دلخۆش" } },
  { name: "healthy-snacks", title: { en: "Healthy snacks, strong teeth", ar: "وجبة خفيفة، أسنان قوية", ku: "خوارنا سڤک، ددانێن بهێز" } },
  { name: "snacks-myth-fact", title: { en: "Myth or fact: snacks", ar: "خرافة أم حقيقة: الوجبات الخفيفة", ku: "ئەفسانە یان ڕاستی: خوارنا سڤک" } },
  { name: "water-friend", title: { en: "Water is my teeth's friend", ar: "الماء صديق أسناني", ku: "ئاڤ هەڤالێ ددانێن منە" } },
  { name: "water-steps", title: { en: "Water washes sugar away", ar: "الماء يغسل السكر عن أسناني", ku: "ئاڤ شەکرێ ژ ددانا دشۆت" } },
  { name: "healthy-gums", title: { en: "Pink gums, happy teeth", ar: "لثة وردية تعني أسنان سعيدة", ku: "پوکێن پەمبەیی، ددانێن دلخۆش" } },
  { name: "new-toothbrush", title: { en: "A new brush every 3 months", ar: "فرشاة جديدة كل ٣ أشهر", ku: "فلچەیەکا نوی هەر ٣ هەیڤان" } },
  { name: "sports-mouthguard", title: { en: "Protect your smile in sports", ar: "حافظ على ابتسامتك في الرياضة", ku: "د وەرزشێ دا بزەیا خۆ بپارێزە" } },
  { name: "dental-xray", title: { en: "A magic photo of my teeth (X-ray)", ar: "صورة سحرية لأسناني (الأشعة)", ku: "وێنەیەکێ سیحری بۆ ددانێن من (تیشک)" } },
  { name: "teeth-polishing", title: { en: "Shiny, polished teeth", ar: "تلميع أسناني البرّاقة", ku: "بریقەدانا ددانێن من" } },
  { name: "braces", title: { en: "Straight teeth with braces", ar: "أسناني ستصطف مثل الجنود (التقويم)", ku: "ددانێن من ڕێز دبن (تقویم)" } },
];

const PREVIEW = 8;

const Posters = () => {
  const { language, dir } = useLanguage();
  const lang = language as L;
  const c = TEXT[lang];
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const shown = showAll ? POSTERS : POSTERS.slice(0, PREVIEW);

  const step = (d: number) => setOpen((i) => (i === null ? i : (i + d + POSTERS.length) % POSTERS.length));

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(dir === "rtl" ? -1 : 1);
      if (e.key === "ArrowLeft") step(dir === "rtl" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dir]);

  const current = open === null ? null : POSTERS[open];
  const shareUrl = current
    ? `https://wa.me/?text=${encodeURIComponent(`${current.title[lang]} — https://www.doctorsaleem.com/posters/${current.name}.webp`)}`
    : "";

  return (
    <section id="posters" className="py-16 md:py-24 lg:py-28 bg-background relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <BookOpen className="w-4 h-4" />
            {c.badge}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {c.title1} <span className="text-gradient">{c.title2}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">{c.intro}</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {shown.map((p, i) => (
            <motion.button
              key={p.name}
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 4) * 0.05 }}
              className="group text-start rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-card transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
            >
              <div className="aspect-[768/1376] overflow-hidden bg-secondary">
                <img
                  src={`/posters/${p.name}-thumb.webp`}
                  alt={p.title[lang]}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={717}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="p-2.5 sm:p-3 text-sm font-semibold text-foreground leading-snug">{p.title[lang]}</p>
            </motion.button>
          ))}
        </div>

        {POSTERS.length > PREVIEW && (
          <div className="text-center mt-8">
            <Button variant="tealOutline" size="lg" onClick={() => setShowAll((v) => !v)}>
              {showAll ? c.showLess : `${c.showAll} (${POSTERS.length})`}
            </Button>
          </div>
        )}
      </div>

      {/* Full-size viewer with next / previous */}
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
                src={`/posters/${current.name}.webp`}
                alt={current.title[lang]}
                className="max-h-[78vh] w-auto max-w-full rounded-xl shadow-2xl"
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

export default Posters;
