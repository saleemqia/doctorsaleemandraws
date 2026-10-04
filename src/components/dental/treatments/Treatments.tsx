import { useState } from "react";
import { Clapperboard, Calendar, Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import TreatmentPlayer, { type Step } from "./TreatmentPlayer";
import { RootCanalScene, ImplantScene, CrownScene, ExtractionScene, DecayScene, MissingToothScene, type SceneProps } from "./scenes";
import VideoLibrary from "./VideoLibrary";
import type { ComponentType } from "react";

type L = "en" | "ar" | "ku";

const TEXT: Record<L, { badge: string; title1: string; title2: string; intro: string; note: string; cta: string; video: string; videoBy: string }> = {
  en: {
    badge: "How it works",
    title1: "How Is the",
    title2: "Treatment Done?",
    intro: "Short animations that show, step by step, what happens during common treatments. Knowing what to expect makes the visit easier.",
    note: "Simplified drawings for explanation. The doctor examines you and explains the plan that suits your own case.",
    cta: "Book a visit",
    video: "Watch the 3D animation",
    videoBy: "Video by",
  },
  ar: {
    badge: "كيف يتم العلاج",
    title1: "كيف يتم",
    title2: "العلاج؟",
    intro: "رسوم متحركة قصيرة تشرح خطوة بخطوة ما يحدث في أشهر العلاجات. عندما تعرف ماذا ينتظرك تصبح الزيارة أسهل.",
    note: "رسوم مبسطة للتوضيح. يفحصك الطبيب ويشرح لك الخطة المناسبة لحالتك.",
    cta: "احجز زيارة",
    video: "شاهد الفيديو ثلاثي الأبعاد",
    videoBy: "الفيديو من",
  },
  ku: {
    badge: "چاوا چارەسەری دئێتە کرن",
    title1: "چارەسەری",
    title2: "چاوا دئێتە کرن؟",
    intro: "وێنەیێن لڤۆکێن کورت کو قۆناغ ب قۆناغ نیشان ددەن د چارەسەریێن بەربەلاڤ دا چ دقەومیت. دەمێ تو بزانی چ چاڤەڕێیا تە دکەت، سەردان ئاسانتر دبیت.",
    note: "وێنەیێن سادەکری بۆ ڕوونکرنێ. دکتۆر تە دپشکنیت و پلانا گونجای بۆ حالەتێ تە ڕوون دکەت.",
    cta: "نۆرەیەکێ بگرە",
    video: "ڤیدیۆیا 3D ببینە",
    videoBy: "ڤیدیۆ ژ",
  },
};

// video: an optional 3D animation shown from YouTube (embedded with YouTube's own player, not copied).
interface Treatment { id: string; name: Record<L, string>; Scene: ComponentType<SceneProps>; steps: Step[]; video?: { id: string; credit: string } }

const TREATMENTS: Treatment[] = [
  {
    id: "decay",
    name: { en: "How decay progresses", ar: "كيف يتطور التسوس", ku: "کڕمبوون چاوا پێش دکەڤیت" },
    Scene: DecayScene,
    steps: [
      { title: { en: "A white spot", ar: "بقعة بيضاء", ku: "پەڵەیەکا سپی" },
        text: { en: "Acid from sugar and bacteria softens the enamel. At this stage fluoride and good brushing can still stop it.", ar: "الأحماض من السكر والبكتيريا تُضعف المينا. في هذه المرحلة يمكن إيقافه بالفلورايد والتفريش الجيد.", ku: "ترشێن شەکر و بەکتریایان مینا لاواز دکەن. د ڤێ قۆناغێ دا هێشتا ب فلۆراید و فلچەکرنا باش دئێتە ڕاوەستاندن." } },
      { title: { en: "A cavity in the enamel", ar: "تسوس في المينا", ku: "کڕمبوون د مینایێ دا" },
        text: { en: "A small brown hole forms. It usually doesn't hurt yet, so a check-up finds it early. A small filling fixes it.", ar: "تتكوّن فجوة بنية صغيرة، غالباً بدون ألم، لذلك يكشفها الفحص الدوري مبكراً. حشوة صغيرة تعالجها.", ku: "کونەکێ قاوەیی یێ بچووک چێدبیت، ب گشتی بێ ئێش، لەوما پشکنین زوو دبینیت. حەشوەکا بچووک چارەسەر دکەت." } },
      { title: { en: "Into the dentin", ar: "وصول التسوس إلى العاج", ku: "گەهشتن بۆ عاجێ" },
        text: { en: "Decay spreads faster in the softer dentin. Cold and sweet foods start to cause sensitivity.", ar: "ينتشر التسوس أسرع في العاج الأطرى، وتبدأ الحساسية من البارد والحلو.", ku: "کڕمبوون د عاجێ نەرمتر دا زووتر بەلاڤ دبیت، و هەستیاری ژ سار و شرینیێ دەست پێدکەت." } },
      { title: { en: "It reaches the nerve", ar: "الوصول إلى العصب", ku: "گەهشتن بۆ دەمارێ" },
        text: { en: "The nerve becomes inflamed: strong pain, especially at night. Now the tooth needs root canal treatment.", ar: "يلتهب العصب: ألم شديد خاصة في الليل. الآن يحتاج السن إلى علاج العصب.", ku: "دەمار هەو دکەت: ئێشەکا توند ب تایبەتی ب شەڤ. نوکە ددان پێدڤی چارەسەریا دەمارێ یە." } },
      { title: { en: "Abscess at the root", ar: "خراج عند الجذر", ku: "کێم ل سەرێ ڕەهی" },
        text: { en: "Untreated infection spreads to the bone at the root tip and can cause swelling. Come in quickly.", ar: "الالتهاب غير المعالج ينتشر إلى العظم عند طرف الجذر وقد يسبب تورماً. راجعنا بسرعة.", ku: "هەوکرنا چارەسەرنەکری دگەهیتە هەستیێ سەرێ ڕەهی و دبیت نەپسینێ چێبکەت. زوو وەرە." } },
    ],
  },
  {
    id: "root-canal",
    name: { en: "Root canal treatment", ar: "علاج العصب (حشو العصب)", ku: "چارەسەریا دەمارێ (حەشوا دەمارێ)" },
    Scene: RootCanalScene,
    video: { id: "VR8IQ9QFdWw", credit: "VOKA 3D Anatomy & Pathology" },
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
  {
    id: "missing",
    name: { en: "If a lost tooth is not replaced", ar: "إذا لم يُعوَّض السن المفقود", ku: "ئەگەر ددانێ کەفتی نەئێتە گوهۆڕین" },
    Scene: MissingToothScene,
    steps: [
      { title: { en: "A tooth is lost", ar: "فقدان سن", ku: "ددانەک دکەڤیت" },
        text: { en: "Right after losing a tooth, the gap seems harmless. But the teeth around it start to change.", ar: "بعد فقدان السن مباشرة يبدو الفراغ بلا ضرر، لكن الأسنان حوله تبدأ بالتغيّر.", ku: "پشتی کەفتنا ددانی، ڤالاهی بێ زیان دیار دبیت، بەلێ ددانێن دۆر دەست ب گوهۆڕینێ دکەن." } },
      { title: { en: "Neighbouring teeth tilt", ar: "ميلان الأسنان المجاورة", ku: "ددانێن نێزیک لار دبن" },
        text: { en: "The teeth next to the gap slowly lean into it. Gaps open, food gets trapped and the bite changes.", ar: "تميل الأسنان المجاورة ببطء نحو الفراغ، فتنفتح فراغات ويعلق الطعام ويتغير الإطباق.", ku: "ددانێن نێزیک هێدی بەرەو ڤالاهیێ لار دبن، کەلش ڤەدبن، خوارن تێدا دمینیت و گەستن دگوهۆڕیت." } },
      { title: { en: "The opposite tooth moves", ar: "نزول السن المقابل", ku: "ددانێ بەرامبەر دلڤیت" },
        text: { en: "With nothing to bite on, the tooth in the other jaw grows out of its place. This makes later treatment harder.", ar: "السن المقابل في الفك الآخر لا يجد ما يعض عليه فيخرج من مكانه، فيصعب العلاج لاحقاً.", ku: "ددانێ بەرامبەر د شویلکا دی دا چ نابینیت بگەزیت، لەوما ژ جهێ خۆ دەردکەڤیت و چارەسەری پاشی زەحمەتتر دبیت." } },
      { title: { en: "The jaw bone shrinks", ar: "ذوبان عظم الفك", ku: "هەستیێ شویلکێ کێم دبیت" },
        text: { en: "Without a root, the bone shrinks over time and the face can look older. Replacing the tooth early (implant or bridge) prevents this.", ar: "بدون جذر يذوب العظم مع الوقت وقد يبدو الوجه أكبر سناً. تعويض السن مبكراً (زراعة أو جسر) يمنع ذلك.", ku: "بێ ڕەه هەستی ب دەمی کێم دبیت و دبیت ڕوو پیرتر دیار ببیت. گوهۆڕینا ددانی زوو (چاندن یان جسر) ڤێ ڕێگری دکەت." } },
    ],
  },
];

// Loads YouTube only when the visitor taps, using the privacy-enhanced (no-cookie) player.
const YouTubeVideo = ({ id, title, label, credit }: { id: string; title: string; label: string; credit: string }) => {
  const [on, setOn] = useState(false);
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden bg-black shadow-card">
        {on ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 w-full h-full" aria-label={title}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35">
              <span className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-elevated">
                <Play className="w-7 h-7 text-primary fill-primary ms-1" />
              </span>
              <span className="text-white font-semibold drop-shadow">{label}</span>
            </span>
          </button>
        )}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2">{credit}</p>
    </div>
  );
};

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
          {t.video && <YouTubeVideo key={t.video.id} id={t.video.id} title={`${t.name[lang]} — ${c.video}`} label={c.video} credit={`${c.videoBy} ${t.video.credit} · YouTube`} />}
        </div>

        <VideoLibrary lang={lang} />

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
