import { MapPin, ExternalLink, Shield, Facebook, Instagram, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import clinicLogo from "@/assets/clinic-logo.png";

const Footer = () => {
  const { t, dir } = useLanguage();

  const mapDirectionsUrl = "https://share.google/jfAOUXSkIEwwTg9fn";

  const navLinks = [
    { key: "home", href: "#home" },
    { key: "services", href: "#services" },
    { key: "about", href: "#about" },
    { key: "gallery", href: "#gallery" },
    { key: "testimonials", href: "#testimonials" },
    { key: "contact", href: "#contact" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16 px-4 sm:px-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${dir === "rtl" ? "text-right" : ""}`}>
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className={`flex items-center gap-3 mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <img 
                src={clinicLogo} 
                alt="Dr. Saleem Andraws Dental Clinic" 
                className="h-14 md:h-16 w-auto object-contain"
              />
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-md mb-4">
              {t("footer.description")}
            </p>
            <div className={`flex gap-3 ${dir === "rtl" ? "flex-row-reverse justify-end" : ""}`}>
              <a 
                href="https://www.facebook.com/doctor.saleem.diamond.dental.duhok/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/10 hover:bg-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/dr.saleemandraws/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/10 hover:bg-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tripadvisor.com/LocationPhotoDirectLink-g676534-i473690580-Duhok_Duhok_Province.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/10 hover:bg-primary transition-colors"
                title="TripAdvisor"
              >
                <Star className="w-4 h-4" />
              </a>
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

          {/* Location */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.location")}</h4>
            <a 
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-start gap-2 text-sm text-background/70 hover:text-primary transition-colors ${dir === "rtl" ? "flex-row-reverse" : ""}`}
            >
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("contact.address")}</span>
            </a>
            <p className="text-sm text-background/50 mt-4">{t("footer.openDaily")}</p>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60 ${dir === "rtl" ? "md:flex-row-reverse" : ""}`}>
          <p>© {new Date().getFullYear()} Dr. Saleem Andraws Dental Clinic. {t("footer.rights")}</p>
          <Link to="/admin" className={`flex items-center gap-1.5 hover:text-primary transition-colors ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
