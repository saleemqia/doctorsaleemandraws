import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home, Stethoscope, UserRound, Building2, Images, Instagram, MessageSquareQuote,
  HelpCircle, Baby, BookOpen, CalendarClock, MapPin, List, X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type L = "en" | "ar" | "ku";

// The page sections, in page order. Labels in English, Arabic and Kurdish.
const SECTIONS: { id: string; icon: typeof Home; label: Record<L, string> }[] = [
  { id: "home", icon: Home, label: { en: "Home", ar: "الرئيسية", ku: "سەرەکی" } },
  { id: "services", icon: Stethoscope, label: { en: "Services", ar: "الخدمات", ku: "خزمەتگوزاری" } },
  { id: "about", icon: UserRound, label: { en: "The doctor", ar: "عن الطبيب", ku: "دەربارەی دکتۆری" } },
  { id: "clinic", icon: Building2, label: { en: "Our clinic", ar: "العيادة", ku: "کلینیک" } },
  { id: "gallery", icon: Images, label: { en: "Before & after", ar: "المعرض", ku: "پێشانگە" } },
  { id: "instagram", icon: Instagram, label: { en: "Instagram", ar: "إنستغرام", ku: "ئینستاگرام" } },
  { id: "testimonials", icon: MessageSquareQuote, label: { en: "Reviews", ar: "آراء المرضى", ku: "بۆچوونێن نەخۆشان" } },
  { id: "faq", icon: HelpCircle, label: { en: "Questions", ar: "الأسئلة", ku: "پسیار" } },
  { id: "kids", icon: Baby, label: { en: "Kids' teeth", ar: "أسنان الأطفال", ku: "ددانێن زارۆکان" } },
  { id: "posters", icon: BookOpen, label: { en: "Learn", ar: "تعليمي", ku: "فێرکاری" } },
  { id: "hours", icon: CalendarClock, label: { en: "Opening hours", ar: "أوقات الدوام", ku: "دەمێن کاری" } },
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
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Dot rail, always on the left edge */}
      <nav
        aria-label={TITLE[lang]}
        dir="ltr"
        className={`fixed left-0.5 sm:left-1 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-0.5 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={TITLE[lang]}
          className="w-6 h-6 mb-1.5 flex items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft ring-2 ring-white"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-label={s.label[lang]}
              aria-current={on ? "true" : undefined}
              className="group relative w-5 h-5 flex items-center justify-center"
            >
              <span className={`block rounded-full transition-all duration-300 ${on ? "w-2.5 h-5 bg-primary" : "w-2 h-2 bg-slate-400/80 group-hover:bg-primary/70"} ring-2 ring-white shadow-sm`} />
              <span
                className="pointer-events-none absolute left-7 whitespace-nowrap rounded-lg bg-foreground text-background text-xs font-semibold px-2.5 py-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 transition-all hidden md:block"
                dir="auto"
              >
                {s.label[lang]}
              </span>
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
