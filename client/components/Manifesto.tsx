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
        "Music and creative technology are central to Maurique Labs. They shape the experiences we design and the products we choose to build.",
        "That same approach extends to wellness, local business, education and other sectors we care about. We bring people together around real challenges, then grow the strongest opportunities into portfolio products.",
      ],
    },
    es: {
      sectionTitle: "Tecnología, cultura y comunidad",
      paragraphs: [
        "La música y la tecnología creativa están en el centro de Maurique Labs. Dan forma a las experiencias que diseñamos y a los productos que elegimos construir.",
        "Ese mismo enfoque se extiende al bienestar, el comercio local, la educación y otros sectores que nos importan. Reunimos a las personas en torno a retos reales y hacemos crecer las oportunidades más fuertes hasta convertirlas en productos de portfolio.",
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
