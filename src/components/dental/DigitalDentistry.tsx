import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScanLine, Cpu, Crosshair, Play, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type L = "en" | "ar" | "ku";

const TEXT: Record<L, { badge: string; title1: string; title2: string; intro: string; videosTitle: string; videoNote: string }> = {
  en: {
    badge: "Digital dentistry",
    title1: "Modern Technology",
    title2: "for Precise Results",
    intro: "We use the latest digital techniques in dentistry: a 3D intraoral scanner instead of traditional impressions, and digital planning with a surgical guide for dental implants.",
    videosTitle: "From our daily work: 3D scanning",
    videoNote: "Real videos from the clinic. Tap to play.",
  },
  ar: {
    badge: "طب الأسنان الرقمي",
    title1: "تقنيات حديثة",
    title2: "لنتائج دقيقة",
    intro: "نستخدم أحدث التقنيات الرقمية في طب الأسنان: الماسح الضوئي ثلاثي الأبعاد داخل الفم بدلاً من الطبعات التقليدية، والتخطيط الرقمي مع الدليل الجراحي لزراعة الأسنان.",
    videosTitle: "من عملنا اليومي: المسح ثلاثي الأبعاد",
    videoNote: "فيديوهات حقيقية من العيادة. اضغط للتشغيل.",
  },
  ku: {
    badge: "نوژداریا ددانا یا دیجیتالی",
    title1: "تەکنەلۆژیا نوی",
    title2: "بۆ ئەنجامێن دروست",
    intro: "ئەم نوترین تەکنیکێن دیجیتالی د نوژداریا ددانا دا بکار دئینین: سکانەرا ٣D یا ناڤ دەڤی ل جهێ قالبێن کەڤن، و پلاندانانا دیجیتالی دگەل ڕێبەرێ نەشتەرگەری بۆ چاندنا ددانا.",
    videosTitle: "ژ کارێ مە یێ ڕۆژانە: سکانکرنا ٣D",
    videoNote: "ڤیدیۆیێن ڕاستەقینە ژ کلینیکێ. کلیک بکە دا لێبدەی.",
  },
};

