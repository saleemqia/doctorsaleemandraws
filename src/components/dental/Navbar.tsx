import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Calendar, Globe, ChevronDown, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import clinicLogo from "@/assets/clinic-logo.png";
import AssyrianName from "@/components/dental/AssyrianName";
import { INSTAGRAM_URL } from "@/config/clinic";
import { parsePath, pathFor, type SitePage } from "@/config/seo";

const navLinks: { key: string; href: string; mobileOnly?: boolean }[] = [
  { key: "home", href: "#home" },
  { key: "services", href: "#services" },
  { key: "about", href: "#about" },
  { key: "smile", href: "#smile" },
  { key: "gallery", href: "#gallery" },
  { key: "testimonials", href: "#testimonials" },
  { key: "treatments", href: "/treatments" },
  { key: "case", href: "/case" },
  { key: "kids", href: "/kids" },
  { key: "infographics", href: "/infographics" },
  { key: "links", href: "/links", mobileOnly: true },
  { key: "contact", href: "#contact" },
];

const languages = [
  { code: "en" as const, label: "English", flag: "🇺🇸" },
  { code: "ar" as const, label: "العربية", flag: "🇮🇶" },
  { code: "ku" as const, label: "کوردی", flag: "🟢" },
];

interface NavbarProps {
  onBookingClick: () => void;
}

const Navbar = ({ onBookingClick }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { language, setLanguage, t, dir } = useLanguage();

  const currentLang = languages.find((l) => l.code === language);
  // "#section" links work on the home page; from a sub-page they go to the home page first.
  const onHome = parsePath(window.location.pathname)?.page === "";
  // "/links" is a separate one-page site (one language), so it keeps its own address.
  const hrefFor = (href: string) =>
    href === "/links" ? href : href.startsWith("/") ? pathFor(language, href as SitePage) : onHome ? href : pathFor(language, "") + href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(var(--aqua)/0.25)] bg-white/85 text-foreground shadow-sm backdrop-blur-xl">
      <div className="mx-3 sm:mx-4 md:mx-8">
        <nav className="flex items-center justify-between gap-3 py-2.5 sm:py-3">
          {/* Logo */}
          <a href={pathFor(language, "")} className="flex flex-1 min-w-0 items-center gap-3 group">
            <img 
              src={clinicLogo} 
              alt="Dr. Saleem Andraws Dental Clinic" 
              className="h-9 sm:h-11 w-auto object-contain shrink-0 rounded-md p-0.5"
            />
            <AssyrianName />
          </a>

          {/* Desktop Navigation */}
          <div className={`hidden min-[1850px]:flex items-center gap-6 ${dir === "rtl" ? "" : ""}`}>
            {navLinks.filter((l) => !l.mobileOnly).map((link) => (
              <a
                key={link.key}
                href={hrefFor(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t(`nav.${link.key}`)}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className={`hidden md:flex items-center gap-3 ${dir === "rtl" ? "" : ""}`}>
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{currentLang?.flag}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full mt-2 ${dir === "rtl" ? "left-0" : "right-0"} w-40 p-2 rounded-lg bg-card text-foreground border border-border shadow-card`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors ${
                          language === lang.code ? "bg-primary/10 text-primary" : ""
                        } ${dir === "rtl" ? "text-right" : ""}`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
              <Button variant="ghost" size="sm" className="text-foreground/80 hover:bg-secondary hover:text-primary">
                <Instagram className="w-4 h-4" />
              </Button>
            </a>
            <a href="tel:07507816500" className="hidden xl:inline-flex">
              <Button variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:bg-secondary hover:text-primary">
                <Phone className="w-4 h-4" />
                <span className="hidden 2xl:inline">07507816500</span>
              </Button>
            </a>
            <a href="tel:07781665000" className="hidden xl:inline-flex">
              <Button variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:bg-secondary hover:text-primary">
                <Phone className="w-4 h-4" />
                <span className="hidden 2xl:inline">07781665000</span>
              </Button>
            </a>
            <Button size="sm" onClick={onBookingClick} className="gap-2 rounded-full bg-[hsl(var(--sun))] text-[hsl(var(--ink))] shadow-[0_6px_18px_-6px_hsl(var(--sun))] hover:bg-[hsl(41_100%_68%)]">
              <Calendar className="w-4 h-4" />
              {t("nav.bookAppointment")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-[1850px]:hidden p-2.5 -m-1 rounded-lg hover:bg-secondary transition-colors" aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-[1850px]:hidden mb-3 p-5 sm:p-6 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg bg-card text-foreground border border-border shadow-elevated"
            >
              <div className="flex flex-col gap-4">
                {/* Language Selector Mobile */}
                <div className={`flex gap-2 pb-4 border-b border-border ${dir === "rtl" ? "" : ""}`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors ${
                        language === lang.code
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="hidden sm:inline">{lang.label}</span>
                    </button>
                  ))}
                </div>

                {navLinks.map((link) => (
                  <a
                    key={link.key}
                    href={hrefFor(link.href)}
                    className={`text-base font-medium text-foreground py-2 ${dir === "rtl" ? "text-right" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(`nav.${link.key}`)}
                  </a>
                ))}
                <div className="pt-4 border-t border-border flex flex-col gap-3">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full justify-center gap-2">
                      <Instagram className="w-4 h-4" />
                      {t("nav.instagram")}
                    </Button>
                  </a>
                  <a href="tel:07507816500" className="w-full">
                    <Button variant="outline" className={`w-full justify-center gap-2 ${dir === "rtl" ? "" : ""}`}>
                      <Phone className="w-4 h-4" />
                      {t("nav.call")}: 07507816500
                    </Button>
                  </a>
                  <a href="tel:07781665000" className="w-full">
                    <Button variant="outline" className={`w-full justify-center gap-2 ${dir === "rtl" ? "" : ""}`}>
                      <Phone className="w-4 h-4" />
                      {t("nav.call")}: 07781665000
                    </Button>
                  </a>
                  <Button variant="teal" className={`w-full justify-center gap-2 ${dir === "rtl" ? "" : ""}`} onClick={() => { setMobileMenuOpen(false); onBookingClick(); }}>
                    <Calendar className="w-4 h-4" />
                    {t("nav.bookAppointment")}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Reading progress */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-transparent">
        <div className="h-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--sun))]" style={{ transform: `scaleX(${progress})`, transformOrigin: dir === "rtl" ? "right" : "left" }} />
      </div>
    </header>
  );
};

export default Navbar;