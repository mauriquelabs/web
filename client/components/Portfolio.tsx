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

    const element = document.getElementById("projects");
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
      sectionTitle: "Projects & Initiatives",
      intro:
        "Examples of our interests and approach: initiatives we explore and build in the communities and sectors we care about.",
      items: [
        {
          title: "Mind the Beat",
          label: "Live experiences",
          description:
            "Curated electronic music experiences connecting people through shared values and interests.",
          href: "https://mindthebeat.live/",
          host: "mindthebeat.live",
          accent: "orange",
        },
        {
          title: "Brew & Move",
          label: "Movement rewards",
          description:
            "A movement-powered rewards platform connecting active lifestyles with specialty coffee.",
          href: "https://brew-n-move.com/",
          host: "brew-n-move.com",
          accent: "teal",
        },
        {
          title: "AI Sound Labs",
          label: "Concept in development",
          description:
            "A creative innovation concept exploring AI, music and creative expression through experimental showcases and collaborative experiences.",
          accent: "orange",
        },
      ],
    },
    es: {
      sectionTitle: "Proyectos e iniciativas",
      intro:
        "Ejemplos de nuestros intereses y enfoque: iniciativas que exploramos y construimos en las comunidades y sectores que nos importan.",
      items: [
        {
          title: "Mind the Beat",
          label: "Experiencias en vivo",
          description:
            "Experiencias de música electrónica curadas que conectan a las personas a través de valores e intereses compartidos.",
          href: "https://mindthebeat.live/",
          host: "mindthebeat.live",
          accent: "orange",
        },
        {
          title: "Brew & Move",
          label: "Recompensas por moverte",
          description:
            "Una plataforma de recompensas impulsada por el movimiento que conecta estilos de vida activos con café de especialidad.",
          href: "https://brew-n-move.com/",
          host: "brew-n-move.com",
          accent: "teal",
        },
        {
          title: "AI Sound Labs",
          label: "Concepto en desarrollo",
          description:
            "Un concepto de innovación creativa que explora la IA, la música y la expresión creativa a través de showcases experimentales y experiencias colaborativas.",
          accent: "orange",
        },
      ],
    },
  };

  const copy = content[language];

  return (
    <section
      id="projects"
      className={`section max-md:py-14 bg-background text-foreground ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <div className="mb-10 sm:mb-16 max-w-2xl">
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
