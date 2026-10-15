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
    { sectionTitle: string; items: Offering[] }
  > = {
    en: {
      sectionTitle: "What we can create together",
      items: [
        {
          title: "Hackathons & innovation experiences",
          description:
            "Bring your team or community together around a meaningful challenge. We help shape the brief, guide collaboration and support participants as they develop concepts and prototypes worth taking further.",
        },
        {
          title: "Creative technology labs",
          description:
            "Explore where music, culture and technology meet. Collaborative sessions for artists, creators and curious minds to experiment with new tools, exchange perspectives and develop ideas.",
        },
        {
          title: "Practical workshops",
          description:
            "Help people build confidence with AI and digital tools through projects that matter to them. Accessible, guided learning with room to experiment, question results and apply what they discover.",
        },
      ],
    },
    es: {
      sectionTitle: "Lo que podemos crear juntos",
      items: [
        {
          title: "Hackathons y experiencias de innovación",
          description:
            "Reúne a tu equipo o comunidad en torno a un reto con sentido. Ayudamos a dar forma al brief, guiamos la colaboración y acompañamos a los participantes mientras desarrollan conceptos y prototipos que merecen continuar.",
        },
        {
          title: "Labs de tecnología creativa",
          description:
            "Explora donde se cruzan la música, la cultura y la tecnología. Sesiones colaborativas para artistas, creadores y mentes curiosas que quieren experimentar con nuevas herramientas, intercambiar perspectivas y desarrollar ideas.",
        },
        {
          title: "Workshops prácticos",
          description:
            "Ayuda a las personas a ganar confianza con la IA y las herramientas digitales a través de proyectos que les importan. Aprendizaje accesible y guiado, con espacio para experimentar, cuestionar resultados y aplicar lo descubierto.",
        },
      ],
    },
  };

  const copy = content[language];
  const show = isVisible || reduceMotion;

  return (
    <section
      id="offerings"
      className={`section bg-background text-foreground ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <h2
          className={`mb-12 sm:mb-16 max-w-3xl transition-opacity duration-300 ${
            show ? "opacity-100" : "opacity-0"
          }`}
        >
          {copy.sectionTitle}
        </h2>

        <ul className="grid gap-12 sm:gap-16 lg:grid-cols-3 lg:gap-10">
          {copy.items.map((item, index) => (
            <li
              key={item.title}
              className={`transition-opacity duration-300 ${
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
              <p className="text-foreground/70 leading-relaxed">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
