import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StatementSection from "../StatementSection";
import { pillars } from "../data";
import { openHowItWorks } from "../lib/howItWorks";

// ─────────────────────────────────────────────────────────────────
// ValueSection — Propuesta de valor
// "En KLEOS no organizamos tareas..." + los tres niveles de trabajo.
// ─────────────────────────────────────────────────────────────────

export default function ValueSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".pillar-intro-label", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pillar-intro-label",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".pillar-card", {
        y: 70,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pillar-grid",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".pillar-cta", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pillar-cta",
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative bg-[#050505] border-t border-white/10">
      <StatementSection
        id="value-section"
        variant="deblur"
        eyebrow="La solución"
        bottomLeft="KLEOS CONSULTORÍA"
        compactMobile
        text="Agency OS reemplaza el caos por un sistema."
        highlight="Procesos claros y responsabilidades definidas. Todo en un solo lugar."
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 pb-24 md:pb-36 relative z-10">
        <p className="pillar-intro-label font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-neutral-500 uppercase text-center mb-10 md:mb-14 select-none">
          Lo que cambia en tu día a día
        </p>

        <div className="pillar-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="pillar-card group relative bg-[#0B0B0C] border border-white/10 hover:border-gold/30 rounded-2xl p-7 md:p-9 transition-colors duration-300 overflow-hidden"
            >
              {/* Glow sutil al hover */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/[0.04] rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative">
                {/* Se eliminó la cabecera "[01 / 03]" con su filete divisorio.
                    Las tarjetas quedan con el título como único elemento
                    destacado. key={pillar.id} se conserva más arriba: el id ya
                    no se muestra, pero sigue identificando a cada tarjeta. */}
                <h3 className="font-serif text-2xl md:text-3xl text-neutral-100 font-light tracking-tight mb-3 group-hover:text-gold transition-colors duration-500 select-text">
                  {pillar.title}
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed font-light select-text">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA secundario ──
            Misma logica que el boton del Hero (openHowItWorks): scroll suave
            con Lenis a #services-section, o el video si VSL_URL se llega a
            configurar. Borde fino dorado y text-gold: el mismo tratamiento del
            footer de la home, para no sumar un estilo nuevo al sitio.
            Centrado y con mt-14/md:mt-16: el contenedor ya cierra con
            pb-24 md:pb-36, asi que el aire propio del boton es el de arriba. */}
        <div className="pillar-cta mt-14 md:mt-16 flex justify-center">
          <button
            type="button"
            onClick={openHowItWorks}
            className="cursor-hover group inline-flex items-center gap-3 rounded-full border border-gold/30 px-6 py-3 text-gold transition-all duration-300 hover:border-gold hover:bg-gold/5"
          >
            <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em]">
              Ver cómo funciona
            </span>
            <svg
              className="h-3 w-3 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}