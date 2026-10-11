import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/config/seo";

interface NewsItem { title: string; link: string; source: string; kind: string; date: string; excerpt: string }

// Daily dentistry headlines from public news feeds (see functions/api/dental-news.ts). Headlines are in English;
// every card links to the original article. Loaded only when the section is near the screen.
const DentalNews = () => {
  const { t, language, dir } = useLanguage();
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<"all" | "clinic" | "research">("all");
  const [showAll, setShowAll] = useState(false);
  const box = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      fetch("/api/dental-news")
        .then((r) => r.json())
        .then((d: { ok: boolean; items: NewsItem[] }) => (d.ok ? setItems(d.items) : setFailed(true)))
        .catch(() => setFailed(true));
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const loc = language === "ar" ? "ar" : language === "ku" ? "ckb" : "en";
  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" }); } catch { return iso.slice(0, 10); }
  };
  const list = (items ?? []).filter((i) => filter === "all" || i.kind === filter);
  const shown = showAll ? list : list.slice(0, 6);
  const tabs: ["all" | "clinic" | "research", string][] = [["all", t("news.all")], ["clinic", t("news.clinic")], ["research", t("news.research")]];

  return (
    <section id="news" ref={box} className="py-16 md:py-24 bg-secondary/30" dir={dir}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Newspaper className="w-4 h-4" /> {t("news.badge")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {t("news.title1")} <span className="text-gradient">{t("news.title2")}</span>
          </h2>
          <p className="text-muted-foreground">{t("news.desc")}</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => { setFilter(k); setShowAll(false); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${filter === k ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground"}`}>
              {label}
            </button>
          ))}
        </div>

        {!items && !failed && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => <div key={i} className="h-40 rounded-2xl bg-card border border-border animate-pulse" />)}
          </div>
        )}
        {failed && <p className="text-center text-muted-foreground">{t("news.failed")}</p>}

        {items && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((n, idx) => (
              <a key={n.link} href={n.link} target="_blank" rel="noopener noreferrer" dir="ltr"
                className={`group flex flex-col rounded-2xl bg-card border border-border p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition text-left ${idx === 0 && filter === "all" ? "md:col-span-2 lg:col-span-3 border-primary/40" : ""}`}>
                <div className="flex items-center justify-between gap-2 text-xs mb-2">
                  <span className={`px-2.5 py-1 rounded-full font-semibold ${n.kind === "clinic" ? "bg-primary/10 text-primary" : "bg-accent/20 text-foreground"}`}>
                    {n.kind === "clinic" ? t("news.clinic") : t("news.research")} · {n.source}
                  </span>
                  <time dateTime={n.date} className="text-muted-foreground" dir={dir}>{fmt(n.date)}</time>
                </div>
                <h3 className={`font-display font-bold leading-snug mb-2 ${idx === 0 && filter === "all" ? "text-xl md:text-2xl" : "text-base"}`}>{n.title}</h3>
                {n.excerpt && <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{n.excerpt}</p>}
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary" dir={dir}>
                  {t("news.read")} <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>
            ))}
          </div>
        )}
        {items && window.location.pathname.replace(/^\/(ar|ku)/, "").replace(/\/+$/, "") !== "/news" && (
          <div className="text-center mt-6">
            <a href={pathFor(language, "/news")} className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold inline-block">{t("news.all_news")}</a>
          </div>
        )}
        {items && list.length > 6 && !showAll && (
          <div className="text-center mt-6">
            <button onClick={() => setShowAll(true)} className="px-6 py-2.5 rounded-full border border-primary text-primary font-semibold">{t("news.more")}</button>
          </div>
        )}
        <p className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto">{t("news.note")}</p>
      </div>
    </section>
  );
};

export default DentalNews;
