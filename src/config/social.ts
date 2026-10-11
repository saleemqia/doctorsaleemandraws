// The clinic's social media, each with its own page on the site (/social/<slug>, also /ar and /ku)
// that shows the account inside the page. Plain data only, so the server can use it for titles too.

import type { L3 } from "./services";

const T = (en: string, ar: string, ku: string): L3 => ({ en, ar, ku });

export interface SocialInfo {
  slug: string;
  name: string;
  handle: string;
  url: string;
  color: string; // brand colour for the card
  embed: "instagram" | "facebook" | "tiktok" | "youtube" | "snapchat";
  id?: string; // YouTube video id / Snapchat user name
  videos?: string[]; // TikTok: ids of single videos to play on the page (the number at the end of a video link)
  text: L3;
}

export const SOCIALS: SocialInfo[] = [
  {
    slug: "instagram", name: "Instagram", handle: "@dr.saleemandraws", url: "https://www.instagram.com/dr.saleemandraws/", color: "#E1306C", embed: "instagram",
    text: T("Real cases from our clinic: before and after photos, smile makeovers and implant work.", "حالات حقيقية من عيادتنا: صور قبل وبعد، تجميل الابتسامة وأعمال الزراعة.", "حالەتێن ڕاستەقینە ژ کلینیکا مە: وێنەیێن بەری و پشتی، جوانکرنا بزەیێ و کارێن چاندنێ."),
  },
  {
    slug: "facebook", name: "Facebook", handle: "Diamond Dental Duhok", url: "https://www.facebook.com/doctor.saleem.diamond.dental.duhok", color: "#1877F2", embed: "facebook",
    text: T("News from the clinic, offers and dental tips on our Facebook page.", "أخبار العيادة والعروض ونصائح العناية بالأسنان على صفحتنا في فيسبوك.", "هەوالێن کلینیکێ، ئۆفەر و شیرەتێن ددانان ل سەر پەڕا مە یا فەیسبووکێ."),
  },
  {
    slug: "tiktok", name: "TikTok", handle: "@salandhana", url: "https://www.tiktok.com/@salandhana", color: "#111111", embed: "tiktok", videos: [],
    text: T("Short videos from Dr. Saleem.", "فيديوهات قصيرة من د. سليم.", "ڤیدیۆیێن کورت ژ د. سەلیم."),
  },
  {
    slug: "youtube", name: "YouTube", handle: "Dr. Saleem Andraws", url: "https://youtu.be/edq1-loT6As", color: "#FF0000", embed: "youtube", id: "edq1-loT6As",
    text: T("A video tour of the clinic's new location.", "فيديو عن موقع العيادة الجديد.", "ڤیدیۆیەک ل سەر جهێ نوی یێ کلینیکێ."),
  },
  {
    slug: "snapchat", name: "Snapchat", handle: "doctor.saleem", url: "https://www.snapchat.com/add/doctor.saleem", color: "#FFFC00", embed: "snapchat", id: "doctor.saleem",
    text: T("Add us on Snapchat: scan the Snapcode with the Snapchat app.", "أضفنا على سناب شات: امسح رمز السناب بتطبيق سناب شات.", "مە ل سناپچات زێدە بکە: سناپکۆدێ ب ئەپێ سناپچاتێ سکان بکە."),
  },
];

export const socialBySlug = (slug: string) => SOCIALS.find((s) => s.slug === slug);

// Other public links that open outside the site (no way to show them inside a page).
export const OTHER_LINKS: { name: string; handle: string; url: string }[] = [
  { name: "Telegram", handle: "@CHercules130", url: "https://t.me/CHercules130" },
  { name: "LinkedIn", handle: "Saleem Andraws Hana", url: "https://iq.linkedin.com/in/saleem-andraws-hana-71a71377" },
];

export const SOCIAL_INDEX = {
  name: T("Social media", "مواقع التواصل", "تۆڕێن جڤاکی"),
  title: T("Dr. Saleem Andraws Dental Clinic on Social Media | Duhok", "عيادة د. سليم أندراوس على مواقع التواصل | دهوك", "کلینیکا د. سەلیم ئەندراوس ل سەر تۆڕێن جڤاکی | دهوک"),
  description: T(
    "See our Instagram, Facebook, TikTok, YouTube and Snapchat inside the website: real cases, clinic news and dental tips from Dr. Saleem Andraws Dental Clinic in Duhok.",
    "شاهد إنستغرام وفيسبوك وتيك توك ويوتيوب وسناب شات داخل الموقع: حالات حقيقية وأخبار العيادة ونصائح الأسنان من عيادة د. سليم أندراوس في دهوك.",
    "ئینستاگرام، فەیسبووک، تیکتۆک، یووتیووب و سناپچاتا مە د ناڤ ماڵپەڕی دا ببینە: حالەتێن ڕاستەقینە، هەوالێن کلینیکێ و شیرەتێن ددانان ژ کلینیکا د. سەلیم ئەندراوس ل دهوکێ.",
  ),
};

export const socialTitle = (s: SocialInfo): L3 => T(
  `${s.name} – Dr. Saleem Andraws Dental Clinic, Duhok`,
  `${s.name} – عيادة د. سليم أندراوس، دهوك`,
  `${s.name} – کلینیکا د. سەلیم ئەندراوس، دهوک`,
);
