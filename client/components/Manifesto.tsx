import { useEffect, useState } from "react";

interface ManifestoProps {
  language: "en" | "es";
}

export default function Manifesto({ language }: ManifestoProps) {
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

  return (
    <section
      id="manifesto"
      className="section bg-card/30 border-y border-border"
    >
      <div className="section-container">
        <p
          className={`max-w-4xl mx-auto text-center text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {text}
        </p>
      </div>
    </section>
  );
}
