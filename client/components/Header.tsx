import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  language: "en" | "es";
  onLanguageChange: (lang: "en" | "es") => void;
}

type NavItem = { label: string; href: string } | { label: string; to: string };

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isBlog =
    location.pathname === "/blog" || location.pathname.startsWith("/blog/");

  const prefix = isHome ? "" : "/";

  const navLinks: Record<"en" | "es", NavItem[]> = {
    en: [
      { label: "Experiences", href: `${prefix}#offerings` },
      { label: "How it works", href: `${prefix}#process` },
      { label: "Projects", href: `${prefix}#projects` },
      { label: "Blog", to: "/blog" },
    ],
    es: [
      { label: "Experiencias", href: `${prefix}#offerings` },
      { label: "Cómo funciona", href: `${prefix}#process` },
      { label: "Proyectos", href: `${prefix}#projects` },
      { label: "Blog", to: "/blog" },
    ],
  };

  const navClassName = (active: boolean) =>
    cn(
      "text-sm font-medium transition-colors duration-300",
      active ? "text-foreground" : "text-foreground/70 hover:text-accent",
    );

  const ctaLabel = language === "en" ? "Let's talk" : "Hablemos";
  const ctaHref = `${prefix}#contact`;

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
          {navLinks[language].map((link) =>
            "to" in link ? (
              <Link
                key={link.to}
                to={link.to}
                className={navClassName(isBlog)}
                aria-current={isBlog ? "page" : undefined}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={navClassName(false)}
              >
                {link.label}
              </a>
            ),
          )}
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
            href={ctaHref}
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
            {navLinks[language].map((link) =>
              "to" in link ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className={navClassName(isBlog)}
                  aria-current={isBlog ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={navClassName(false)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ),
            )}
            <a
              href={ctaHref}
              className="btn-primary text-sm text-center"
              onClick={() => setMobileMenuOpen(false)}
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
