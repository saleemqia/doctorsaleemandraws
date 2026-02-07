import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, Sparkles, ZoomIn, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

// Import gallery images
import clinicInterior from "@/assets/gallery/clinic-interior.jpg";
import receptionArea from "@/assets/gallery/reception-area.jpg";
import implantResult from "@/assets/gallery/implant-result.jpg";
import dentalEquipment from "@/assets/gallery/dental-equipment.jpg";
import dentalCrowns from "@/assets/gallery/dental-crowns.jpg";
// Before/after images
import frontFilling from "@/assets/gallery/front-filling.jpeg";
import amalgamReplacement from "@/assets/gallery/amalgam-replacement.jpeg";
import smileMakeover1 from "@/assets/gallery/smile-makeover-1.png";
import perfectSmile from "@/assets/gallery/perfect-smile.png";
import hollywoodSmile from "@/assets/gallery/hollywood-smile.png";
import zirconEmax from "@/assets/gallery/zircon-emax.jpeg";
import smileTransformation1 from "@/assets/gallery/smile-transformation-1.jpeg";
import veneerCase from "@/assets/gallery/veneer-case.jpeg";
import fullRestoration from "@/assets/gallery/full-restoration.jpeg";
import beforeAfterComparison from "@/assets/gallery/before-after-comparison.jpeg";
// Educational images
import eduGumCleaning from "@/assets/gallery/edu-gum-cleaning.png";
import eduGingivitis from "@/assets/gallery/edu-gingivitis.png";
import eduKidsBrushing from "@/assets/gallery/edu-kids-brushing.png";
import eduCheckup from "@/assets/gallery/edu-checkup.png";
import eduPlaque from "@/assets/gallery/edu-plaque.png";
import eduPrevention from "@/assets/gallery/edu-prevention.png";
import eduModernCare from "@/assets/gallery/edu-modern-care.png";
import eduHealthyGums from "@/assets/gallery/edu-healthy-gums.png";

interface GalleryImage {
  src: string;
  titleKey: string;
  descKey: string;
  category: "clinic" | "results" | "educational";
}

const galleryImages: GalleryImage[] = [
  // Results - Before/After Images
  {
    src: smileMakeover1,
    titleKey: "gallery.smileMakeover",
    descKey: "gallery.smileMakeoverDesc",
    category: "results",
  },
  {
    src: fullRestoration,
    titleKey: "gallery.fullRestoration",
    descKey: "gallery.fullRestorationDesc",
    category: "results",
  },
  {
    src: zirconEmax,
    titleKey: "gallery.zirconEmax",
    descKey: "gallery.zirconEmaxDesc",
    category: "results",
  },
  {
    src: smileTransformation1,
    titleKey: "gallery.smileTransformation",
    descKey: "gallery.smileTransformationDesc",
    category: "results",
  },
  {
    src: veneerCase,
    titleKey: "gallery.veneerCase",
    descKey: "gallery.veneerCaseDesc",
    category: "results",
  },
  {
    src: beforeAfterComparison,
    titleKey: "gallery.beforeAfterComparison",
    descKey: "gallery.beforeAfterComparisonDesc",
    category: "results",
  },
  {
    src: frontFilling,
    titleKey: "gallery.frontFilling",
    descKey: "gallery.frontFillingDesc",
    category: "results",
  },
  {
    src: amalgamReplacement,
    titleKey: "gallery.amalgamReplacement",
    descKey: "gallery.amalgamReplacementDesc",
    category: "results",
  },
  {
    src: hollywoodSmile,
    titleKey: "gallery.hollywoodSmile",
    descKey: "gallery.hollywoodSmileDesc",
    category: "results",
  },
  {
    src: perfectSmile,
    titleKey: "gallery.perfectSmile",
    descKey: "gallery.perfectSmileDesc",
    category: "results",
  },
  {
    src: implantResult,
    titleKey: "gallery.implantResult",
    descKey: "gallery.implantResultDesc",
    category: "results",
  },
  {
    src: dentalCrowns,
    titleKey: "gallery.dentalCrowns",
    descKey: "gallery.dentalCrownsDesc",
    category: "results",
  },
  // Educational Images
  {
    src: eduGumCleaning,
    titleKey: "gallery.eduGumCleaning",
    descKey: "gallery.eduGumCleaningDesc",
    category: "educational",
  },
  {
    src: eduGingivitis,
    titleKey: "gallery.eduGingivitis",
    descKey: "gallery.eduGingivitisDesc",
    category: "educational",
  },
  {
    src: eduKidsBrushing,
    titleKey: "gallery.eduKidsBrushing",
    descKey: "gallery.eduKidsBrushingDesc",
    category: "educational",
  },
  {
    src: eduCheckup,
    titleKey: "gallery.eduCheckup",
    descKey: "gallery.eduCheckupDesc",
    category: "educational",
  },
  {
    src: eduPlaque,
    titleKey: "gallery.eduPlaque",
    descKey: "gallery.eduPlaqueDesc",
    category: "educational",
  },
  {
    src: eduPrevention,
    titleKey: "gallery.eduPrevention",
    descKey: "gallery.eduPreventionDesc",
    category: "educational",
  },
  {
    src: eduModernCare,
    titleKey: "gallery.eduModernCare",
    descKey: "gallery.eduModernCareDesc",
    category: "educational",
  },
  {
    src: eduHealthyGums,
    titleKey: "gallery.eduHealthyGums",
    descKey: "gallery.eduHealthyGumsDesc",
    category: "educational",
  },
  // Clinic Images
  {
    src: clinicInterior,
    titleKey: "gallery.clinicInterior",
    descKey: "gallery.clinicInteriorDesc",
    category: "clinic",
  },
  {
    src: receptionArea,
    titleKey: "gallery.receptionArea",
    descKey: "gallery.receptionAreaDesc",
    category: "clinic",
  },
  {
    src: dentalEquipment,
    titleKey: "gallery.dentalEquipment",
    descKey: "gallery.dentalEquipmentDesc",
    category: "clinic",
  },
];

