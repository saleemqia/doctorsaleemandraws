import { useState } from "react";
import { Clapperboard, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import TreatmentPlayer, { type Step } from "./TreatmentPlayer";
import { RootCanalScene, ImplantScene, CrownScene, ExtractionScene, type SceneProps } from "./scenes";
import type { ComponentType } from "react";

type L = "en" | "ar" | "ku";

const TEXT: Record<L, { badge: string; title1: string; title2: string; intro: string; note: string; cta: string }> = {
  en: {
    badge: "How it works",
    title1: "How Is the",
    title2: "Treatment Done?",
    intro: "Short animations that show, step by step, what happens during common treatments. Knowing what to expect makes the visit easier.",
    note: "Simplified drawings for explanation. The doctor examines you and explains the plan that suits your own case.",
    cta: "Book a visit",
  },
  ar: {
    badge: "كيف يتم العلاج",
    title1: "كيف يتم",
    title2: "العلاج؟",
    intro: "رسوم متحركة قصيرة تشرح خطوة بخطوة ما يحدث في أشهر العلاجات. عندما تعرف ماذا ينتظرك تصبح الزيارة أسهل.",
    note: "رسوم مبسطة للتوضيح. يفحصك الطبيب ويشرح لك الخطة المناسبة لحالتك.",
    cta: "احجز زيارة",
  },
  ku: {
    badge: "چاوا چارەسەری دئێتە کرن",
    title1: "چارەسەری",
    title2: "چاوا دئێتە کرن؟",
    intro: "وێنەیێن لڤۆکێن کورت کو قۆناغ ب قۆناغ نیشان ددەن د چارەسەریێن بەربەلاڤ دا چ دقەومیت. دەمێ تو بزانی چ چاڤەڕێیا تە دکەت، سەردان ئاسانتر دبیت.",
    note: "وێنەیێن سادەکری بۆ ڕوونکرنێ. دکتۆر تە دپشکنیت و پلانا گونجای بۆ حالەتێ تە ڕوون دکەت.",
    cta: "نۆرەیەکێ بگرە",
  },
};

interface Treatment { id: string; name: Record<L, string>; Scene: ComponentType<SceneProps>; steps: Step[] }

const TREATMENTS: Treatment[] = [
  {
    id: "root-canal",
    name: { en: "Root canal treatment", ar: "علاج العصب (حشو العصب)", ku: "چارەسەریا دەمارێ (حەشوا دەمارێ)" },
    Scene: RootCanalScene,
    steps: [
      { title: { en: "The infected tooth", ar: "السن الملتهب", ku: "ددانێ هەوکری" },
        text: { en: "Deep decay reaches the nerve (pulp). It becomes inflamed and painful, and infection can form at the root tip.", ar: "يصل التسوس العميق إلى العصب (اللب) فيلتهب ويسبب الألم، وقد يتكوّن خراج عند طرف الجذر.", ku: "کڕمبوونا کویر دگەهیتە دەمارێ، هەو دکەت و ئێشێ چێدکەت، و دبیت کێم ل سەرێ ڕەهی چێببیت." } },
      { title: { en: "Numbing and opening", ar: "التخدير وفتح السن", ku: "سڕکرن و ڤەکرنا ددانی" },
        text: { en: "The area is numbed so you feel no pain. The doctor makes a small opening in the top of the tooth.", ar: "يُخدَّر المكان فلا تشعر بالألم، ثم يعمل الطبيب فتحة صغيرة في أعلى السن.", ku: "جه دئێتە سڕکرن دا تو ئێشێ هەست نەکەی، پاشی دکتۆر کونەکێ بچووک ل سەرێ ددانی ڤەدکەت." } },
      { title: { en: "Cleaning the canals", ar: "تنظيف القنوات", ku: "پاقژکرنا کەنالان" },
        text: { en: "Fine instruments remove the inflamed nerve and clean and shape the canals inside the roots.", ar: "تُزال الأعصاب الملتهبة بأدوات دقيقة، وتُنظَّف القنوات داخل الجذور وتُشكَّل.", ku: "ب ئامرازێن زراڤ دەمارا هەوکری دئێتە ڕاکرن و کەنالێن ناڤ ڕەهان پاقژ دبن." } },
      { title: { en: "Filling the canals", ar: "حشو القنوات", ku: "حەشوکرنا کەنالان" },
        text: { en: "The clean canals are filled and sealed from the root tip upward, and the opening is closed.", ar: "تُحشى القنوات النظيفة وتُغلق بإحكام من طرف الجذر إلى الأعلى، ثم تُغلق الفتحة.", ku: "کەنالێن پاقژ ژ سەرێ ڕەهی بەرەو ژۆر دئێنە حەشوکرن و گرتن، پاشی کون دئێتە گرتن." } },
      { title: { en: "Protecting the tooth", ar: "حماية السن", ku: "پاراستنا ددانی" },
        text: { en: "A crown is often placed to protect the treated tooth, so you can chew normally for many years.", ar: "غالباً يوضع تاج (كراون) لحماية السن المعالج، فتمضغ بشكل طبيعي لسنوات طويلة.", ku: "گەلەک جاران کراسەک بۆ پاراستنا ددانی دئێتە دانان، دا ب ساڵان ب ئاسایی بجوی." } },
    ],
  },
  {
    id: "implant",
    name: { en: "Dental implant", ar: "زراعة الأسنان", ku: "چاندنا ددانا" },
    Scene: ImplantScene,
    steps: [
      { title: { en: "A missing tooth", ar: "سن مفقود", ku: "ددانەکێ کەفتی" },
        text: { en: "A gap affects chewing and smiling, and the neighbouring teeth can slowly move into the space.", ar: "الفراغ يؤثر على المضغ والابتسامة، وقد تميل الأسنان المجاورة تدريجياً نحو الفراغ.", ku: "ڤالاهی کارتێکرنێ ل جوتن و بزەیێ دکەت، و ددانێن نێزیک هێدی هێدی بەرەو ڤالاهیێ دچن." } },
      { title: { en: "3D digital planning", ar: "التخطيط الرقمي ثلاثي الأبعاد", ku: "پلاندانانا دیجیتالی یا ٣D" },
        text: { en: "Using a 3D X-ray and a digital scan, the implant position is planned on the computer and a surgical guide is made.", ar: "بالأشعة ثلاثية الأبعاد والمسح الرقمي يُخطَّط موقع الزرعة على الكمبيوتر، ويُصنع دليل جراحي.", ku: "ب تیشکا ٣D و سکانا دیجیتالی جهێ چاندنێ ل سەر کۆمپیوتەری دئێتە پلانکرن و ڕێبەرەکێ نەشتەرگەری چێدبیت." } },
      { title: { en: "Placing the implant", ar: "وضع الزرعة", ku: "دانانا چاندنێ" },
        text: { en: "Under local anaesthetic, a small titanium implant is placed in the jaw bone in the planned position.", ar: "تحت التخدير الموضعي توضع زرعة صغيرة من التيتانيوم في عظم الفك في الموقع المخطط.", ku: "ب سڕکرنا جهی، چاندنەکا بچووک ژ تیتانیۆمێ د هەستیێ شویلکێ دا ل جهێ پلانکری دئێتە دانان." } },
      { title: { en: "Healing", ar: "الالتئام", ku: "ساخبوون" },
        text: { en: "Over about 3 months the bone grows tightly around the implant, making it strong like a natural root.", ar: "خلال ٣ أشهر تقريباً ينمو العظم حول الزرعة ويلتحم بها، فتصبح قوية مثل الجذر الطبيعي.", ku: "د ماوێ ٣ هەیڤان دا هەستی ل دۆر چاندنێ مەزن دبیت و پێڤە دنووسیت، و وەک ڕەهێ سروشتی بهێز دبیت." } },
      { title: { en: "The new tooth", ar: "السن الجديد", ku: "ددانێ نوی" },
        text: { en: "A connector (abutment) and a crown are fixed on the implant: a tooth that looks and works like a natural one.", ar: "تُثبَّت قطعة الوصل والتاج على الزرعة: سن يبدو ويعمل مثل السن الطبيعي.", ku: "پارچا گرێدانێ و کراس ل سەر چاندنێ دئێنە جێگیرکرن: ددانەک وەک یێ سروشتی دیار دبیت و کار دکەت." } },
    ],
  },
  {
    id: "crown",
    name: { en: "Crown with the 3D scanner", ar: "التاج (الكراس) بالماسح الضوئي", ku: "کراس ب سکانەرا ٣D" },
    Scene: CrownScene,
    steps: [
      { title: { en: "A broken or weak tooth", ar: "سن مكسور أو ضعيف", ku: "ددانێ شکەستی یان لاواز" },
        text: { en: "A tooth that is broken, heavily filled or treated with a root canal needs protection.", ar: "السن المكسور أو الذي فيه حشوة كبيرة أو عولج عصبه يحتاج إلى حماية.", ku: "ددانێ شکەستی، یان حەشوا مەزن تێدا، یان دەمارێ وی هاتیە چارەسەرکرن، پێدڤی پاراستنێ یە." } },
      { title: { en: "Shaping the tooth", ar: "تحضير السن", ku: "ئامادەکرنا ددانی" },
        text: { en: "Under local anaesthetic, the tooth is gently shaped so the crown can fit over it.", ar: "تحت التخدير الموضعي يُحضَّر السن بلطف ليتسع التاج فوقه.", ku: "ب سڕکرنا جهی، ددان ب نەرمی دئێتە ئامادەکرن دا کراس ل سەر جهـ بگریت." } },
      { title: { en: "3D digital scan", ar: "المسح الرقمي ثلاثي الأبعاد", ku: "سکانا دیجیتالی یا ٣D" },
        text: { en: "Instead of impression paste, a small camera scans the tooth and builds an exact 3D model.", ar: "بدلاً من معجون الطبعة، تمسح كاميرا صغيرة السن وتبني نموذجاً ثلاثي الأبعاد دقيقاً.", ku: "ل جهێ مەعجوونا قالبی، کامێرایەکا بچووک ددانی سکان دکەت و مۆدێلەکێ ٣D یێ دروست چێدکەت." } },
      { title: { en: "The new crown", ar: "التاج الجديد", ku: "کراسێ نوی" },
        text: { en: "The crown (zircon, E-max or ceramic) is made from the scan and fixed on the tooth, matching your other teeth.", ar: "يُصنع التاج (زركون أو إيماكس أو سيراميك) من المسح ويُثبَّت على السن بلون يطابق أسنانك.", ku: "کراس (زیرکۆن، ئیماکس یان سیرامیک) ژ سکانێ چێدبیت و ل سەر ددانی دئێتە جێگیرکرن ب ڕەنگێ ددانێن تە." } },
    ],
  },
  {
    id: "extraction",
    name: { en: "Tooth extraction", ar: "قلع السن", ku: "هەلکێشانا ددانی" },
    Scene: ExtractionScene,
    steps: [
      { title: { en: "A tooth that cannot be saved", ar: "سن لا يمكن إنقاذه", ku: "ددانەکێ نەهێتە ڕزگارکرن" },
        text: { en: "When decay or a crack is too large to repair, removing the tooth stops the pain and infection.", ar: "عندما يكون التسوس أو الكسر كبيراً لا يمكن إصلاحه، يوقف القلع الألم والالتهاب.", ku: "دەمێ کڕمبوون یان شکەستن زۆر مەزن بیت و نەهێتە چاککرن، هەلکێشان ئێش و هەوکرنێ ڕادوەستینیت." } },
      { title: { en: "Numbing", ar: "التخدير", ku: "سڕکرن" },
        text: { en: "Local anaesthetic numbs the area completely. You may feel pressure, but not pain.", ar: "التخدير الموضعي يخدّر المكان تماماً. قد تشعر بضغط، لكن بدون ألم.", ku: "سڕکرنا جهی جهی ب تەمامی سڕ دکەت. دبیت پاڵەپەستۆیێ هەست بکەی، بەلێ بێ ئێش." } },
      { title: { en: "Gentle removal", ar: "القلع بلطف", ku: "هەلکێشان ب نەرمی" },
        text: { en: "The doctor loosens the tooth gently and removes it, protecting the bone around it.", ar: "يحرّك الطبيب السن بلطف ثم يقلعه، مع الحفاظ على العظم حوله.", ku: "دکتۆر ددانی ب نەرمی دلەقینیت و هەلدکێشیت، دگەل پاراستنا هەستیێ دۆر." } },
      { title: { en: "Healing and what's next", ar: "الالتئام وما بعده", ku: "ساخبوون و پاشی" },
        text: { en: "Bite on gauze, avoid rinsing for the first day, and the gum heals. Later the gap can be replaced with an implant or a bridge.", ar: "اعضض على الشاش، ولا تمضمض في اليوم الأول، فتلتئم اللثة. لاحقاً يمكن تعويض الفراغ بزراعة أو جسر.", ku: "ل سەر گازێ بگەزە، ڕۆژا ئێکێ دەڤێ خۆ نەشۆ، و پوک ساخ دبیت. پاشی دشێی ڤالاهیێ ب چاندنێ یان جسرێ پڕ بکەی." } },
    ],
  },
];

const Treatments = ({ onBookingClick }: { onBookingClick: () => void }) => {
  const { language } = useLanguage();
  const lang = language as L;
  const c = TEXT[lang];
  const [active, setActive] = useState(TREATMENTS[0].id);
  const t = TREATMENTS.find((x) => x.id === active) ?? TREATMENTS[0];

  return (
    <section id="treatments" className="py-12 md:py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Clapperboard className="w-4 h-4" />
            {c.badge}
          </span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {c.title1} <span className="text-gradient">{c.title2}</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">{c.intro}</p>
        </div>

        {/* treatment tabs */}
        <div role="tablist" className="flex flex-wrap justify-center gap-2 mb-8">
          {TREATMENTS.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={x.id === active}
              onClick={() => setActive(x.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                x.id === active ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft" : "border-border text-foreground hover:bg-secondary"
              }`}
            >
              {x.name[lang]}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto bg-card rounded-3xl border border-border shadow-soft p-4 sm:p-6 md:p-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-5 text-center md:text-start">{t.name[lang]}</h2>
          <TreatmentPlayer key={t.id} Scene={t.Scene} steps={t.steps} lang={lang} label={t.name[lang]} />
        </div>

        <p className="flex items-start justify-center gap-2 text-xs text-muted-foreground mt-6 max-w-2xl mx-auto text-center">
          <Info className="w-4 h-4 shrink-0" />
          {c.note}
        </p>
        <div className="text-center mt-6">
          <Button variant="teal" size="lg" onClick={onBookingClick} className="gap-2">
            <Calendar className="w-5 h-5" />
            {c.cta}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Treatments;
