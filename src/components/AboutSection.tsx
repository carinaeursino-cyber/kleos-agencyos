import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutFocus } from "../data";

// ── Foto de Carina ──
// Si el archivo src/assets/images/foto_carina_hero.png (o .jpg) existe,
// se muestra la foto. Si no, se muestra el monograma "C" como respaldo.
const carinaImages = import.meta.glob("../assets/images/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const carinaPhoto = Object.entries(carinaImages).find(([path]) =>
  path.toLowerCase().includes("foto_carina_hero")
)?.[1];

// ─────────────────────────────────────────────────────────────────
// AboutSection — Sobre Carina
// ─────────────────────────────────────────────────────────────────

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".about-header > *", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-header",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".about-card", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-card",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".about-focus-chip", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-focus-grid",
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".about-axiom", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-axiom",
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
      id="about-section"
      className="relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 py-24 md:py-36 relative z-10">
        {/* Header */}
        <div className="about-header max-w-3xl mb-14 md:mb-20">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            Sobre Carina
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight leading-[1.02] text-neutral-100 select-text">
            La operación compleja también puede{" "}
            <span className="text-gold italic font-normal">volverse clara.</span>
          </h2>
        </div>

        {/* Bio card */}
        <div className="about-card relative bg-[#0B0B0C] border border-white/10 hover:border-gold/25 rounded-2xl p-7 md:p-12 transition-colors duration-500 overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Monograma o foto */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              {carinaPhoto ? (
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border border-gold/30 shadow-[0_0_60px_rgba(197,160,89,0.12)]">
                  <img
                    src={carinaPhoto}
                    alt="Carina Ursino"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-gold/20 pointer-events-none" />
                </div>
              ) : (
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border border-gold/30 flex items-center justify-center bg-gradient-to-b from-[#0B0B0C] to-[#050505] shadow-[0_0_60px_rgba(197,160,89,0.08)]">
                  <div className="absolute inset-2 rounded-full border border-gold/10" />
                  <span className="font-serif text-6xl md:text-7xl text-gold italic font-light select-none">
                    C
                  </span>
                </div>
              )}
              <p className="mt-6 font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase select-none">
                Carina Ursino
              </p>
              <p className="mt-2 text-neutral-500 text-xs font-light leading-relaxed select-text">
                Project &amp; Operations Manager · PMO
                <br />
                Consultora en transformación digital
                <br />y optimización de procesos
              </p>
            </div>

            {/* Texto */}
            <div className="lg:col-span-8">
              {/* Bio en 3 parrafos. El envoltorio con space-y-4 es la receta de
                  parrafos apilados del sitio (la bio de /vsl usa la misma); cada
                  <p> conserva literalmente la clase que ya tenia este parrafo,
                  y el gold sobre "13 anos" se mantiene: era el unico acento de
                  la bio y el numero es el argumento de autoridad. */}
              <div className="space-y-4">
                <p className="text-neutral-300 font-light text-base md:text-lg leading-relaxed select-text">
                  Durante{" "}
                  <span className="text-gold font-normal">13 años</span> gestioné
                  operaciones en startups y agencias que crecían rápido. Vi equipos
                  talentosos quemarse por falta de claridad. Vi CEOs brillantes
                  atrapados en el día a día, sin poder ver el bosque completo.
                </p>
                <p className="text-neutral-300 font-light text-base md:text-lg leading-relaxed select-text">
                  El patrón era siempre el mismo: la operación no acompañaba el ritmo
                  de la facturación. No era falta de talento. Era falta de sistema.
                </p>
                <p className="text-neutral-300 font-light text-base md:text-lg leading-relaxed select-text">
                  Creé Agency OS para cerrar esa brecha. Solo implementación pura de
                  una arquitectura operativa que te permita delegar sin miedo, escalar
                  sin caos y recuperar el control de tu agencia.
                </p>
              </div>

              {/* La etiqueta se guarda en su caja natural porque la clase ya trae
                  `uppercase`: en pantalla sale en mayusculas, igual que antes. */}
              <p className="mt-5 font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase select-none">
                Lo que obtienes al trabajar conmigo:
              </p>

              <div className="about-focus-grid mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {aboutFocus.map((f, i) => (
                  <div
                    key={i}
                    className="about-focus-chip flex items-center gap-2.5 border border-white/[0.07] bg-[#070708] rounded-lg px-4 py-2.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/70 shrink-0" />
                    <span className="text-neutral-300 text-[13px] font-light select-text">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Axioma */}
        <div className="about-axiom mt-14 md:mt-20 max-w-3xl mx-auto text-center">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mb-6" />
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light leading-snug text-neutral-100 select-text">
            No trabajo para que parezca ordenada una semana.
            <br />
            <span className="text-gold italic">
              Trabajo para que ejecutes mejor cuando el volumen crezca.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}