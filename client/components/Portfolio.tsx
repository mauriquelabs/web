import { useEffect, useState } from "react";
import { ArrowUpRight, Radio, Cpu } from "lucide-react";

interface PortfolioProps {
  language: "en" | "es";
  theme?: "dark" | "light";
}

export default function Portfolio({ language, theme = "dark" }: PortfolioProps) {
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
      { threshold: 0.1 },
    );

    const element = document.getElementById("portfolio");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const show = isVisible || reduceMotion;

  const content = {
    en: {
      sectionTitle: "What we've built",
      items: [
        {
          title: "Mind the Beat",
          description:
            "Helping artists, promoters and communities create purpose-driven electronic music experiences.",
          icon: Radio,
          link: "https://mindthebeat.live/",
          image:
            "linear-gradient(135deg, rgba(255, 87, 20, 0.25) 0%, rgba(43, 201, 163, 0.2) 100%)",
        },
        {
          title: "AI Sound Labs",
          description:
            "Bringing together music professionals and technology companies to explore the future of creativity.",
          icon: Cpu,
          link: "https://aisoundlabs.com/",
          image:
            "linear-gradient(135deg, rgba(43, 201, 163, 0.2) 0%, rgba(199, 185, 240, 0.2) 100%)",
        },
      ],
    },
    es: {
      sectionTitle: "Lo que hemos construido",
      items: [
        {
          title: "Mind the Beat",
          description:
            "Ayudamos a artistas, promotores y comunidades a crear experiencias de música electrónica con propósito.",
          icon: Radio,
          link: "https://mindthebeat.live/",
          image:
            "linear-gradient(135deg, rgba(255, 87, 20, 0.25) 0%, rgba(43, 201, 163, 0.2) 100%)",
        },
        {
          title: "AI Sound Labs",
          description:
            "Reunimos a profesionales de la música y empresas de tecnología para explorar el futuro de la creatividad.",
          icon: Cpu,
          link: "https://aisoundlabs.com/",
          image:
            "linear-gradient(135deg, rgba(43, 201, 163, 0.2) 0%, rgba(199, 185, 240, 0.2) 100%)",
        },
      ],
    },
  };

  const copy = content[language];

  return (
    <section
      id="portfolio"
      className={`section bg-background text-foreground ${theme === "light" ? "light" : ""}`}
    >
      <div className="section-container">
        <h2
          className={`mb-16 transition-opacity duration-300 ${
            show ? "opacity-100" : "opacity-0"
          }`}
        >
          {copy.sectionTitle}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {copy.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`card-base card-hover group transition-opacity duration-300 overflow-hidden relative ${
                  show ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transitionDelay:
                    show && !reduceMotion ? `${(index + 1) * 100}ms` : "0ms",
                }}
              >
                {/*
                  Gradient stands in for real product photography (see brand
                  design system rule: "missing assets" — replace with an
                  artist/promoter/product photo when available).
                */}
                <div
                  className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.16] transition-opacity"
                  style={{ background: item.image }}
                ></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-btn bg-accent2/10 mb-6">
                    <Icon className="w-6 h-6 text-accent2" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-accent2 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent2">
                    {item.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
