import { motion } from "framer-motion";
import { Calendar, Clock, User, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountUp } from "@/hooks/use-count-up";

const Appointments = () => {
  const { t, dir } = useLanguage();

  // Fake appointments data
  const appointments = [
    {
      id: 1,
      nameKey: "appointments.patient1",
      service: "services.teethWhitening",
      date: "2026-02-08",
      time: "15:30",
      status: "confirmed",
    },
    {
      id: 2,
      nameKey: "appointments.patient2",
      service: "services.dentalImplants",
      date: "2026-02-08",
      time: "16:00",
      status: "confirmed",
    },
    {
      id: 3,
      nameKey: "appointments.patient3",
      service: "services.cosmeticDentistry",
      date: "2026-02-09",
      time: "15:00",
      status: "confirmed",
    },
    {
      id: 4,
      nameKey: "appointments.patient4",
      service: "services.dentalCleaning",
      date: "2026-02-09",
      time: "17:30",
      status: "confirmed",
    },
    {
      id: 5,
      nameKey: "appointments.patient5",
      service: "services.orthodontics",
      date: "2026-02-10",
      time: "18:00",
      status: "pending",
    },
    {
      id: 6,
      nameKey: "appointments.patient6",
      service: "services.rootCanal",
      date: "2026-02-10",
      time: "19:00",
      status: "confirmed",
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-10 md:mb-12 ${dir === "rtl" ? "text-right md:text-center" : ""}`}
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Calendar className="w-4 h-4" />
            {t("appointments.badge")}
          </span>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            {t("appointments.title1")}{" "}
            <span className="text-gradient">{t("appointments.title2")}</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
            {t("appointments.description")}
          </p>
        </motion.div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className={`p-4 md:p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-300 ${dir === "rtl" ? "text-right" : ""}`}>
                {/* Header */}
                <div className={`flex items-center justify-between mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                      {t(appointment.nameKey).charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm md:text-base">{t(appointment.nameKey)}</p>
                      <p className="text-xs text-muted-foreground">{t(appointment.service)}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === "confirmed" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  } ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {appointment.status === "confirmed" ? t("appointments.confirmed") : t("appointments.pending")}
                  </div>
                </div>

                {/* Details */}
                <div className={`flex items-center gap-4 text-sm text-muted-foreground ${dir === "rtl" ? "flex-row-reverse justify-end" : ""}`}>
                  <div className={`flex items-center gap-1.5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Stats t={t} />
      </div>
    </section>
  );
};

const Stats = ({ t }: { t: (key: string) => string }) => {
  const appointments = useCountUp(150, 2000);
  const satisfaction = useCountUp(98, 2000);
  const patients = useCountUp(500, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-10 md:mt-12 grid grid-cols-3 gap-4"
    >
      <div className="text-center p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-300">
        <p className="text-2xl md:text-3xl font-bold text-primary" ref={appointments.ref as any}>{appointments.count}+</p>
        <p className="text-xs md:text-sm text-muted-foreground">{t("appointments.thisMonth")}</p>
      </div>
      <div className="text-center p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-300">
        <p className="text-2xl md:text-3xl font-bold text-primary" ref={satisfaction.ref as any}>{satisfaction.count}%</p>
        <p className="text-xs md:text-sm text-muted-foreground">{t("appointments.satisfaction")}</p>
      </div>
      <div className="text-center p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-300">
        <p className="text-2xl md:text-3xl font-bold text-primary" ref={patients.ref as any}>{patients.count}+</p>
        <p className="text-xs md:text-sm text-muted-foreground">{t("appointments.totalPatients")}</p>
      </div>
    </motion.div>
  );
};

export default Appointments;
