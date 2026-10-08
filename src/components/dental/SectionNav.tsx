import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home, Stethoscope, UserRound, Building2, Images, Instagram, MessageSquareQuote,
  HelpCircle, ScanLine, Compass, CalendarClock, MapPin, List, X, Mountain, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type L = "en" | "ar" | "ku";

// The page sections, in page order. Labels in English, Arabic and Kurdish.
const SECTIONS: { id: string; icon: typeof Home; label: Record<L, string> }[] = [
  { id: "home", icon: Home, label: { en: "Home", ar: "الرئيسية", ku: "سەرەکی" } },
  { id: "services", icon: Stethoscope, label: { en: "Services", ar: "الخدمات", ku: "خزمەتگوزاری" } },
  { id: "about", icon: UserRound, label: { en: "The doctor", ar: "عن الطبيب", ku: "دەربارەی دکتۆری" } },
  { id: "clinic", icon: Building2, label: { en: "Our clinic", ar: "العيادة", ku: "کلینیک" } },
  { id: "technology", icon: ScanLine, label: { en: "3D technology", ar: "التقنيات الرقمية", ku: "تەکنەلۆژیا ٣D" } },
  { id: "smile", icon: Sparkles, label: { en: "Smile preview", ar: "معاينة الابتسامة", ku: "پێشبینیا بزەیێ" } },
  { id: "gallery", icon: Images, label: { en: "Before & after", ar: "المعرض", ku: "پێشانگە" } },
  { id: "instagram", icon: Instagram, label: { en: "Instagram", ar: "إنستغرام", ku: "ئینستاگرام" } },
  { id: "testimonials", icon: MessageSquareQuote, label: { en: "Reviews", ar: "آراء المرضى", ku: "بۆچوونێن نەخۆشان" } },
  { id: "faq", icon: HelpCircle, label: { en: "Questions", ar: "الأسئلة", ku: "پسیار" } },
  { id: "more", icon: Compass, label: { en: "Explore more", ar: "المزيد", ku: "زێدەتر" } },
  { id: "hours", icon: CalendarClock, label: { en: "Opening hours", ar: "أوقات الدوام", ku: "دەمێن کاری" } },
  { id: "duhok", icon: Mountain, label: { en: "Our city", ar: "مدينتنا", ku: "باژێرێ مە" } },
  { id: "contact", icon: MapPin, label: { en: "Location & contact", ar: "الموقع والتواصل", ku: "جهـ و پەیوەندی" } },
];

const TITLE: Record<L, string> = { en: "Go to section", ar: "انتقل إلى قسم", ku: "بچە بۆ بەشێ" };

// A slim column of dots on the left edge: one per section, the current one highlighted.
// Hovering a dot shows its name; the list button opens all sections with names (best on phones).
const SectionNav = () => {
  const { language } = useLanguage();
  const lang = language as L;
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const railRef = useRef<HTMLElement>(null);
  const skipNextClick = useRef(false);

  // On phones: close the names again after a few seconds, or when touching elsewhere.
  useEffect(() => {
    if (!expanded) return;
    const timer = setTimeout(() => setExpanded(false), 6000);
    const outside = (e: Event) => {
      if (railRef.current && !railRef.current.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("touchstart", outside, { passive: true });
    return () => {
      clearTimeout(timer);
      document.removeEventListener("touchstart", outside);
    };
  }, [expanded]);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => {
    if (skipNextClick.current) {
      skipNextClick.current = false;
      return;
    }
    setOpen(false);
    setExpanded(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Dot rail on the left edge. Mouse over it (or touch it) and it opens to show
          every section's name, so you can see where each dot will take you. */}
      <nav
        ref={railRef}
        aria-label={TITLE[lang]}
        dir="ltr"
        onPointerEnter={(e) => e.pointerType === "mouse" && setExpanded(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setExpanded(false)}
        onTouchStart={() => {
          if (!expanded) {
            // First touch only opens the names; the next touch moves to the section.
            skipNextClick.current = true;
            setExpanded(true);
          }
        }}
        className={`fixed left-0.5 sm:left-1 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-0.5 transition-all duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${expanded ? "items-stretch bg-card/95 backdrop-blur-md border border-border shadow-elevated rounded-2xl p-1.5" : "items-center"}`}
      >
        <button
          type="button"
          onClick={() => {
            if (skipNextClick.current) {
              skipNextClick.current = false;
              return;
            }
            setOpen(true);
          }}
          aria-label={TITLE[lang]}
          className={`flex items-center gap-2 mb-1.5 rounded-full bg-gradient-primary text-primary-foreground shadow-soft ring-2 ring-white ${
            expanded ? "h-8 px-3 text-xs font-semibold" : "w-6 h-6 justify-center"
          }`}
        >
          <List className="w-3.5 h-3.5 shrink-0" />
          {expanded && <span dir="auto">{TITLE[lang]}</span>}
        </button>
        {SECTIONS.map((s) => {
          const on = active === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-label={s.label[lang]}
              aria-current={on ? "true" : undefined}
              className={`group relative flex items-center rounded-xl transition-colors ${
                expanded
                  ? `gap-2 h-8 ps-1.5 pe-3 text-start ${on ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary active:bg-secondary"}`
                  : "w-5 h-5 justify-center"
              }`}
            >
              <span className="w-5 flex justify-center shrink-0">
                <span
                  className={`block rounded-full transition-all duration-300 ring-2 ring-white shadow-sm ${
                    on ? "w-2.5 h-5 bg-primary" : "w-2 h-2 bg-slate-400/80 group-hover:bg-primary group-hover:w-2.5 group-hover:h-2.5"
                  }`}
                />
              </span>
              {expanded && (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${on ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                  <span dir="auto" className={`whitespace-nowrap text-xs sm:text-sm ${on ? "font-bold" : "font-medium group-hover:font-semibold"}`}>
                    {s.label[lang]}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Full list with names */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[55] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-label={TITLE[lang]}
              className="absolute left-0 top-0 bottom-0 w-[260px] max-w-[80vw] bg-card shadow-elevated p-4 overflow-y-auto"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-display font-bold text-lg">{TITLE[lang]}</p>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1.5 rounded-lg hover:bg-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ul className="space-y-1">
                {SECTIONS.map((s) => {
                  const on = active === s.id;
                  const Icon = s.icon;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => go(s.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start text-sm font-medium transition-colors ${
                          on ? "bg-gradient-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        {s.label[lang]}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionNav;
