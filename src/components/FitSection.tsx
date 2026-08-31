import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fitYes, fitNo } from "../data";
import { Check, X } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// FitSection — Para quién es / para quién no es
// ─────────────────────────────────────────────────────────────────

export default function FitSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".fit-header > *", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fit-header",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".fit-card", {
        y: 80,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fit-grid",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="fit-section"
      className="relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 py-24 md:py-36 relative z-10">
        {/* Header */}
        <div className="fit-header max-w-3xl mb-14 md:mb-20">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            Para quién es
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight leading-[1.02] text-neutral-100 select-text">
            Esto no es para {" "}
            <span className="text-gold italic font-normal">todas las agencias.</span>
          </h2>
        </div>

        <div className="fit-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
          {/* Para quién SÍ */}
          <div className="fit-card relative bg-[#0B0B0C] border border-gold/20 rounded-2xl p-7 md:p-9">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6 select-none">
              <span className="font-mono text-[10px] text-gold font-bold tracking-widest uppercase">
                kleos Agency OS es para agencias que:
              </span>
            </div>

            <ul className="space-y-3">
              {fitYes.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-[1px]">
                    <Check className="w-3 h-3 text-gold" />
                  </span>
                  <span className="text-neutral-300 text-sm font-light leading-relaxed select-text">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Para quién NO */}
          <div className="fit-card relative bg-[#0B0B0C] border border-white/10 rounded-2xl p-7 md:p-9">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6 select-none">
              <span className="font-mono text-[10px] text-neutral-500 font-bold tracking-widest uppercase">
                Este sistema no es para:
              </span>
            </div>

            <ul className="space-y-3">
              {fitNo.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-[1px]">
                    <X className="w-3 h-3 text-neutral-500" />
                  </span>
                  <span className="text-neutral-500 text-sm font-light leading-relaxed select-text">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Axioma */}
            <div className="mt-8 border-t border-white/5 pt-6">
              <p className="font-serif italic text-gold text-base md:text-lg font-normal leading-snug select-text">
                “La herramienta no reemplaza la responsabilidad. La hace visible.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
