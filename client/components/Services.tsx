import { useEffect, useState } from "react";
import { Monitor, Calendar, Camera } from "lucide-react";

interface ServicesProps {
  language: "en" | "es";
}

export default function Services({ language }: ServicesProps) {
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

    const element = document.getElementById("services");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: {
      title: "What We Do",
      integration:
        "A digital client may need a launch event. An event space may need a website. This integration is our real competitive advantage.",
      pillars: [
        {
          icon: Monitor,
          color: "text-accent",
          dotColor: "text-accent",
          border: "hover:border-accent",
          title: "Digital",
          description:
            "Professional digital presence and custom tools for creators, brands, and small businesses.",
          services: [
            "Websites, landing pages & portfolios",
            "MVPs and custom digital tools",
            "Integrations & advanced forms",
            "Maintenance & continuous support",
          ],
        },
        {
          icon: Calendar,
          color: "text-accent2",
          dotColor: "text-accent2",
          border: "hover:border-accent2",
          title: "Events & Experiences",
          description:
            "Cultural, musical, and corporate experiences that activate communities and create lasting connections.",
          services: [
            "Brand showcases & activations",
            "Music sessions & DJ events",
            "Workshops & hackathons",
            "Recurring event formats",
          ],
        },
      ],
      audiovisual: {
        icon: Camera,
        label: "And we document it all —",
        title: "Audiovisual",
        description:
          "Content that captures the story of every project — executed with trusted collaborators.",
        services: [
          "Aftermovies & event documentation",
          "Social content & product demos",
          "Photography",
          "Content strategy",
        ],
      },
    },
    es: {
      title: "Qué Hacemos",
      integration:
        "Un cliente digital puede necesitar un evento de lanzamiento. Un espacio de eventos puede necesitar una web. Esta integración es nuestra ventaja competitiva real.",
      pillars: [
        {
          icon: Monitor,
          color: "text-accent",
          dotColor: "text-accent",
          border: "hover:border-accent",
          title: "Digital",
          description:
            "Presencia digital profesional y herramientas a medida para creadores, marcas y pequeñas empresas.",
          services: [
            "Webs, landing pages y portfolios",
            "MVPs y herramientas digitales a medida",
            "Integraciones y formularios avanzados",
            "Mantenimiento y evolución continua",
          ],
        },
        {
          icon: Calendar,
          color: "text-accent2",
          dotColor: "text-accent2",
          border: "hover:border-accent2",
          title: "Eventos y Experiencias",
          description:
            "Experiencias culturales, musicales y corporativas que activan comunidades y crean conexiones duraderas.",
          services: [
            "Showcases y activaciones de marca",
            "Sesiones musicales y de DJ",
            "Workshops y hackathons",
            "Formatos de eventos recurrentes",
          ],
        },
      ],
      audiovisual: {
        icon: Camera,
        label: "Y lo documentamos todo —",
        title: "Audiovisual",
        description:
          "Contenido que captura la historia de cada proyecto — ejecutado con colaboradores de confianza.",
        services: [
          "Aftermovies y documentación de eventos",
          "Contenido para redes y product demos",
          "Fotografía",
          "Estrategia de contenido",
        ],
      },
    },
  };

  const copy = content[language];
  const av = copy.audiovisual;
  const AvIcon = av.icon;

  return (
    <section id="services" className="section">
      <div className="section-container">
        <h2
          className={`mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {copy.title}
        </h2>

        <p
          className={`text-foreground/60 text-base sm:text-lg max-w-2xl mb-16 leading-relaxed italic transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
        >
          {copy.integration}
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-6">
          {copy.pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible ? `${(index + 1) * 150}ms` : "0ms",
                }}
              >
                <div className={`card-base card-hover h-full ${pillar.border}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className={`w-8 h-8 ${pillar.color}`} />
                    <h3 className="text-xl font-bold">{pillar.title}</h3>
                  </div>
                  <p className="text-foreground/70 mb-6 leading-relaxed text-sm">
                    {pillar.description}
                  </p>
                  <ul className="space-y-3">
                    {pillar.services.map((service, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-foreground/80 text-sm"
                      >
                        <span className={`${pillar.dotColor} font-bold mt-1`}>
                          •
                        </span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}
        >
          <div className="border border-foreground/10 rounded-xl px-6 py-5 bg-foreground/[0.03] hover:border-foreground/20 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex items-center gap-3 sm:min-w-fit">
                <AvIcon className="w-5 h-5 text-foreground/40 flex-shrink-0" />
                <span className="text-foreground/40 text-sm italic">
                  {av.label}
                </span>
                <span className="text-foreground/50 text-sm font-semibold">
                  {av.title}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 flex-1">
                <p className="text-foreground/40 text-sm leading-relaxed sm:max-w-xs">
                  {av.description}
                </p>
                <ul className="flex flex-wrap gap-x-6 gap-y-1.5 sm:flex-col sm:gap-y-1.5">
                  {av.services.map((service, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-foreground/40 text-xs"
                    >
                      <span className="text-foreground/30 font-bold">•</span>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
