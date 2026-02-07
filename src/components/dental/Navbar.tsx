import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Calendar, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import clinicLogo from "@/assets/clinic-logo.png";

const navLinks = [
  { key: "home", href: "#home" },
  { key: "services", href: "#services" },
  { key: "about", href: "#about" },
  { key: "gallery", href: "#gallery" },
  { key: "testimonials", href: "#testimonials" },
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
      <div className="mx-4 md:mx-8 mt-4">
        <nav className={`flex items-center justify-between px-6 py-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-soft ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          {/* Logo */}
          <a href="#home" className={`flex items-center gap-3 group ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <img 
              src={clinicLogo} 
              alt="Dr. Saleem Andraws Dental Clinic" 
              className="h-12 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center gap-8 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
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
          <div className={`hidden md:flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors ${dir === "rtl" ? "flex-row-reverse" : ""}`}
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
                        } ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="tel:07507816500">
              <Button variant="ghost" size="sm" className={`gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">07507816500</span>
              </Button>
            </a>
            <Button variant="teal" size="sm" onClick={onBookingClick} className={`gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <Calendar className="w-4 h-4" />
              {t("nav.bookAppointment")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
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
              className="lg:hidden mt-2 p-6 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-elevated"
            >
              <div className="flex flex-col gap-4">
                {/* Language Selector Mobile */}
                <div className={`flex gap-2 pb-4 border-b border-border ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
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
                  <a href="tel:07507816500" className="w-full">
                    <Button variant="outline" className={`w-full justify-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <Phone className="w-4 h-4" />
                      {t("nav.call")}: 07507816500
                    </Button>
                  </a>
                  <Button variant="teal" className={`w-full justify-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`} onClick={() => { setMobileMenuOpen(false); onBookingClick(); }}>
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