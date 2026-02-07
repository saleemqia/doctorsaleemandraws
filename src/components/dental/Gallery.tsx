import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

// Import gallery images
import clinicInterior from "@/assets/gallery/clinic-interior.jpg";
import receptionArea from "@/assets/gallery/reception-area.jpg";
import implantResult from "@/assets/gallery/implant-result.jpg";
import dentalEquipment from "@/assets/gallery/dental-equipment.jpg";
import dentalCrowns from "@/assets/gallery/dental-crowns.jpg";

interface GalleryImage {
  src: string;
  titleKey: string;
  descKey: string;
  category: "clinic" | "results";
}

const galleryImages: GalleryImage[] = [
  {
    src: clinicInterior,
    titleKey: "gallery.clinicInterior",
    descKey: "gallery.clinicInteriorDesc",
    category: "clinic",
  },
  {
    src: implantResult,
    titleKey: "gallery.implantResult",
    descKey: "gallery.implantResultDesc",
    category: "results",
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
  {
    src: dentalCrowns,
    titleKey: "gallery.dentalCrowns",
    descKey: "gallery.dentalCrownsDesc",
    category: "results",
  },
];

const Gallery = () => {
  const { t, dir } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "clinic" | "results">("all");

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

  return (
    <section id="gallery" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-12 ${dir === "rtl" ? "text-right md:text-center" : ""}`}
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Camera className="w-4 h-4" />
            {t("gallery.badge")}
          </span>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("gallery.title1")}{" "}
            <span className="text-gradient">{t("gallery.title2")}</span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("gallery.description")}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`flex flex-wrap justify-center gap-3 mb-10 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
        >
          <Button
            variant={filter === "all" ? "teal" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-full"
          >
            {t("gallery.filterAll")}
          </Button>
          <Button
            variant={filter === "clinic" ? "teal" : "outline"}
            size="sm"
            onClick={() => setFilter("clinic")}
            className={`rounded-full gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <Camera className="w-4 h-4" />
            {t("gallery.filterClinic")}
          </Button>
          <Button
            variant={filter === "results" ? "teal" : "outline"}
            size="sm"
            onClick={() => setFilter("results")}
            className={`rounded-full gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <Sparkles className="w-4 h-4" />
            {t("gallery.filterResults")}
          </Button>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-card hover:shadow-elevated transition-all"
                onClick={() => openLightbox(filteredImages.indexOf(image))}
              >
                <img
                  src={image.src}
                  alt={t(image.titleKey)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute bottom-0 left-0 right-0 p-4 ${dir === "rtl" ? "text-right" : ""}`}>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {t(image.titleKey)}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {t(image.descKey)}
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <div className={`absolute top-3 ${dir === "rtl" ? "left-3" : "right-3"}`}>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    image.category === "results" 
                      ? "bg-accent/90 text-accent-foreground" 
                      : "bg-primary/90 text-primary-foreground"
                  } ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    {image.category === "results" ? (
                      <Sparkles className="w-3 h-3" />
                    ) : (
                      <Camera className="w-3 h-3" />
                    )}
                    {image.category === "results" ? t("gallery.resultsTag") : t("gallery.clinicTag")}
                  </span>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage("prev"); }}
              className={`absolute ${dir === "rtl" ? "right-4" : "left-4"} p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10`}
            >
              <ChevronLeft className={`w-8 h-8 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage("next"); }}
              className={`absolute ${dir === "rtl" ? "left-4" : "right-4"} p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10`}
            >
              <ChevronRight className={`w-8 h-8 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImage].src}
                alt={t(filteredImages[selectedImage].titleKey)}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Image Caption */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg ${dir === "rtl" ? "text-right" : ""}`}>
                <h3 className="text-white font-semibold text-xl mb-1">
                  {t(filteredImages[selectedImage].titleKey)}
                </h3>
                <p className="text-white/80 text-sm">
                  {t(filteredImages[selectedImage].descKey)}
                </p>
              </div>
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
              {selectedImage + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
