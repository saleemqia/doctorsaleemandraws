import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ExternalLink, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactProps {
  onBookingClick: () => void;
}

const Contact = ({ onBookingClick }: ContactProps) => {
  const { t, dir } = useLanguage();

  // Google Maps links - Dr. Saleem's actual clinic location
  const mapDirectionsUrl = "https://share.google/jfAOUXSkIEwwTg9fn";
  // Embed using search query for accurate business location
  const mapEmbedUrl = "https://maps.google.com/maps?q=Doctor+Saleem+Andraws+Dental+Clinic+Duhok&t=&z=17&ie=UTF8&iwloc=&output=embed";

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-28 bg-background relative overflow-hidden">
      <div className="container px-4 sm:px-6">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 ${dir === "rtl" ? "lg:grid-flow-dense" : ""}`}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={dir === "rtl" ? "lg:col-start-2 text-right" : ""}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
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
              <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}>
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 group-hover:bg-gradient-primary transition-colors flex-shrink-0">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm md:text-base">{t("contact.visitUs")}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t("contact.address")}</p>
                  <span className={`inline-flex items-center gap-1 text-primary text-xs md:text-sm mt-1 group-hover:underline ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <Navigation className="w-3 h-3" />
                    {t("contact.getDirections")}
                  </span>
                </div>
              </a>

              <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card border border-border/50 ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}>
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
            <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
              <a href="https://linktr.ee/saleem.andraws" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="teal" size="lg" className={`w-full gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
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
            className={`relative ${dir === "rtl" ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            <div className="rounded-2xl overflow-hidden shadow-elevated h-full min-h-[300px] md:min-h-[400px]">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dr. Saleem Andraws Dental Clinic Location - Duhok"
                className="md:min-h-[400px]"
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
