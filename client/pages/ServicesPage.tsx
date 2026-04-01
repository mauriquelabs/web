import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Monitor,
  Calendar,
  Wrench,
  BarChart3,
  Check,
  Rocket,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

type Language = "en" | "es";

function useVisible(id: string) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [id]);
  return visible;
}

interface QuoteFormState {
  name: string;
  email: string;
  serviceType: string;
  description: string;
  budgetRange: string;
}

function QuoteForm({ language }: { language: Language }) {
  const { toast } = useToast();
  const [form, setForm] = useState<QuoteFormState>({
    name: "",
    email: "",
    serviceType: "",
    description: "",
    budgetRange: "",
  });
  const [loading, setLoading] = useState(false);

  const content = {
    en: {
      title: "Request a Quote",
      subtitle: "Tell us about your project. We'll get back to you within 48 hours with a tailored proposal.",
      name: "Name",
      namePh: "Your name",
      email: "Email",
      emailPh: "your@email.com",
      serviceType: "Service Type",
      serviceTypePh: "Select a service...",
      description: "Project Description",
      descriptionPh: "Tell us about your project, timeline, and goals...",
      budgetRange: "Indicative Budget",
      budgetPh: "Select a range...",
      submit: "Send Request",
      loading: "Sending...",
      services: [
        "Web / Landing Page",
        "Portfolio / Press Kit Digital",
        "MVP Funcional",
        "Acompañamiento Técnico (Recurrente)",
        "Evento Privado / Community",
        "Evento Corporativo",
        "Workshop o Hackathon",
        "Gestión Recurrente de Eventos",
        "Lanzamiento Completo (Pack)",
        "Other / Not sure yet",
      ],
      budgets: [
        "< 700 €",
        "700 € – 1,500 €",
        "1,500 € – 3,000 €",
        "3,000 € – 6,000 €",
        "6,000 € – 10,000 €",
        "> 10,000 €",
        "Monthly retainer",
      ],
    },
    es: {
      title: "Solicita un Presupuesto",
      subtitle: "Cuéntanos tu proyecto. Te respondemos en 48 horas con una propuesta a medida.",
      name: "Nombre",
      namePh: "Tu nombre",
      email: "Email",
      emailPh: "tu@email.com",
      serviceType: "Tipo de Servicio",
      serviceTypePh: "Selecciona un servicio...",
      description: "Descripción del Proyecto",
      descriptionPh: "Cuéntanos tu proyecto, plazos y objetivos...",
      budgetRange: "Presupuesto Orientativo",
      budgetPh: "Selecciona un rango...",
      submit: "Enviar Solicitud",
      loading: "Enviando...",
      services: [
        "Web / Landing Page",
        "Portfolio / Press Kit Digital",
        "MVP Funcional",
        "Acompañamiento Técnico (Recurrente)",
        "Evento Privado / Community",
        "Evento Corporativo",
        "Workshop o Hackathon",
        "Gestión Recurrente de Eventos",
        "Lanzamiento Completo (Pack)",
        "Otro / No lo tengo claro aún",
      ],
      budgets: [
        "< 700 €",
        "700 € – 1.500 €",
        "1.500 € – 3.000 €",
        "3.000 € – 6.000 €",
        "6.000 € – 10.000 €",
        "> 10.000 €",
        "Retainer mensual",
      ],
    },
  };

  const copy = content[language];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setForm({ name: "", email: "", serviceType: "", description: "", budgetRange: "" });
        toast({
          title: language === "en" ? "Request received!" : "¡Solicitud recibida!",
          description:
            language === "en"
              ? "We'll get back to you within 48 hours."
              : "Te contactamos en menos de 48 horas.",
        });
      } else {
        toast({
          title: language === "en" ? "Something went wrong" : "Algo salió mal",
          description:
            language === "en"
              ? "Please try again or email us directly."
              : "Por favor intenta de nuevo o escríbenos directamente.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: language === "en" ? "Something went wrong" : "Algo salió mal",
        description:
          language === "en"
            ? "Please try again or email us directly."
            : "Por favor intenta de nuevo o escríbenos directamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

  return (
    <section id="quote" className="section bg-card/30">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <h2 className="mb-4 text-center">{copy.title}</h2>
          <p className="text-foreground/60 text-center mb-12 text-lg leading-relaxed">
            {copy.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">{copy.name}</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={copy.namePh}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{copy.email}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={copy.emailPh}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">{copy.serviceType}</label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="" disabled>{copy.serviceTypePh}</option>
                  {copy.services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{copy.budgetRange}</label>
                <select
                  name="budgetRange"
                  value={form.budgetRange}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="" disabled>{copy.budgetPh}</option>
                  {copy.budgets.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{copy.description}</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder={copy.descriptionPh}
                required
                rows={5}
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-base py-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? copy.loading : copy.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("maurique-language") as Language | null;
    if (saved) setLanguage(saved);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("maurique-language", lang);
  };

  const entryVisible = useVisible("entry-paths");
  const pillarsVisible = useVisible("service-pillars");
  const packVisible = useVisible("lanzamiento-pack");
  const pricingVisible = useVisible("pricing-table");

  const content = {
    en: {
      heroLabel: "Services & Pricing",
      heroTitle: "Everything you need to\nlaunch, grow & be found.",
      heroSubtitle:
        "We combine digital development and event production under one roof — so you never have to choose between building online and building community.",
      heroCtaQuote: "Request a Quote",
      heroCtaBack: "Back to Home",

      entryTitle: "Where do we start?",
      entries: [
        {
          icon: Rocket,
          color: "text-accent",
          border: "border-accent/30 hover:border-accent",
          bg: "bg-accent/5",
          title: "Launch something new",
          desc: "Website, portfolio, MVP or digital presence from scratch. For projects taking off.",
        },
        {
          icon: Users,
          color: "text-accent2",
          border: "border-accent2/30 hover:border-accent2",
          bg: "bg-accent2/5",
          title: "Build community",
          desc: "Recurring events, brand activations and formats that generate real audience.",
          highlight: true,
        },
        {
          icon: TrendingUp,
          color: "text-foreground/60",
          border: "border-border hover:border-foreground/40",
          bg: "bg-muted/30",
          title: "Grow what you have",
          desc: "Monthly retainers, continuous maintenance and integrated management for active clients.",
        },
      ],

      pillarsTitle: "Our Services",
      pillars: [
        {
          icon: Monitor,
          color: "text-accent",
          border: "hover:border-accent",
          tag: "DIGITAL",
          tagColor: "text-accent bg-accent/10",
          title: "Digital Presence",
          items: [
            "Corporate website & landing pages",
            "Portfolio & digital press kit",
            "Forms & integrations",
            "Functional MVP",
          ],
          price: "From 700 €",
          freq: "Delivery 2–4 weeks",
        },
        {
          icon: Calendar,
          color: "text-accent2",
          border: "hover:border-accent2",
          tag: "EVENTS",
          tagColor: "text-accent2 bg-accent2/10",
          title: "Event Production",
          items: [
            "Brand showcases & activations",
            "Music sessions · Bejaus Sessions",
            "Workshops & hackathons",
            "Hybrid events & own formats",
          ],
          price: "From 700 €",
          freq: "Private event 20–30 pax",
        },
        {
          icon: Wrench,
          color: "text-foreground/60",
          border: "hover:border-foreground/30",
          tag: "RECURRING",
          tagColor: "text-foreground/60 bg-muted",
          title: "Technical Support",
          items: [
            "Web maintenance & evolution",
            "Continuous updates & improvements",
            "Monthly technical support",
          ],
          price: "150 € – 500 €",
          freq: "/ month",
        },
        {
          icon: BarChart3,
          color: "text-foreground/60",
          border: "hover:border-foreground/30",
          tag: "RECURRING",
          tagColor: "text-foreground/60 bg-muted",
          title: "Monthly Event Management",
          items: [
            "Creative concept & programming",
            "Full logistics coordination",
            "Communication & prior promotion",
            "Results report",
          ],
          price: "800 € – 2,000 €",
          freq: "/ month",
        },
      ],

      packTitle: "Exclusive Offer",
      packBadge: "MAURIQUE LABS PACK",
      packName: "Lanzamiento Completo",
      packDesc:
        "The only offer on the market that combines digital development and event production in a single coordinated project. Designed for brand launches, products or creative projects that need to make an impact from day one — both online and in person.",
      packIncludes: [
        "Web / launch landing page",
        "Full event presentation & production",
        "Event audiovisual content",
        "Integrated promotion & communication",
        "Follow-up retainer (optional)",
      ],
      packPrice: "Combined price with applied discount. Custom proposal.",

      pricingTitle: "Indicative Pricing",
      pricingNote: "All prices are net, excluding VAT. Final quote tailored to each project.",
      pricingHeaders: ["Service", "Scope", "Price"],
      pricing: [
        { service: "Web / Landing Page", scope: "Delivery 2–4 weeks", price: "700 – 1,200 €", recurring: false },
        { service: "Portfolio / Press Kit", scope: "—", price: "500 – 900 €", recurring: false },
        { service: "Functional MVP", scope: "Iterative process", price: "From 3,000 €", recurring: false },
        { service: "Development by hours", scope: "—", price: "60 – 80 € / h", recurring: false },
        { service: "Technical Support", scope: "Monthly maintenance", price: "150 – 500 € / mo", recurring: true },
        { service: "Private Event / Community", scope: "20–30 pax", price: "approx. 700 €", recurring: false },
        { service: "Corporate Event", scope: "40–80 pax, full coordination", price: "approx. 2,500 €", recurring: false },
        { service: "Workshop / Hackathon", scope: "Sponsored", price: "approx. 3,000 €", recurring: false },
        { service: "Recurring Event Management", scope: "Monthly contract", price: "800 – 2,000 € / mo", recurring: true },
      ],
      recurringLabel: "Recurring",
    },
    es: {
      heroLabel: "Servicios y Tarifas",
      heroTitle: "Todo lo que necesitas para\nlanzar, crecer y ser encontrado.",
      heroSubtitle:
        "Combinamos desarrollo digital y producción de eventos bajo un mismo techo — para que nunca tengas que elegir entre construir online y construir comunidad.",
      heroCtaQuote: "Solicitar Presupuesto",
      heroCtaBack: "Volver al Inicio",

      entryTitle: "¿Por dónde empezamos?",
      entries: [
        {
          icon: Rocket,
          color: "text-accent",
          border: "border-accent/30 hover:border-accent",
          bg: "bg-accent/5",
          title: "Lanzar algo nuevo",
          desc: "Web, portfolio, MVP o presencia digital desde cero. Para proyectos en fase de despegue.",
        },
        {
          icon: Users,
          color: "text-accent2",
          border: "border-accent2/30 hover:border-accent2",
          bg: "bg-accent2/5",
          title: "Construir comunidad",
          desc: "Eventos recurrentes, activaciones de marca y formatos que generan audiencia real.",
          highlight: true,
        },
        {
          icon: TrendingUp,
          color: "text-foreground/60",
          border: "border-border hover:border-foreground/40",
          bg: "bg-muted/30",
          title: "Hacer crecer lo que tienes",
          desc: "Retainers mensuales, mantenimiento continuo y gestión integrada para clientes activos.",
        },
      ],

      pillarsTitle: "Nuestros Servicios",
      pillars: [
        {
          icon: Monitor,
          color: "text-accent",
          border: "hover:border-accent",
          tag: "DIGITAL",
          tagColor: "text-accent bg-accent/10",
          title: "Presencia Digital",
          items: [
            "Web corporativa & landing pages",
            "Portfolio & press kit digital",
            "Formularios e integraciones",
            "MVP funcional",
          ],
          price: "Desde 700 €",
          freq: "Entrega 2–4 semanas",
        },
        {
          icon: Calendar,
          color: "text-accent2",
          border: "hover:border-accent2",
          tag: "EVENTOS",
          tagColor: "text-accent2 bg-accent2/10",
          title: "Producción de Eventos",
          items: [
            "Showcases y activaciones de marca",
            "Sesiones musicales · Bejaus Sessions",
            "Workshops y hackathons",
            "Eventos híbridos y formatos propios",
          ],
          price: "Desde 700 €",
          freq: "Evento privado 20–30 pax",
        },
        {
          icon: Wrench,
          color: "text-foreground/60",
          border: "hover:border-foreground/30",
          tag: "RECURRENTE",
          tagColor: "text-foreground/60 bg-muted",
          title: "Acompañamiento Técnico",
          items: [
            "Mantenimiento y evolución web",
            "Mejoras continuas y actualizaciones",
            "Soporte técnico mensual",
          ],
          price: "150 € – 500 €",
          freq: "/ mes",
        },
        {
          icon: BarChart3,
          color: "text-foreground/60",
          border: "hover:border-foreground/30",
          tag: "RECURRENTE",
          tagColor: "text-foreground/60 bg-muted",
          title: "Gestión de Eventos Mensual",
          items: [
            "Programación y concepto creativo",
            "Coordinación logística completa",
            "Comunicación y difusión previa",
            "Informe de resultados",
          ],
          price: "800 € – 2.000 €",
          freq: "/ mes",
        },
      ],

      packTitle: "Oferta Diferencial",
      packBadge: "PACK EXCLUSIVO MAURIQUE LABS",
      packName: "Lanzamiento Completo",
      packDesc:
        "La única oferta del mercado que combina desarrollo digital y producción de eventos en un solo proyecto coordinado. Diseñada para lanzamientos de marca, productos o proyectos creativos que necesitan impactar desde el primer día — tanto online como en persona.",
      packIncludes: [
        "Web / landing de lanzamiento",
        "Evento de presentación producido",
        "Contenido audiovisual del evento",
        "Difusión y comunicación integrada",
        "Retainer de seguimiento (opcional)",
      ],
      packPrice: "Precio combinado con descuento aplicado. Consultar propuesta a medida.",

      pricingTitle: "Tarifas Orientativas",
      pricingNote: "Todos los precios son netos, sin IVA. Presupuesto final adaptado a cada proyecto.",
      pricingHeaders: ["Servicio", "Alcance", "Precio"],
      pricing: [
        { service: "Web / Landing Page", scope: "Entrega 2–4 semanas", price: "700 – 1.200 €", recurring: false },
        { service: "Portfolio / Press Kit Digital", scope: "—", price: "500 – 900 €", recurring: false },
        { service: "MVP Funcional", scope: "Proceso iterativo", price: "Desde 3.000 €", recurring: false },
        { service: "Desarrollo por Horas", scope: "—", price: "60 – 80 € / h", recurring: false },
        { service: "Acompañamiento Técnico", scope: "Mantenimiento mensual", price: "150 – 500 € / mes", recurring: true },
        { service: "Evento Privado / Community", scope: "20–30 pax", price: "aprox. 700 €", recurring: false },
        { service: "Evento Corporativo", scope: "40–80 pax, coordinación completa", price: "aprox. 2.500 €", recurring: false },
        { service: "Workshop o Hackathon", scope: "Patrocinado", price: "aprox. 3.000 €", recurring: false },
        { service: "Gestión Recurrente de Eventos", scope: "Contrato mensual", price: "800 – 2.000 € / mes", recurring: true },
      ],
      recurringLabel: "Recurrente",
    },
  };

  const copy = content[language];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header language={language} onLanguageChange={handleLanguageChange} />

      <main>
        {/* Hero */}
        <section className="section relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent2/5 rounded-full blur-3xl" />
          </div>
          <div className="section-container relative z-10">
            <span className="inline-block text-xs font-bold tracking-widest text-accent uppercase mb-6 border border-accent/30 px-3 py-1 rounded-full">
              {copy.heroLabel}
            </span>
            <h1 className="mb-6 whitespace-pre-line">{copy.heroTitle}</h1>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mb-10 leading-relaxed">
              {copy.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#quote" className="btn-primary flex items-center gap-2">
                {copy.heroCtaQuote}
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/" className="btn-secondary">
                {copy.heroCtaBack}
              </Link>
            </div>
          </div>
        </section>

        {/* Entry Paths */}
        <section id="entry-paths" className="section bg-card/20">
          <div className="section-container">
            <h2
              className={`mb-12 transition-all duration-700 ${entryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              {copy.entryTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {copy.entries.map((entry, i) => {
                const Icon = entry.icon;
                return (
                  <div
                    key={i}
                    className={`transition-all duration-700 ${entryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    style={{ transitionDelay: entryVisible ? `${i * 150}ms` : "0ms" }}
                  >
                    <div
                      className={`card-base h-full border ${entry.border} ${entry.bg} transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-background/50`}>
                          <Icon className={`w-5 h-5 ${entry.color}`} />
                        </div>
                        <h3 className="text-lg font-bold">{entry.title}</h3>
                      </div>
                      <p className="text-foreground/70 text-sm leading-relaxed">{entry.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Service Pillars */}
        <section id="service-pillars" className="section">
          <div className="section-container">
            <h2
              className={`mb-12 transition-all duration-700 ${pillarsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              {copy.pillarsTitle}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {copy.pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={i}
                    className={`transition-all duration-700 ${pillarsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    style={{ transitionDelay: pillarsVisible ? `${i * 120}ms` : "0ms" }}
                  >
                    <div className={`card-base card-hover h-full ${pillar.border}`}>
                      <div className="flex items-start justify-between mb-5 gap-3">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-7 h-7 ${pillar.color} flex-shrink-0`} />
                          <div>
                            <span className={`text-xs font-bold tracking-widest px-2 py-0.5 rounded ${pillar.tagColor}`}>
                              {pillar.tag}
                            </span>
                            <h3 className="text-xl font-bold mt-1">{pillar.title}</h3>
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {pillar.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                            <span className={`${pillar.color} font-bold mt-0.5 flex-shrink-0`}>—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-border pt-4 flex items-baseline justify-between">
                        <span className="font-bold text-lg">{pillar.price}</span>
                        <span className="text-foreground/50 text-sm">{pillar.freq}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Lanzamiento Completo Pack */}
        <section id="lanzamiento-pack" className="section bg-card/20">
          <div className="section-container">
            <div
              className={`transition-all duration-700 ${packVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h2 className="mb-3">{copy.packTitle}</h2>
              <p className="text-foreground/50 text-sm font-bold tracking-widest uppercase mb-10">
                {copy.packBadge}
              </p>

              <div className="border border-accent/40 rounded-xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="grid md:grid-cols-2 gap-10 relative z-10">
                  <div>
                    <h3 className="text-3xl font-bold mb-4 italic">{copy.packName}</h3>
                    <p className="text-foreground/70 leading-relaxed mb-6">{copy.packDesc}</p>
                    <p className="text-foreground/50 text-sm italic">{copy.packPrice}</p>
                    <a href="#quote" className="btn-primary mt-6 inline-flex items-center gap-2">
                      {language === "en" ? "Request a Custom Proposal" : "Consultar Propuesta"}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-foreground/50 uppercase mb-4">
                      {language === "en" ? "Includes" : "Incluye"}
                    </p>
                    <ul className="space-y-3">
                      {copy.packIncludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-foreground/80">
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section id="pricing-table" className="section">
          <div className="section-container">
            <h2
              className={`mb-4 transition-all duration-700 ${pricingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              {copy.pricingTitle}
            </h2>
            <p
              className={`text-foreground/50 text-sm mb-10 transition-all duration-700 ${pricingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: pricingVisible ? "100ms" : "0ms" }}
            >
              {copy.pricingNote}
            </p>

            <div
              className={`transition-all duration-700 ${pricingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: pricingVisible ? "200ms" : "0ms" }}
            >
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-card">
                      {copy.pricingHeaders.map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-4 text-xs font-bold tracking-widest text-foreground/50 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {copy.pricing.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0 hover:bg-card/50 transition-colors"
                      >
                        <td className="px-5 py-4 text-sm font-semibold">
                          <span className="flex items-center gap-2">
                            {row.service}
                            {row.recurring && (
                              <span className="text-xs font-bold text-foreground/50 bg-muted px-2 py-0.5 rounded">
                                {copy.recurringLabel}
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-foreground/60">{row.scope}</td>
                        <td className="px-5 py-4 text-sm font-bold text-accent">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Form */}
        <QuoteForm language={language} />
      </main>

      <Footer language={language} />
    </div>
  );
}
