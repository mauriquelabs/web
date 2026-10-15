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

    const element = document.getElementById("process");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: {
      sectionTitle: "From a shared question to a practical next step",
      steps: [
        {
          title: "Shape the challenge.",
          description:
            "Together, we define who the experience is for, what they want to explore and what a useful outcome looks like.",
        },
        {
          title: "Learn and build together.",
          description:
            "We design and facilitate the experience, combining collaboration with practical guidance and technical support.",
        },
        {
          title: "Take the ideas forward.",
          description:
            "We close with tangible outcomes and clear next steps. Where useful, we can support further testing, prototyping and product development.",
        },
      ],
    },
    es: {
      sectionTitle: "De una pregunta compartida a un siguiente paso práctico",
      steps: [
        {
          title: "Damos forma al reto.",
          description:
            "Juntos definimos para quién es la experiencia, qué quieren explorar y cómo se ve un resultado útil.",
        },
        {
          title: "Aprendemos y construimos juntas.",
          description:
            "Diseñamos y facilitamos la experiencia, combinando colaboración con guía práctica y apoyo técnico.",
        },
        {
          title: "Llevamos las ideas más lejos.",
          description:
            "Cerramos con resultados tangibles y siguientes pasos claros. Cuando tiene sentido, podemos apoyar más pruebas, prototipado y desarrollo de producto.",
        },
      ],
    },
  };

  const copy = content[language];
  const show = isVisible || reduceMotion;

  return (
    <section
      id="process"
      className={`section bg-background text-foreground ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <h2
          className={`mb-16 text-center max-w-3xl mx-auto transition-opacity duration-300 ${
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
                  transitionDelay:
                    show && !reduceMotion ? `${index * 100 + 120}ms` : "0ms",
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
