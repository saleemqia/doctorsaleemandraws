import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const services = [
  {
    icon: "🦷",
    title: "Teeth Whitening",
    description: "Professional whitening treatments for a brighter, more confident smile.",
    price: "Starting from $150",
  },
  {
    icon: "🔧",
    title: "Dental Implants",
    description: "Permanent tooth replacement solutions that look and feel natural.",
    price: "Starting from $800",
  },
  {
    icon: "✨",
    title: "Cosmetic Dentistry",
    description: "Veneers, bonding, and smile makeovers for aesthetic perfection.",
    price: "Starting from $300",
  },
  {
    icon: "🛡️",
    title: "Root Canal Treatment",
    description: "Pain-free root canal therapy to save and restore damaged teeth.",
    price: "Starting from $250",
  },
  {
    icon: "📐",
    title: "Orthodontics",
    description: "Braces and aligners for perfectly aligned teeth and improved bite.",
    price: "Starting from $1000",
  },
  {
    icon: "🔬",
    title: "Oral Radiology",
    description: "Advanced digital X-rays and imaging for accurate diagnosis.",
    price: "Starting from $50",
  },
  {
    icon: "🧹",
    title: "Dental Cleaning",
    description: "Professional cleaning and scaling for optimal oral hygiene.",
    price: "Starting from $75",
  },
  {
    icon: "👶",
    title: "Pediatric Dentistry",
    description: "Gentle and caring dental treatments for children of all ages.",
    price: "Starting from $50",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Comprehensive Dental{" "}
            <span className="text-gradient">Care</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We offer a wide range of dental services using the latest technology 
            and techniques to ensure your comfort and satisfaction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-300">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                <p className="text-primary font-semibold text-sm">
                  {service.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;