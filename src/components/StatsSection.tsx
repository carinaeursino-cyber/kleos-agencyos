import { useEffect, useRef, useState } from "react";
import { stats } from "../data";
import type { Stat } from "../types";

// ─────────────────────────────────────────────────────────────────
// StatsSection — La franja de credibilidad
// Va entre ProblemSection (Sintomas) y AosSection (La solucion). 4 contadores:
// numero serif dorado + etiqueta gris, en 2x2 en movil y 4 columnas en desktop.
//
// Como el pedido trajo su propia tecnica (IntersectionObserver + rAF, no el
// ScrollTrigger/gsap que usan las otras secciones), aca NO hay gsap: el unico
// movimiento de la franja es el conteo. Por eso tampoco hay tween de reveal: si
// manana se quiere la entrada con subida+fade de las hermanas, hay que sumar el
// bloque gsap.context() y una clase de ancla, no mezclar los dos sistemas sobre el
// mismo nodo.
//
// Los guiones fijos ("+" y "5–") no son parte del numero animado: vive en la
// constante como prefijo/sufijo, asi que el conteo nunca toca un caracter que no
// tiene que cambiar.
// ─────────────────────────────────────────────────────────────────

const DURACION_MS = 1500;

// easeOutExpo: arranque rapido, desaceleracion larga (lo pedido).
const easeOutExpo = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

export default function StatsSection() {
  const bandRef = useRef<HTMLDivElement>(null);

  // `null` = todavia no se disparo. Y "todavia no se disparo" se pinta con el
  // valor FINAL (no con 0): es lo que hace que el HTML sin JS o antes del scroll
  // ya diga 7+, 70+, 400+ y 5–50. El reinicio a 0 ocurre solo en el frame en el
  // que el observador dispara.
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const el = bandRef.current;
    if (!el) return;

    // Con "reducir movimiento" activo no se observa ni se anima: los numeros
    // quedan en su valor final desde el primer paint.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let enMarcha = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        // Una sola vez. Se corta por las dos vias: disconnect() (no llegan mas
        // entradas) y esta bandera (aunque alguien reconecte el observador, o el
        // hot reload remonte el componente, el conteo no vuelve a arrancar).
        if (enMarcha) return;
        enMarcha = true;
        io.disconnect();

        // El reloj es el timestamp que trae el propio requestAnimationFrame, no
        // performance.now(): asi el origen del tiempo es UNO solo (mezclar los dos
        // dio numeros negativos en la prueba, ver el comentario de abajo). Y `p` se
        // limita a [0,1] para que un frame fuera de rango no pueda pintar basura.
        let t0 = 0;
        const step = (now: number) => {
          if (t0 === 0) t0 = now;
          const p = Math.max(0, Math.min(1, (now - t0) / DURACION_MS));
          setProgress(easeOutExpo(p));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const valor = (s: Stat) =>
    progress === null ? s.to : Math.round(s.from + (s.to - s.from) * progress);

  return (
    <section
      id="stats-section"
      className="relative bg-[#050505] text-white border-t border-white/10 overflow-hidden font-sans"
    >
      {/* Solo border-t a proposito: cada <section> del sitio trae su propio
          border-t border-white/10, asi que la linea de abajo la aporta
          AosSection. Poner border-b duplicaria el filete (dos lineas pegadas). */}
      <div
        ref={bandRef}
        className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 py-20 md:py-24 relative z-10"
      >
        <p className="stats-label font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-gold uppercase text-center mb-10 md:mb-12 select-none">
          Agency OS no fue inventado. Fue observado.
        </p>

        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
          {stats.map((s) => (
            <div key={s.id} className="stat-item flex flex-col items-center text-center">
              <p className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-none text-gold select-text">
                {/* El valor animado es decorativo para un lector de pantalla (iría
                    leyendo 3, 5, 6, 7…): lo que se anuncia es el final. En el
                    sr-only va SOLO el numero, sin la etiqueta, porque la etiqueta
                    ya esta ahi abajo como texto visible — si la repitiera, el
                    lector diria "7+ Agencias operadas…" dos veces. */}
                <span aria-hidden="true">
                  {s.prefix}
                  {valor(s)}
                  {s.suffix}
                </span>
                <span className="sr-only">
                  {s.prefix}
                  {s.to}
                  {s.suffix}
                </span>
              </p>
              <p className="mt-3 text-neutral-500 text-xs md:text-[13px] font-light leading-relaxed select-text">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}