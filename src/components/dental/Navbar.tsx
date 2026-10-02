import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Calendar, Globe, ChevronDown, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import clinicLogo from "@/assets/clinic-logo.png";
import { INSTAGRAM_URL } from "@/config/clinic";

const navLinks = [
  { key: "home", href: "#home" },
  { key: "services", href: "#services" },
  { key: "about", href: "#about" },
  { key: "gallery", href: "#gallery" },
  { key: "testimonials", href: "#testimonials" },
  { key: "kids", href: "#kids" },
  { key: "posters", href: "#posters" },
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
  const { language, setLanguage, t, dir } = useLanguage();

  const currentLang = languages.find((l) => l.code === language);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-3 sm:mx-4 md:mx-8 mt-3 sm:mt-4">
        <nav className={`flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-soft ${dir === "rtl" ? "" : ""}`}>
          {/* Logo */}
          <a href="#home" className={`flex items-center gap-3 group ${dir === "rtl" ? "" : ""}`}>
            <img 
              src={clinicLogo} 
              alt="Dr. Saleem Andraws Dental Clinic" 
              className="h-10 sm:h-12 w-auto object-contain shrink-0"
            />
            {/* The doctor's name in Assyrian (Syriac script). Fixed direction and font so it
                looks exactly the same in every site language. */}
            <span
              dir="rtl"
              lang="syr"
              className="font-syriac text-[1.35rem] sm:text-2xl lg:text-[1.75rem] leading-none text-primary whitespace-nowrap select-none"
              style={{ unicodeBidi: "isolate" }}
            >
              ܕܳܟܬܾܘܪ ܣܠܝܡ ܐܰܢܕܪܰܐܘܳܣ
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className={`hidden min-[1700px]:flex items-center gap-6 ${dir === "rtl" ? "" : ""}`}>
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
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
                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors ${dir === "rtl" ? "" : ""}`}
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
                    className={`absolute top-full mt-2 ${dir === "rtl" ? "left-0" : "right-0"} w-40 p-2 rounded-xl bg-card border border-border shadow-card`}
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
              <Button variant="ghost" size="sm">
                <Instagram className="w-4 h-4" />
              </Button>
            </a>
            <a href="tel:07781665000" className="hidden xl:inline-flex">
              <Button variant="ghost" size="sm" className={`gap-2 ${dir === "rtl" ? "" : ""}`}>
                <Phone className="w-4 h-4" />
                <span className="hidden 2xl:inline">07781665000</span>
              </Button>
            </a>
            <a href="tel:07507816500" className="hidden xl:inline-flex">
              <Button variant="ghost" size="sm" className={`gap-2 ${dir === "rtl" ? "" : ""}`}>
                <Phone className="w-4 h-4" />
                <span className="hidden 2xl:inline">07507816500</span>
              </Button>
            </a>
            <Button variant="teal" size="sm" onClick={onBookingClick} className={`gap-2 ${dir === "rtl" ? "" : ""}`}>
              <Calendar className="w-4 h-4" />
              {t("nav.bookAppointment")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-[1700px]:hidden p-2.5 -m-1 rounded-lg hover:bg-secondary transition-colors" aria-label="Menu"
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
              className="min-[1700px]:hidden mt-2 p-5 sm:p-6 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-elevated"
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
                    href={link.href}
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
                  <a href="tel:07781665000" className="w-full">
                    <Button variant="outline" className={`w-full justify-center gap-2 ${dir === "rtl" ? "" : ""}`}>
                      <Phone className="w-4 h-4" />
                      {t("nav.call")}: 07781665000
                    </Button>
                  </a>
                  <a href="tel:07507816500" className="w-full">
                    <Button variant="outline" className={`w-full justify-center gap-2 ${dir === "rtl" ? "" : ""}`}>
                      <Phone className="w-4 h-4" />
                      {t("nav.call")}: 07507816500
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
    </header>
  );
};

export default Navbar;