import { useEffect, type RefObject } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import type { AuditOption, AuditQuestion as Question } from "../../lib/audit";

const pad = (n: number) => String(n).padStart(2, "0");

interface Props {
  question: Question;
  pickedId?: string;
  busy: boolean;
  onPick: (option: AuditOption) => void;
  headingRef?: RefObject<HTMLHeadingElement | null>;
}

export default function AuditQuestion({ question, pickedId, busy, onPick, headingRef }: Props) {
  // El foco entra con la pregunta montada (no desde la pagina: con
  // AnimatePresence mode="wait" la anterior todavia esta saliendo y el ref
  // apunta al nodo viejo).
  useEffect(() => {
    headingRef?.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-3xl font-light leading-[1.08] tracking-tight text-neutral-100 select-text focus:outline-none md:text-5xl"
      >
        {question.title}
      </h2>

      {question.context && (
        <p className="mt-4 text-neutral-500 font-light text-sm md:text-[15px] leading-relaxed select-text">
          {question.context}
        </p>
      )}

      <div role="group" aria-label="Opciones de respuesta" className="mt-8 grid gap-2.5 md:mt-10">
        {question.options.map((option, i) => {
          const picked = option.id === pickedId;
          return (
            <motion.button
              key={option.id}
              type="button"
              disabled={busy}
              aria-pressed={picked}
              onClick={() => onPick(option)}
              whileTap={picked || busy ? undefined : { scale: 0.995 }}
              className={[
                "cursor-hover group relative flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 md:p-6",
                picked
                  ? "border-gold/60 bg-gold/[0.05]"
                  : "border-white/10 bg-[#0B0B0C] hover:border-gold/30 hover:bg-white/[0.02]",
                busy && !picked ? "opacity-40" : "opacity-100",
              ].join(" ")}
            >
              {/* El filete superior solo en el estado activo: es la senal de
                  "esta tarjeta es la que el motor retuvo". */}
              {picked && (
                <span className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              )}

              <span
                className={[
                  "mt-1 shrink-0 font-mono text-[10px] tracking-widest transition-colors duration-300",
                  picked ? "text-gold" : "text-neutral-700 group-hover:text-gold/70",
                ].join(" ")}
              >
                {pad(i + 1)}
              </span>

              <span className="flex-1">
                <span className="block text-base font-light text-neutral-100 select-text md:text-lg">
                  {option.label}
                </span>
                {option.hint && (
                  <span className="mt-1 block text-[13px] font-light leading-relaxed text-neutral-500 select-text">
                    {option.hint}
                  </span>
                )}
              </span>

              <span className="mt-1 shrink-0">
                {picked ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                    <Check className="h-3 w-3 text-gold" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                ) : (
                  <ArrowRight
                    className="h-4 w-4 text-neutral-700 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold/70 group-hover:opacity-100"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.25em] text-neutral-700 select-none">
        Toca una opción o usa las teclas 1 a {question.options.length}
      </p>
    </div>
  );
}

/** La batida de "el motor esta escribiendo" entre pregunta y pregunta. */
export function AuditProcessing({ lines }: { lines: string[] }) {
  return (
    <div
      aria-live="polite"
      className="mt-6 rounded-2xl border border-gold/20 bg-[#0B0B0C] p-5 md:mt-8 md:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold">
          Motor KLEOS
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-neutral-600">
          procesando
        </span>
      </div>

      <div className="mt-4 h-[2px] w-full overflow-hidden bg-white/[0.07]">
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
          initial={{ x: "-120%" }}
          animate={{ x: "340%" }}
          transition={{ duration: 0.46, ease: "easeInOut" }}
        />
      </div>

      <ul className="mt-4 space-y-1.5">
        {lines.map((line, i) => (
          <motion.li
            key={line}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 * i, duration: 0.3 }}
            className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-neutral-400"
          >
            {line}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}