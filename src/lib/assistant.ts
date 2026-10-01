// The website's helper: matches a visitor's question to an answer the clinic has approved.
// Every answer comes from the site's own text (translations), so the bot never invents facts.
// To teach it a new topic: add an entry to TOPICS with words people type and the answer key.

export type AssistantAction = "book" | "whatsapp" | "call" | "directions";

export interface Topic {
  id: string;
  answerKey: string;
  keywords: string[];
  actions: AssistantAction[];
}

// Normalise spelling so "أسنان", "اسنان", "ئاسنان", "ددان"/"ددانا" and Kurdish written with an
// Arabic keyboard all match the same keywords.
export const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, "") // Arabic diacritics and tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىیێ]/g, "ي")
    .replace(/ک/g, "ك")
    .replace(/ە/g, "ه")
    .replace(/[ۆۊ]/g, "و")
    .replace(/[ڕ]/g, "ر")
    .replace(/[ڵ]/g, "ل")
    .replace(/چ/g, "ج")
    .replace(/ڤ/g, "ف")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export const TOPICS: Topic[] = [
  {
    id: "sameDay",
    answerKey: "faq.a14",
    keywords: ["same day", "same-day", "today", "tonight", "now", "urgent", "emergency", "pain", "hurt", "toothache", "swelling", "broken",
      "اليوم", "الان", "هسه", "طوارئ", "طارئ", "عاجل", "مستعجل", "الم", "وجع", "يوجع", "ينبض", "ورم", "انكسر", "مكسور",
      "ئەڤرو", "ئیرو", "نوکە", "ئێستا", "ئیش", "ژان", "دئێشیت", "بلەز", "شکەستی"],
    actions: ["call", "whatsapp", "book"],
  },
  {
    id: "prices",
    answerKey: "faq.a15",
    keywords: ["price", "cost", "how much", "fee", "cheap", "expensive", "dollar", "dinar",
      "سعر", "اسعار", "بكم", "كم سعر", "كم يكلف", "تكلفه", "تكلف", "كلفه", "غالي", "رخيص", "دولار", "دينار",
      "نرخ", "بها", "بهایێ", "پارە"],
    actions: ["whatsapp", "book"],
  },
  {
    id: "hours",
    answerKey: "chat.a.hours",
    keywords: ["hour", "time", "open", "close", "when", "friday", "schedule",
      "ساعات", "ساعه", "دوام", "متى", "مفتوح", "مغلق", "الجمعه", "وقت",
      "کات", "کاتی", "کاتێن", "دەم", "دەمێن کاری", "دەمژمێر", "ڤەکری", "گرتی", "ئینی", "کەنگی"],
    actions: ["book", "call"],
  },
  {
    id: "location",
    answerKey: "faq.a7",
    keywords: ["where", "address", "location", "map", "direction", "located", "street", "parking",
      "وين", "اين", "عنوان", "موقع", "مكان", "خريطه", "شارع", "قاضي محمد", "كراج",
      "شوێن", "ناڤنیشان", "کیرێ", "کیڤە", "نەخشە", "شەقام"],
    actions: ["directions", "call"],
  },
  {
    id: "booking",
    answerKey: "chat.a.booking",
    keywords: ["book", "appointment", "reserve", "reservation", "visit", "schedule a",
      "حجز", "احجز", "موعد", "مواعيد", "زياره",
      "نۆرە", "نوره", "ژڤان", "سەردان"],
    actions: ["book", "whatsapp", "call"],
  },
  {
    id: "contact",
    answerKey: "chat.a.contact",
    keywords: ["phone", "call", "number", "whatsapp", "contact", "email",
      "رقم", "هاتف", "تلفون", "اتصال", "اتصل", "واتساب", "واتس", "تواصل",
      "ژمارە", "تەلەفۆن", "پەیوەندی"],
    actions: ["call", "whatsapp"],
  },
  {
    id: "implants",
    answerKey: "faq.a8",
    keywords: ["implant", "missing tooth", "زراعه", "زرع", "زراعة", "سن مفقود", "جاندن", "چاندن"],
    actions: ["book", "whatsapp"],
  },
  {
    id: "veneers",
    answerKey: "faq.a9",
    keywords: ["veneer", "veener", "vener", "hollywood", "smile design", "makeover",
      "فينير", "هوليود", "ابتسامه", "تجميل", "سمايل", "ڤینیر", "بزە"],
    actions: ["book", "whatsapp"],
  },
  {
    id: "crowns",
    answerKey: "faq.a13",
    keywords: ["crown", "bridge", "denture", "zircon", "ceramic", "porcelain", "emax", "e-max", "cap",
      "كراس", "تاج", "تيجان", "جسر", "جسور", "طقم", "طخم", "زركون", "سيراميك", "ايماكس", "تەخم", "زیرکۆن"],
    actions: ["book", "whatsapp"],
  },
  {
    id: "whitening",
    answerKey: "faq.a10",
    keywords: ["whiten", "whitening", "bleach", "white teeth", "yellow", "تبييض", "ابيض", "اصفر", "سپیکرن", "سپی"],
    actions: ["book", "whatsapp"],
  },
  {
    id: "rootCanal",
    answerKey: "faq.a11",
    keywords: ["root canal", "nerve", "filling", "cavity", "cavities", "caries", "decay", "hole",
      "عصب", "حشو", "حشوه", "تسوس", "سوس", "نخر", "حەشو", "دەمار", "کڕم"],
    actions: ["book", "whatsapp"],
  },
  {
    id: "extraction",
    answerKey: "faq.a12",
    keywords: ["extract", "extraction", "pull", "remove tooth", "wisdom", "قلع", "خلع", "ضرس العقل", "هلكيشان", "هەلکێشان", "دەرێخستن"],
    actions: ["book", "call"],
  },
  {
    id: "braces",
    answerKey: "faq.a17",
    keywords: ["brace", "ortho", "align", "invisalign", "crooked", "straighten", "تقويم", "تقويم الاسنان", "ملتويه", "ڕێکخستن", "تقویم"],
    actions: ["book", "whatsapp"],
  },
  {
    id: "children",
    answerKey: "faq.a6",
    keywords: ["child", "children", "kid", "son", "daughter", "baby", "pediatric", "اطفال", "طفل", "ابني", "بنتي", "صغير", "زارۆک", "زاروک", "کوڕ", "کچ"],
    actions: ["book", "whatsapp"],
  },
  {
    id: "cleaning",
    answerKey: "faq.a16",
    keywords: ["clean", "scaling", "polish", "tartar", "plaque", "gum", "تنظيف", "تنضيف", "جير", "كلس", "لثه", "پاقژ", "پاک", "پوک"],
    actions: ["book", "whatsapp"],
  },
  {
    id: "walkIn",
    answerKey: "faq.a2",
    keywords: ["walk in", "walk-in", "without appointment", "no appointment", "بدون موعد", "بلا موعد", "بێ نۆرە", "بێ ژڤان"],
    actions: ["call", "book"],
  },
  {
    id: "services",
    answerKey: "chat.a.services",
    keywords: ["service", "treatment", "what do you", "offer", "خدمات", "خدمه", "علاج", "علاجات", "شنو تسوون", "خزمەت", "چارەسەری"],
    actions: ["book", "whatsapp"],
  },
  {
    id: "thanks",
    answerKey: "chat.a.thanks",
    keywords: ["thank", "thanks", "شكرا", "مشكور", "تسلم", "سوپاس", "سپاس", "دەستخۆش"],
    actions: [],
  },
  {
    id: "greeting",
    answerKey: "chat.welcome",
    keywords: ["hello", "hi", "hey", "salam", "مرحبا", "السلام", "سلام", "هلا", "اهلا", "سڵاو", "سلاو", "رۆژباش", "روژباش"],
    actions: [],
  },
];

const PRIORITY = new Set(["prices"]);

const NORMALIZED = TOPICS.map((topic) => ({ topic, words: topic.keywords.map(normalize) }));

// Pick the topic whose keywords best match the question. Longer keyword matches count more,
// so "root canal" beats "can". Returns null when nothing matches.
export const findTopic = (question: string): Topic | null => {
  const q = ` ${normalize(question)} `;
  let best: { topic: Topic; score: number } | null = null;
  for (const { topic, words } of NORMALIZED) {
    let score = 0;
    for (const w of words) {
      if (!w) continue;
      const short = w.length <= 3;
      const hit = short ? q.includes(` ${w} `) : q.includes(w);
      if (hit) score += w.length;
    }
    // A price question always gets the price answer, even when it names a treatment.
    if (score > 0 && PRIORITY.has(topic.id)) return topic;
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  return best?.topic ?? null;
};
