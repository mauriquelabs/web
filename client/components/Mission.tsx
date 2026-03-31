import { useEffect, useState } from "react";

interface MissionProps {
  language: "en" | "es";
}

export default function Mission({ language }: MissionProps) {
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

    const element = document.getElementById("mission");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: {
      label: "Our Mission",
      headline: "Where technology meets culture.",
      body: "There's a real gap between traditional digital agencies — expensive and inflexible — and conventional event promoters with no digital strategy. Maurique Labs fills that space with an integrated, accessible proposal built around continuity and community, not one-off deliverables.",
    },
    es: {
      label: "Nuestra Misión",
      headline: "Donde la tecnología se encuentra con la cultura.",
      body: "Existe un hueco real entre las agencias digitales tradicionales — caras y poco flexibles — y las promotoras de eventos convencionales sin enfoque digital ni visión estratégica. Maurique Labs ocupa ese espacio con una propuesta integrada, accesible y orientada a generar comunidad y continuidad, no solo entregas puntuales.",
    },
  };

  const copy = content[language];

  return (
    <section id="mission" className="section bg-card/30">
      <div className="section-container">
        <div
          className={`max-w-3xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-4">
            {copy.label}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight">
            {copy.headline}
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed">
            {copy.body}
          </p>
        </div>
      </div>
    </section>
  );
}
