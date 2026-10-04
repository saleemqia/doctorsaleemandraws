import { useState } from "react";
import { Play, ExternalLink, Film } from "lucide-react";

type L = "en" | "ar" | "ku";

// 3D animations from YouTube, shown with YouTube's own player (embedded, never copied).
// Each one also has a "watch on YouTube" link, in case the owner does not allow playing it on other sites.
// To add a video: put its YouTube id (the part after v=) in the right group.
const GROUPS: { title: Record<L, string>; videos: { id: string; title: Record<L, string> }[] }[] = [
  {
    title: { en: "Decay, infection and nerve treatment", ar: "التسوس والالتهاب وعلاج العصب", ku: "کڕمبوون، هەوکرن و چارەسەریا دەمارێ" },
    videos: [
      { id: "ezm56rYWnTE", title: { en: "The stages of tooth decay", ar: "مراحل تسوس الأسنان", ku: "قۆناغێن کڕمبوونا ددانا" } },
      { id: "nXc7C0mo_yk", title: { en: "Abscess at the root tip (periapical abscess)", ar: "خراج طرف الجذر", ku: "کێما سەرێ ڕەهی" } },
      { id: "VR8IQ9QFdWw", title: { en: "Root canal treatment", ar: "علاج العصب", ku: "چارەسەریا دەمارێ" } },
    ],
  },
  {
    title: { en: "Extraction and wisdom teeth", ar: "القلع وأضراس العقل", ku: "هەلکێشان و ددانێن عەقلی" },
    videos: [
      { id: "RIhr32Ko-uY", title: { en: "Tooth extraction", ar: "قلع السن", ku: "هەلکێشانا ددانی" } },
      { id: "hjAuS7hyJnk", title: { en: "Wisdom tooth removal: step by step", ar: "قلع ضرس العقل خطوة بخطوة", ku: "هەلکێشانا ددانێ عەقلی قۆناغ ب قۆناغ" } },
      { id: "IvfRHJ5ig-4", title: { en: "Impacted wisdom teeth", ar: "أضراس العقل المطمورة", ku: "ددانێن عەقلی یێن ڤەشارتی" } },
    ],
  },
  {
    title: { en: "Implants and sinus lift", ar: "الزراعة ورفع الجيب الأنفي", ku: "چاندن و بلندکرنا سینوسێ" },
    videos: [
      { id: "2dfyWpdiFoM", title: { en: "How a dental implant is placed", ar: "كيف تتم زراعة السن", ku: "چاندنا ددانی چاوا دئێتە کرن" } },
      { id: "2sul5gcXatg", title: { en: "Dental implant animation", ar: "زراعة الأسنان (رسوم ثلاثية الأبعاد)", ku: "چاندنا ددانا (ئەنیمەیشنا 3D)" } },
      { id: "QDGtioGwrTc", title: { en: "Implant from surgery to the final tooth (Arabic)", ar: "الزراعة من الجراحة حتى التركيب (بالعربية)", ku: "چاندن ژ نەشتەرگەریێ هەتا ددانێ دوماهیێ (عەرەبی)" } },
      { id: "wRIv-iEo6hc", title: { en: "Sinus lift", ar: "رفع الجيب الأنفي", ku: "بلندکرنا سینوسێ" } },
      { id: "ugDxmSXnx70", title: { en: "Sinus lift with bone graft for implants", ar: "رفع الجيب مع تطعيم العظم للزراعة", ku: "بلندکرنا سینوسێ دگەل چاندنا هەستی" } },
    ],
  },
  {
    title: { en: "Crowns, veneers and dentures", ar: "التيجان والفينير وطقم الأسنان", ku: "کراس، ڤینیر و تەخمێ ددانا" },
    videos: [
      { id: "GFziL1S4zJc", title: { en: "Dental crown procedure", ar: "تركيب التاج (الكراس)", ku: "دانانا کراسی" } },
      { id: "J6lPwPE7BOc", title: { en: "Crown placement explained", ar: "شرح تركيب التاج", ku: "ڕوونکرنا دانانا کراسی" } },
      { id: "XlWNKVW30Pg", title: { en: "Veneers step by step", ar: "الفينير خطوة بخطوة", ku: "ڤینیر قۆناغ ب قۆناغ" } },
      { id: "SUYM2WNZSdE", title: { en: "Complete dentures explained", ar: "طقم الأسنان الكامل", ku: "تەخمێ ددانا یێ تەمام" } },
    ],
  },
  {
    title: { en: "Cleaning and children's teeth", ar: "التنظيف وأسنان الأطفال", ku: "پاقژکرن و ددانێن زارۆکان" },
    videos: [
      { id: "SpIhNc05n3k", title: { en: "Scaling and polishing", ar: "إزالة الجير وتلميع الأسنان", ku: "ڕاکرنا کلسی و بریقەدانا ددانا" } },
      { id: "4xdAFJBabhY", title: { en: "How teeth develop and erupt", ar: "تكوّن الأسنان وظهورها", ku: "چێبوون و دەرکەفتنا ددانا" } },
      { id: "rD2j7svQx40", title: { en: "From baby teeth to permanent teeth", ar: "من الأسنان اللبنية إلى الدائمة", ku: "ژ ددانێن شیری بۆ ددانێن هەمیشەیی" } },
    ],
  },
];

