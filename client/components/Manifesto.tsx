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
      sectionTitle: "Technology, culture & community",
      paragraphs: [
        "Music and creative technology are central to Maurique Labs. They shape how we design experiences and digital products for partners.",
        "That same approach extends to wellness, local business, education and other sectors where collaboration, learning and experimentation create real outcomes.",
      ],
    },
    es: {
      sectionTitle: "Tecnología, cultura y comunidad",
      paragraphs: [
        "La música y la tecnología creativa están en el centro de Maurique Labs. Dan forma a cómo diseñamos experiencias y productos digitales para partners.",
        "Ese mismo enfoque se extiende al bienestar, el comercio local, la educación y otros sectores donde la colaboración, el aprendizaje y la experimentación generan resultados reales.",
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
