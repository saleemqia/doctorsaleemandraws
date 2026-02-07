import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, ExternalLink, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactProps {
  onBookingClick: () => void;
}

const Contact = ({ onBookingClick }: ContactProps) => {
  const { t, dir } = useLanguage();

  // Google Maps location for Duhok, Iraq - Sherko Nuts area
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3219.5!2d42.9881!3d36.8670!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40086e6e41c5c8ed%3A0x1!2sDuhok%2C%20Kurdistan%20Region%2C%20Iraq!5e0!3m2!1sen!2s!4v1699000000000!5m2!1sen!2s";
  const mapDirectionsUrl = "https://www.google.com/maps/search/Dr.+Saleem+Andraws+Dental+Clinic+Duhok+KRO+Sherko+Nuts/@36.867,42.988,15z";

  return (
    <section id="contact" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 ${dir === "rtl" ? "lg:grid-flow-dense" : ""}`}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={dir === "rtl" ? "lg:col-start-2 text-right" : ""}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <MapPin className="w-4 h-4" />
              {t("contact.badge")}
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t("contact.title1")}{" "}
              <span className="text-gradient">{t("contact.title2")}</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-8">
              {t("contact.description")}
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mb-8">
              <a href="tel:07507816500" className={`group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-gradient-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold">{t("contact.callUs")}</p>
                  <p className="text-muted-foreground">07507816500</p>
                </div>
              </a>

              <a href="mailto:dr.saleemo@gmail.com" className={`group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-gradient-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold">{t("contact.emailUs")}</p>
                  <p className="text-muted-foreground">dr.saleemo@gmail.com</p>
                </div>
              </a>

              <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-gradient-primary transition-colors">
                  <MapPin className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold">{t("contact.visitUs")}</p>
                  <p className="text-muted-foreground">{t("contact.address")}</p>
                </div>
              </a>

              <div className={`flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{t("contact.workingHours")}</p>
                  <p className="text-muted-foreground">{t("contact.workingHoursValue")}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
              <a href="https://wa.me/9647507816500" target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg" className={`w-full sm:w-auto gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <MessageCircle className="w-5 h-5" />
                  {t("contact.whatsapp")}
                </Button>
              </a>
              <a href="https://linktr.ee/saleem.andraws" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className={`w-full sm:w-auto gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
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
            <div className="rounded-2xl overflow-hidden shadow-elevated h-full min-h-[400px]">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dr. Saleem Andraws Dental Clinic Location - Duhok"
              />
            </div>

            {/* Book appointment overlay */}
            <div className={`absolute bottom-4 ${dir === "rtl" ? "right-4 left-4" : "left-4 right-4"}`}>
              <div className={`p-4 rounded-xl bg-card/95 backdrop-blur-sm border border-border/50 shadow-card ${dir === "rtl" ? "text-right" : ""}`}>
                <p className="font-semibold mb-2">{t("contact.readyToVisit")}</p>
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