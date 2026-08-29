import { motion } from "motion/react";
import { Check } from "lucide-react";

// Las 5 fases del protocolo, en el orden del breadcrumb. Coinciden con
// `phase` de cada pregunta en src/lib/audit.ts.
const PHASES = ["Contexto", "Operación", "Herramientas", "Adopción", "Prioridad"];

const pad = (n: number) => String(n).padStart(2, "0");

interface Props {
  step: number;
  total: number;
  answered: number;
  finished?: boolean;
}

export default function AuditProgress({ step, total, answered, finished }: Props) {
  const pct = finished ? 100 : Math.max(6, Math.round((answered / total) * 100));

  return (
    <div className="w-full select-none">
      <div className="flex items-end justify-between gap-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold">
          KIP-004 · Operaciones ·{" "}
          {finished ? "Lectura completa" : `Paso ${pad(step)} de ${pad(total)}`}
        </p>
        <p className="hidden md:block font-mono text-[8px] uppercase tracking-[0.25em] text-neutral-600">
          {PHASES[Math.min(PHASES.length - 1, step - 1)]}
        </p>
      </div>

      <div className="mt-3 h-[2px] w-full overflow-hidden bg-white/[0.07]">
        <motion.div
          className="h-full bg-gold"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <ol className="mt-4 hidden items-center gap-5 md:flex">
        {PHASES.map((label, i) => {
          const n = i + 1;
          const done = finished || n < step;
          const current = !finished && n === step;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={[
                  "flex h-4 w-4 items-center justify-center rounded-full border text-[8px] font-mono",
                  done
                    ? "border-gold/50 bg-gold/10 text-gold"
                    : current
                      ? "border-gold/70 text-gold"
                      : "border-white/10 text-neutral-700",
                ].join(" ")}
              >
                {done ? <Check className="h-2.5 w-2.5" strokeWidth={2} aria-hidden="true" /> : pad(n)}
              </span>
              <span
                className={[
                  "font-mono text-[8px] uppercase tracking-[0.2em]",
                  done ? "text-neutral-500" : current ? "text-gold" : "text-neutral-700",
                ].join(" ")}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}