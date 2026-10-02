import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileHeart, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import beforeUpper from "@/assets/case/before-upper.webp";
import beforeLower from "@/assets/case/before-lower.webp";
import plan3d from "@/assets/case/plan-3d.webp";
import planPano from "@/assets/case/plan-pano.webp";
import planSections from "@/assets/case/plan-sections.webp";
import implantsPlaced from "@/assets/case/implants-placed.webp";
import afterFront from "@/assets/case/after-front.webp";
import afterLower from "@/assets/case/after-lower.webp";

type L = "en" | "ar" | "ku";

const TEXT: Record<L, { badge: string; title1: string; title2: string; intro: string; before: string; after: string; consent: string; close: string }> = {
  en: {
    badge: "Real case",
    title1: "A Full Case,",
    title2: "Step by Step",
    intro: "Rebuilding a smile with digitally planned dental implants: from the first visit, through 3D planning, to the final result.",
    before: "Before",
    after: "After",
    consent: "Photos published with the patient's permission. Every case is different; the doctor plans each treatment after examination.",
    close: "Close",
  },
  ar: {
    badge: "حالة حقيقية",
    title1: "حالة كاملة",
    title2: "خطوة بخطوة",
    intro: "إعادة بناء الابتسامة بزراعة أسنان مخطط لها رقمياً: من الزيارة الأولى، مروراً بالتخطيط ثلاثي الأبعاد، حتى النتيجة النهائية.",
    before: "قبل",
    after: "بعد",
    consent: "الصور منشورة بموافقة المريض. كل حالة تختلف عن الأخرى، ويخطط الطبيب العلاج بعد الفحص.",
    close: "إغلاق",
  },
  ku: {
    badge: "حالەتەکا ڕاستەقینە",
    title1: "حالەتەکا تەمام",
    title2: "قۆناغ ب قۆناغ",
    intro: "ئاڤاکرنا بزەیێ ب چاندنا ددانا یا ب دیجیتالی پلانکری: ژ سەردانا ئێکێ، ب پلاندانانا ٣D، هەتا ئەنجامێ دوماهیێ.",
    before: "بەری",
    after: "پشتی",
    consent: "وێنە ب ڕەزامەندیا نەخۆشی هاتینە بەلاڤکرن. هەر حالەتەک جیاوازە، و دکتۆر پشتی پشکنینێ چارەسەریێ پلان دکەت.",
    close: "گرتن",
  },
};

interface Pic { src: string; alt: Record<L, string>; wide?: boolean; center?: boolean }
interface Step { title: Record<L, string>; text: Record<L, string>; pics: Pic[]; tag?: "before" | "after" }

const STEPS: Step[] = [
  {
    tag: "before",
    title: { en: "The starting point", ar: "نقطة البداية", ku: "خالا دەستپێکێ" },
    text: {
      en: "Most upper teeth were missing and the remaining teeth were broken and decayed. Chewing and smiling had become difficult.",
      ar: "معظم الأسنان العلوية مفقودة، والأسنان المتبقية مكسورة ومتسوسة. أصبح المضغ والابتسام صعباً.",
      ku: "پترانیا ددانێن ژۆری نەمابوون و ددانێن مای شکەستی و کڕمبووی بوون. جوتن و بزەکرن ئاستەنگ ببوون.",
    },
    pics: [
      { src: beforeUpper, alt: { en: "Before treatment: upper jaw", ar: "قبل العلاج: الفك العلوي", ku: "بەری چارەسەریێ: شویلکا ژۆری" } },
      { src: beforeLower, alt: { en: "Before treatment: lower teeth", ar: "قبل العلاج: الأسنان السفلية", ku: "بەری چارەسەریێ: ددانێن ژێری" } },
    ],
  },
  {
    title: { en: "3D X-ray and digital planning", ar: "أشعة ثلاثية الأبعاد وتخطيط رقمي", ku: "تیشکا ٣D و پلاندانانا دیجیتالی" },
    text: {
      en: "From a 3D X-ray (CBCT) and a digital scan, the doctor planned 8 implants in the upper jaw on the computer: the position, angle and length of each one, checked against the bone and the sinus. The plan is then used to make the surgical guide.",
      ar: "من الأشعة ثلاثية الأبعاد (CBCT) والمسح الرقمي، خطط الطبيب على الكمبيوتر لـ ٨ زرعات في الفك العلوي: موقع وزاوية وطول كل زرعة، مع مراعاة العظم والجيب الأنفي. ثم تُستخدم الخطة لصنع الدليل الجراحي.",
      ku: "ژ تیشکا ٣D (CBCT) و سکانا دیجیتالی، دکتۆری ل سەر کۆمپیوتەری ٨ چاندن بۆ شویلکا ژۆری پلان کرن: جهـ، گۆشە و درێژیا هەر ئێکێ، ب ڕەچاوکرنا هەستی و سینوسی. پاشی پلان بۆ چێکرنا ڕێبەرێ نەشتەرگەری دئێتە بکارئینان.",
    },
    pics: [
      { src: plan3d, center: true, alt: { en: "3D implant plan (front, top and side views)", ar: "خطة الزراعة ثلاثية الأبعاد", ku: "پلانا چاندنێ یا ٣D" } },
      { src: planPano, wide: true, alt: { en: "Implant positions on the panoramic view", ar: "مواقع الزرعات على الصورة البانورامية", ku: "جهێن چاندنێ ل سەر وێنێ پانۆرامی" } },
      { src: planSections, wide: true, alt: { en: "Cross-sections checking the bone around each implant", ar: "مقاطع لفحص العظم حول كل زرعة", ku: "بڕگە بۆ پشکنینا هەستیێ دۆرا هەر چاندنەکێ" } },
    ],
  },
  {
    title: { en: "Implants placed as planned", ar: "وضع الزرعات حسب الخطة", ku: "دانانا چاندنان ل دویڤ پلانێ" },
    text: {
      en: "The implants were placed in the positions planned on the computer, ready to carry the new teeth.",
      ar: "وُضعت الزرعات في المواقع المخطط لها على الكمبيوتر، جاهزة لتحمل الأسنان الجديدة.",
      ku: "چاندن ل وان جهان هاتنە دانان یێن ل سەر کۆمپیوتەری پلانکری، ئامادە بۆ هەلگرتنا ددانێن نوی.",
    },
    pics: [{ src: implantsPlaced, alt: { en: "Implants in the upper jaw (mirror view)", ar: "الزرعات في الفك العلوي (صورة بالمرآة)", ku: "چاندن د شویلکا ژۆری دا (وێنە ب ئاوێنێ)" } }],
  },
  {
    tag: "after",
    title: { en: "The result", ar: "النتيجة", ku: "ئەنجام" },
    text: {
      en: "New fixed teeth: a complete, natural-looking smile and comfortable chewing again.",
      ar: "أسنان ثابتة جديدة: ابتسامة كاملة بمظهر طبيعي، ومضغ مريح من جديد.",
      ku: "ددانێن جێگیر یێن نوی: بزەیەکا تەمام ب دیمەنەکێ سروشتی، و جوتنەکا ئاسوودە دیسان.",
    },
    pics: [
      { src: afterFront, alt: { en: "After treatment: front view", ar: "بعد العلاج: منظر أمامي", ku: "پشتی چارەسەریێ: دیمەنێ پێشیێ" } },
      { src: afterLower, alt: { en: "After treatment: lower teeth", ar: "بعد العلاج: الأسنان السفلية", ku: "پشتی چارەسەریێ: ددانێن ژێری" } },
    ],
  },
];

