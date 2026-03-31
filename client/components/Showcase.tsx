import { useEffect, useState } from "react";
import { Music, Zap, Sparkles } from "lucide-react";

interface ShowcaseProps {
  language: "en" | "es";
}

export default function Showcase({ language }: ShowcaseProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("showcase");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: [
      {
        title: "Bejaus Sessions",
        description:
          "Live music sessions showcasing emerging artists at the intersection of culture and community. The live laboratory where Maurique Labs tests formats and builds real audiences.",
        icon: Music,
        link: "https://www.youtube.com/@bejaussessions",
        image:
          "linear-gradient(135deg, rgba(255, 87, 20, 0.25) 0%, rgba(43, 201, 163, 0.2) 100%)",
      },
      {
        title: "Moonamour x Bejaus",
        description:
          "Collaborative experiences bringing together music, visual art, and community storytelling — a showcase of what the digital + events integration looks like in practice.",
        icon: Zap,
        link: "https://www.youtube.com/channel/UCdil_RtSsa7P9Il6hMU4-eA",
        image:
          "linear-gradient(135deg, rgba(43, 201, 163, 0.2) 0%, rgba(185, 240, 31, 0.15) 100%)",
      },
      {
        title: "Upcoming Projects",
        description:
          "New collaborations in the works — blending digital presence, brand activations, and cultural experiences for creators and businesses in Barcelona.",
        icon: Sparkles,
        link: "#collaborate",
        image:
          "linear-gradient(135deg, rgba(199, 185, 240, 0.15) 0%, rgba(255, 87, 20, 0.15) 100%)",
      },
    ],
    es: [
      {
        title: "Bejaus Sessions",
        description:
          "Sesiones de música en vivo que muestran artistas emergentes en la intersección de la cultura y la comunidad. El laboratorio en vivo donde Maurique Labs prueba formatos y construye audiencias reales.",
        icon: Music,
        link: "https://www.youtube.com/@bejaussessions",
        image:
          "linear-gradient(135deg, rgba(255, 87, 20, 0.25) 0%, rgba(43, 201, 163, 0.2) 100%)",
      },
      {
        title: "Moonamour x Bejaus",
        description:
          "Experiencias colaborativas que reúnen música, arte visual y narrativa comunitaria — una muestra de cómo se ve la integración digital + eventos en la práctica.",
        icon: Zap,
        link: "https://www.youtube.com/channel/UCdil_RtSsa7P9Il6hMU4-eA",
        image:
          "linear-gradient(135deg, rgba(43, 201, 163, 0.2) 0%, rgba(185, 240, 31, 0.15) 100%)",
      },
      {
        title: "Proyectos en Curso",
        description:
          "Nuevas colaboraciones en marcha — combinando presencia digital, activaciones de marca y experiencias culturales para creadores y empresas en Barcelona.",
        icon: Sparkles,
        link: "#collaborate",
        image:
          "linear-gradient(135deg, rgba(199, 185, 240, 0.15) 0%, rgba(255, 87, 20, 0.15) 100%)",
      },
    ],
  };

  const items = content[language];
  const sectionTitle = language === "en" ? "Our Work" : "Nuestro Trabajo";

  return (
    <section id="showcase" className="section">
      <div className="section-container">
        <h2
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {sectionTitle}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.link}
                target={item.link.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.link.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className={`card-base card-hover group transition-all duration-700 overflow-hidden relative ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible ? `${(index + 1) * 150}ms` : "0ms",
                }}
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity"
                  style={{ background: item.image }}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-accent group-hover:text-accent2 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
