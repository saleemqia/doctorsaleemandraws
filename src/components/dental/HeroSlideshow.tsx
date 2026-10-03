import { useEffect, useState } from "react";
import drSaleem from "@/assets/dr-saleem.jpg";
import drOffice from "@/assets/dr-saleem-office.webp";
import drConference from "@/assets/dr-saleem-conference.webp";

// Photos of the doctor in the hero, cross-fading every few seconds.
// To add a photo: put it in src/assets (portrait 4:5 works best) and add it here.
const SLIDES = [
  { src: drSaleem, pos: "37% center", alt: "Dr. Saleem Andraws, dentist in Duhok" },
  { src: drOffice, pos: "center", alt: "Dr. Saleem Andraws in his office at the clinic" },
  { src: drConference, pos: "center", alt: "Dr. Saleem Andraws at a dental conference and exhibition" },
];
const INTERVAL_MS = 4500;

const HeroSlideshow = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (still || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative aspect-[4/5] w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          aria-hidden={i !== index}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: s.pos }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2" dir="ltr">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`${i + 1} / ${SLIDES.length}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/90"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow;
