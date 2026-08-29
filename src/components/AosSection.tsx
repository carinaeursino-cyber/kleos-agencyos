import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Crown, Handshake, LayoutDashboard, Settings } from "lucide-react";
import { aosLayers, controlDashboards } from "../data";
import { openHowItWorks } from "../lib/howItWorks";

// Íconos de marca por tarjeta, emparejados por id de data.ts. Línea fina
// (strokeWidth 1.25) y el mismo text-gold sólido que tenían los números:
// cambia el marcador, no la paleta. Se evitó PieChart en "Dashboard ejecutivo"
// porque esa tarjeta ya muestra un gráfico de anillo y el ícono duplicaría
// exactamente el mismo dibujo.
const layerIcons = {
  // El emparejado va por id, no por titulo: si manana cambia el copy, el icono
  // queda donde tiene que quedar.
  "01": Building2, // Centro de Mando — el edificio de la direccion
  "02": Settings, // Motor Operativo — engranaje de la ejecucion
  "03": Handshake, // Gestion de Clientes — la relacion con el cliente
};

const dashboardIcons = {
  "01": Crown, // Dashboard ejecutivo — vista de dirección
  "02": LayoutDashboard, // Dashboard operativo — panel de control
};

// ── Capturas de los dashboards ──
// Mismo mecanismo que AboutSection usa con la foto de Carina: se toman los
// archivos de src/assets/images/ y se emparejan por substring del nombre.
// Si el PNG todavia no esta, la tarjeta se renderiza sin imagen y el build
// NO se rompe. Soltar el archivo en esa carpeta alcanza para que aparezca.
const dashboardImages = import.meta.glob("../assets/images/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// Captura y alt por tarjeta, emparejados por id de data.ts.
// Vive aca y no en data.ts por el mismo motivo que la foto de Carina vive en
// AboutSection: es cableado de un asset, no copy editable.
const dashboardCaptures: Record<string, { file: string; alt: string }> = {
  "01": {
    file: "salud_de_proyecto",
    alt: "Semáforo de Salud de Proyectos: gráfico de anillo con el estado de cada proyecto.",
  },
  "02": {
    file: "volumen_activo_por_persona",
    alt: "Volumen Activo por Persona: gráfico de barras con la carga de trabajo de cada integrante.",
  },
};

const imageFor = (id: string) => {
  const want = dashboardCaptures[id]?.file.toLowerCase();
  if (!want) return undefined;
  const hit = Object.entries(dashboardImages).find(([path]) =>
    path.toLowerCase().includes(want)
  );
  return hit ? { src: hit[1], alt: dashboardCaptures[id].alt } : undefined;
};

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

      // El CTA no pasa por reveal(): venia de ValueSection con su propio tween
      // mas suave (y 24, start top 92%) porque es un boton suelto, no una grilla
      // de tarjetas. Se conserva para que el boton se vea igual que antes.
      gsap.from(".aos-cta", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".aos-cta",
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
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
          {/* El h2 y la linea dorada son el statement que vivia en ValueSection,
              que se fusiono aca. El h2 conserva la clase del que habia (el mismo
              tamanio del resto de las secciones). Ojo con el cambio de reparto:
              antes el dorado era la SEGUNDA MITAD del titulo (un <span> adentro
              del h2) y ahora es una linea aparte, asi que el h2 queda sin <span>
              y sin el {" "} de separacion.
              La linea dorada usa la receta de linea dorada suelta del sitio (la de
              ServicesSection y el cierre de ProblemSection: font-serif + italic +
              text-gold + font-normal). Unica desviacion de la receta que habia aca:
              max-w-2xl en vez de max-w-xl, porque son 3 frases y 197 caracteres. */}
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02] text-neutral-100 select-text">
            Agency OS reemplaza el caos por un sistema.
          </h2>
          <p className="mt-5 max-w-2xl font-serif italic text-gold text-base md:text-lg font-normal leading-relaxed select-text">
            Procesos que se ejecutan sin que tengas que recordarlos. Responsabilidades
            que no hay que perseguir. Todo en un solo lugar.
          </p>
        </div>

        {/* Capas del sistema */}
        <div className="aos-layers-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {aosLayers.map((layer) => {
            const LayerIcon = layerIcons[layer.id] ?? Building2;
            return (
            <div
              key={layer.id}
              className="aos-layer-card group relative bg-[#0B0B0C] border border-white/10 hover:border-gold/30 rounded-2xl p-6 md:p-8 transition-colors duration-300 flex flex-col"
            >
              {/* Acento superior */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Cabecera de la tarjeta: solo el icono dorado.
                  Llevaba a la derecha la etiqueta "Layer", eliminada por
                  decorativa. Se retira tambien justify-between: con un unico
                  hijo no hacia nada (flex-start es el default). items-center se
                  conserva de cuando el icono se alineaba contra el label (un SVG
                  no tiene linea base de texto) para que la cabecera siga ordenada
                  si algun dia vuelve a dividirse en dos. */}
              <div className="flex items-center border-b border-white/5 pb-4 mb-5 select-none">
                <LayerIcon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.25} aria-hidden="true" />
              </div>

              <h3 className="font-serif text-xl md:text-2xl font-light tracking-tight text-neutral-100 group-hover:text-gold transition-colors duration-500 select-text">
                {layer.title}
              </h3>
              <p className="mt-2 text-neutral-500 text-[13px] font-light leading-relaxed select-text">
                {layer.description}
              </p>

              {/* Se quito la lista de bullets; la tarjeta queda con
                  titulo + descripcion corta. */}
            </div>
            );
          })}
        </div>

        {/* ── CTA secundario ──
            Venia de ValueSection; se trajo aca, centrado y debajo de las 3
            tarjetas, para que el bloque del sistema no cierre con las tarjetas
            solas. Misma logica que el boton del Hero (openHowItWorks -> /vsl, con
            caida a scroll en #services-section si VSL_PAGE se desconfigura; por eso
            no va un <Link> duro). Borde fino dorado, text-gold y la etiqueta en
            mayusculas por la clase: el tratamiento del footer de la home, sin sumar
            un estilo nuevo al sitio. */}
        <div className="aos-cta mt-14 md:mt-16 flex justify-center">
          <button
            type="button"
            onClick={openHowItWorks}
            className="cursor-hover group inline-flex items-center gap-3 rounded-full border border-gold/30 px-6 py-3 text-gold transition-all duration-300 hover:border-gold hover:bg-gold/5"
          >
            <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em]">
              Ver cómo funciona
            </span>
            <svg
              className="h-3 w-3 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Separador entre las 3 capas y los dashboards ──
          Hijo directo del <section>, igual que los cortes reales del sitio:
          border-t border-white/10 aplicado sobre un elemento que ocupa el
          ancho de viewport, no el de max-w-6xl. Fuera del contenedor a
          proposito, si no quedaria cortado a 1152px.
          El aire lo dan los py-24 md:py-36 de los dos contenedores, que son
          exactamente los que delimitan los demas cortes del home (ProblemSection,
          ServicesSection, OnboardingSection, AutomationSection, FitSection,
          AboutSection, FaqSection y los dos CtaBanner). No se citan numeros de
          linea a proposito: se rompen con el primer corte de secciones. */}
      <div className="border-t border-white/10" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 py-24 md:py-36 relative z-10">
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
            {controlDashboards.map((dash) => {
              const capture = imageFor(dash.id);
              const DashIcon = dashboardIcons[dash.id] ?? LayoutDashboard;
              return (
              <div
                key={dash.id}
                className="aos-dashboard-card relative bg-[#0B0B0C] border border-white/10 hover:border-gold/30 rounded-2xl p-6 md:p-9 transition-colors duration-300"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 select-none">
                  <DashIcon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.25} aria-hidden="true" />
                  <span className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/30" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  </span>
                </div>

                <h4 className="font-serif text-xl md:text-2xl font-light tracking-tight text-neutral-100 mb-5 select-text">
                  {dash.title}
                </h4>

                {capture && (
                  <figure className="mb-5">
                    <img
                      src={capture.src}
                      alt={capture.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full rounded-lg border border-white/10"
                    />
                  </figure>
                )}

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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}