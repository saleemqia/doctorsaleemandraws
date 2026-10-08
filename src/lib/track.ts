// Anonymous click statistics: counts calls, WhatsApp messages, bookings, directions etc.
// Sends only the event name, where on the page it happened, language, device type and
// referring website. No cookies, nothing personal. Data goes to functions/api/track.ts.

type EventName =
  | "page_view" | "call" | "whatsapp" | "book_open" | "book_submit"
  | "directions" | "map" | "instagram" | "review" | "chat_open" | "chat_question" | "smile_preview";

const isLocal = () => /^(localhost|127\.|\[::1\])/.test(location.hostname);
const device = () => (window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop");
const lang = () => {
  const p = location.pathname;
  return p.startsWith("/ar") ? "ar" : p.startsWith("/ku") ? "ku" : document.documentElement.lang || "en";
};

const source = () => {
  const utm = new URLSearchParams(location.search).get("utm_source");
  if (utm) return utm;
  try {
    const ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
    if (!ref || ref.endsWith("doctorsaleem.com")) return "direct";
    return ref;
  } catch {
    return "direct";
  }
};

export const track = (event: EventName, place?: string) => {
  try {
    if (isLocal() || navigator.webdriver) return;
    const body = JSON.stringify({ event, place: place ?? null, lang: lang(), device: device(), source: source() });
    if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
      fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {
    /* statistics must never break the page */
  }
};

// Where on the page a click happened: the nearest element marked data-track, or the section id.
export const placeOf = (el: Element | null): string => {
  const marked = el?.closest("[data-track]");
  if (marked) return marked.getAttribute("data-track") || "unknown";
  const section = el?.closest("section[id], nav, footer, header");
  return section?.id || section?.tagName.toLowerCase() || "page";
};

// One listener for every link on the page, so new buttons are counted automatically.
export const startClickTracking = () => {
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.href;
      let event: EventName | null = null;
      if (href.startsWith("tel:")) event = "call";
      else if (/wa\.me|whatsapp\.com/.test(href)) event = "whatsapp";
      else if (/google\.[^/]+\/maps\/dir|maps\/dir/.test(href)) event = "directions";
      else if (/writereview|placeid=/.test(href)) event = "review";
      else if (/maps\.google|google\.[^/]+\/maps|goo\.gl\/maps/.test(href)) event = "map";
      else if (/instagram\.com/.test(href)) event = "instagram";
      if (event) track(event, placeOf(a));
    },
    { capture: true }
  );
};
