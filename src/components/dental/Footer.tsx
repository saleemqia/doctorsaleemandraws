import { MapPin, ExternalLink, Shield, Facebook, Instagram, Star, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import clinicLogo from "@/assets/clinic-logo.png";
import { GOOGLE_MAPS_URL, INSTAGRAM_URL } from "@/config/clinic";
import { parsePath, pathFor, type SitePage } from "@/config/seo";

const Footer = () => {
  const { t, dir, language } = useLanguage();

  const mapDirectionsUrl = GOOGLE_MAPS_URL;

  const navLinks = [
    { key: "home", href: "#home" },
    { key: "services", href: "#services" },
    { key: "about", href: "#about" },
    { key: "gallery", href: "#gallery" },
    { key: "instagram", href: "#instagram" },
    { key: "testimonials", href: "#testimonials" },
    { key: "contact", href: "#contact" },
    { key: "case", href: "/case" },
    { key: "kids", href: "/kids" },
  ];
  const onHome = parsePath(window.location.pathname)?.page === "";
  const hrefFor = (href: string) =>
    href.startsWith("/") ? pathFor(language, href as SitePage) : onHome ? href : pathFor(language, "") + href;

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16 px-4 sm:px-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${dir === "rtl" ? "text-right" : ""}`}>
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className={`flex items-center gap-3 mb-4 ${dir === "rtl" ? "" : ""}`}>
              <img 
                src={clinicLogo} 
                alt="Dr. Saleem Andraws Dental Clinic" 
                className="h-14 md:h-16 w-auto object-contain"
              />
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-md mb-4">
              {t("footer.description")}
            </p>
            <div className={`flex gap-3 ${dir === "rtl" ? "" : ""}`}>
              <a 
                href="https://www.facebook.com/doctor.saleem.diamond.dental.duhok/" 
                aria-label="Facebook"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/10 hover:bg-white/25 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={INSTAGRAM_URL}
                aria-label="Instagram"
                title="Instagram"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/10 hover:bg-white/25 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tripadvisor.com/LocationPhotoDirectLink-g676534-i473690580-Duhok_Duhok_Province.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/10 hover:bg-white/25 transition-colors"
                title="TripAdvisor"
              >
                <Star className="w-4 h-4" />
              </a>
              <a 
                href="https://linktr.ee/saleem.andraws" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/10 hover:bg-white/25 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2 text-sm text-background/70">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <a href={hrefFor(link.href)} className="hover:text-white transition-colors">
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
              className={`flex items-start gap-2 text-sm text-background/70 hover:text-white transition-colors ${dir === "rtl" ? "" : ""}`}
            >
              <MapPin className="w-4 h-4 text-[hsl(199,85%,70%)] mt-0.5 flex-shrink-0" />
              <span>{t("contact.address")}</span>
            </a>
            <div className={`flex items-start gap-2 text-sm text-background/70 mt-3 ${dir === "rtl" ? "" : ""}`}>
              <Phone className="w-4 h-4 text-[hsl(199,85%,70%)] mt-0.5 flex-shrink-0" />
              <div className={`flex flex-wrap gap-2 ${dir === "rtl" ? "" : ""}`}>
                <a href="tel:07781665000" className="hover:text-white transition-colors">07781665000</a>
                <a href="tel:07507816500" className="hover:text-white transition-colors">07507816500</a>
              </div>
            </div>
            <p className="text-sm text-background/50 mt-4">{t("footer.openDaily")}</p>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60 ${dir === "rtl" ? "" : ""}`}>
          <p>© {new Date().getFullYear()} Dr. Saleem Andraws Dental Clinic. {t("footer.rights")}</p>
          <Link to="/admin" className={`flex items-center gap-1.5 hover:text-white transition-colors ${dir === "rtl" ? "" : ""}`}>
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
