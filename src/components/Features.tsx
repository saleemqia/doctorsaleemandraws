import { motion } from "framer-motion";
import { Layers, Rocket, Code2, Palette, Lock, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Component Library",
    description: "Pre-built, customizable components that accelerate your development workflow.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Rocket,
    title: "Instant Deploy",
    description: "Ship to production in seconds with our optimized build pipeline.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Code2,
    title: "Developer First",
    description: "TypeScript native with full IDE support and type safety throughout.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Design System",
    description: "Beautiful, consistent UI with dark mode support out of the box.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance certifications included.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Built-in",
    description: "Understand your users with comprehensive, privacy-first analytics.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const Features = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="text-gradient">succeed</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Powerful features designed to help you build, deploy, and scale your applications 
            with confidence and ease.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full p-6 md:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;