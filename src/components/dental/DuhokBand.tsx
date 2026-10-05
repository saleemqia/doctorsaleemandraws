import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, ExternalLink, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GOOGLE_DIRECTIONS_URL } from "@/config/clinic";

type L = "en" | "ar" | "ku";

// Aerial video of Duhok by the YouTube channel RDD2022. It is shown with YouTube's own
// player (embedded, never downloaded or cut), muted and looping, with credit below.
const VIDEO_ID = "ohvHzLMYa9c";
const CREDIT = "RDD2022";

const TEXT: Record<L, { badge: string; title1: string; title2: string; text: string; directions: string; credit: string; play: string }> = {
  en: {
    badge: "Our city",
    title1: "In the heart of",
    title2: "Duhok",
    text: "Our clinic is on Qazi Mohammad Road, easy to reach from every part of the city.",
    directions: "Get directions",
    credit: "Aerial video",
    play: "Play the video of Duhok",
  },
  ar: {
    badge: "مدينتنا",
    title1: "في قلب",
    title2: "دهوك",
    text: "عيادتنا في شارع قاضي محمد، ويسهل الوصول إليها من كل أنحاء المدينة.",
    directions: "احصل على الاتجاهات",
    credit: "تصوير جوي",
    play: "تشغيل فيديو دهوك",
  },
  ku: {
    badge: "باژێرێ مە",
    title1: "ل دلێ",
    title2: "دهوکێ",
    text: "کلینیکا مە ل شەقامێ قازی محەمەد یە، و ژ هەمی دەڤەرێن باژێری ب ساناهی دگەهیێ.",
    directions: "ڕێکێ ببینە",
    credit: "وێنەگرتنا ئاسمانی",
    play: "ڤیدیۆیا دهوکێ لێبدە",
  },
};

const DuhokBand = () => {
  const { language } = useLanguage();
  const c = TEXT[language as L];
  const boxRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  // Load the video only when the band comes into view, and not for visitors who prefer less motion
  // (they get the picture with a play button instead).
  useEffect(() => {
    const el = boxRef.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`;

  return (
    <section id="duhok" className="py-14 md:py-20 bg-gradient-to-b from-sky-50 to-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            {c.badge}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            {c.title1} <span className="text-gradient">{c.title2}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">{c.text}</p>
        </div>

        <div ref={boxRef} className="relative max-w-6xl mx-auto aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-elevated bg-sky-900">
          {on ? (
            <iframe
              src={src}
              title="Duhok — aerial video"
              allow="autoplay; encrypted-media; picture-in-picture"
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
          ) : (
            <button type="button" onClick={() => setOn(true)} aria-label={c.play} className="group absolute inset-0 w-full h-full">
              <img src={`https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-elevated group-hover:scale-105 transition-transform">
                  <Play className="w-7 h-7 text-primary fill-primary ms-1" />
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="max-w-6xl mx-auto mt-4 flex flex-wrap items-center justify-between gap-3">
          <a
            href={GOOGLE_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-card transition-shadow"
          >
            <Navigation className="w-4 h-4" />
            {c.directions}
          </a>
          <a
            href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {c.credit}: {CREDIT} — YouTube
          </a>
        </div>
      </div>
    </section>
  );
};

export default DuhokBand;
