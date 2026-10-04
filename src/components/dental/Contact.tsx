import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ExternalLink, Navigation, Phone, Instagram } from "lucide-react";
import { PHONES } from "@/config/clinic";
import { useLanguage } from "@/contexts/LanguageContext";
import { GOOGLE_DIRECTIONS_URL, GOOGLE_MAPS_URL, GOOGLE_MAP_EMBED_URL, INSTAGRAM_URL, ENTRANCE_360_EMBED_URL } from "@/config/clinic";
import { useState } from "react";
import { Map as MapIcon, Rotate3d } from "lucide-react";

interface ContactProps {
  onBookingClick: () => void;
}

const Contact = ({ onBookingClick }: ContactProps) => {
  const { t, dir, language } = useLanguage();
  const [view, setView] = useState<"map" | "pano">("map");
  const VIEW_TEXT = {
    en: { map: "Map", pano: "360° entrance view", hint: "Drag to look around the street and the clinic entrance" },
    ar: { map: "الخريطة", pano: "مدخل العيادة 360°", hint: "اسحب لتتجول في الشارع وترى مدخل العيادة" },
    ku: { map: "نەخشە", pano: "دەرگەهێ کلینیکێ 360°", hint: "ڕابکێشە دا شەقام و دەرگەهێ کلینیکێ ببینی" },
  }[language];

  // Exact clinic location (from the clinic's Google Maps listing)
  const mapDirectionsUrl = GOOGLE_DIRECTIONS_URL;
  const mapEmbedUrl = GOOGLE_MAP_EMBED_URL;

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-28 bg-background relative overflow-hidden">
      <div className="container px-4 sm:px-6">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 ${dir === "rtl" ? "" : ""}`}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={dir === "rtl" ? "text-right" : ""}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 ${dir === "rtl" ? "" : ""}`}>
              <MapPin className="w-4 h-4" />
              {t("contact.badge")}
            </span>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              {t("contact.title1")}{" "}
              <span className="text-gradient">{t("contact.title2")}</span>
            </h2>

            <p className="text-muted-foreground text-base md:text-lg mb-6 md:mb-8">
              {t("contact.description")}
            </p>

            {/* Contact Cards */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all ${dir === "rtl" ? "text-right" : ""}`}>
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 group-hover:bg-gradient-primary transition-colors flex-shrink-0">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm md:text-base">{t("contact.visitUs")}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t("contact.address")}</p>
                  <span className={`inline-flex items-center gap-1 text-primary text-xs md:text-sm mt-1 group-hover:underline ${dir === "rtl" ? "" : ""}`}>
                    <Navigation className="w-3 h-3" />
                    {t("contact.getDirections")}
                  </span>
                </div>
              </a>

              <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card border border-border/50 ${dir === "rtl" ? "text-right" : ""}`}>
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex-shrink-0">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm md:text-base">{t("contact.phone") || "Phone"}</p>
                  <div className="flex flex-col gap-1.5 mt-1">
                    {PHONES.map((n) => (
                      <div key={n.tel} className="flex items-center gap-2">
                        <a href={`tel:${n.tel}`} dir="ltr" className="text-primary text-sm font-semibold tabular-nums hover:underline">{n.shown}</a>
                        <a href={`https://wa.me/${n.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${n.shown}`}
                          className="inline-flex items-center gap-1 rounded-full bg-[#25D366] text-white text-xs font-semibold px-2 py-0.5 hover:bg-[#1ebe5b]">
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.04 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.04 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41"/></svg>
                          WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card border border-border/50 ${dir === "rtl" ? "text-right" : ""}`}>
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex-shrink-0">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm md:text-base">{t("contact.workingHours")}</p>
                  <p className="text-muted-foreground text-sm">{t("contact.workingHoursValue")}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
              <a href={GOOGLE_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="teal" size="lg" className="w-full gap-2 px-3 sm:px-6 text-sm sm:text-base whitespace-normal h-auto min-h-12 py-2.5 leading-tight text-center">
                  <Navigation className="w-5 h-5" />
                  {t("contact.getDirections")}
                </Button>
              </a>
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full gap-2 px-3 sm:px-6 text-sm sm:text-base whitespace-normal h-auto min-h-12 py-2.5 leading-tight text-center">
                  <MapPin className="w-5 h-5" />
                  {t("contact.openInMaps")}
                </Button>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full gap-2 px-3 sm:px-6 text-sm sm:text-base whitespace-normal h-auto min-h-12 py-2.5 leading-tight text-center">
                  <Instagram className="w-5 h-5" />
                  {t("contact.instagram")}
                </Button>
              </a>
              <a href="https://linktr.ee/saleem.andraws" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full gap-2 px-3 sm:px-6 text-sm sm:text-base whitespace-normal h-auto min-h-12 py-2.5 leading-tight text-center">
                  <ExternalLink className="w-5 h-5" />
                  {t("contact.socialMedia")}
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`relative ${dir === "rtl" ? "" : ""}`}
          >
            {/* Map / 360° entrance switch */}
            <div role="tablist" className="absolute top-3 inset-x-3 z-10 flex justify-center">
              <div className="inline-flex gap-1 p-1 rounded-full bg-card/95 backdrop-blur border border-border shadow-card">
                {(["map", "pano"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="tab"
                    aria-selected={view === v}
                    onClick={() => setView(v)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      view === v ? "bg-gradient-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {v === "map" ? <MapIcon className="w-4 h-4" /> : <Rotate3d className="w-4 h-4" />}
                    {VIEW_TEXT[v]}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-elevated h-full min-h-[340px] md:min-h-[420px] relative">
              {view === "pano" && (
                <>
                  <iframe
                    src={ENTRANCE_360_EMBED_URL}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "340px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Dr. Saleem Andraws Dental Clinic - 360° view of the entrance"
                    className="absolute inset-0 w-full h-full"
                  />
                  <p className="absolute top-16 inset-x-3 text-center pointer-events-none">
                    <span className="inline-block px-3 py-1 rounded-full bg-black/55 text-white text-xs">{VIEW_TEXT.hint}</span>
                  </p>
                </>
              )}
              <iframe
                hidden={view !== "map"}
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dr. Saleem Andraws Dental Clinic Location - Duhok"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Book appointment overlay */}
            <div className={`absolute bottom-3 md:bottom-4 ${dir === "rtl" ? "right-3 left-3 md:right-4 md:left-4" : "left-3 right-3 md:left-4 md:right-4"}`}>
              <div className={`p-3 md:p-4 rounded-xl bg-card/95 backdrop-blur-sm border border-border/50 shadow-card ${dir === "rtl" ? "text-right" : ""}`}>
                <p className="font-semibold mb-2 text-sm md:text-base">{t("contact.readyToVisit")}</p>
                <Button variant="teal" className="w-full" onClick={onBookingClick}>
                  {t("contact.bookYourAppointment")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
