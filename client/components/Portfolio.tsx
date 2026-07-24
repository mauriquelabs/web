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
  href: string;
  host: string;
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

  const content: Record<"en" | "es", { sectionTitle: string; items: Product[] }> =
  {
    en: {
      sectionTitle: "What we've built",
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
          title: "AI Sound Labs",
          label: "Music × technology",
          description:
            "A space where music professionals and technology companies meet to explore how AI changes creative practice.",
          href: "https://aisoundlabs.com/",
          host: "aisoundlabs.com",
          accent: "teal",
        },
      ],
    },
    es: {
      sectionTitle: "Lo que hemos construido",
      items: [
        {
          title: "Mind the Beat",
          label: "Experiencias en vivo",
          description:
            "La plataforma que reúne a la nueva generación de experiencias de música electrónica con propósito. Descubre eventos, conecta con comunidades y ayuda a artistas y promotores a hacerlas crecer.",
          href: "https://mindthebeat.live/",
          host: "mindthebeat.live",
          accent: "orange",
        },
        {
          title: "AI Sound Labs",
          label: "Música × tecnología",
          description:
            "Un espacio donde profesionales de la música y empresas de tecnología exploran cómo la IA cambia la práctica creativa.",
          href: "https://aisoundlabs.com/",
          host: "aisoundlabs.com",
          accent: "teal",
        },
      ],
    },
  };

  const copy = content[language];

  return (
    <section
      id="portfolio"
      className={`section bg-background text-foreground ${theme === "light" ? "light" : ""
        }`}
    >
      <div className="section-container">
        <h2
          className={`mb-12 sm:mb-16 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"
            }`}
        >
          {copy.sectionTitle}
        </h2>

        <ul className="border-t border-border">
          {copy.items.map((item, index) => (
            <li
              key={item.title}
              className={`transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"
                }`}
              style={{
                transitionDelay:
                  show && !reduceMotion ? `${index * 120 + 80}ms` : "0ms",
              }}
            >
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block border-b border-border py-10 sm:py-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {/* Accent rule — encodes product character, not decoration */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100 group-focus-visible:scale-y-100 ${item.accent === "orange" ? "bg-brand-orange" : "bg-brand-teal"
                    }`}
                />

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-12 pl-0 group-hover:pl-4 group-focus-visible:pl-4 transition-[padding] duration-300">
                  <div className="min-w-0 max-w-2xl">
                    <p
                      className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${item.accent === "orange"
                        ? "text-brand-orange"
                        : "text-brand-teal"
                        }`}
                    >
                      {item.label}
                    </p>
                    <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base sm:text-lg text-foreground/65 leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-foreground/70 transition-colors duration-200 group-hover:text-accent2 sm:mt-10">
                    {item.host}
                    <ArrowUpRight
                      className={`h-4 w-4 transition-transform duration-200 ${reduceMotion
                        ? ""
                        : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        }`}
                    />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
