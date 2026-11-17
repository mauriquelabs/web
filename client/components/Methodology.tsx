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
      sectionTitle: "Explore. Build. Deliver.",
      steps: [
        {
          title: "Explore & Define",
          description:
            "We listen to the community, understand the people and problem, and shape product direction through discovery, research and validation.",
        },
        {
          title: "Design & Build",
          description:
            "We turn the clearest opportunity into a prototype, digital product or shared in-person experience, testing and learning with the people it is for.",
        },
        {
          title: "Deliver & Iterate",
          description:
            "We prepare what works for launch, bring the experience to life, and agree practical next steps to keep improving with the community.",
        },
      ],
    },
    es: {
      sectionTitle: "Explorar. Construir. Entregar.",
      steps: [
        {
          title: "Explorar y definir",
          description:
            "Escuchamos a la comunidad, entendemos a las personas y el problema, y definimos el rumbo del producto mediante descubrimiento, investigación y validación.",
        },
        {
          title: "Diseñar y construir",
          description:
            "Convertimos la oportunidad más clara en un prototipo, un producto digital o una experiencia presencial compartida, probando y aprendiendo con las personas a quienes va dirigida.",
        },
        {
          title: "Entregar e iterar",
          description:
            "Preparamos lo que funciona para su lanzamiento, hacemos realidad la experiencia y acordamos pasos prácticos para seguir mejorando con la comunidad.",
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

        <div className="relative mx-auto max-w-xl">
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
