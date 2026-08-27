import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────
// CtaBanner — Bloques de conversión (intermedio y final)
// ─────────────────────────────────────────────────────────────────

interface CtaBannerProps {
  id: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: string;
  items?: string[];
  buttonLabel: string;
  smallText?: string;
  footerText?: string;
  action: "scroll" | "contact";
  scrollTarget?: string;
}

export default function CtaBanner({
  id,
  eyebrow,
  title,
  highlight,
  intro,
  items,
  buttonLabel,
  smallText,
  footerText,
  action,
  scrollTarget,
}: CtaBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        y: 90,
        opacity: 0,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    if (action === "contact") {
      navigate("/contacto");
    } else if (scrollTarget) {
      document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 py-20 md:py-28">
        <div className="relative max-w-5xl mx-auto text-center border border-gold/20 bg-gradient-to-b from-[#0B0B0C] to-[#040405] rounded-3xl p-10 md:p-16 lg:p-20 overflow-hidden">
          {/* Glow dorado */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[420px] bg-gold/[0.05] rounded-full blur-3xl pointer-events-none" />
          {/* Línea superior */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          <div className="relative z-10 space-y-8">
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold uppercase font-bold block select-none">
              {eyebrow}
            </span>
            <div className="w-16 h-px bg-gold/40 mx-auto" />

            <h3 className="font-serif text-2xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight text-neutral-100 select-text">
              {title}
              {highlight && (
                <>
                  <br className="hidden sm:inline" />
                  <span className="text-gold italic font-normal"> {highlight}</span>
                </>
              )}
            </h3>

            {intro && (
              <p className="text-neutral-400 font-light text-sm md:text-base leading-relaxed max-w-2xl mx-auto select-text">
                {intro}
              </p>
            )}

            {items && items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 bg-[#070708] border border-white/[0.07] rounded-lg px-4 py-3"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/80 mt-[8px] shrink-0" />
                    <span className="text-neutral-300 text-[13px] font-light leading-snug select-text">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleClick}
                className="cursor-hover inline-flex items-center gap-3 bg-gold hover:bg-gold-hover text-[#050505] px-9 md:px-12 py-4 rounded-full font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-bold transition-colors duration-300 shadow-[0_0_50px_rgba(197,160,89,0.2)]"
              >
                {buttonLabel}
              </button>

              {smallText && (
                <p className="mt-5 text-neutral-500 font-light text-xs md:text-[13px] leading-relaxed select-text">
                  {smallText}
                </p>
              )}
            </div>

            {footerText && (
              <div className="border-t border-white/5 pt-6 mt-2">
                <p className="font-serif italic text-gold text-sm md:text-base font-normal select-text">
                  {footerText}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
