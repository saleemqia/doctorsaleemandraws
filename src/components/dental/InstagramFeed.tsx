import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Instagram as InstagramIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BEHOLD_FEED_ID, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/config/clinic";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "behold-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { "feed-id"?: string };
    }
  }
}

const BEHOLD_SCRIPT_SRC = "https://w.behold.so/widget.js";

// Loads the Behold widget script once, only when the section is about to be seen.
const useBeholdWidget = (enabled: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!visible) return;
    if (document.querySelector(`script[src="${BEHOLD_SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = BEHOLD_SCRIPT_SRC;
    document.head.appendChild(script);
  }, [visible]);

  return { ref, visible };
};

const InstagramFeed = () => {
  const { t } = useLanguage();
  const hasFeed = BEHOLD_FEED_ID.trim().length > 0;
  const { ref, visible } = useBeholdWidget(hasFeed);

  return (
    <section id="instagram" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <InstagramIcon className="w-4 h-4" />
            {t("instagram.badge")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("instagram.title1")} <span className="text-gradient">{t("instagram.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{t("instagram.description")}</p>
        </motion.div>

        {hasFeed && (
          <div ref={ref} className="min-h-[300px] mb-10" dir="ltr">
            {/* Behold's web component renders the live Instagram grid. */}
            {visible && <behold-widget feed-id={BEHOLD_FEED_ID}></behold-widget>}
          </div>
        )}

        <div className="flex justify-center">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="teal" size="lg" className="w-full gap-2">
              <InstagramIcon className="w-5 h-5" />
              <span>{t("instagram.follow")}</span>
              <bdi dir="ltr">{INSTAGRAM_HANDLE}</bdi>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
