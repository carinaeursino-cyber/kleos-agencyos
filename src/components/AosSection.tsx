import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aosLayers, controlDashboards } from "../data";

// ─────────────────────────────────────────────────────────────────
// AosSection — Agency Operating System
// La arquitectura completa: capas, dashboards y onboarding.
// ─────────────────────────────────────────────────────────────────

export default function AosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { y: 150 },
          {
            y: -150,
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

      const reveal = (selector: string, trigger: string) => {
        gsap.from(selector, {
          y: 70,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });
      };

      reveal(".aos-header > *", ".aos-header");
      reveal(".aos-layer-card", ".aos-layers-grid");
      reveal(".aos-dashboard-card", ".aos-dashboards-grid");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="system-section"
      className="relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans"
    >
      {/* Watermark */}
      <div
        ref={watermarkRef}
        className="absolute right-[-4vw] top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.012] text-[25vw] font-serif italic text-white leading-none whitespace-nowrap will-change-transform"
      >
        Sistema
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 py-24 md:py-36 relative z-10">
        {/* Header */}
        <div className="aos-header max-w-3xl mb-14 md:mb-20">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            Agency Operating System
          </p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02] text-neutral-100 select-text">
            Todo tu negocio, organizado{" "}
            <span className="text-gold italic font-normal">en un solo sistema.</span>
          </h2>
          <p className="mt-5 text-neutral-500 font-light text-sm md:text-base leading-relaxed max-w-xl select-text">
            Dirección, gestión interna y operación con clientes, en un mismo lugar.
          </p>
        </div>

        {/* Capas del sistema */}
        <div className="aos-layers-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
          {aosLayers.map((layer) => (
            <div
              key={layer.id}
              className="aos-layer-card group relative bg-[#0B0B0C] border border-white/10 hover:border-gold/30 rounded-2xl p-6 md:p-8 transition-colors duration-300 flex flex-col"
            >
              {/* Acento superior */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-baseline justify-between border-b border-white/5 pb-4 mb-5 select-none">
                <span className="font-mono text-[10px] text-gold font-bold">
                  [{layer.id} / 03]
                </span>
                <span className="font-mono text-[8px] tracking-widest text-neutral-600 uppercase">
                  Layer
                </span>
              </div>

              <h3 className="font-serif text-xl md:text-2xl font-light tracking-tight text-neutral-100 group-hover:text-gold transition-colors duration-500 select-text">
                {layer.title}
              </h3>
              <p className="mt-2 text-neutral-500 text-[13px] font-light leading-relaxed select-text">
                {layer.description}
              </p>

              <ul className="mt-5 space-y-2 flex-1">
                {layer.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-gold/70 mt-[7px] shrink-0" />
                    <span className="text-neutral-400 text-[13px] font-light leading-snug group-hover:text-neutral-300 transition-colors duration-300 select-text">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dashboards de control */}
        <div className="mb-16 md:mb-24">
          <div className="aos-header max-w-3xl mb-8 md:mb-12">
            <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
              Dashboards de control
            </p>
            <h3 className="font-serif text-2xl md:text-4xl font-light tracking-tight text-neutral-100 select-text">
              Para que cada nivel{" "}
              <span className="text-gold italic font-normal">vea lo que necesita.</span>
            </h3>
          </div>

          <div className="aos-dashboards-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {controlDashboards.map((dash) => (
              <div
                key={dash.id}
                className="aos-dashboard-card relative bg-[#0B0B0C] border border-white/10 hover:border-gold/30 rounded-2xl p-6 md:p-9 transition-colors duration-300"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 select-none">
                  <span className="font-mono text-[10px] text-gold font-bold">
                    [{dash.id} / 02]
                  </span>
                  <span className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/30" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  </span>
                </div>

                <h4 className="font-serif text-xl md:text-2xl font-light tracking-tight text-neutral-100 mb-5 select-text">
                  {dash.title}
                </h4>

                <ul className="space-y-2.5">
                  {dash.metrics.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-4 border-b border-white/[0.04] pb-2.5"
                    >
                      <span className="text-neutral-300 text-[13px] md:text-sm font-light select-text">
                        {m}
                      </span>
                      <span className="w-10 h-1 rounded-full bg-gold/20 shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
