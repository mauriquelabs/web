import { Link } from "react-router-dom";
import { Linkedin, Instagram } from "lucide-react";

interface FooterProps {
  language: "en" | "es";
}

export default function Footer({ language }: FooterProps) {
  const year = new Date().getFullYear();

  const content = {
    en: {
      copyright: `© ${year} Maurique Labs. All rights reserved.`,
      journal: "Journal",
    },
    es: {
      copyright: `© ${year} Maurique Labs. Todos los derechos reservados.`,
      journal: "Journal",
    },
  };

  const copy = content[language];

  return (
    <footer className="bg-card border-t border-border">
      <div className="section-container py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <img
            src="/logo-maurique-labs.png"
            alt="Maurique Labs"
            className="h-8 w-auto"
          />

          <div className="flex items-center gap-6">
            <Link
              to="/journal"
              className="text-sm font-medium text-foreground/60 hover:text-accent transition-colors duration-200"
            >
              {copy.journal}
            </Link>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/maurique_labs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:border-accent text-foreground/60 hover:text-accent transition-all duration-300 hover:bg-accent/10"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/maurique-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:border-accent text-foreground/60 hover:text-accent transition-all duration-300 hover:bg-accent/10"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <p className="text-foreground/50 text-xs text-center">
            {copy.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
