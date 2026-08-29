import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Square } from "lucide-react";
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
        text="Tu equipo no llegó a su límite."
        emphasis="Tu forma de operar sí."
        highlight="Porque no puedes escalar con procesos que viven en tu cabeza."
        dense
        align="left"
        compactMobile
      />

      {/* Introducción + síntomas */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 pb-20 md:pb-28 relative z-10">
        <div className="problem-intro max-w-3xl mx-auto text-center space-y-4 md:space-y-5 mb-14 md:mb-20 select-text">
          {/* Titular de apertura de la sección. Subió de párrafo (text-base/lg,
              font-light) a headline: escala grande + peso semibold.
              Color neutro y fuente sans intactos — la jerarquía se logra solo
              por tamaño y peso. font-semibold en vez de bold porque index.css
              carga Inter en 300;400;500;600, así que 700 se sintetizaría mal. */}
          <h3 className="text-neutral-300 font-semibold text-2xl sm:text-[1.75rem] md:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight text-balance">
            Tu gente trabaja bien. Pero tu forma de trabajar no escala.
          </h3>
          <p className="text-neutral-500 font-light text-sm md:text-base leading-relaxed">
            ¿Cuántos de estos síntomas reconoces?
          </p>
        </div>

        {/* Grid de síntomas — tarjetas con el dinamismo de las brechas.
            6 tarjetas = 1 col x 6 en mobile, 2 x 3 en tablet, 3 x 2 en desktop.
            Con lg:grid-cols-4 la ultima fila quedaba a la mitad (4 + 2); 3 columnas
            cierra el rectangulo y ademas prolijidad vertical: a 373px de ancho cada
            texto largo entra en 2 renglones, a 276px eran 3 y las filas se veian
            desparejas. */}
        <div className="symptom-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {symptoms.map((s) => (
            <div
              key={s.id}
              className="symptom-card group relative bg-[#0B0B0C] border border-white/10 hover:border-gold/30 rounded-xl p-5 md:p-6 transition-all duration-300 hover:shadow-[0_0_35px_rgba(197,160,89,0.08)] overflow-hidden"
            >
              {/* Línea láser superior (patrón de las brechas) */}
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Barra dorada lateral */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold/25 group-hover:bg-gold/50 rounded-l-xl transition-colors duration-500" />

              {/* Casillero vacío — reemplaza la numeración 01–06 de los ids.
                  Es decorativo (sin estado de clic en esta iteración).
                  Se usa el icono de lucide en lugar del carácter "☐" porque
                  U+2610 no está en Inter ni en JetBrains Mono: renderizarlo
                  como texto provoca fallback de fuente distinto por SO. */}
              <Square
                aria-hidden="true"
                size={14}
                strokeWidth={1.25}
                className="relative block mb-3 text-gold/50 group-hover:text-gold transition-colors duration-300"
              />
              <p className="relative text-neutral-400 group-hover:text-neutral-200 text-[13px] md:text-sm font-light leading-relaxed transition-colors duration-300 select-text">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        {/* Una sola frase de cierre (era un bloque de axiomas; el axioma "Crecer
            significa más caos, no más orden." se eliminó porque duplicaba a la
            ultima tarjeta del grid). */}
        <div className="problem-axioms mt-12 md:mt-16 max-w-2xl mx-auto text-center space-y-3 md:space-y-4">
          {/* Cierre de la seccion, en dorado y cursiva (la receta del sitio para
              la frase de remate). Antes venia entre comillas tipograficas “ ”
              porque era una cita suelta; ahora habla en segunda persona
              ("No te preocupes"), asi que las comillas se sacaron: envolver en
              comillas algo que le decis al lector lo convierte en refran. */}
          <p className="font-serif italic text-gold text-base md:text-lg font-normal leading-snug select-text">
            No te preocupes. El desorden es solo un síntoma natural de tu éxito. Tu
            agencia creció más rápido que tus procesos y ahora solo toca implementar la
            estructura para que puedas escalar al siguiente nivel.
          </p>
        </div>
      </div>
    </div>
  );
}