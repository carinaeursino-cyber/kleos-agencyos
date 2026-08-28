import { useEffect, useRef } from "react";
import { Check, Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fitNo, fitYes } from "../data";

// ─────────────────────────────────────────────────────────────────
// VslPage — landing del "Mira cómo funciona"
//
// Pagina de una sola columna, sin navegacion completa: video + CTA.
// Reutiliza las recetas visuales del sitio (no se define ningun estilo
// nuevo): tarjetas bg-[#0B0B0C] + rounded-2xl de AosSection/AboutSection,
// tiles bg-[#070708] + rounded-lg de CtaBanner, circulos Check/X de
// FitSection, boton primario dorado del hero y eyebrow/titulares
// font-mono + font-serif del resto de las secciones.
// ─────────────────────────────────────────────────────────────────

// ⚠️ LOS UNICOS DOS TEXTOS QUE CONVIENE REVISAR ANTES DE PUBLICAR.
// La agenda real (cal.com/carina-ursino/sesion-diagnostico, verificada el
// 2026-08-28) dice "Diagnóstico Operativo | Agency OS" y duracion 30m.
// El copy pedido dice "Auditoría Operativa" y 15 min. Se deja textual como
// se pidio; para alinear la promesa con la agenda real, cambiar estas dos
// lineas y nada mas (se usan en 3 lugares).
const CTA_LABEL = "Agenda tu Auditoría Operativa de 15 min";
const HEADER_LABEL = "Agendar auditoría";

const CAL_URL = "https://cal.com/carina-ursino/sesion-diagnostico";

// ── El embed ──
// Mientras sea null se pinta el placeholder: no hay iframe activo en la
// pagina. Para activarlo, poner aca la URL del reproductor (o pasar la prop
// videoUrl). Formatos que van a funcionar directo:
//   Vimeo    https://player.vimeo.com/video/ID
//   Loom     https://www.loom.com/embed/ID
//   YouTube  https://www.youtube.com/embed/ID
export const VSL_EMBED_URL: string | null = null;

// ── Foto de Carina ──
// MISMA logica que AboutSection.tsx (lineas 6-16): si
// src/assets/images/foto_carina_hero.png (o .jpg) existe, se muestra la foto;
// si falta, cae en el monograma "C". El sitio ya pesa 1,75 MB por esa imagen:
// en /vsl se paga de nuevo si el visitante llega directo (campana), por eso
// conviene una version recortada (~60 KB) — oferta, no aplicado.
const carinaImages = import.meta.glob("../assets/images/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const carinaPhoto = Object.entries(carinaImages).find(([path]) =>
  path.toLowerCase().includes("foto_carina_hero")
)?.[1];

// Los 6 enfoques de esta landing NO son los del home (aboutFocus en data.ts):
// aca se eligen los que sostienen la promesa del diagnostico.
const vslFocus = [
  "Metodología Agency OS.",
  "Sistemas sin dependencia del fundador.",
  "Estandarización de entregables.",
  "Optimización en ClickUp.",
  "Adopción real de equipos remotos.",
  "Reducción de cuellos de botella.",
];

// Copy propio de esta pagina (lo demas sale de data.ts para que las dos
// paginas no se desincronicen).
const auditPoints = [
  "Revisamos cómo está organizada tu operación hoy.",
  "Identificamos dónde se pierde tiempo, dinero o control.",
  "Te decimos si Agency OS es lo que tu agencia necesita — o no.",
  "Sin pitch de venta genérico: hablamos de tu caso puntual.",
];

// Las viñetas que el home ya tiene, filtradas por id de data.ts: son texto
// byte a byte igual, asi que si manana se edita la seccion "Para quién es"
// del home, esta pagina sigue alineada. El tercer "no es para ti" es propio
// de esta landing y se suma abajo, aparte.
const only = (items: { id: string; text: string }[], ids: string[]) =>
  ids.map((id) => items.find((i) => i.id === id)).filter(Boolean) as {
    id: string;
    text: string;
  }[];
const vslYes = only(fitYes, ["01", "02", "05"]);

// El 3er "no es para ti" NO esta en data.ts: ahi fitNo tiene 4 items y los
// consume el home. Agregandolo alla, la tarjeta "Para quien es" del home
// pasaria de 4 a 5 lineas. Por eso se declara aca y se pega detras de las
// dos compartidas; el id es solo la key de React.
const vslNoExtra = {
  id: "vsl-05",
  text: "Quieres resolver el caos sin involucrar a tu equipo en la adopción.",
};
const vslNo = [...only(fitNo, ["01", "04"]), vslNoExtra];

interface VslPageProps {
  videoUrl?: string | null;
}

