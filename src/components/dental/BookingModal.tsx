import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Calendar, Clock, User, Phone, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const timeSlots = [
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
  "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const { t, dir } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const services = [
    t("services.teethWhitening"),
    t("services.dentalImplants"),
    t("services.cosmeticDentistry"),
    t("services.rootCanal"),
    t("services.orthodontics"),
    t("services.oralRadiology"),
    t("services.dentalCleaning"),
    t("services.pediatricDentistry"),
    t("booking.generalCheckup"),
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase.from("appointments").insert({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        preferred_date: formData.date,
        preferred_time: formData.time,
        notes: formData.notes?.trim() || null,
      });

      if (error) throw error;

      // Create WhatsApp message
      const message = `Hello Dr. Saleem! I'd like to book an appointment.

Name: ${formData.name}
Phone: ${formData.phone}
Service: ${formData.service}
Date: ${formData.date}
Time: ${formData.time}
${formData.notes ? `Notes: ${formData.notes}` : ""}

Thank you!`;

      const whatsappUrl = `https://wa.me/9647507816500?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      toast.success(t("booking.success") || "Appointment booked successfully!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(t("booking.error") || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
      onClose();
      setStep(1);
      setFormData({ name: "", phone: "", service: "", date: "", time: "", notes: "" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card rounded-2xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-primary p-6 text-white">
              <div className={`flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <div className={dir === "rtl" ? "text-right" : ""}>
                  <h2 className="font-display text-2xl font-bold">{t("booking.title")}</h2>
                  <p className="text-white/80 text-sm mt-1">{t("booking.subtitle")}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress */}
              <div className={`flex gap-2 mt-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      s <= step ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <User className="w-4 h-4 text-primary" />
                      {t("booking.fullName")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      dir={dir}
                      className={`w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${dir === "rtl" ? "text-right" : ""}`}
                      placeholder={t("booking.fullNamePlaceholder")}
                    />
                  </div>

                  <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <Phone className="w-4 h-4 text-primary" />
                      {t("booking.phone")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${dir === "rtl" ? "text-right" : ""}`}
                      placeholder={t("booking.phonePlaceholder")}
                    />
                  </div>

                  <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <FileText className="w-4 h-4 text-primary" />
                      {t("booking.service")}
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                      dir={dir}
                      className={`w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${dir === "rtl" ? "text-right" : ""}`}
                    >
                      <option value="">{t("booking.selectService")}</option>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="button"
                    variant="teal"
                    className="w-full mt-4"
                    onClick={() => setStep(2)}
                    disabled={!formData.name || !formData.phone || !formData.service}
                  >
                    {t("booking.continue")}
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <Calendar className="w-4 h-4 text-primary" />
                      {t("booking.preferredDate")}
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${dir === "rtl" ? "text-right" : ""}`}
                    />
                    <p className={`text-xs text-muted-foreground mt-1 ${dir === "rtl" ? "text-right" : ""}`}>{t("booking.dateNote")}</p>
                  </div>

                  <div>
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <Clock className="w-4 h-4 text-primary" />
                      {t("booking.preferredTime")}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({ ...formData, time })}
                          className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                            formData.time === time
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`text-sm font-medium mb-2 block ${dir === "rtl" ? "text-right" : ""}`}>{t("booking.additionalNotes")}</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      dir={dir}
                      className={`w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${dir === "rtl" ? "text-right" : ""}`}
                      placeholder={t("booking.notesPlaceholder")}
                    />
                  </div>

                  <div className={`flex gap-3 mt-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      {t("booking.back")}
                    </Button>
                    <Button
                      type="submit"
                      variant="whatsapp"
                      className="flex-1"
                      disabled={!formData.date || !formData.time || isSubmitting}
                    >
                      {isSubmitting ? (t("booking.submitting") || "Submitting...") : t("booking.bookViaWhatsapp")}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;