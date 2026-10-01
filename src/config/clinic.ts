// Single source of truth for the clinic's location and public profiles.
// Change these values here and every section of the site updates.

// Dr. Saleem graduated from the College of Dentistry, University of Baghdad, in 2007.
export const GRADUATION_YEAR = 2007;

export const CLINIC_LAT = 36.8681965;
export const CLINIC_LNG = 42.9613024;

// Official Google Maps listing (Google Business Profile)
export const GOOGLE_MAPS_URL = "https://maps.google.com/maps?cid=12832058961737231247";
export const GOOGLE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${CLINIC_LAT},${CLINIC_LNG}`;
export const GOOGLE_MAP_EMBED_URL = `https://www.google.com/maps?q=${CLINIC_LAT},${CLINIC_LNG}&z=17&output=embed`;
export const GOOGLE_WRITE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJHQVly9aNCEARjys3d6OhFLI";

export const INSTAGRAM_URL = "https://www.instagram.com/dr.saleemandraws/";
export const INSTAGRAM_HANDLE = "@dr.saleemandraws";

// LIVE INSTAGRAM FEED (Behold — https://behold.so)
// 1. Sign up at behold.so and connect the @dr.saleemandraws Instagram account.
// 2. Create a feed, and add doctorsaleem.com and www.doctorsaleem.com as allowed domains.
// 3. Paste the Feed ID between the quotes below. Leave it empty to show only the Follow button.
export const BEHOLD_FEED_ID = "";

export const WHATSAPP_NUMBER = "9647507816500";

// REAL PATIENT REVIEWS — copied word-for-word from the clinic's Google reviews.
// To add or change a review, edit this list. Do not reword a patient's text.
export type Review = { name: string; text: string; date: string };

export const REVIEWS: Review[] = [
  {
    name: "Rondik F.",
    date: "May 2025",
    text: "Perfect clinic and appointments, clean clinic and easy access and have its own garage for your car",
  },
  {
    name: "Shahzad B.",
    date: "July 2023",
    text: "تعامل الطبيب جيد جدا ويخصص وقت كثير ليستمع للمريض",
  },
  {
    name: "Iden H.",
    date: "June 2022",
    text: "The best Dental Clinic in Duhok!",
  },
  {
    name: "غزوان ق.",
    date: "June 2022",
    text: "من أمهر الأطباء في مدينة دهوك، تمنياتي للعزيز دكتور سليم كل التوفيق",
  },
  {
    name: "Ivanka H.",
    date: "June 2022",
    text: "عيادة ممتازة والتعامل بطريقة مهنية.",
  },
];