const CaseStudy = () => {
  const { language } = useLanguage();
  const lang = language as L;
  const c = TEXT[lang];
  const [open, setOpen] = useState<Pic | null>(null);

  return (
    <section id="case" className="py-16 md:py-24 lg:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <FileHeart className="w-4 h-4" />
            {c.badge}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {c.title1} <span className="text-gradient">{c.title2}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">{c.intro}</p>
        </motion.div>

        <ol className="relative max-w-5xl mx-auto space-y-10 md:space-y-14">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title.en}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="relative ps-12 md:ps-16"
            >
              {/* timeline */}
              <span className="absolute start-0 top-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-primary text-primary-foreground font-bold flex items-center justify-center shadow-teal">
                {i + 1}
              </span>
              {i < STEPS.length - 1 && <span className="absolute start-[17px] md:start-[21px] top-11 md:top-12 -bottom-10 md:-bottom-14 w-0.5 bg-primary/25" aria-hidden="true" />}

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-display text-xl md:text-2xl font-bold">{s.title[lang]}</h3>
                {s.tag && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.tag === "before" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-800"}`}>
                    {s.tag === "before" ? c.before : c.after}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">{s.text[lang]}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {s.pics.map((p) => (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => setOpen(p)}
                    className={`group relative overflow-hidden rounded-2xl bg-black shadow-card focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 ${
                      p.wide || s.pics.length === 1 ? "sm:col-span-2" : ""} ${p.center ? "sm:col-span-2 w-full max-w-xl mx-auto" : ""
                    }`}
                  >
                    <img
                      src={p.src}
                      alt={p.alt[lang]}
                      loading="lazy"
                      decoding="async"
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
                        p.wide ? "h-auto" : s.pics.length === 1 ? "aspect-[16/8]" : "aspect-[16/10]"
                      }`}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs sm:text-sm font-medium p-2.5 pt-6 text-start">
                      {p.alt[lang]}
                    </span>
                  </button>
                ))}
              </div>
            </motion.li>
          ))}
        </ol>

        <p className="text-center text-xs text-muted-foreground mt-10 max-w-2xl mx-auto">{c.consent}</p>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-label={open.alt[lang]}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setOpen(null)}
          >
            <button type="button" aria-label={c.close} onClick={() => setOpen(null)}
              className="absolute top-4 end-4 p-2 rounded-full bg-white/15 text-white hover:bg-white/25">
              <X className="w-6 h-6" />
            </button>
            <figure className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <img src={open.src} alt={open.alt[lang]} className="w-full max-h-[82vh] object-contain rounded-xl" />
              <figcaption className="text-center text-white mt-3 font-semibold">{open.alt[lang]}</figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CaseStudy;
