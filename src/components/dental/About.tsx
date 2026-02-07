import { motion } from "framer-motion";
import { Award, GraduationCap, Users, Heart } from "lucide-react";
import drSaleem from "@/assets/dr-saleem.jpg";

const achievements = [
  { icon: GraduationCap, value: "M.Sc.", label: "Oral Radiology" },
  { icon: Award, value: "B.D.S.", label: "University of Baghdad" },
  { icon: Users, value: "500+", label: "Happy Patients" },
  { icon: Heart, value: "15+", label: "Years Experience" },
];

const About = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={drSaleem}
                alt="Dr. Saleem Andraws"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-3xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              About Dr. Saleem
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Expert Dental Care You Can{" "}
              <span className="text-gradient">Trust</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Dr. Saleem Andraws is a highly qualified dental professional with over 15 years of 
              experience in providing exceptional dental care. With a Master's degree in Oral 
              Radiology and a Bachelor's degree from the prestigious University of Baghdad, 
              Dr. Saleem brings expertise and dedication to every patient.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              At our clinic in Duhok, we combine state-of-the-art technology with a warm, 
              patient-centered approach. Whether you need routine dental care or advanced 
              treatments, we're committed to helping you achieve and maintain a healthy, 
              beautiful smile.
            </p>

            {/* Achievements */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-secondary/50"
                >
                  <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-display font-bold text-xl text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;