const TEXT: Record<L, { title: string; intro: string; watch: string; onYoutube: string; note: string }> = {
  en: {
    title: "3D video library",
    intro: "Short 3D animations from YouTube about more treatments and conditions. Tap a video to play it.",
    watch: "Play",
    onYoutube: "Watch on YouTube",
    note: "Videos belong to their creators and play from YouTube. Most are in English. If a video doesn't play here, use \"Watch on YouTube\".",
  },
  ar: {
    title: "مكتبة الفيديوهات ثلاثية الأبعاد",
    intro: "رسوم متحركة ثلاثية الأبعاد قصيرة من YouTube عن علاجات وحالات أخرى. اضغط على أي فيديو لتشغيله.",
    watch: "تشغيل",
    onYoutube: "شاهد على YouTube",
    note: "الفيديوهات ملك أصحابها وتُعرض من YouTube، ومعظمها بالإنجليزية. إذا لم يعمل فيديو هنا، اضغط \"شاهد على YouTube\".",
  },
  ku: {
    title: "کتێبخانا ڤیدیۆیێن 3D",
    intro: "ئەنیمەیشنێن 3D یێن کورت ژ YouTube ل سەر چارەسەری و حالەتێن دی. کلیک ل سەر ڤیدیۆیەکێ بکە دا لێبدەی.",
    watch: "لێدان",
    onYoutube: "ل YouTube ببینە",
    note: "ڤیدیۆ یێن خودانێن وان نە و ژ YouTube دئێنە نیشاندان، پترانیا وان ب ئینگلیزی نە. ئەگەر ڤیدیۆیەک ل ڤێرێ کار نەکەت، \"ل YouTube ببینە\" بکاربینە.",
  },
};

const VideoCard = ({ id, title, lang }: { id: string; title: string; lang: L }) => {
  const [on, setOn] = useState(false);
  const t = TEXT[lang];
  return (
    <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden flex flex-col">
      <div className="relative aspect-video bg-black">
        {on ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button type="button" onClick={() => setOn(true)} aria-label={`${t.watch}: ${title}`} className="group absolute inset-0 w-full h-full">
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-elevated group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 text-primary fill-primary ms-0.5" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="font-semibold text-sm text-foreground leading-snug">{title}</p>
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {t.onYoutube}
        </a>
      </div>
    </div>
  );
};

const VideoLibrary = ({ lang }: { lang: L }) => {
  const t = TEXT[lang];
  return (
    <div id="videos" className="max-w-6xl mx-auto mt-14 md:mt-20">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="font-display text-2xl md:text-4xl font-bold mb-3 inline-flex items-center gap-2">
          <Film className="w-7 h-7 text-primary" />
          {t.title}
        </h2>
        <p className="text-muted-foreground">{t.intro}</p>
      </div>
      <div className="space-y-10">
        {GROUPS.map((g) => (
          <section key={g.title.en}>
            <h3 className="font-display text-xl md:text-2xl font-bold mb-4">{g.title[lang]}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {g.videos.map((v) => (
                <VideoCard key={v.id} id={v.id} title={v.title[lang]} lang={lang} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-6 max-w-2xl mx-auto">{t.note}</p>
    </div>
  );
};

export default VideoLibrary;
