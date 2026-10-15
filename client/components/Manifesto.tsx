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
        "Music and creative technology are central to Maurique Labs. They inform how we bring people together and create space for experimentation.",
        "That same approach extends to local businesses, wellness communities, educational organisations and teams with challenges to explore. What connects the work is curiosity, participation and a shared reason to build.",
      ],
    },
    es: {
      sectionTitle: "Tecnología, cultura y comunidad",
      paragraphs: [
        "La música y la tecnología creativa están en el centro de Maurique Labs. Informan cómo reunimos a las personas y creamos espacio para experimentar.",
        "Ese mismo enfoque se extiende a negocios locales, comunidades de bienestar, organizaciones educativas y equipos con retos por explorar. Lo que conecta el trabajo es la curiosidad, la participación y una razón compartida para construir.",
      ],
    },
  };

  const copy = content[language];
  const show = isVisible || reduceMotion;

  return (
    <section
      id="manifesto"
      className={`section bg-background text-foreground border-y border-border ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <div className="content-narrow mx-auto text-center">
          <h2
            className={`mb-8 transition-all duration-500 ease-out ${
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
