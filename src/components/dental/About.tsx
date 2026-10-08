import { CheckCircle2 } from "lucide-react";
import { GRADUATION_YEAR } from "@/config/clinic";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountUp } from "@/hooks/use-count-up";
import doctor from "@/assets/dr-saleem-office.webp";

const About = () => {
  const { t } = useLanguage();
  const years = new Date().getFullYear() - GRADUATION_YEAR;
  const yearsCount = useCountUp(years, 1600);
  const patientsCount = useCountUp(500, 1800);

  // Qualifications as a ledger: the figure first, what it means beside it.
  const facts = [
    { value: "M.Sc.", labelKey: "about.oralRadiology", bg: "bg-[hsl(var(--sun))]" },
    { value: "B.D.S.", labelKey: "about.univBaghdad", bg: "bg-[hsl(var(--aqua)/0.85)]" },
    { value: `${patientsCount.count}+`, labelKey: "about.happyPatients", ref: patientsCount.ref, bg: "bg-[hsl(var(--coral)/0.85)]" },
    { value: String(yearsCount.count), labelKey: "about.yearsExperience", ref: yearsCount.ref, bg: "bg-[hsl(199_90%_82%)]" },
  ];
  const credentials = ["about.cred.bds", "about.cred.msc", "about.cred.years", "about.cred.syndicate", "about.cred.languages"];

  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-[hsl(199_77%_94%)] to-background py-16 md:py-24">
      <div className="container lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden="true" className="absolute inset-x-4 -bottom-3 top-4 -rotate-3 rounded-t-[999px] rounded-b-[2rem] bg-gradient-to-br from-[hsl(var(--sun))] to-[hsl(var(--coral))] opacity-80" />
            <img src={doctor} alt="Dr. Saleem Andraws in his office" loading="lazy" className="relative aspect-[4/5] w-full rounded-t-[999px] rounded-b-[2rem] border-4 border-white object-cover shadow-elevated" />
          </div>

          <div>
            <p className="mb-3 inline-flex rounded-full bg-white px-4 py-1 text-sm font-semibold text-primary shadow-sm">{t("about.badge")}</p>
            <h2 className="mb-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              {t("about.title1")} <span className="text-gradient">{t("about.title2")}</span>
            </h2>
            <p className="mb-4 max-w-2xl text-lg leading-relaxed text-foreground">{t("about.description1")}</p>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">{t("about.description2")}</p>

            <dl className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.labelKey} ref={f.ref as React.RefObject<HTMLDivElement> | undefined} className={`rounded-2xl p-4 text-[hsl(var(--ink))] transition-transform hover:-translate-y-1 ${f.bg}`}>
                  <dt className="font-display text-3xl font-semibold tabular-nums">{f.value}</dt>
                  <dd className="mt-1 text-xs font-medium leading-snug opacity-80">{t(f.labelKey)}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mb-3 text-lg font-semibold">{t("about.credTitle")}</h3>
            <ul className="grid gap-2">
              {credentials.map((key) => (
                <li key={key} className="flex items-start gap-3 rounded-xl bg-white px-4 py-2.5 text-foreground shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--aqua))]" />{t(key)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
