import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import ContactForm from "./ContactForm";

interface ContactProps {
  language: "en" | "es";
}

export default function Contact({ language }: ContactProps) {
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
      email: "hello@mauriquelabs.com",
    },
    es: {
      sectionTitle: "Construyamos juntos",
      sectionDesc:
        "Seas artista, promotor o una empresa de tecnología musical, nos encantaría saber qué estás construyendo.",
      email: "hello@mauriquelabs.com",
    },
  };

  const copy = content[language];

  return (
    <section id="contact" className="section">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className={`mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {copy.sectionTitle}
          </h2>

          <p
            className={`text-lg sm:text-xl text-foreground/70 mb-4 leading-relaxed transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
          >
            {copy.sectionDesc}
          </p>

          <a
            href={`mailto:${copy.email}`}
            className={`inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "250ms" : "0ms" }}
          >
            <Mail className="w-4 h-4" />
            {copy.email}
          </a>
        </div>

        <div
          className={`max-w-xl mx-auto mt-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: isVisible ? "350ms" : "0ms" }}
        >
          <ContactForm language={language} />
        </div>
      </div>
    </section>
  );
}
