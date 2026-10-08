import { GRADUATION_YEAR } from "@/config/clinic";
import { useLanguage } from "@/contexts/LanguageContext";
import doctor from "@/assets/dr-saleem-office.webp";

const About = () => {
  const { t } = useLanguage();

  // Qualifications as a ledger: the figure first, what it means beside it.
  const facts = [
    { value: "M.Sc.", labelKey: "about.oralRadiology" },
    { value: "B.D.S.", labelKey: "about.univBaghdad" },
    { value: "500+", labelKey: "about.happyPatients" },
    { value: String(new Date().getFullYear() - GRADUATION_YEAR), labelKey: "about.yearsExperience" },
  ];
  const credentials = ["about.cred.bds", "about.cred.msc", "about.cred.years", "about.cred.syndicate", "about.cred.languages"];

  return (
    <section id="about" className="bg-[hsl(var(--ink))] py-16 text-[hsl(40_30%_96%)] md:py-24 lg:py-28">
      <div className="container">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="film mx-auto w-full max-w-md overflow-hidden rounded-[0.35rem] ring-1 ring-white/15 lg:sticky lg:top-28 lg:max-w-none">
            <img src={doctor} alt="Dr. Saleem Andraws in his office" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </div>

          <div>
            <p className="mb-4 flex items-center gap-3 text-sm font-medium text-[hsl(40_42%_70%)]">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              {t("about.badge")}
            </p>
            <h2 className="mb-6 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {t("about.title1")} {t("about.title2")}
            </h2>
            <p className="mb-5 max-w-2xl text-lg leading-relaxed text-[hsl(200_20%_84%)]">{t("about.description1")}</p>
            <p className="mb-10 max-w-2xl leading-relaxed text-[hsl(200_20%_76%)]">{t("about.description2")}</p>

            <dl className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.labelKey} className="bg-[hsl(var(--ink))] p-4">
                  <dt className="font-display text-3xl font-semibold text-[hsl(40_48%_66%)]">{f.value}</dt>
                  <dd className="mt-1 text-xs leading-snug text-[hsl(200_20%_76%)]">{t(f.labelKey)}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mb-3 text-lg font-semibold text-white">{t("about.credTitle")}</h3>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {credentials.map((key) => (
                <li key={key} className="py-3 text-[hsl(200_20%_86%)]">{t(key)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