const FEATURES: { icon: typeof ScanLine; title: Record<L, string>; text: Record<L, string>; points: Record<L, string[]> }[] = [
  {
    icon: ScanLine,
    title: { en: "3D intraoral scanner", ar: "الماسح الضوئي ثلاثي الأبعاد", ku: "سکانەرا ٣D یا ناڤ دەڤی" },
    text: {
      en: "A small camera scans your teeth in minutes and builds an exact 3D model on the screen. No trays of impression paste in your mouth.",
      ar: "كاميرا صغيرة تمسح أسنانك خلال دقائق وتبني نموذجاً ثلاثي الأبعاد دقيقاً على الشاشة، بدون معجون الطبعة في فمك.",
      ku: "کامێرایەکا بچووک د چەند خولەکان دا ددانێن تە سکان دکەت و مۆدێلەکێ ٣D یێ دروست ل سەر شاشێ چێدکەت، بێ مەعجوونا قالبی د دەڤێ تە دا.",
    },
    points: {
      en: ["Comfortable: no gagging on impression paste", "Very accurate fit for crowns, bridges and veneers", "You see your own teeth in 3D on the screen"],
      ar: ["مريح: بدون غثيان من معجون الطبعة", "دقة عالية في تركيب التيجان والجسور والفينير", "ترى أسنانك بشكل ثلاثي الأبعاد على الشاشة"],
      ku: ["ئاسوودە: بێ دلتێکچوون ژ مەعجوونا قالبی", "دروستیەکا بلند بۆ کراس، جسر و ڤینیر", "ددانێن خۆ ب ٣D ل سەر شاشێ دبینی"],
    },
  },
  {
    icon: Cpu,
    title: { en: "Digital implant planning", ar: "التخطيط الرقمي للزراعة", ku: "پلاندانانا دیجیتالی یا چاندنێ" },
    text: {
      en: "Before surgery, the doctor plans the exact position, angle and depth of each implant on the computer, using your 3D X-ray and the digital scan.",
      ar: "قبل العملية، يخطط الطبيب على الكمبيوتر الموقع والزاوية والعمق الدقيق لكل زرعة، باستخدام الأشعة ثلاثية الأبعاد والمسح الرقمي.",
      ku: "بەری نەشتەرگەریێ، دکتۆر ل سەر کۆمپیوتەری جهـ، گۆشە و کویراتیا دروست یا هەر چاندنەکێ پلان دکەت، ب تیشکا ٣D و سکانا دیجیتالی.",
    },
    points: {
      en: ["The plan respects nerves, sinus and bone", "You see the plan before treatment starts"],
      ar: ["التخطيط يراعي الأعصاب والجيوب والعظم", "ترى الخطة قبل بدء العلاج"],
      ku: ["پلان دەمار، سینوس و هەستی ڕەچاو دکەت", "تو پلانێ بەری دەستپێکرنا چارەسەریێ دبینی"],
    },
  },
  {
    icon: Crosshair,
    title: { en: "Surgical guide", ar: "الدليل الجراحي", ku: "ڕێبەرێ نەشتەرگەری" },
    text: {
      en: "The digital plan is turned into a custom surgical guide that fits over your teeth and directs the implant to the planned position.",
      ar: "تتحول الخطة الرقمية إلى دليل جراحي مخصص يوضع على أسنانك ويوجّه الزرعة إلى الموقع المخطط بالضبط.",
      ku: "پلانا دیجیتالی دبیتە ڕێبەرەکێ نەشتەرگەری یێ تایبەت کو ل سەر ددانێن تە دئێتە دانان و چاندنێ بەرەو جهێ پلانکری دبەت.",
    },
    points: {
      en: ["More precise and predictable placement", "Often a smaller opening and quicker healing", "Shorter time in the chair"],
      ar: ["وضع أدق ونتائج متوقعة أكثر", "غالباً فتحة أصغر وشفاء أسرع", "وقت أقل على كرسي العلاج"],
      ku: ["دانانەکا دروستتر و ئەنجامەکێ پێشبینیکری", "گەلەک جاران برینەکا بچووکتر و ساخبوونەکا زووتر", "دەمەکێ کێمتر ل سەر کورسیێ"],
    },
  },
];

const VIDEOS = ["scan-3d-model", "scan-chairside", "scan-full-arch", "scan-and-check"];

// One video: shows a still image until tapped, then loads and plays (saves data on phones).
const ClinicVideo = ({ name, label }: { name: string; label: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-card">
      <video
        ref={ref}
        src={`/videos/${name}.mp4`}
        poster={`/videos/${name}.jpg`}
        preload="none"
        playsInline
        muted
        loop
        controls={playing}
        className="w-full h-full object-cover"
        aria-label={label}
      />
      {!playing && (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            ref.current?.play().catch(() => {});
          }}
          aria-label={label}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors"
        >
          <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-elevated">
            <Play className="w-6 h-6 text-primary fill-primary ms-1" />
          </span>
        </button>
      )}
    </div>
  );
};

const DigitalDentistry = () => {
  const { language } = useLanguage();
  const lang = language as L;
  const c = TEXT[lang];

  return (
    <section id="technology" className="py-16 md:py-24 lg:py-28 bg-background relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4" />
            {c.badge}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {c.title1} <span className="text-gradient">{c.title2}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">{c.intro}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title.en}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-soft"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{f.title[lang]}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{f.text[lang]}</p>
                <ul className="space-y-2">
                  {f.points[lang].map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-2">{c.videosTitle}</h3>
        <p className="text-center text-sm text-muted-foreground mb-6">{c.videoNote}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 max-w-5xl mx-auto">
          {VIDEOS.map((v) => (
            <ClinicVideo key={v} name={v} label={c.videosTitle} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalDentistry;
