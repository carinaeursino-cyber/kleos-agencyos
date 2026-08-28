// ─────────────────────────────────────────────────────────────────
// "Cómo funciona" — el comportamiento de ese boton vive aca una sola vez
// y lo comparten el Hero, ValueSection y cualquier CTA futuro.
//
// Mientras VSL_URL tenga el placeholder, el boton hace scroll suave con
// Lenis hasta la seccion Implementacion (que es donde el visitante ve como
// funciona el servicio: los 4 frentes). En el momento en que el mini VSL
// este publicado y se reemplace la URL, la MISMA funcion pasa a abrir el
// video en una pestaña nueva: ningun componente se toca.
//
// Por que no un href directo: asi el sitio nunca puede quedar con un enlace
// roto. Un <a href="https://TU-URL-DEL-MINI-VSL"> es exactamente lo que el
// hero tenia hoy, y es la causa de que el boton mas visible de la pagina
// abriera una pagina de error del navegador.
// ─────────────────────────────────────────────────────────────────

export const VSL_URL = "https://TU-URL-DEL-MINI-VSL";

export const SERVICES_SECTION_ID = "services-section";

// "Configurada" = https/http real y sin el marcador de posicion.
const isConfigured = (url: string) =>
  /^https?:\/\//.test(url) && !url.includes("TU-URL");

export function openHowItWorks() {
  if (isConfigured(VSL_URL)) {
    window.open(VSL_URL, "_blank", "noopener,noreferrer");
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