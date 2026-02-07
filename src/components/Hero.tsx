import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />

      <div className="container relative z-10 flex flex-col items-center justify-center min-h-screen py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            Welcome to the future
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-center max-w-5xl leading-[1.1] tracking-tight"
        >
          Build amazing{" "}
          <span className="text-gradient">products</span>{" "}
          faster than ever
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground text-center max-w-2xl leading-relaxed"
        >
          The modern platform that empowers teams to create, iterate, and ship 
          exceptional digital experiences with unprecedented speed and quality.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button variant="hero" size="lg" className="group">
            Get started free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="heroOutline" size="lg">
            See how it works
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 grid grid-cols-3 gap-8 md:gap-16"
        >
          {[
            { value: "10K+", label: "Active users" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "50ms", label: "Avg response" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Floating feature cards */}
        <div className="absolute bottom-32 left-8 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="animate-float"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-xl shadow-card border border-border/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm">Lightning fast</div>
                <div className="text-xs text-muted-foreground">Built for speed</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-48 right-8 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="animate-float"
            style={{ animationDelay: "3s" }}
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-xl shadow-card border border-border/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-accent">
                <Shield className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm">Enterprise secure</div>
                <div className="text-xs text-muted-foreground">SOC 2 compliant</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;