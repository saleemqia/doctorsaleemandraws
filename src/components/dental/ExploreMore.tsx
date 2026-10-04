import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor, type SitePage } from "@/config/seo";
import afterFront from "@/assets/case/after-front.webp";

type L = "en" | "ar" | "ku";

const TEXT: Record<L, { badge: string; title1: string; title2: string; open: string }> = {
  en: { badge: "More from our clinic", title1: "Explore", title2: "More", open: "Open" },
  ar: { badge: "المزيد من عيادتنا", title1: "اكتشف", title2: "المزيد", open: "افتح" },
  ku: { badge: "زێدەتر ژ کلینیکا مە", title1: "زێدەتر", title2: "ببینە", open: "ڤەکە" },
};

const CARDS: { page: SitePage; img: string; title: Record<L, string>; text: Record<L, string> }[] = [
  {
    page: "/treatments",
    img: "/treatments-card.svg",
    title: { en: "How is the treatment done? (animations)", ar: "كيف يتم العلاج؟ (رسوم متحركة)", ku: "چارەسەری چاوا دئێتە کرن؟ (ئەنیمەیشن)" },
    text: {
      en: "Root canal, implant, crown and extraction explained step by step with simple animations.",
      ar: "علاج العصب، الزراعة، التاج والقلع، مشروحة خطوة بخطوة برسوم متحركة بسيطة.",
      ku: "چارەسەریا دەمارێ، چاندن، کراس و هەلکێشان، قۆناغ ب قۆناغ ب ئەنیمەیشنێن سادە.",
    },
  },
  {
    page: "/case",
    img: afterFront,
    title: { en: "A real implant case, step by step", ar: "حالة زراعة حقيقية خطوة بخطوة", ku: "حالەتەکا چاندنێ قۆناغ ب قۆناغ" },
    text: {
      en: "Before, 3D planning with a surgical guide, and the result. Plus videos of our 3D scanner at work.",
      ar: "قبل، والتخطيط ثلاثي الأبعاد مع الدليل الجراحي، والنتيجة. مع فيديوهات الماسح الضوئي أثناء العمل.",
      ku: "بەری، پلاندانانا ٣D دگەل ڕێبەرێ نەشتەرگەری، و ئەنجام. دگەل ڤیدیۆیێن سکانەرا ٣D.",
    },
  },
  {
    page: "/kids",
    img: "/posters/loose-tooth-thumb.webp",
    title: { en: "Children's teeth: a guide for parents", ar: "أسنان الأطفال: دليل للأهل", ku: "ددانێن زارۆکان: ڕێبەر بۆ دەیک و بابان" },
    text: {
      en: "When teeth come in and fall out, care at every age, tips, emergencies and colourful posters for kids.",
      ar: "متى تظهر الأسنان ومتى تسقط، والعناية في كل عمر، ونصائح، وحالات طارئة، وملصقات ملونة للأطفال.",
      ku: "ددان کەنگی دەردکەڤن و دکەڤن، چاڤدێری د هەر تەمەنەکی دا، شیرەت، حالەتێن لەز و پۆستەرێن ڕەنگین.",
    },
  },
  {
    page: "/infographics",
    img: "/infographics/decay-stages-thumb.webp",
    title: { en: "Dental health in pictures (infographics)", ar: "صحة أسنانك بالصور (إنفوجرافيك)", ku: "ساخلەمیا ددانا ب وێنە (ئینفۆگرافیک)" },
    text: {
      en: "One-page guides on brushing, gums, decay, sensitivity and food for healthy teeth. Easy to share.",
      ar: "أدلة في صفحة واحدة عن التفريش واللثة والتسوس والحساسية والغذاء الصحي للأسنان. سهلة المشاركة.",
      ku: "ڕێبەرێن د پەڕەکێ دا ل سەر فلچەکرن، پوک، کڕمبوون، هەستیاری و خوارنا ساخلەم. ب ساناهی پشک بکە.",
    },
  },
];

// Small cards on the home page that lead to the sub-pages, so the home page stays short.
const ExploreMore = () => {
  const { language } = useLanguage();
  const lang = language as L;
  const c = TEXT[lang];
  return (
    <section id="more" className="py-14 md:py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Compass className="w-4 h-4" />
            {c.badge}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            {c.title1} <span className="text-gradient">{c.title2}</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {CARDS.map((card, i) => (
            <motion.a
              key={card.page}
              href={pathFor(language, card.page)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex gap-4 items-stretch bg-card rounded-2xl border border-border shadow-soft hover:shadow-card overflow-hidden transition-shadow"
            >
              <img src={card.img} alt="" loading="lazy" className="w-28 sm:w-36 object-cover shrink-0" />
              <div className="py-4 pe-4 flex flex-col">
                <h3 className="font-display text-lg md:text-xl font-bold mb-1.5 group-hover:text-primary transition-colors">{card.title[lang]}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{card.text[lang]}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-primary font-semibold text-sm">
                  {c.open}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreMore;
