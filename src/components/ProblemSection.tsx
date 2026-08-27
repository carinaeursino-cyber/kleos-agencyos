import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StatementSection from "../StatementSection";
import { symptoms } from "../data";

// ─────────────────────────────────────────────────────────────────
// ProblemSection — El problema
// Tesis + síntomas de una operación que quedó atrás del crecimiento.
// ─────────────────────────────────────────────────────────────────

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Párrafos de introducción
      gsap.from(".problem-intro > *", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".problem-intro",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      // Grid de síntomas — reveal progresivo por tarjeta al hacer scroll
      // Cada síntoma aparece individualmente al entrar en pantalla,
      // alternando sutilmente la dirección de entrada para crear ritmo.
      const symptomCards = gsap.utils.toArray<HTMLElement>(".symptom-card");

      symptomCards.forEach((card, i) => {
        gsap.set(card, {
          autoAlpha: 0,
          y: 44,
          x: i % 2 === 0 ? -26 : 26,
        });
      });

      ScrollTrigger.batch(symptomCards, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            x: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: "power3.out",
          });
        },
      });

      // Frases de refuerzo (axiomas heredados de las brechas)
      gsap.from(".problem-axioms > *", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".problem-axioms",
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      // Axioma de cierre
      gsap.from(".problem-axiom", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".problem-axiom",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative bg-[#050505]">
      {/* Tesis */}
      <StatementSection
        id="problem-section"
        variant="deblur"
        eyebrow="El problema"
        bottomLeft="KLEOS CONSULTORÍA"
        text="El problema no es tu equipo."
        highlight="Es que no hay un sistema que organice cómo trabaja."
      />

      {/* Introducción + síntomas */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 pb-20 md:pb-28 relative z-10">
        <div className="problem-intro max-w-3xl mx-auto text-center space-y-4 md:space-y-5 mb-14 md:mb-20 select-text">
          <p className="text-neutral-300 font-light text-base md:text-lg leading-relaxed">
            Tu gente trabaja bien, pero tu forma de trabajar quedó chica.
          </p>
          <p className="text-neutral-500 font-light text-sm md:text-base leading-relaxed">
            ¿Cuántos de estos síntomas reconoces?
          </p>
        </div>

        {/* Grid de síntomas — tarjetas con el dinamismo de las brechas */}
        <div className="symptom-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {symptoms.map((s) => (
            <div
              key={s.id}
              className="symptom-card group relative bg-[#0B0B0C] border border-white/10 hover:border-gold/30 rounded-xl p-5 md:p-6 transition-all duration-300 hover:shadow-[0_0_35px_rgba(197,160,89,0.08)] overflow-hidden"
            >
              {/* Línea láser superior (patrón de las brechas) */}
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Barra dorada lateral */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold/25 group-hover:bg-gold/50 rounded-l-xl transition-colors duration-500" />

              <span className="relative font-mono text-[10px] text-gold/50 group-hover:text-gold transition-colors duration-300 block mb-3">
                [{s.id}]
              </span>
              <p className="relative text-neutral-400 group-hover:text-neutral-200 text-[13px] md:text-sm font-light leading-relaxed transition-colors duration-300 select-text">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        {/* Frases de refuerzo (axiomas de las brechas) */}
        <div className="problem-axioms mt-12 md:mt-16 max-w-2xl mx-auto text-center space-y-3 md:space-y-4">
          <p className="font-serif italic text-gold text-base md:text-lg font-normal leading-snug select-text">
            “Una operación madura no depende de preguntar. Depende de poder consultar.”
          </p>
          <p className="font-serif italic text-gold text-base md:text-lg font-normal leading-snug select-text">
            “No construiste una agencia para ser el centro de cada problema.”
          </p>
        </div>

        {/* Axioma */}
        <div className="problem-axiom mt-14 md:mt-20 max-w-3xl mx-auto text-center relative">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mb-6" />
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light leading-snug text-neutral-100 select-text">
            Crecer significa
            <br />
            <span className="text-gold italic">
              más caos, no más orden.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
