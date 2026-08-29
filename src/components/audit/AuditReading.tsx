import { useEffect, type RefObject } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import type { Reading } from "../../lib/audit";
import { BOOKING_URL } from "../../lib/booking";

// Eyebrow de la lectura: el numero del protocolo, como en KLEOS INSIGHT.
export const READING_EYEBROW = "Lectura de diagnóstico · Protocolo KIP-004 · Operaciones";

// El CORE: lo que sigue despues de la lectura.
// Sin duracion en el boton: la agenda real es un evento de 30 minutos y el
// boton no tiene por que prometer un numero que despues hay que defender.
// (2026-08-30: se le quito "Sin pitch de ventas." del microcopy por decision
// de Carina; la frase que queda es la promesa, no la defensa.)
export const CORE_HEADLINE = "Hemos identificado el patrón. Ahora, veamos cómo resolverlo.";
export const CORE_LABEL = "Agenda tu sesión exploratoria";
export const CORE_MICRO = "Analicemos este diagnóstico y tracemos tu plan de acción.";

const step = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
});

interface Props {
  reading: Reading;
  seconds: number;
  onRestart: () => void;
  headingRef?: RefObject<HTMLHeadingElement | null>;
}

export default function AuditReading({ reading, seconds, onRestart, headingRef }: Props) {
  const { index, level } = reading;

  useEffect(() => {
    headingRef?.current?.focus({ preventScroll: true });
  }, [headingRef]);

  return (
    <div>
      <motion.p
        {...step(0)}
        className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold select-none md:text-[10px]"
      >
        {READING_EYEBROW}
      </motion.p>

      <motion.h2
        ref={headingRef}
        tabIndex={-1}
        {...step(1)}
        className="mt-4 font-serif text-3xl font-light leading-[1.06] tracking-tight text-neutral-100 select-text focus:outline-none md:text-5xl"
      >
        {reading.headline}
      </motion.h2>

      <motion.p
        {...step(2)}
        className="mt-5 text-neutral-400 font-light text-sm leading-relaxed select-text md:text-[15px]"
      >
        Cinco respuestas, {seconds} {seconds === 1 ? "segundo" : "segundos"} de protocolo. Esto es
        lo que el motor encontró en tu caso: la dimensión más floja primero, y en
        el orden en que pesó más.
      </motion.p>

      {/* ── Indice Kleos + salud por dimension ── */}
      <motion.div
        {...step(3)}
        className="mt-10 grid grid-cols-1 items-center gap-6 rounded-2xl border border-white/10 bg-[#0B0B0C] p-6 md:grid-cols-[auto_1fr] md:gap-10 md:p-8"
      >
        <div className="flex items-baseline gap-3 md:block">
          <p className="font-serif text-6xl font-light leading-none text-gold select-text md:text-7xl">
            {index}
          </p>
          <div className="md:mt-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 select-none">
              Índice Kleos
            </p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold select-none">
              {level.code}
            </p>
            <p className="mt-1 font-mono text-[8px] uppercase leading-relaxed tracking-[0.2em] text-neutral-500 select-none md:text-[9px]">
              {level.name}
            </p>
          </div>
        </div>

        <ul className="space-y-3">
          {reading.dimensions.map((dim) => (
            <li key={dim.key} className="flex items-center gap-4">
              <span className="w-[152px] shrink-0 font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-500 select-none">
                {dim.name}
              </span>
              <span className="relative h-[3px] flex-1 overflow-hidden bg-white/[0.07]">
                {/* El ancho es el valor real, sin animacion por JS: si la
                    animacion no corre, la barra no puede mentir en 0%. */}
                <span
                  className="absolute inset-y-0 left-0 bg-gold"
                  style={{ width: `${(dim.score / 20) * 100}%` }}
                />
              </span>
              <span className="w-10 shrink-0 text-right font-mono text-[9px] text-neutral-400 select-text">
                {dim.score}/20
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* ── Los hallazgos: cada uno viene de una respuesta concreta ── */}
      <div className="mt-10 space-y-2.5">
        {reading.findings.map((f, i) => (
          <motion.div
            key={f.text.slice(0, 24)}
            {...step(4 + i)}
            className="rounded-2xl border border-white/10 bg-[#0B0B0C] p-5 transition-colors duration-500 hover:border-gold/25 md:p-6"
          >
            <div className="flex items-center gap-2.5 select-none">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-gold">
                {f.label}
              </span>
              <span className="h-px flex-1 bg-white/[0.07]" />
              <span className="font-mono text-[9px] tracking-widest text-neutral-600">
                {f.score}/20
              </span>
            </div>
            <p className="mt-3 text-[15px] font-light leading-relaxed text-neutral-300 select-text md:text-base">
              {f.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Cierre: la misma receta del axioma del home ── */}
      <motion.div {...step(7)} className="mx-auto mt-12 max-w-2xl text-center md:mt-16">
        <div className="mx-auto mb-6 h-px w-16 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <p className="font-serif text-xl font-light leading-snug text-neutral-100 select-text md:text-2xl">
          {reading.close}
        </p>
      </motion.div>

      {/* ── El CORE: del patron a la accion ── */}
      <motion.div
        {...step(8)}
        className="relative mt-12 overflow-hidden rounded-2xl border border-gold/25 bg-[#0B0B0C] p-7 md:mt-16 md:p-12"
      >
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/[0.05] blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold select-none">
            Siguiente paso
          </p>
          <h3 className="mt-4 max-w-xl font-serif text-2xl font-light leading-snug tracking-tight text-neutral-100 select-text md:text-4xl">
            {CORE_HEADLINE}
          </h3>

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-hover mt-9 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gold px-9 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#050505] shadow-[0_0_50px_rgba(197,160,89,0.2)] transition-colors duration-300 hover:bg-gold-hover sm:w-auto sm:px-12 md:text-[11px]"
          >
            {CORE_LABEL}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          </a>

          <p className="mt-5 max-w-md text-xs font-light leading-relaxed text-neutral-500 select-text md:text-[13px]">
            {CORE_MICRO}
          </p>

          <button
            type="button"
            onClick={onRestart}
            className="cursor-hover mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-neutral-500 transition-all duration-300 hover:border-gold/30 hover:text-gold"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] sm:text-[9px]">
              Rehacer el protocolo
            </span>
          </button>
        </div>
      </motion.div>

      <motion.p
        {...step(9)}
        className="mt-8 text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.2em] text-neutral-700 select-none"
      >
        El protocolo corre en tu navegador. No se envió ningún dato: no pedimos nombre ni mail.
      </motion.p>
    </div>
  );
}