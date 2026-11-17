import { useEffect, useState } from "react";

interface OfferingsProps {
  language: "en" | "es";
  theme?: "dark" | "light";
}

type Offering = {
  title: string;
  description: string;
};

export default function Offerings({
  language,
  theme = "dark",
}: OfferingsProps) {
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
      { threshold: 0.12 },
    );

    const element = document.getElementById("offerings");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content: Record<
    "en" | "es",
    { sectionTitle: string; intro: string; items: Offering[] }
  > = {
    en: {
      sectionTitle: "What we do",
      intro:
        "Our work takes two connected forms: digital products that meet real needs, and in-person experiences shaped with the communities around them.",
      items: [
        {
          title: "Digital products",
          description:
            "We work with people close to a real need to explore it, define product direction, prototype, validate and launch useful digital products, from web and mobile experiences to AI-enabled tools where they help.",
        },
        {
          title: "In-person experiences",
          description:
            "We bring communities together through music, movement, creative technology and learning. We shape participatory events, workshops and gatherings with the people who make them meaningful.",
        },
      ],
    },
    es: {
      sectionTitle: "Qué hacemos",
      intro:
        "Nuestro trabajo tiene dos formas conectadas: productos digitales que responden a necesidades reales y experiencias presenciales creadas con las comunidades que los rodean.",
      items: [
        {
          title: "Productos digitales",
          description:
            "Trabajamos con personas cercanas a una necesidad real para explorarla, definir el rumbo del producto, crear prototipos, validar y lanzar productos digitales útiles: desde experiencias web y móviles hasta herramientas con IA cuando aportan valor.",
        },
        {
          title: "Experiencias presenciales",
          description:
            "Reunimos a comunidades a través de la música, el movimiento, la tecnología creativa y el aprendizaje. Diseñamos eventos participativos, talleres y encuentros con las personas que les dan sentido.",
        },
      ],
    },
  };

  const copy = content[language];
  const show = isVisible || reduceMotion;

  return (
    <section
      id="offerings"
      className={`section max-md:py-14 bg-background text-foreground ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <div className="mb-10 sm:mb-14 max-w-3xl">
          <h2
            className={`mb-4 transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
          >
            {copy.sectionTitle}
          </h2>
          <p
            className={`text-lg text-foreground/65 leading-relaxed transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDelay: show && !reduceMotion ? "60ms" : "0ms",
            }}
          >
            {copy.intro}
          </p>
        </div>

        <ul className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-8">
          {copy.items.map((item, index) => (
            <li
              key={item.title}
              className={`card-base flex flex-col lg:min-h-[20rem] lg:justify-center transition-opacity duration-300 ${
                show ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transitionDelay:
                  show && !reduceMotion ? `${index * 100 + 80}ms` : "0ms",
              }}
            >
              <span
                aria-hidden="true"
                className="block text-sm font-bold text-accent2 mb-4"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground leading-tight">
                {item.title}
              </h3>
              <p className="text-base sm:text-lg text-foreground/70 leading-relaxed">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
