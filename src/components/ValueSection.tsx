import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StatementSection from "../StatementSection";
import { pillars } from "../data";

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
        highlight="Procesos claros. Responsabilidades definidas. Todo en un solo lugar."
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
                <div className="flex items-baseline justify-between border-b border-white/5 pb-4 mb-5 select-none">
                  <span className="font-mono text-[10px] text-gold font-bold">
                    [{pillar.id} / 03]
                  </span>
                </div>

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
      </div>
    </div>
  );
}
