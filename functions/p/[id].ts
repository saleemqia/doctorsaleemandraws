// Patient-card QR codes point here: https://www.doctorsaleem.com/p/DSA-P-00001
// The printed code never changes; where it leads is decided here, so the target can be
// changed later without reprinting cards. Today it opens a search for the patient number
// in the clinic's Google Drive account (authuser picks that account when several are signed in).
// Only works for someone signed in to that account.
// Nothing about the patient is stored or shown on the public website.

const CLINIC_GOOGLE_ACCOUNT = "duhokresearches@gmail.com";

export const onRequest: PagesFunction = ({ params }) => {
  const id = String(params.id || "").toUpperCase();
  if (!/^DSA-P-\d{5}$/.test(id)) {
    return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  const target = `https://drive.google.com/drive/search?q=${encodeURIComponent(id)}&authuser=${encodeURIComponent(CLINIC_GOOGLE_ACCOUNT)}`;
  return new Response(null, {
    status: 302,
    headers: { Location: target, "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
};
