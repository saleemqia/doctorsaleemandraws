import { useEffect, useRef, useState } from "react";
import { Link2, Sparkles, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import "./SiteLinks.css";

// Capture the address before language selection updates the URL.
const isRootEntry = window.location.pathname === "/" && !window.location.hash && !new URLSearchParams(window.location.search).has("previewDesign") && window.self === window.top;
const WELCOME_KEY = "saleem-links-welcome-shown";
const WELCOME_SECONDS = 15;

export default function SiteLinks() {
  const { language, dir } = useLanguage();
  const location = useLocation();
  const [welcome, setWelcome] = useState(() => {
    if (!isRootEntry) return false;
    try { return sessionStorage.getItem(WELCOME_KEY) !== "1"; } catch { return true; }
  });
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(WELCOME_SECONDS);
  const closeRef = useRef<HTMLButtonElement>(null);
  const allowed = !/^\/(clinic|admin|login|\.lovable)(\/|$)/.test(location.pathname);
  const text = {
    en: { links: "All links", title: "Dr. Saleem's links", open: "Go to the website", timer: "Website opens in", seconds: "seconds", paused: "Take your time browsing the links", close: "Close links introduction" },
    ar: { links: "كل الروابط", title: "روابط الدكتور سليم", open: "الدخول إلى الموقع", timer: "يفتح الموقع خلال", seconds: "ثانية", paused: "تصفح الروابط براحتك", close: "إغلاق الروابط والانتقال للموقع" },
    ku: { links: "هەمی لینک", title: "لینکێن د. سەلیم", open: "بچۆ ماڵپەڕێ", timer: "ماڵپەڕ دڤەبیت پشتی", seconds: "چرکە", paused: "لینکان ب ئارامی ببینە", close: "لینکان بگرە و بچۆ ماڵپەڕێ" },
  }[language];

  const close = () => { try { sessionStorage.setItem(WELCOME_KEY, "1"); } catch { /* storage is optional */ } setWelcome(false); };
  useEffect(() => {
    if (!welcome || !allowed) return;
    const page = document.getElementById("site-page");
    page?.setAttribute("inert", "");
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    const onMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.type === "saleem-links-interaction" && event.source === document.querySelector<HTMLIFrameElement>("#saleem-links-frame")?.contentWindow) setPaused(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("message", onMessage);
    return () => { page?.removeAttribute("inert"); window.removeEventListener("keydown", onKey); window.removeEventListener("message", onMessage); };
  }, [welcome, allowed]);
  useEffect(() => {
    if (!welcome || !loaded || paused || !allowed) return;
    const timer = window.setInterval(() => setSeconds(value => {
      if (value <= 1) { window.clearInterval(timer); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [welcome, loaded, paused, allowed]);
  useEffect(() => { if (welcome && loaded && seconds === 0) close(); }, [seconds, welcome, loaded]);
  if (!allowed) return null;
  return <>
    <a className={`saleem-links-button ${dir}`} href="/links/" aria-label={text.links} aria-hidden={welcome || undefined} tabIndex={welcome ? -1 : undefined}><Sparkles size={16} aria-hidden="true"/><Link2 size={19} aria-hidden="true"/><span>{text.links}</span></a>
    {welcome && <div className="saleem-links-welcome" role="dialog" aria-modal="true" aria-label={text.title} dir={dir}>
      <div className="saleem-links-welcome-bar"><div><strong>{text.title}</strong><small aria-live="polite">{paused ? text.paused : loaded ? `${text.timer} ${seconds} ${text.seconds}` : "…"}</small></div><button ref={closeRef} type="button" onClick={close} aria-label={text.close}><X size={18} aria-hidden="true"/> {text.open}</button></div>
      <iframe id="saleem-links-frame" title={text.title} src="/links/?intro=1" onLoad={() => setLoaded(true)} />
    </div>}
  </>;
}
