import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface StatementSectionProps {
  text: string;
  highlight: string;
  id?: string;
  className?: string;
  variant?: "parallax" | "deblur" | "window" | "principle";
  eyebrow?: string;
  bottomLeft?: string;
  bottomRight?: string;
}

export default function StatementSection({
  text,
  highlight,
  id,
  className = "",
  variant = "parallax",
  eyebrow,
  bottomLeft,
  bottomRight,
}: StatementSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const isDeblur = variant === "deblur";
  const isPrinciple = variant === "principle";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (variant === "parallax" && textRef.current) {
        const line1 = textRef.current.querySelector(".statement-line-1");
        const line2 = textRef.current.querySelector(".statement-line-2");

        gsap.fromTo(
          line1,
          { x: "-8vw" },
          {
            x: "8vw",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );

        gsap.fromTo(
          line2,
          { x: "8vw" },
          {
            x: "-8vw",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );

        gsap.fromTo(
          [line1, line2],
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      if (variant === "deblur" && textRef.current) {
        const words = textRef.current.querySelectorAll(".deblur-word");

        gsap.fromTo(
          words,
          {
            opacity: 0,
            filter: "blur(24px)",
            scale: 1.08,
            y: 15,
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            y: 0,
            duration: 1.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      if (variant === "window" && textRef.current) {
        gsap.fromTo(
          textRef.current,
          { y: "-6vh" },
          {
            y: "6vh",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          textRef.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      if (variant === "principle" && textRef.current) {
        const eyebrow = sectionRef.current?.querySelector(".principle-eyebrow");
        const rail = sectionRef.current?.querySelector(".principle-rail");
        const line1 = textRef.current.querySelector(".principle-line-1");
        const line2 = textRef.current.querySelector(".principle-line-2");
        const underline = textRef.current.querySelector(".principle-underline");
        const bottomRail = sectionRef.current?.querySelector(".principle-bottom-rail");

        const principleTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play reverse play reverse",
          },
        });

        principleTl
          .fromTo(
            eyebrow,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
          )
          .fromTo(
            rail,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.9, ease: "power3.out" },
            "-=0.45"
          )
          .fromTo(
            line1,
            { opacity: 0, y: 34, color: "#737373" },
            { opacity: 1, y: 0, color: "#E5E5E5", duration: 1.0, ease: "power3.out" },
            "-=0.25"
          )
          .fromTo(
            line2,
            { opacity: 0, y: 36, filter: "blur(18px)", scale: 1.04 },
            { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 1.25, ease: "power3.out" },
            "-=0.45"
          )
          .fromTo(
            underline,
            { scaleX: 0, transformOrigin: "center center", opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1.0, ease: "power3.out" },
            "-=0.7"
          )
          .fromTo(
            bottomRail,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.55"
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [variant]);

  const renderDeblurText = () => {
  const textWords      = text.split(" ");
  const highlightWords = highlight.split(" ");

  return (
    <>
      <span className="block mb-4">
        {textWords.map((word, i) => (
          <span
            key={`t-${i}`}
            className="deblur-word inline-block mr-[0.25em] will-change-transform text-neutral-100"
          >
            {word}
          </span>
        ))}
      </span>
      <span className="block">
        {highlightWords.map((word, i) => (
          <span
            key={`h-${i}`}
            className="deblur-word inline-block mr-[0.25em] will-change-transform text-gold italic font-normal"
          >
            {word}
          </span>
        ))}
      </span>
    </>
  );
};

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans flex items-center justify-center ${
        isDeblur || isPrinciple ? "min-h-screen py-14 md:py-16 lg:py-20" : "py-16 sm:py-24 md:py-32 lg:py-48 min-h-[50vh] sm:min-h-[75vh]"
      } ${className}`}
    >
      <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.008] text-[20vw] font-serif italic text-white leading-none whitespace-nowrap">
        Kleos
      </div>

      {isDeblur ? (
        <div
          ref={containerRef}
          className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 w-full min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)] flex flex-col justify-between select-none"
        >
          <div className="w-full flex items-center gap-4">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase whitespace-nowrap">
              {eyebrow ?? "KLEOS CONSULTORÍA"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-gold/15 to-transparent" />
          </div>

          <div className="flex-1 flex items-center justify-center py-16 md:py-20 lg:py-24">
            <h2
              ref={textRef}
              className="text-[4rem] md:text-5xl lg:text-7xl xl:text-8xl font-serif tracking-tight leading-[1.05] font-light w-full"
            >
              <div className="flex flex-col items-center justify-center py-4 max-w-5xl mx-auto leading-[1.1]">
                {renderDeblurText()}
              </div>
            </h2>
          </div>

          <div className="w-full flex justify-between items-center border-t border-white/5 pt-3">
            <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-[0.25em]">
              {bottomLeft ?? "KLEOS STUDIO"}
            </span>
          </div>
        </div>
      ) : isPrinciple ? (
        <div
          ref={containerRef}
          className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 w-full min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)] flex flex-col justify-between select-none"
        >
          <div className="w-full flex items-center gap-4">
            <span className="principle-eyebrow font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase whitespace-nowrap">
              {eyebrow ?? "Principio de diferenciación"}
            </span>
            <div className="principle-rail h-px flex-1 bg-gradient-to-r from-gold/20 to-transparent" />
          </div>

          <div className="flex-1 flex items-center justify-center py-16 md:py-20 lg:py-24">
            <h2
              ref={textRef}
              className="w-full text-center font-serif tracking-tight leading-[1.05] font-light"
            >
              <span className="principle-line-1 block text-3xl md:text-5xl lg:text-6xl xl:text-6xl text-neutral-200 max-w-5xl mx-auto leading-[1.05] text-balance">
                {text}
              </span>
              <span className="principle-line-2 block mt-6 md:mt-8 text-4xl md:text-6xl lg:text-7xl xl:text-7xl text-gold italic font-normal will-change-transform max-w-5xl mx-auto leading-[1.02] text-balance">
                {highlight}
              </span>
              <span className="principle-underline block mx-auto mt-8 h-px w-40 md:w-56 bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
            </h2>
          </div>

          <div className="principle-bottom-rail w-full flex justify-between items-center border-t border-white/5 pt-3">
            <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-[0.25em]">
              {bottomLeft ?? "KLEOS STUDIO"}
            </span>
            <span className="font-mono text-[8px] text-gold uppercase tracking-[0.3em] text-right">
              {bottomRight ?? "DIFERENCIACIÓN SOBRE COMPETENCIA"}
            </span>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 text-center w-full">
          <h2
            ref={textRef}
            className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-serif tracking-tight leading-[1.05] font-light w-full"
          >
            {variant === "parallax" && (
              <div className="flex flex-col gap-4 sm:gap-6 overflow-hidden py-4 w-full">
                <span className="statement-line-1 block will-change-transform text-balance sm:whitespace-nowrap">
                  {text}
                </span>
                <span className="statement-line-2 block text-gold italic font-normal will-change-transform text-balance sm:whitespace-nowrap">
                  {highlight}
                </span>
              </div>
            )}

            {variant === "window" && (
              <div className="py-4 max-w-5xl mx-auto leading-[1.1] will-change-transform select-none">
                {text} <br className="hidden sm:inline" />
                <span className="text-gold italic font-normal">{highlight}</span>
              </div>
            )}
          </h2>
        </div>
      )}
    </section>
  );
}
