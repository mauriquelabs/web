import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface MethodologyProps {
  language: "en" | "es";
}

export default function Methodology({ language }: MethodologyProps) {
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

    const element = document.getElementById("methodology");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: {
      sectionTitle: "How are we different?",
      steps: [
        {
          title: "We work with the industry.",
          description:
            "We collaborate directly with artists, promoters and music organizations to understand how they actually work.",
        },
        {
          title: "We validate ideas.",
          description:
            "Through our own communities, events and collaborations we test ideas before building products.",
        },
        {
          title: "We build software.",
          description:
            "We transform those insights into software that solves real operational problems.",
        },
        {
          title: "We scale what works.",
          description:
            "The best solutions become products that can benefit the wider music industry.",
        },
      ],
    },
    es: {
      sectionTitle: "¿En qué somos diferentes?",
      steps: [
        {
          title: "Trabajamos con la industria.",
          description:
            "Colaboramos directamente con artistas, promotores y organizaciones musicales para entender cómo funcionan realmente.",
        },
        {
          title: "Validamos ideas.",
          description:
            "A través de nuestras propias comunidades, eventos y colaboraciones, probamos ideas antes de construir productos.",
        },
        {
          title: "Construimos software.",
          description:
            "Transformamos esos aprendizajes en software que resuelve problemas operativos reales.",
        },
        {
          title: "Escalamos lo que funciona.",
          description:
            "Las mejores soluciones se convierten en productos que benefician a toda la industria musical.",
        },
      ],
    },
  };

  const copy = content[language];

  return (
    <section id="methodology" className="section">
      <div className="section-container">
        <h2
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {copy.sectionTitle}
        </h2>

        <div className="max-w-xl mx-auto flex flex-col items-center">
          {copy.steps.map((step, index) => (
            <div key={step.title} className="w-full flex flex-col items-center">
              <div
                className={`w-full text-center transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
                }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed max-w-md mx-auto">
                  {step.description}
                </p>
              </div>

              {index < copy.steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`my-8 transition-opacity duration-700 ${
                    isVisible ? "opacity-40" : "opacity-0"
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${index * 150 + 100}ms` : "0ms",
                  }}
                >
                  <ChevronDown className="w-6 h-6 text-accent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
