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
      { threshold: 0.35 },
    );

    const element = document.getElementById("manifesto");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: "We believe technology should empower the people shaping music culture so they can focus on the art.",
    es: "Creemos que la tecnología debe empoderar a las personas que dan forma a la cultura musical, para que puedan enfocarse en lo que mejor saben hacer: crear experiencias inolvidables.",
  };

  const text = content[language];
  const words = text.split(" ");
  // Keep the whole reveal inside ~450ms (design-system ceiling for manifesto)
  const staggerMs = reduceMotion
    ? 0
    : Math.min(28, Math.floor(420 / Math.max(words.length - 1, 1)));

  return (
    <section
      id="manifesto"
      className={`section bg-background text-foreground border-y border-border ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <p
          className="max-w-4xl mx-auto text-center text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight font-heading"
          aria-label={text}
        >
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={`inline-block mr-[0.28em] last:mr-0 transition-all duration-500 ease-out ${
                isVisible || reduceMotion
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{
                transitionDelay:
                  isVisible && !reduceMotion ? `${index * staggerMs}ms` : "0ms",
              }}
              aria-hidden="true"
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
