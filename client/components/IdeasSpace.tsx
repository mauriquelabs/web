import { useEffect, useState } from "react";

interface IdeasSpaceProps {
  language: "en" | "es";
  theme?: "dark" | "light";
}

export default function IdeasSpace({
  language,
  theme = "light",
}: IdeasSpaceProps) {
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

    const element = document.getElementById("ideas");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: {
      sectionTitle: "Product builders, starting with community.",
      lead: "Maurique Labs is a community of product builders. We start with the people and communities we belong to, then create digital products and in-person experiences around what matters to them.",
      body: "A product builder takes an idea from product discovery to something people can use: understanding a need, prototyping, learning with the community, and preparing for launch. We build alongside the people a product is for, not at a distance.",
    },
    es: {
      sectionTitle: "Creamos productos empezando por la comunidad.",
      lead: "Maurique Labs es una comunidad de creadores de productos. Empezamos por las personas y comunidades de las que formamos parte, y creamos productos digitales y experiencias presenciales en torno a lo que les importa.",
      body: "Un creador de productos lleva una idea desde el descubrimiento de producto hasta algo que las personas pueden usar: entiende una necesidad, crea prototipos, aprende con la comunidad y prepara el lanzamiento. Construimos junto a las personas para quienes es el producto, no desde lejos.",
    },
  };

  const copy = content[language];
  const show = isVisible || reduceMotion;

  return (
    <section
      id="ideas"
      className={`section max-md:py-12 bg-background text-foreground ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <div className="content-narrow mx-auto text-center">
          <h2
            className={`mb-6 sm:mb-8 transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
          >
            {copy.sectionTitle}
          </h2>

          <p
            className={`text-lg sm:text-xl text-foreground/70 leading-relaxed mb-6 transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDelay: show && !reduceMotion ? "80ms" : "0ms",
            }}
          >
            {copy.lead}
          </p>

          <p
            className={`text-base sm:text-lg text-foreground/60 leading-relaxed transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDelay: show && !reduceMotion ? "140ms" : "0ms",
            }}
          >
            {copy.body}
          </p>
        </div>
      </div>
    </section>
  );
}
