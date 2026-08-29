import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import AuditProgress from "../components/audit/AuditProgress";
import AuditQuestion, { AuditProcessing } from "../components/audit/AuditQuestion";
import AuditReading from "../components/audit/AuditReading";
import { useAuditEngine } from "../lib/useAuditEngine";
import { BOOKING_URL } from "../lib/booking";

// ─────────────────────────────────────────────────────────────────
// AuditPage — /auditoria
//
// El KIP (Kleos Interactive Protocol): cinco pasos, una pregunta por vez,
// cada respuesta elige la siguiente. Sin campos: no hay inputs, no hay mail,
// no hay nombre. El estado vive en src/lib/useAuditEngine.ts y la logica de
// ramado y de lectura en src/lib/audit.ts, asi que la pagina solo compone.
//
// Estetica: la misma del sitio (fondo #050505, serif para titulares, mono para
// etiquetas, tarjetas #0B0B0C con borde blanco al 10% y dorado en el estado
// activo). Ninguna clase nueva de color, radio o sombra.
// ─────────────────────────────────────────────────────────────────

const HEADER_LABEL = "Agendar sesión";

export default function AuditPage() {
  const engine = useAuditEngine();
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const { phase, step, question, pick } = engine;

  // Titulo propio: es una pagina que se comparte y se publicita.
  useEffect(() => {
    const prev = document.title;
    document.title = "Auditoría Operativa en 3 min · KLEOS Consultoría";
    return () => {
      document.title = prev;
    };
  }, []);

  // Cada paso nuevo vuelve arriba y le pasa el foco al encabezado de la
  // pregunta: asi quien usa teclado o lector de pantalla no se queda en el
  // boton que acabo de tocar, y el scroll acompana el cambio de fase.
  useEffect(() => {
    if (reduceMotion) window.scrollTo({ top: 0 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, phase, reduceMotion]);

  // 1..4 eligen la opcion, como en un terminal.
  useEffect(() => {
    if (phase !== "question") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const n = Number(event.key);
      if (!Number.isInteger(n) || n < 1 || n > question.options.length) return;
      event.preventDefault();
      pick(question.options[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, question, pick]);

  const seconds = engine.payload ? Math.max(1, Math.round(engine.payload.durationMs / 1000)) : 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] font-sans text-[#F5F5F5] selection:bg-gold/30 selection:text-white">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(197,160,89,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Header minimo: el protocolo no compite con la navegacion */}
      <header className="relative z-10 flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-6 sm:px-6 md:px-12 md:py-8">
        <Link to="/" className="cursor-hover group inline-flex flex-col" aria-label="Volver al inicio de KLEOS Consultoría">
          <span className="font-serif text-2xl font-light leading-none tracking-[0.15em] md:text-3xl">
            <span className="text-[#C5A059]">K</span>
            <span className="text-white">·L·E·O·S</span>
          </span>
          <span className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.4em] text-gold/60 select-none sm:text-[8px]">
            Consultoría
          </span>
        </Link>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-hover group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gold/30 px-4 py-2 text-gold transition-all duration-300 hover:border-gold hover:bg-gold/5"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] sm:text-[9px] sm:tracking-[0.3em]">
            {HEADER_LABEL}
          </span>
        </a>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:px-6 md:px-8 md:pb-32 md:pt-14">
        <h1 className="sr-only">Auditoría Operativa en 3 min · KLEOS</h1>

        <AuditProgress
          step={step}
          total={engine.total}
          answered={engine.answered}
          finished={phase === "reading"}
        />

        {/* La key del AnimatePresence es SOLO la pregunta. Si incluyera la
            fase, cada clic re-montaria el bloque entero (el <h2> sale y vuelve a
            entrar) justo en el momento en que el usuario necesita ver su
            seleccion quieta; por eso el "procesando" va como hermano abajo y no
            dentro del mismo nodo animado. */}
        <div ref={stageRef} className="mt-10 md:mt-14">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "reading" && engine.reading ? (
              <motion.div
                key="reading"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <AuditReading
                  reading={engine.reading}
                  seconds={seconds}
                  onRestart={engine.restart}
                  headingRef={headingRef}
                />
              </motion.div>
            ) : (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <AuditQuestion
                  question={question}
                  pickedId={engine.pickedId}
                  busy={phase === "processing"}
                  onPick={pick}
                  headingRef={headingRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {phase === "processing" && <AuditProcessing lines={engine.trace} />}

        {phase !== "reading" && (
          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={engine.back}
              disabled={!engine.canGoBack}
              className="cursor-hover group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 transition-all duration-300 enabled:hover:border-gold/30 disabled:opacity-30"
            >
              <ArrowLeft
                className="h-3 w-3 text-neutral-500 transition-all duration-300 group-enabled:group-hover:-translate-x-0.5 group-enabled:group-hover:text-gold"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-neutral-500 select-none sm:text-[9px]">
                Volver
              </span>
            </button>

            <p className="max-w-[16rem] text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.2em] text-neutral-700 select-none sm:text-[9px]">
              Sin compromiso · Sin datos personales
            </p>
          </div>
        )}
      </main>

      {/* Pie minimo, con la misma salida que el resto de la pagina */}
      <footer className="relative z-10 border-t border-white/10 bg-[#030304] px-5 py-10 text-neutral-400 sm:px-6 md:px-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Link
            to="/"
            className="cursor-hover font-mono text-[9px] uppercase tracking-[0.3em] text-gold/60 transition-colors duration-300 hover:text-gold"
          >
            Volver al sitio
          </Link>
          <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-neutral-700 sm:text-[8px]">
            © 2026 KLEOS Consultoría · Operaciones para agencias
          </p>
        </div>
      </footer>
    </div>
  );
}