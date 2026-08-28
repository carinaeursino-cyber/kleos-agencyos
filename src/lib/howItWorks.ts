// ─────────────────────────────────────────────────────────────────
// "Cómo funciona" — el comportamiento de ese boton vive aca una sola vez
// y lo comparten el Hero, ValueSection y cualquier CTA futuro.
//
// Prioridades del boton:
//   1. VSL_PAGE (/vsl): la landing con el video y el CTA de agendamiento.
//   2. si se vacia la constante, scroll suave con Lenis a la seccion
//      Implementacion (donde igual se ve como funciona el servicio).
// El video en si se embebe dentro de la landing con VSL_EMBED_URL
// (src/pages/VslPage.tsx), no aca.
//
// Por que no un href directo: asi el sitio nunca puede quedar con un enlace
// roto: el <a href="https://TU-URL-DEL-MINI-VSL"> que tenia el hero abria
// una pagina de error del navegador.
// ─────────────────────────────────────────────────────────────────

export const VSL_PAGE = "/vsl";

export const SERVICES_SECTION_ID = "services-section";

// "Configurada" = URL absoluta (https://...) o ruta interna del sitio
// (empieza con /), y sin el marcador de posicion. Con esto el boton nunca
// puede quedar roto: si la constante se vacia, cae en el scroll.
const isConfigured = (url: string) =>
  (url.startsWith("/") || /^https?:\/\//.test(url)) && !url.includes("TU-URL");

export function openHowItWorks() {
  // La landing /vsl existe: es el destino real del boton. Se usa
  // location.assign en vez de un <Link> porque esta funcion vive fuera del
  // Router (la comparten el hero y ValueSection como onClick). En una
  // landing de video la recarga completa es irrelevante: no hay estado que
  // conservar y la pagina no tiene la intro cinematografica.
  if (isConfigured(VSL_PAGE)) {
    window.location.assign(VSL_PAGE);
    return;
  }

  const target = document.getElementById(SERVICES_SECTION_ID);
  if (!target) return;

  // App.tsx guarda la instancia en window (linea 51). Se usa SU scrollTo y no
  // scrollIntoView: con Lenis interceptando la rueda, el scroll nativo "smooth"
  // pelea con el suavizado propio y el salto queda cortado o a saltos.
  type LenisLike = { scrollTo?: (t: HTMLElement, o?: Record<string, unknown>) => void };
  const lenis = (window as unknown as { lenis?: LenisLike }).lenis;

  if (lenis?.scrollTo) {
    lenis.scrollTo(target, { offset: -80, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}