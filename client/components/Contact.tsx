import { useEffect, useState } from "react";
import ContactForm from "./ContactForm";

interface ContactProps {
  language: "en" | "es";
  theme?: "dark" | "light";
}

export default function Contact({ language, theme = "dark" }: ContactProps) {
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
      { threshold: 0.1 },
    );

    const element = document.getElementById("contact");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: {
      sectionTitle: "Let's build together",
      sectionDesc:
        "Whether you're an artist, promoter or music tech company, we'd love to hear what you're building.",
    },
    es: {
      sectionTitle: "Construyamos juntos",
      sectionDesc:
        "Seas artista, promotor o una empresa de tecnología musical, nos encantaría saber qué estás construyendo.",
    },
  };

  const copy = content[language];
  const show = isVisible || reduceMotion;

  return (
    <section
      id="contact"
      className={`section relative overflow-hidden bg-background text-foreground ${
        theme === "light" ? "light" : ""
      }`}
    >
      {/* CTA gradient — intentional conversion-surface treatment */}
      {theme === "dark" && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 55% at 50% -10%, rgba(255, 87, 20, 0.22) 0%, transparent 55%),
              radial-gradient(ellipse 60% 45% at 100% 100%, rgba(43, 201, 163, 0.14) 0%, transparent 50%)
            `,
          }}
        />
      )}

      <div className="section-container relative z-10">
        <div className="content-narrow text-center">
          <h2
            className={`mb-6 transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
          >
            {copy.sectionTitle}
          </h2>

          <p
            className={`text-lg sm:text-xl text-foreground/70 mb-4 leading-relaxed transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDelay: show && !reduceMotion ? "80ms" : "0ms",
            }}
          >
            {copy.sectionDesc}
          </p>
        </div>

        <div
          className={`max-w-xl mx-auto mt-12 transition-opacity duration-300 ${
            show ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transitionDelay: show && !reduceMotion ? "140ms" : "0ms",
          }}
        >
          <ContactForm language={language} />
        </div>
      </div>
    </section>
  );
}
