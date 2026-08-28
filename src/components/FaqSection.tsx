import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faqItems } from "../data";

// ─────────────────────────────────────────────────────────────────
// FaqSection — Preguntas frecuentes (acordeón)
// ─────────────────────────────────────────────────────────────────

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".faq-header > *", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".faq-header",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".faq-item", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".faq-list",
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq-section"
      className="relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans"
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-12 py-24 md:py-36 relative z-10">
        {/* Header */}
        <div className="faq-header text-center mb-12 md:mb-16">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            FAQ
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight leading-[1.02] text-neutral-100 select-text">
            Preguntas <span className="text-gold italic font-normal">frecuentes.</span>
          </h2>
        </div>

        {/* Lista */}
        <div className="faq-list divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {faqItems.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="faq-item">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="cursor-hover group w-full flex items-center justify-between gap-6 py-5 md:py-6 text-left"
                >
                  <span className="flex items-baseline gap-4 md:gap-6">
                    <span
                      className={`font-serif font-light text-lg md:text-2xl leading-snug transition-colors duration-300 select-text ${
                        isOpen ? "text-gold" : "text-neutral-200 group-hover:text-white"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                      isOpen
                        ? "border-gold/50 text-gold"
                        : "border-white/10 text-neutral-500 group-hover:border-gold/30 group-hover:text-gold"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-neutral-400 font-light text-sm md:text-base leading-relaxed max-w-2xl select-text">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}