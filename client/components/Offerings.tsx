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
      sectionTitle: "What we can create together",
      intro:
        "Collaboration, community engagement, learning and experimentation that lead to tangible outcomes for your organisation.",
      items: [
        {
          title: "Hackathons & innovation experiences",
          description:
            "Design, organisation and facilitation of hackathons, ideathons and innovation challenges. From challenge definition and experience design to facilitation, technical mentoring and prototyping support.",
        },
        {
          title: "Creative technology labs & workshops",
          description:
            "Hands-on AI workshops, creative coding sessions, music-tech labs and collaborative learning. Standalone or integrated into larger events.",
        },
        {
          title: "Digital product development",
          description:
            "Product discovery, validation, rapid prototyping, MVPs, web and mobile applications, and AI-powered solutions. Available independently of our events.",
        },
      ],
    },
    es: {
      sectionTitle: "Lo que podemos crear juntos",
      intro:
        "Colaboración, engagement comunitario, aprendizaje y experimentación que llevan a resultados tangibles para tu organización.",
      items: [
        {
          title: "Hackathons y experiencias de innovación",
          description:
            "Diseño, organización y facilitación de hackathons, ideathons y retos de innovación. Desde la definición del reto y el diseño de la experiencia hasta la facilitación, el mentoring técnico y el apoyo al prototipado.",
        },
        {
          title: "Labs y workshops de tecnología creativa",
          description:
            "Workshops prácticos de IA, sesiones de creative coding, labs de music-tech y aprendizaje colaborativo. Independientes o integrados en eventos más amplios.",
        },
        {
          title: "Desarrollo de producto digital",
          description:
            "Discovery de producto, validación, prototipado rápido, MVPs, aplicaciones web y mobile, y soluciones con IA. Disponible de forma independiente a nuestros eventos.",
        },
      ],
    },
  };

  const copy = content[language];
  const show = isVisible || reduceMotion;
  const [lead, ...rest] = copy.items;

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

        {/* Lead offering: full width, larger type */}
        <div
          className={`mb-12 sm:mb-16 max-w-3xl transition-opacity duration-300 ${
            show ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transitionDelay: show && !reduceMotion ? "80ms" : "0ms",
          }}
        >
          <span
            aria-hidden="true"
            className="block text-sm font-bold text-accent2 mb-4"
          >
            01
          </span>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
            {lead.title}
          </h3>
          <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl">
            {lead.description}
          </p>
        </div>

        <ul className="grid gap-12 sm:gap-14 md:grid-cols-2 md:gap-10">
          {rest.map((item, index) => (
            <li
              key={item.title}
              className={`transition-opacity duration-300 ${
                show ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transitionDelay:
                  show && !reduceMotion ? `${(index + 1) * 100 + 80}ms` : "0ms",
              }}
            >
              <span
                aria-hidden="true"
                className="block text-sm font-bold text-accent2 mb-4"
              >
                {String(index + 2).padStart(2, "0")}
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
