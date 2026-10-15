import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface PortfolioProps {
  language: "en" | "es";
  theme?: "dark" | "light";
}

type Product = {
  title: string;
  label: string;
  description: string;
  href?: string;
  host?: string;
  /** Brand accent for the row rule — teal or orange only, one per product */
  accent: "teal" | "orange";
};

export default function Portfolio({
  language,
  theme = "dark",
}: PortfolioProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12 },
    );

    const element = document.getElementById("portfolio");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const show = isVisible || reduceMotion;

  const content: Record<
    "en" | "es",
    { sectionTitle: string; intro: string; items: Product[] }
  > = {
    en: {
      sectionTitle: "Our portfolio",
      intro:
        "We also build products of our own — platforms and experiences that grow from the same communities and experiments.",
      items: [
        {
          title: "Mind the Beat",
          label: "Live experiences",
          description:
            "The platform for discovering, creating and growing communities around purpose-driven electronic music experiences.",
          href: "https://mindthebeat.live/",
          host: "mindthebeat.live",
          accent: "orange",
        },
        {
          title: "Brew & Move",
          label: "Community experiences",
          description:
            "A gathering place where specialty coffee and movement meet — helping people connect, reset and build habits together.",
          accent: "teal",
        },
      ],
    },
    es: {
      sectionTitle: "Nuestro portfolio",
      intro:
        "También construimos productos propios: plataformas y experiencias que crecen desde las mismas comunidades y experimentos.",
      items: [
        {
          title: "Mind the Beat",
          label: "Experiencias en vivo",
          description:
            "La plataforma para descubrir, crear y hacer crecer comunidades en torno a experiencias de música electrónica con propósito.",
          href: "https://mindthebeat.live/",
          host: "mindthebeat.live",
          accent: "orange",
        },
        {
          title: "Brew & Move",
          label: "Experiencias de comunidad",
          description:
            "Un punto de encuentro donde el café de especialidad y el movimiento se cruzan: conectar, resetear y construir hábitos juntos.",
          accent: "teal",
        },
      ],
    },
  };

  const copy = content[language];

  return (
    <section
      id="portfolio"
      className={`section bg-background text-foreground ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <div className="mb-12 sm:mb-16 max-w-2xl">
          <h2
            className={`mb-4 transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
          >
            {copy.sectionTitle}
          </h2>
          <p
            className={`text-lg text-foreground/65 leading-relaxed transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDelay: show && !reduceMotion ? "60ms" : "0ms",
            }}
          >
            {copy.intro}
          </p>
        </div>

        <ul className="border-t border-border">
          {copy.items.map((item, index) => {
            const inner = (
              <>
                {/* Accent rule — encodes product character, not decoration */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100 group-focus-visible:scale-y-100 ${
                    item.accent === "orange"
                      ? "bg-brand-orange"
                      : "bg-brand-teal"
                  }`}
                />

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-12 pl-0 group-hover:pl-4 group-focus-visible:pl-4 transition-[padding] duration-300">
                  <div className="min-w-0 max-w-2xl">
                    <p
                      className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                        item.accent === "orange"
                          ? "text-brand-orange"
                          : "text-brand-teal"
                      }`}
                    >
                      {item.label}
                    </p>
                    <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base sm:text-lg text-foreground/65 leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>

                  {item.host && (
                    <span className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-foreground/70 transition-colors duration-200 group-hover:text-accent2 sm:mt-10">
                      {item.host}
                      <ArrowUpRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          reduceMotion
                            ? ""
                            : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        }`}
                      />
                    </span>
                  )}
                </div>
              </>
            );

            return (
              <li
                key={item.title}
                className={`transition-opacity duration-300 ${
                  show ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transitionDelay:
                    show && !reduceMotion ? `${index * 120 + 80}ms` : "0ms",
                }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block border-b border-border py-10 sm:py-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group relative block border-b border-border py-10 sm:py-12">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
