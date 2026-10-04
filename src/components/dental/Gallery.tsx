import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, Sparkles, ZoomIn, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { INFOGRAPHICS } from "@/components/dental/Infographics";
import treatmentRoom from "@/assets/clinic/treatment-room.webp";
import receptionPhoto from "@/assets/clinic/reception.webp";
import waitingRoom from "@/assets/clinic/waiting-room.webp";
import doctorOffice from "@/assets/clinic/doctor-office.webp";
import entrancePhoto from "@/assets/clinic/entrance.webp";

// Import gallery images
import implantResult from "@/assets/gallery/implant-result.jpg";
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

type L = "en" | "ar" | "ku";

interface GalleryImage {
  src: string;
  full?: string; // bigger file for the full-size viewer, when src is a small thumbnail
  top?: boolean; // tall picture: show its top part in the grid
  titleKey?: string;
  descKey?: string;
  title?: Record<L, string>;
  desc?: Record<L, string>;
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
  // Educational: the infographics (full collection on /infographics)
  ...INFOGRAPHICS.map((i) => ({
    src: `/infographics/${i.name}-thumb.webp`,
    full: `/infographics/${i.name}.webp`,
    top: true,
    title: i.title,
    desc: { en: "Infographic", ar: "إنفوجرافيك توعوي", ku: "ئینفۆگرافیکا فێرکاری" },
    category: "educational" as const,
  })),
  // Clinic: real photos from inside the clinic
  ...[
    { src: treatmentRoom, title: { en: "Treatment room", ar: "غرفة العلاج", ku: "ژوورا چارەسەریێ" } },
    { src: receptionPhoto, title: { en: "Reception", ar: "الاستقبال", ku: "پێشوازی" } },
    { src: waitingRoom, title: { en: "Waiting room", ar: "غرفة الانتظار", ku: "ژوورا چاڤەڕێبوونێ" } },
    { src: doctorOffice, title: { en: "Doctor's office", ar: "غرفة الطبيب", ku: "ژوورا دکتۆری" } },
    { src: entrancePhoto, title: { en: "Clinic entrance", ar: "مدخل العيادة", ku: "دەرگەهێ کلینیکێ" } },
  ].map((c) => ({
    ...c,
    desc: { en: "Inside our clinic in Duhok", ar: "من داخل عيادتنا في دهوك", ku: "ژ ناڤ کلینیکا مە ل دهوکێ" },
    category: "clinic" as const,
  })),
];

const Gallery = () => {
  const { t, dir, language } = useLanguage();
  const titleOf = (img: GalleryImage) => (img.title ? img.title[language as L] : t(img.titleKey ?? ""));
  const descOf = (img: GalleryImage) => (img.desc ? img.desc[language as L] : t(img.descKey ?? ""));
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "clinic" | "results" | "educational">("all");
  const [showAll, setShowAll] = useState(false);
  const PREVIEW_COUNT = 8;

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
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 ${dir === "rtl" ? "" : ""}`}
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
          className={`flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10 ${dir === "rtl" ? "" : ""}`}
        >
          <Button
            variant={filter === "all" ? "teal" : "outline"}
            size="sm"
            onClick={() => { setFilter("all"); setShowAll(false); }}
            className="rounded-full transition-all duration-300 hover:scale-105 text-xs md:text-sm"
          >
            {t("gallery.filterAll")}
          </Button>
          <Button
            variant={filter === "results" ? "teal" : "outline"}
            size="sm"
            onClick={() => { setFilter("results"); setShowAll(false); }}
            className={`rounded-full gap-1 md:gap-2 transition-all duration-300 hover:scale-105 text-xs md:text-sm ${dir === "rtl" ? "" : ""}`}
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            {t("gallery.filterResults")}
          </Button>
          <Button
            variant={filter === "educational" ? "teal" : "outline"}
            size="sm"
            onClick={() => { setFilter("educational"); setShowAll(false); }}
            className={`rounded-full gap-1 md:gap-2 transition-all duration-300 hover:scale-105 text-xs md:text-sm ${dir === "rtl" ? "" : ""}`}
          >
            <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
            {t("gallery.filterEducational")}
          </Button>
          <Button
            variant={filter === "clinic" ? "teal" : "outline"}
            size="sm"
            onClick={() => { setFilter("clinic"); setShowAll(false); }}
            className={`rounded-full gap-1 md:gap-2 transition-all duration-300 hover:scale-105 text-xs md:text-sm ${dir === "rtl" ? "" : ""}`}
          >
            <Camera className="w-3 h-3 md:w-4 md:h-4" />
            {t("gallery.filterClinic")}
          </Button>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {(showAll ? filteredImages : filteredImages.slice(0, PREVIEW_COUNT)).map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.05 }}
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
                    alt={titleOf(image)}
                    className={`w-full h-full object-cover ${image.top ? "object-top" : ""}`}
                    loading="lazy"
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-500" />

                  {/* Content */}
                  <div className={`absolute bottom-0 left-0 right-0 p-2 md:p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${dir === "rtl" ? "text-right" : ""}`}>
                    <h3 className="text-white font-semibold text-xs md:text-lg mb-0.5 md:mb-1 opacity-90 group-hover:opacity-100 line-clamp-1">
                      {titleOf(image)}
                    </h3>
                    <p className="text-white/70 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 hidden md:block">
                      {descOf(image)}
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
                    } ${dir === "rtl" ? "" : ""}`}>
                      {getCategoryIcon(image.category)}
                      <span className="hidden sm:inline">{getCategoryTag(image.category)}</span>
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Show a short preview first so the page stays short on phones */}
        {filteredImages.length > PREVIEW_COUNT && (
          <div className="flex justify-center mt-6 md:mt-8">
            <Button variant="outline" size="lg" onClick={() => setShowAll((v) => !v)} className="min-w-[200px]">
              {showAll ? t("gallery.showLess") : `${t("gallery.showAll")} (${filteredImages.length})`}
            </Button>
          </div>
        )}
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
                src={filteredImages[selectedImage].full ?? filteredImages[selectedImage].src}
                alt={titleOf(filteredImages[selectedImage])}
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
                  {titleOf(filteredImages[selectedImage])}
                </h3>
                <p className="text-white/80 text-sm md:text-base">
                  {descOf(filteredImages[selectedImage])}
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
