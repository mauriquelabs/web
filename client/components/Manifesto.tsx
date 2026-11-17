import { useEffect, useState } from "react";

interface ManifestoProps {
  language: "en" | "es";
  theme?: "dark" | "light";
}

export default function Manifesto({
  language,
  theme = "dark",
}: ManifestoProps) {
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
      { threshold: 0.2 },
    );

    const element = document.getElementById("manifesto");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: {
      sectionTitle: "Built with the communities we belong to",
      paragraphs: [
        "Music and creative technology are part of how we bring people together and make products. We also work across interests such as wellness, local business and education.",
        "Community-led product building means listening, making and learning with the people a product or experience is for. That work starts with the first question and continues through launch and beyond.",
      ],
    },
    es: {
      sectionTitle: "Creamos con las comunidades de las que formamos parte",
      paragraphs: [
        "La música y la tecnología creativa son parte de cómo reunimos a las personas y creamos productos. También trabajamos en ámbitos como el bienestar, el comercio local y la educación.",
        "La creación de productos desde la comunidad consiste en escuchar, crear y aprender junto a las personas para quienes se diseña un producto o una experiencia, desde la primera pregunta hasta el lanzamiento y más allá.",
      ],
    },
  };

  const copy = content[language];
  const show = isVisible || reduceMotion;

  return (
    <section
      id="manifesto"
      className={`section max-md:py-12 bg-background text-foreground border-y border-border ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <div className="content-narrow mx-auto text-center">
          <h2
            className={`mb-6 sm:mb-8 transition-all duration-500 ease-out ${
              show
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            {copy.sectionTitle}
          </h2>

          {copy.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={`text-lg sm:text-xl text-foreground/70 leading-relaxed transition-all duration-500 ease-out ${
                index < copy.paragraphs.length - 1 ? "mb-6" : ""
              } ${
                show
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{
                transitionDelay:
                  show && !reduceMotion ? `${(index + 1) * 100}ms` : "0ms",
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
