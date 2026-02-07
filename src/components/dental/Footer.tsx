import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import clinicLogo from "@/assets/clinic-logo.png";

const Footer = () => {
  const { t, dir } = useLanguage();

  const navLinks = [
    { key: "home", href: "#home" },
    { key: "services", href: "#services" },
    { key: "about", href: "#about" },
    { key: "testimonials", href: "#testimonials" },
    { key: "contact", href: "#contact" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${dir === "rtl" ? "text-right" : ""}`}>
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className={`flex items-center gap-3 mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <img 
                src={clinicLogo} 
                alt="Dr. Saleem Andraws Dental Clinic" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-md mb-4">
              {t("footer.description")}
            </p>
            <div className={`flex gap-3 ${dir === "rtl" ? "flex-row-reverse justify-end" : ""}`}>
              <a 
                href="https://linktr.ee/saleem.andraws" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/10 hover:bg-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="hover:text-primary transition-colors">
                    {t(`nav.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:07507816500" className="hover:text-primary transition-colors">07507816500</a>
              </li>
              <li className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:dr.saleemo@gmail.com" className="hover:text-primary transition-colors">dr.saleemo@gmail.com</a>
              </li>
              <li className={`flex items-start gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>{t("contact.address")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60 ${dir === "rtl" ? "md:flex-row-reverse" : ""}`}>
          <p>© {new Date().getFullYear()} Dr. Saleem Andraws Dental Clinic. {t("footer.rights")}</p>
          <p>{t("footer.openDaily")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;