const Gallery = () => {
  const { t, dir } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "clinic" | "results" | "educational">("all");

  const filteredImages = filter === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    
    const newIndex = direction === "next" 
      ? (selectedImage + 1) % filteredImages.length
      : (selectedImage - 1 + filteredImages.length) % filteredImages.length;
    
    setSelectedImage(newIndex);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "results":
        return <Sparkles className="w-3 h-3" />;
      case "educational":
        return <BookOpen className="w-3 h-3" />;
      default:
        return <Camera className="w-3 h-3" />;
    }
  };

  const getCategoryTag = (category: string) => {
    switch (category) {
      case "results":
        return t("gallery.resultsTag");
      case "educational":
        return t("gallery.educationalTag");
      default:
        return t("gallery.clinicTag");
    }
  };

  return (
    <section id="gallery" className="py-16 md:py-24 lg:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-10 md:mb-12 ${dir === "rtl" ? "text-right md:text-center" : ""}`}
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <Camera className="w-4 h-4" />
            {t("gallery.badge")}
          </motion.span>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            {t("gallery.title1")}{" "}
            <span className="text-gradient">{t("gallery.title2")}</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
            {t("gallery.description")}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
        >
          <Button
            variant={filter === "all" ? "teal" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-full transition-all duration-300 hover:scale-105 text-xs md:text-sm"
          >
            {t("gallery.filterAll")}
          </Button>
          <Button
            variant={filter === "results" ? "teal" : "outline"}
            size="sm"
            onClick={() => setFilter("results")}
            className={`rounded-full gap-1 md:gap-2 transition-all duration-300 hover:scale-105 text-xs md:text-sm ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            {t("gallery.filterResults")}
          </Button>
          <Button
            variant={filter === "educational" ? "teal" : "outline"}
            size="sm"
            onClick={() => setFilter("educational")}
            className={`rounded-full gap-1 md:gap-2 transition-all duration-300 hover:scale-105 text-xs md:text-sm ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
            {t("gallery.filterEducational")}
          </Button>
          <Button
            variant={filter === "clinic" ? "teal" : "outline"}
            size="sm"
            onClick={() => setFilter("clinic")}
            className={`rounded-full gap-1 md:gap-2 transition-all duration-300 hover:scale-105 text-xs md:text-sm ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <Camera className="w-3 h-3 md:w-4 md:h-4" />
            {t("gallery.filterClinic")}
          </Button>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                variants={itemVariants}
                layout
                className="group relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => openLightbox(index)}
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                
                {/* Card container */}
                <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden shadow-card group-hover:shadow-elevated transition-shadow duration-500">
                  <motion.img
                    src={image.src}
                    alt={t(image.titleKey)}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-500" />

                  {/* Content */}
                  <div className={`absolute bottom-0 left-0 right-0 p-2 md:p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${dir === "rtl" ? "text-right" : ""}`}>
                    <h3 className="text-white font-semibold text-xs md:text-lg mb-0.5 md:mb-1 opacity-90 group-hover:opacity-100 line-clamp-1">
                      {t(image.titleKey)}
                    </h3>
                    <p className="text-white/70 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 hidden md:block">
                      {t(image.descKey)}
                    </p>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 hidden md:block">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <motion.div 
                    className={`absolute top-2 md:top-3 ${dir === "rtl" ? "left-2 md:left-3" : "right-2 md:right-3"}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className={`inline-flex items-center gap-1 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium backdrop-blur-sm ${
                      image.category === "results" 
                        ? "bg-accent/80 text-accent-foreground" 
                        : image.category === "educational"
                        ? "bg-blue-500/80 text-white"
                        : "bg-primary/80 text-primary-foreground"
                    } ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      {getCategoryIcon(image.category)}
                      <span className="hidden sm:inline">{getCategoryTag(image.category)}</span>
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 z-10 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Navigation Buttons */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => { e.stopPropagation(); navigateImage("prev"); }}
              className={`absolute ${dir === "rtl" ? "right-4" : "left-4"} p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 z-10 hover:scale-110`}
            >
              <ChevronLeft className={`w-8 h-8 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => { e.stopPropagation(); navigateImage("next"); }}
              className={`absolute ${dir === "rtl" ? "left-4" : "right-4"} p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 z-10 hover:scale-110`}
            >
              <ChevronRight className={`w-8 h-8 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </motion.button>

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImage].src}
                alt={t(filteredImages[selectedImage].titleKey)}
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              
              {/* Image Caption */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-b-lg ${dir === "rtl" ? "text-right" : ""}`}
              >
                <h3 className="text-white font-semibold text-xl md:text-2xl mb-2">
                  {t(filteredImages[selectedImage].titleKey)}
                </h3>
                <p className="text-white/80 text-sm md:text-base">
                  {t(filteredImages[selectedImage].descKey)}
                </p>
              </motion.div>
            </motion.div>

            {/* Image Counter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium"
            >
              {selectedImage + 1} / {filteredImages.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
