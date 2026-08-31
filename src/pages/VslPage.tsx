import { useEffect, useRef } from "react";
import { Check, Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// El enlace de agendamiento vive en src/lib/booking.ts, que es el mismo que
// usa el CTA del header del sitio. Se lo importa como CAL_URL para no tocar los
// tres botones de esta pagina.
import { BOOKING_URL as CAL_URL } from "../lib/booking";

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

// El boton no menciona duracion: la agenda real
// (cal.com/carina-ursino/sesion-diagnostico, verificada 2026-08-28) es el
// evento "Diagnóstico Operativo" de 30 min, y prometer 15 obligaba a defender
// el numero en la llamada. Sin numero, la promesa se sostiene sola.
// Son 3 los lugares que consumen CTA_LABEL (arriba del video, abajo del video
// y el CTA final): cambiar la constante alcanza para los tres.
const CTA_LABEL = "Agenda tu Auditoría Operativa";
const HEADER_LABEL = "Agendar auditoría";
// El microcopy del boton nuevo, el que va arriba del video.
const CTA_MICRO = "Una conversación directa sobre tu operación.";

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

// Las 4 + 4 de "¿Es esto para ti?". Son texto PROPIO de esta pagina: antes las
// dos columnas se filtraban de fitYes/fitNo (data.ts) para que el home y el VSL
// no se desincronizaran, y esa ventaja se pierde a cambio de poder decir otra
// cosa aca. Si manana queres volver a compartirlas, hay que alinear los dos
// textos en data.ts. El `id` es solo la key de React: no se pinta.
const fitYesVsl = [
  { id: "vsl-si-01", text: "Tienes clientes activos y un equipo (interno o externo)." },
  { id: "vsl-si-02", text: "Tu agencia creció, pero la operación quedó atrás." },
  { id: "vsl-si-03", text: "Buscas implementar un sistema, no solo recibir consejos." },
  { id: "vsl-si-04", text: "Quieres saber exactamente dónde estás perdiendo margen y tiempo." },
];

const fitNoVsl = [
  { id: "vsl-no-01", text: "Buscas una plantilla genérica sin adaptar a tu agencia." },
  { id: "vsl-no-02", text: "Todavía no tienes un servicio definido." },
  { id: "vsl-no-03", text: "Quieres resolver el caos sin involucrar a tu equipo en la adopción." },
  { id: "vsl-no-04", text: 'Esperas una llamada de "descubrimiento" genérica con teoría de manual.' },
];

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
          {/* Cuatro frases en tres renglones: cada una de las dos primeras tiene
              renglon propio y el par dorado va junto, porque se lee de una. El
              quiebre despues de "memoria." es donde cambia el tiempo del
              argumento. Se saca lg:text-7xl —el home lo tiene y aca el titular
              es 2x mas largo—:
              a 72px son ~5 lineas (~365px) y el video y el boton se iban debajo
              del pliegue. Cap en 60px, la misma talla del h1 del hero. */}
          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-tight leading-[1.06] text-neutral-100 select-text">
            Tu agencia no depende de ti.
            <br />
            Depende de tu memoria.
            <br />
            <span className="text-gold italic font-normal">
              Y eso no es escalable. En pocos minutos, te muestro por qué.
            </span>
          </h1>
          <p className="mt-5 md:mt-6 text-neutral-400 font-light text-sm md:text-[15px] leading-relaxed max-w-2xl md:max-w-3xl mx-auto text-balance select-text">
            Lo que estás a punto de ver no es un tutorial. Es una demostración de cómo
            operan las agencias que facturan sin caos.
          </p>

          {/* CTA arriba del video: hay visitantes que no lo van a ver y hay que
              darles salida antes, no despues. Misma receta del boton dorado del
              hero (mismo radio, mismo glow, mismo microcopy debajo) y full-width
              en mobile. */}
          <div className="mt-9 md:mt-11 flex flex-col items-center">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-hover inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-gold px-9 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#050505] shadow-[0_0_50px_rgba(197,160,89,0.2)] transition-colors duration-300 hover:bg-gold-hover md:px-12 md:text-[11px]"
            >
              {CTA_LABEL}
            </a>
            <p className="mt-3 max-w-[280px] text-center text-neutral-500 font-light text-xs leading-relaxed select-text">
              {CTA_MICRO}
            </p>
          </div>
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
            {/* Microtexto: la receta del hero (mt-3 + max-w-[280px] + text-xs).
                Los TRES microcopy de esta pagina usan exactamente esas clases,
                para que el ancho de linea no cambie segun donde este el boton. */}
            <p className="mt-3 max-w-[280px] text-center text-neutral-500 font-light text-xs leading-relaxed select-text">
              Primera conversación exploratoria, sin compromiso.
            </p>
          </div>
        </div>
      </section>

      {/* ── ¿Es esto para ti? — seccion fusionada ──
          Antes eran dos secciones: "Sobre la auditoria" (que enumeraba de que se
          habla) y el fit de dos columnas. Ahora es una sola con el filtro al
          frente, que es lo que califica en una landing de video. Los 4 puntos de
          "sobre la auditoria" salen del aire a proposito: el titulo de esta
          seccion ya dice lo mismo. ── */}
      <section className="relative z-10 border-t border-white/10 px-5 sm:px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            ¿Es esto para ti?
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight leading-[1.05] text-neutral-100 select-text">
            Una conversación directa sobre tu{" "}
            <span className="text-gold italic font-normal">operación.</span>
          </h2>

          <div className="mt-8 grid grid-cols-1 items-start gap-4 sm:mt-10 md:grid-cols-2 md:gap-6">
            {/* Columna dorada: el borde gold/20 y el filete superior solo aca,
                la misma marca de FitSection en el home. */}
            <div className="relative rounded-2xl border border-gold/20 bg-[#0B0B0C] p-7 md:p-9">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4 select-none">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gold">
                  Sí, es para ti si:
                </span>
              </div>

              <ul className="space-y-3">
                {fitYesVsl.map((item) => (
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
                  No, no es para ti si:
                </span>
              </div>

              <ul className="space-y-3">
                {fitNoVsl.map((item) => (
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
        </div>
      </section>

      {/* ── Sobre Carina: bloque centrado (avatar con anillo dorado, nombre,
          una linea de autoridad, bio larga y los 6 enfoques bajo un filete).
          Es TU maquetacion de esta ronda, no la bio card del home: el avatar
          es mas chico (112/128px vs 144/176), el anillo es un gradiente en vez
          de border + glow de esquina, y hay un border-t antes de los chips. ── */}
      <section className="relative z-10 border-t border-white/10 px-5 sm:px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase mb-4 select-none">
            Sobre Carina
          </p>

          {/* Tarjeta Sobre Carina - estructura centrada */}
          <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 backdrop-blur-sm md:p-12">
            <div className="flex flex-col items-center text-center">
              {/* Avatar y perfil */}
              <div className="mb-8 flex flex-col items-center">
                <div className="relative mb-4 h-28 w-28 rounded-full bg-gradient-to-b from-gold/40 via-gold/10 to-transparent p-1 md:h-32 md:w-32">
                  {carinaPhoto ? (
                    <img
                      src={carinaPhoto}
                      alt="Carina Ursino"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0B0B0C]">
                      <span className="font-serif text-5xl font-light italic text-gold select-none">
                        C
                      </span>
                    </div>
                  )}
                </div>

                {/* El nombre va UNA sola vez. Tu bloque tenia un <h3>Carina
                    Ursino</h3> y debajo un <span>CARINA URSINO</span>: se leia
                    dos veces. Queda el <h3> (le da jerarquia al bloque para
                    lectores de pantalla) con la receta del sitio para el nombre
                    bajo la foto: font-mono + gold + uppercase + 0.3em. */}
                <h3 className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-gold select-none">
                  Carina Ursino
                </h3>

                {/* Una sola linea de autoridad, sin el cargo doble en 3 renglones */}
                <p className="mt-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                  PMO &amp; Consultora de Procesos para Agencias
                </p>
              </div>

              {/* Bio centrada. Dos parrafos: el primero describe el patron que
                  vio, el segundo que vino a resolverlo. Sin marca de herramienta
                  en el texto (la bio del home todavia dice "en ClickUp"; aca no). */}
              <div className="mx-auto max-w-2xl space-y-4">
                <p className="text-base md:text-lg leading-relaxed text-neutral-300 font-light select-text">
                  Soy Carina Ursino, Project Manager y especialista en operaciones
                  digitales. Durante más de <span className="text-gold font-medium">13
                  años</span> he gestionado operaciones en startups y agencias en
                  crecimiento, trabajando directamente con equipos, procesos y sistemas.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-neutral-300 font-light select-text">
                  Agency OS nace de esa experiencia: no como una teoría sobre cómo
                  debería funcionar una agencia, sino como una arquitectura operativa
                  diseñada para implementarse en el día a día.
                </p>
              </div>

              {/* Pilares / chips, separados de la bio con un filete */}
              <div className="mt-12 md:mt-16 w-full max-w-3xl border-t border-neutral-800/80 pt-8">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-6">
                  MI ENFOQUE COMBINA
                </span>

                {/* Los 6 strings ya existen arriba como vslFocus (los consume
                    solo esta tarjeta), asi que se mapea esa constante en vez de
                    re-escribir el array aca: mismo render, una sola fuente. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-left">
                  {vslFocus.map((item) => (
                    <div
                      key={item}
                      className="flex items-center space-x-3 rounded-xl border border-neutral-800 bg-neutral-950/60 px-5 py-3.5 text-sm text-neutral-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0"></span>
                      <span className="select-text">{item}</span>
                    </div>
                  ))}
                </div>
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
          <p className="mt-3 max-w-[280px] text-center text-neutral-500 font-light text-xs leading-relaxed select-text">
            Primera conversación exploratoria, sin compromiso.
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