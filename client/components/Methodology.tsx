import { useEffect, useState } from "react";

interface MethodologyProps {
  language: "en" | "es";
  theme?: "dark" | "light";
}

export default function Methodology({
  language,
  theme = "dark",
}: MethodologyProps) {
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
      { threshold: 0.15 },
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
  const show = isVisible || reduceMotion;

  return (
    <section
      id="methodology"
      className={`section bg-background text-foreground ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <h2
          className={`mb-16 text-center transition-opacity duration-300 ${
            show ? "opacity-100" : "opacity-0"
          }`}
        >
          {copy.sectionTitle}
        </h2>

        <div className="content-narrow relative">
          {/* Progress track — encodes sequence, fills when section enters view */}
          <div
            aria-hidden="true"
            className="absolute left-0 sm:left-3 top-2 bottom-2 w-px bg-border overflow-hidden"
          >
            <div
              className={`w-full bg-accent2 origin-top transition-transform duration-500 ease-out ${
                show ? "scale-y-100" : "scale-y-0"
              }`}
              style={{ height: "100%", transitionDelay: show ? "80ms" : "0ms" }}
            />
          </div>

          <ol className="flex flex-col gap-12 sm:gap-16 pl-8 sm:pl-12">
            {copy.steps.map((step, index) => (
              <li
                key={step.title}
                className={`relative transition-opacity duration-300 ${
                  show ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transitionDelay: show && !reduceMotion ? `${index * 100 + 120}ms` : "0ms",
                }}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-8 sm:-left-12 top-1.5 flex h-3 w-3 -translate-x-[5px] sm:-translate-x-[1px] items-center justify-center rounded-full border-2 border-accent2 bg-background transition-transform duration-300 ${
                    show ? "scale-100" : "scale-0"
                  }`}
                  style={{
                    transitionDelay:
                      show && !reduceMotion ? `${index * 100 + 160}ms` : "0ms",
                  }}
                />
                <span className="block text-sm font-bold text-accent2 mb-2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed max-w-md">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
