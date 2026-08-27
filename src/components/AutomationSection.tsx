import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { automations } from "../data";

// ─────────────────────────────────────────────────────────────────
// AutomationSection — Automatización y control
// ─────────────────────────────────────────────────────────────────

export default function AutomationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".autom-header > *", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".autom-header",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".autom-card", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".autom-grid",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".autom-axiom", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".autom-axiom",
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
      id="automation-section"
      className="relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 py-24 md:py-36 relative z-10">
        {/* Header */}
        <div className="autom-header max-w-3xl mb-14 md:mb-20">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            Automatización y control
          </p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02] text-neutral-100 select-text">
            Menos seguimiento manual.{" "}
            <span className="text-gold italic font-normal">Más visibilidad.</span>
          </h2>
          <p className="mt-5 text-neutral-500 font-light text-sm md:text-base leading-relaxed max-w-xl select-text">
            Lo que se repite, se automatiza:
          </p>
        </div>

        {/* Grid de automatizaciones */}
        <div className="autom-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {automations.map((a) => (
            <div
              key={a.id}
              className="autom-card group relative bg-[#0B0B0C] border border-white/10 hover:border-gold/30 rounded-xl px-5 py-4 flex items-start gap-3 transition-colors duration-300"
            >
              <span className="font-mono text-[10px] text-gold/60 group-hover:text-gold transition-colors duration-300 mt-[2px] shrink-0">
                [{a.id}]
              </span>
              <span className="text-neutral-400 group-hover:text-neutral-200 text-[13px] md:text-sm font-light leading-snug transition-colors duration-300 select-text">
                {a.text}
              </span>
            </div>
          ))}
        </div>

        {/* Axioma */}
        <div className="autom-axiom mt-14 md:mt-20 max-w-3xl mx-auto text-center border border-gold/15 bg-gold/[0.03] rounded-2xl px-8 md:px-14 py-10 md:py-12">
          <p className="font-serif text-lg md:text-2xl font-light leading-relaxed text-neutral-100 select-text">
            Automatizar no elimina el criterio humano.
            <br />
            <span className="text-gold italic">
              Lo reserva para lo que importa.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