export default function VslPage({ videoUrl = VSL_EMBED_URL }: VslPageProps = {}) {
  const pageRef = useRef<HTMLDivElement>(null);

  // Titulo y descripcion propios: es una landing que se comparte y se
  // publicita, y el index.html solo tiene los del sitio principal.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Así funciona Agency OS · KLEOS Consultoría";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  // Reveal SOLO del encabezado. El video y el boton quedan fuera de la
  // animacion a proposito: son la razon de la pagina y tienen que estar
  // visibles aunque el scrolltrigger no dispare.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".vsl-header > *", {
        y: 26,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".vsl-header",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans overflow-x-hidden selection:bg-gold/30 selection:text-white"
    >
      {/* Glow ambiental, el mismo del hero del sitio */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(197,160,89,0.05) 0%, transparent 60%)",
        }}
      />

      {/* ── Header minimo: logo + CTA. Sin menu de navegacion: en una
          landing de video cualquier enlace de salida es una fuga. ── */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-5 sm:px-6 md:px-12 py-6 md:py-8 border-b border-white/[0.06]">
        <Link to="/" className="cursor-hover group inline-flex flex-col" aria-label="Volver al inicio de KLEOS Consultoría">
          <span className="font-serif text-2xl md:text-3xl tracking-[0.15em] font-light leading-none">
            <span className="text-[#C5A059]">K</span>
            <span className="text-white">·L·E·O·S</span>
          </span>
          <span className="mt-1.5 font-mono text-[7px] sm:text-[8px] tracking-[0.4em] text-gold/60 uppercase select-none">
            Consultoría
          </span>
        </Link>

        {/* Variante ghost: identica a la del CTA del header principal */}
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-hover group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gold/30 px-4 py-2 text-gold transition-all duration-300 hover:border-gold hover:bg-gold/5"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] sm:text-[9px] sm:tracking-[0.3em]">
            {HEADER_LABEL}
          </span>
          <svg
            className="h-3 w-3 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </header>

      {/* ── Hero + VSL ── */}
      <section className="relative z-10 px-5 sm:px-6 md:px-12 pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="vsl-header mx-auto max-w-4xl text-center">
          {/* Eyebrow: la receta del sitio (font-mono + tracking ancho + gold +
              uppercase por CSS). Va en mayusculas literales porque el copy lo
              define asi; el class uppercase queda redundante pero inofensivo. */}
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            DIAGNÓSTICO OPERATIVO GRATUITO
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02] text-neutral-100 select-text">
            Cómo pasar del caos operativo a una agencia que escala{" "}
            <span className="text-gold italic font-normal">
              sin depender de ti.
            </span>
          </h1>
          <p className="mt-4 md:mt-5 text-neutral-400 font-light text-sm md:text-base leading-relaxed max-w-xl mx-auto select-text">
            90 segundos para ver cómo se ve el sistema por dentro.
          </p>
        </div>

        {/* El video manda: max-w-3xl (768px) para que a 16:9 sean ~432px de
            alto y no obligue a scrollear. El texto de arriba usa max-w-4xl. */}
        <div className="mx-auto mt-10 md:mt-14 max-w-3xl">
          {videoUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0C]">
              <iframe
                src={videoUrl}
                title="Así funciona Agency OS"
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              role="img"
              aria-label="Espacio reservado para el video de presentación de Agency OS"
              className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0C]"
            >
              {/* Filete superior de las cards del sitio */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
                <span className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                  {/* 1px a la derecha: un triangulo optico no se centra igual
                      que un circulo, queda picudo a la izquierda. */}
                  <Play className="h-6 w-6 md:h-7 md:w-7 translate-x-[1px]" strokeWidth={1.25} fill="currentColor" aria-hidden="true" />
                </span>
                <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-neutral-500 select-none">
                  Video no publicado todavía
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 md:mt-10 flex flex-col items-center">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-hover inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-gold px-9 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#050505] shadow-[0_0_50px_rgba(197,160,89,0.2)] transition-colors duration-300 hover:bg-gold-hover md:px-12 md:text-[11px]"
            >
              {CTA_LABEL}
            </a>
            {/* Microtexto: la misma receta del que esta bajo el CTA del hero */}
            <p className="mt-5 text-neutral-500 font-light text-xs md:text-[13px] leading-relaxed select-text">
              Primera conversación exploratoria.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sobre la auditoria ── */}
      <section className="relative z-10 border-t border-white/10 px-5 sm:px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            Sobre la auditoría
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight leading-[1.05] text-neutral-100 select-text">
            Una conversación directa sobre tu{" "}
            <span className="text-gold italic font-normal">operación.</span>
          </h2>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2">
            {auditPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 rounded-lg border border-white/[0.07] bg-[#070708] px-4 py-3"
              >
                <span className="w-1 h-1 rounded-full bg-gold/80 mt-[8px] shrink-0" />
                <span className="text-neutral-300 text-[13px] font-light leading-snug select-text">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Es para ti / No es para ti: las dos cards de FitSection, con su
          borde dorado y su filete solo en la columna afirmativa ── */}
      <section className="relative z-10 border-t border-white/10 px-5 sm:px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6">
          <div className="relative rounded-2xl border border-gold/20 bg-[#0B0B0C] p-7 md:p-9">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4 select-none">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gold">
                Es para ti si:
              </span>
            </div>

            <ul className="space-y-3">
              {vslYes.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                    <Check className="h-3 w-3 text-gold" />
                  </span>
                  <span className="text-neutral-300 text-sm font-light leading-relaxed select-text">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-[#0B0B0C] p-7 md:p-9">
            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4 select-none">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                No es para ti si:
              </span>
            </div>

            <ul className="space-y-3">
              {vslNo.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <X className="h-3 w-3 text-neutral-500" />
                  </span>
                  <span className="text-neutral-500 text-sm font-light leading-relaxed select-text">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Sobre Carina: la bio card de AboutSection.tsx (foto circular con
          glow, nombre en gold, subtitulo, titulo destacado y los 6 chips con
          su receta rounded-lg + border-white/[0.07] + bg-[#070708] + punto
          bg-gold/70), pero en una sola columna centrada: se elimina el split
          4/8 del home y todo queda en el eje, como el resto de la landing.
          Los textos de ancho se capan a max-w-2xl (672px) para que el
          parrafo y la grilla no estiren los 800px del card; a 672 cada chip
          queda en ~331px, el texto en ~285px y "Sistemas sin dependencia
          del fundador." entra en una linea igual que en el home. ── */}
      <section className="relative z-10 border-t border-white/10 px-5 sm:px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            Sobre Carina
          </p>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0C] p-7 transition-colors duration-500 hover:border-gold/25 md:p-12">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/[0.04] blur-3xl pointer-events-none" />

            <div className="relative flex flex-col items-center text-center">
              {/* Foto circular con glow dorado, centrada arriba */}
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

              {/* Nombre en gold, centrado debajo de la foto */}
              <p className="mt-6 font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase select-none">
                Carina Ursino
              </p>

              {/* Subtitulo en las 3 lineas del home, centrado */}
              <p className="mt-2 text-neutral-500 text-xs font-light leading-relaxed select-text">
                Project &amp; Operations Manager · PMO
                <br />
                Consultora en transformación digital
                <br />y optimización de procesos
              </p>

              {/* Titulo destacado */}
              <p className="mt-8 md:mt-10 max-w-2xl font-serif text-xl md:text-2xl lg:text-3xl font-light leading-snug text-neutral-100 select-text">
                Más de <span className="text-gold font-normal">13 años</span>{" "}
                ordenando operaciones, proyectos y equipos remotos para que
                dejen de improvisar y empiecen a trabajar con claridad.
              </p>

              <p className="mt-6 font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase select-none">
                Mi enfoque combina
              </p>

              {/* Los 6 chips, 2 x 3 desde sm. justify-center es el unico class
                  extra: sin el, el punto + el texto quedan pegados a la
                  izquierda de cada chip y la grilla no lee centrada. */}
              <div className="mt-4 grid max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2">
                {vslFocus.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-center gap-2.5 rounded-lg border border-white/[0.07] bg-[#070708] px-4 py-2.5"
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
      </section>

      {/* ── CTA final, centrado y con el aire de seccion completo antes del
          footer ── */}
      <section className="relative z-10 border-t border-white/10 px-5 sm:px-6 md:px-12 py-24 md:py-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight leading-[1.05] text-neutral-100 select-text">
            ¿Listo para ordenar tu{" "}
            <span className="text-gold italic font-normal">operación?</span>
          </h2>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-hover mt-9 md:mt-11 inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-gold px-9 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#050505] shadow-[0_0_50px_rgba(197,160,89,0.2)] transition-colors duration-300 hover:bg-gold-hover md:px-12 md:text-[11px]"
          >
            {CTA_LABEL}
          </a>
          <p className="mt-5 text-neutral-500 font-light text-xs md:text-[13px] leading-relaxed select-text">
            Sesión exploratoria.
          </p>
        </div>
      </section>

      {/* ── Footer: la version compacta del del sitio. El footer grande vive
          dentro de App.tsx y aca no se puede reusar sin extraerlo a un
          componente; si lo queres identico, se extrae y se monta. ── */}
      <footer className="relative z-10 border-t border-white/10 bg-[#030304] px-5 sm:px-6 md:px-12 py-12 text-neutral-400">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <span className="font-serif text-2xl tracking-[0.15em] font-light leading-none">
            <span className="text-[#C5A059]">K</span>
            <span className="text-white">·L·E·O·S</span>
          </span>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <Link
            to="/"
            className="cursor-hover font-mono text-[9px] uppercase tracking-[0.3em] text-gold/60 transition-colors duration-300 hover:text-gold"
          >
            Volver al sitio
          </Link>
          <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.3em] text-neutral-700">
            © 2026 KLEOS Consultoría · Operaciones para agencias
          </p>
        </div>
      </footer>
    </div>
  );
}