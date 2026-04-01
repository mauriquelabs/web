import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  language: "en" | "es";
  onLanguageChange: (lang: "en" | "es") => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const prefix = isHome ? "" : "/";

  const navLinks = {
    en: [
      { label: "What We Do", href: `${prefix}#services` },
      { label: "Our Work", href: `${prefix}#showcase` },
      { label: "Collaborate", href: `${prefix}#collaborate` },
    ],
    es: [
      { label: "Qué Hacemos", href: `${prefix}#services` },
      { label: "Nuestro Trabajo", href: `${prefix}#showcase` },
      { label: "Colabora", href: `${prefix}#collaborate` },
    ],
  };

  const servicesLink = { label: language === "en" ? "Services" : "Servicios", href: "/services" };
  const ctaLabel = language === "en" ? "Let's Talk" : "Hablemos";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo-maurique-labs.png"
            alt="Maurique Labs"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks[language].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <Link
            to={servicesLink.href}
            className={`text-sm font-medium transition-colors duration-300 ${
              location.pathname === "/services"
                ? "text-accent"
                : "text-foreground/70 hover:text-accent"
            }`}
          >
            {servicesLink.label}
          </Link>
        </nav>

        {/* CTA and Language Toggle */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <div className="hidden sm:flex items-center gap-2 border-l border-border pl-4">
            <button
              onClick={() => onLanguageChange("en")}
              className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                language === "en"
                  ? "text-accent bg-accent/10"
                  : "text-foreground/50 hover:text-foreground/70"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange("es")}
              className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                language === "es"
                  ? "text-accent bg-accent/10"
                  : "text-foreground/50 hover:text-foreground/70"
              }`}
            >
              ES
            </button>
          </div>

          {/* CTA Button */}
          <a
            href="https://calendly.com/hello-mauriquelabs/30min"
            className="hidden sm:inline-block btn-primary text-sm"
          >
            {ctaLabel}
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95">
          <nav className="section-container py-4 flex flex-col gap-4">
            {navLinks[language].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              to={servicesLink.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/services"
                  ? "text-accent"
                  : "text-foreground/70 hover:text-accent"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {servicesLink.label}
            </Link>
            <a
              href="https://calendly.com/hello-mauriquelabs/30min"
              className="btn-primary text-sm text-center"
            >
              {ctaLabel}
            </a>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                onClick={() => {
                  onLanguageChange("en");
                  setMobileMenuOpen(false);
                }}
                className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                  language === "en"
                    ? "text-accent bg-accent/10"
                    : "text-foreground/50"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  onLanguageChange("es");
                  setMobileMenuOpen(false);
                }}
                className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                  language === "es"
                    ? "text-accent bg-accent/10"
                    : "text-foreground/50"
                }`}
              >
                ES
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
