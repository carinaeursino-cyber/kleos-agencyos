import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onboardingDays } from "../data";

// ─────────────────────────────────────────────────────────────────
// OnboardingSection — El onboarding de tus clientes
// Flujo centralizado de los primeros tres días.
// ─────────────────────────────────────────────────────────────────

export default function OnboardingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".onb-header > *", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".onb-header",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".onb-day-card", {
        y: 80,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".onb-days-grid",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".onb-closing", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".onb-closing",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="onboarding-section"
      className="relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 py-24 md:py-36 relative z-10">
        {/* Header */}
        <div className="onb-header max-w-3xl mb-14 md:mb-20">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            El onboarding de tus clientes
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] text-neutral-100 select-text">
            El primer día del cliente no debería depender{" "}
            <span className="text-gold italic font-normal">de la memoria del equipo.</span>
          </h2>
          <p className="mt-5 text-neutral-500 font-light text-sm md:text-base leading-relaxed max-w-xl select-text">
            Un flujo claro para los primeros tres días:
          </p>
        </div>

        {/* Días */}
        <div className="onb-days-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {onboardingDays.map((day) => (
            <div
              key={day.id}
              className="onb-day-card group relative bg-[#0B0B0C] border border-white/10 hover:border-gold/30 rounded-2xl p-6 md:p-8 transition-colors duration-300 flex flex-col"
            >
              {/* Acento superior */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="border-b border-white/5 pb-4 mb-5 select-none">
                <span className="font-mono text-[10px] text-gold font-bold">
                  {day.day}
                </span>
              </div>

              {/* Titulo + parrafo, con la receta exacta de las tarjetas de capas
                  de arriba (el h3 y el <p> de layer.description en AosSection):
                  mismo h3 y un <p> con
                  mt-2 + neutral-500 + text-[13px]. Antes de la descripcion la
                  tarjeta era solo etiqueta + titulo, y el mb-5 del h3 se quito
                  porque no habia nada debajo; con el parrafo de vuelta, el aire
                  lo pasa a dar el mt-2 del <p>. */}
              <h3 className="font-serif text-xl md:text-2xl font-light tracking-tight text-neutral-100 group-hover:text-gold transition-colors duration-500 select-text">
                {day.title}
              </h3>
              <p className="mt-2 text-neutral-500 text-[13px] font-light leading-relaxed select-text">
                {day.description}
              </p>
            </div>
          ))}
        </div>

        {/* Cierre */}
        <div className="onb-closing mt-14 md:mt-20 text-center">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mb-6" />
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light leading-snug text-neutral-100 max-w-2xl mx-auto select-text">
            El kickoff ocurre cuando la información necesaria{" "}
            <span className="text-gold italic">está disponible y validada.</span>
          </p>
        </div>
      </div>
    </section>
  );
}