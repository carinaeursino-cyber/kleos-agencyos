import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DraftingCompass, GraduationCap, Search, SquareKanban } from "lucide-react";
import { consultingServices } from "../data";

// Un ícono por frente de trabajo, emparejado por id. Mismo text-gold que
// tenía "[01 / 04]".
const serviceIcons = {
  "01": Search, // Diagnóstico operativo
  "02": DraftingCompass, // Diseño del sistema (compás de trazado / blueprint)
  "03": SquareKanban, // Implementación en ClickUp (tablero)
  "04": GraduationCap, // Adopción del equipo (capacitación)
};

// ─────────────────────────────────────────────────────────────────
// ServicesSection — Implementación
// Misma mecánica que las cuatro brechas: tarjetas apiladas que se
// van apilando una sobre la otra con pin de scroll.
// ─────────────────────────────────────────────────────────────────

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsBlockRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray<HTMLElement>(".service-stack-card");
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // ── Watermark parallax ──
      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { y: 200 },
          {
            y: -200,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // ── Headline parallax ──
      if (headlineRef.current) {
        const line1 = headlineRef.current.querySelector(".headline-line-1");
        const line2 = headlineRef.current.querySelector(".headline-line-2");

        if (isMobile) {
          gsap.fromTo(
            headlineRef.current,
            { scale: 0.75, opacity: 0.3 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: headlineRef.current,
                start: "top bottom",
                end: "bottom 60%",
                scrub: 1.2,
              },
            }
          );
        } else {
          const parallaxAmount = "6vw";

          gsap.fromTo(
            line1,
            { x: parallaxAmount },
            {
              x: `-${parallaxAmount}`,
              ease: "none",
              scrollTrigger: {
                trigger: headlineRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );

          gsap.fromTo(
            line2,
            { x: `-${parallaxAmount}` },
            {
              x: parallaxAmount,
              ease: "none",
              scrollTrigger: {
                trigger: headlineRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      }

      // ── Stack de tarjetas con pin ──
      if (cards.length > 0 && cardsBlockRef.current) {
        const scrollMultiplier = isMobile ? 60 : 100;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardsBlockRef.current,
            start: "top top",
            end: `+=${cards.length * scrollMultiplier}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        cards.forEach((card, idx) => {
          if (idx === 0) return;

          tl.fromTo(
            card,
            isMobile
              ? { y: "100vh", opacity: 0.8 }
              : { x: "-100vw", opacity: 0.8 },
            {
              ...(isMobile ? { y: "0vh" } : { x: "0vw" }),
              opacity: 1,
              duration: 1,
              ease: "none",
            }
          );

          for (let j = 0; j < idx; j++) {
            const targetScale = 1 - (idx - j) * 0.035;
            const shift = isMobile ? -(idx - j) * 8 : -(idx - j) * 45;

            tl.to(
              cards[j],
              {
                scale: targetScale,
                ...(isMobile ? { y: `${shift}px` } : { x: `${shift}px` }),
                opacity: 1 - (idx - j) * 0.15,
                duration: 1,
                ease: "none",
              },
              "<"
            );
          }
        });

        tl.to({}, { duration: 0.85 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services-section"
      className="relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans"
    >
      {/* Watermark */}
      <div
        ref={watermarkRef}
        className="absolute left-[-5vw] top-40 select-none pointer-events-none opacity-[0.012] text-[25vw] font-serif italic text-white leading-none whitespace-nowrap will-change-transform"
      >
        Método
      </div>

      {/* Headline */}
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-8 sm:pb-12 md:pb-16 px-5 sm:px-6 md:px-12 lg:px-24 max-w-6xl mx-auto select-none overflow-hidden w-full flex flex-col justify-start">
        <div className="mb-4 sm:mb-8 md:mb-10 lg:mb-12">
          <p className="font-mono text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.25em] text-gold uppercase mb-3">
            Implementación
          </p>
        </div>

        <h2
          ref={headlineRef}
          className="font-serif tracking-tight leading-[0.9] text-neutral-100 font-light max-w-none flex flex-col gap-2 sm:gap-3"
        >
          <span className="headline-line-1 block will-change-transform pb-2 text-[clamp(2.6rem,7vw,7rem)]">
            No te lo contamos.
          </span>
          <span className="headline-line-2 block text-gold italic font-normal will-change-transform pb-2 self-start sm:self-auto text-[clamp(2.6rem,7vw,7rem)]">
            Te lo implementamos.
          </span>
        </h2>

        <p className="mt-5 md:mt-7 font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.3em] text-gold uppercase select-none">
          Entender → Diseñar → Implementar → Capacitar → Acompañar
        </p>

        <p className="mt-3 md:mt-4 text-neutral-500 font-light text-sm md:text-base leading-relaxed max-w-xl select-text">
          Del diagnóstico a la adopción: nosotros construimos. Tu equipo opera.
        </p>
      </div>

      {/* Stack de tarjetas con pin */}
      <div
        ref={cardsBlockRef}
        className="relative w-full h-screen bg-[#050505] flex flex-col justify-between py-10 sm:py-16 md:py-20"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 lg:px-24 w-full select-none">
          <div className="flex items-center gap-3 sm:gap-4 justify-between">
            <span className="font-mono text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-gold uppercase">
              04 FRENTES · DEL DIAGNÓSTICO A LA ADOPCIÓN
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-gold/15 to-transparent ml-2 sm:ml-4" />
          </div>
        </div>

        <div className="relative flex-1 w-full max-w-5xl mx-auto flex items-center justify-center h-[52vh] sm:h-[56vh] my-2 sm:my-4 px-4 sm:px-6 md:px-12">
          {consultingServices.map((service, idx) => {
            const ServiceIcon = serviceIcons[service.id] ?? Search;
            return (
            <div
              key={service.id}
              className="service-stack-card absolute w-[calc(100%-16px)] sm:w-full max-w-4xl h-[52vh] sm:h-[56vh] min-h-[360px] sm:min-h-[380px] max-h-[470px] sm:max-h-[490px] bg-[#0B0B0C] border border-gold/15 hover:border-gold/30 rounded-xl sm:rounded-2xl flex flex-col justify-between p-5 sm:p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] group transition-colors duration-300 will-change-transform origin-center"
              style={{ zIndex: idx + 1 }}
            >
              {/* Acentos dorados */}
              <div className="absolute top-0 left-8 sm:left-12 w-1/4 h-[1px] bg-gradient-to-r from-gold/0 via-gold/30 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute left-0 top-0 bottom-0 w-[2px] sm:w-[3px] bg-gold/20 group-hover:bg-gold/45 rounded-l-xl sm:rounded-l-2xl transition-colors duration-500" />

              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-2 sm:pb-3 md:pb-4 select-none shrink-0">
                <ServiceIcon
                  className="h-4 w-4 shrink-0 text-gold sm:h-[18px] sm:w-[18px]"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <span className="font-mono text-[7px] sm:text-[8px] md:text-[9px] tracking-widest text-neutral-600 uppercase hidden sm:block">
                  Frente de trabajo
                </span>
              </div>

              {/* Cuerpo */}
              <div className="my-auto py-2 sm:py-3 overflow-hidden">
                <h4 className="text-lg sm:text-xl md:text-3xl font-serif text-neutral-100 mb-2 sm:mb-3 tracking-tight leading-snug group-hover:text-gold transition-colors duration-500 select-text">
                  {service.title}
                </h4>

                <p className="text-neutral-500 text-[10px] sm:text-xs md:text-sm font-light font-sans mb-2 sm:mb-3 select-text">
                  {service.intro}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1 sm:gap-y-1.5 max-w-3xl">
                  {service.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold/70 mt-[7px] shrink-0" />
                      <span className="text-neutral-400 text-[10px] sm:text-xs md:text-[13px] font-light leading-snug select-text">
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resultado */}
              <div className="border-t border-white/5 pt-3 sm:pt-4 shrink-0">
                <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.25em] text-gold uppercase font-bold select-none">
                  Resultado
                </span>
                <p className="font-serif italic text-gold text-sm sm:text-base md:text-xl font-normal leading-snug mt-1 select-text">
                  “{service.result}”
                </p>
              </div>
            </div>
            );
          })}
        </div>

        {/* Rail inferior */}
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 lg:px-24 w-full flex justify-between items-center border-t border-white/5 pt-2 sm:pt-3 select-none">
          <span className="font-mono text-[6px] sm:text-[8px] text-neutral-600 uppercase tracking-[0.2em] sm:tracking-[0.25em]">
            KLEOS CONSULTORÍA
          </span>
          <span className="font-mono text-[6px] sm:text-[8px] text-gold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            IMPLEMENTACIÓN
          </span>
        </div>
      </div>

      {/* Refuerzo — frase suelta reciclada del diferenciador */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 lg:px-24 pt-10 md:pt-14 pb-2 text-center">
        <p className="font-serif italic text-gold text-lg md:text-2xl font-normal leading-snug select-text">
          No empezamos por la herramienta. Primero la operación. Después la herramienta.
        </p>
      </div>
    </section>
  );
}