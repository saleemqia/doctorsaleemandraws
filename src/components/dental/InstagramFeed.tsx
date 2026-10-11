import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Instagram as InstagramIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/config/seo";
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
  const { t, language } = useLanguage();
  const hasFeed = BEHOLD_FEED_ID.trim().length > 0;
  const { ref, visible } = useBeholdWidget(true);
  const user = INSTAGRAM_URL.replace(/\/+$/, "").split("/").pop();
  const MORE = { en: "All our social media", ar: "كل حساباتنا على مواقع التواصل", ku: "هەمی تۆڕێن مە یێن جڤاکی" };

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

        <div ref={ref} className="min-h-[300px] mb-10" dir="ltr">
          {/* Behold's web component renders the live Instagram grid; without it, Instagram's own profile embed is shown. */}
          {visible && (hasFeed ? <behold-widget feed-id={BEHOLD_FEED_ID}></behold-widget>
            : <iframe title={`Instagram ${INSTAGRAM_HANDLE}`} src={`https://www.instagram.com/${user}/embed/`} loading="lazy" className="mx-auto block w-full rounded-2xl border border-border bg-white" style={{ maxWidth: 540, height: 720 }} />)}
        </div>

        <div className="flex justify-center">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="teal" size="lg" className="w-full gap-2">
              <InstagramIcon className="w-5 h-5" />
              <span>{t("instagram.follow")}</span>
              <bdi dir="ltr">{INSTAGRAM_HANDLE}</bdi>
            </Button>
          </a>
        </div>
        <p className="mt-4 text-center"><a href={pathFor(language, "/social")} className="font-semibold text-primary hover:underline">{MORE[language]}</a></p>
      </div>
    </section>
  );
};

export default InstagramFeed;
