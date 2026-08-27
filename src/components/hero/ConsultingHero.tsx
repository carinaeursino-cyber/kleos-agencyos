import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import GoldenSpiral from "./GoldenSpiral";
import LambdaCanvas from "../../LambdaCanvas";

// ─────────────────────────────────────────────────────────────────
// KLEOS CONSULTORÍA — Hero cinematográfico
//
// Misma experiencia ritual de KLEOS, sin el video del oso:
//
//   ACTO I  — La Espiral Dorada  (3.2s de respiración)
//   ACTO II — El Lambda           (4.8s de dibujo láser e identidad)
//             → el overlay se disuelve y queda el hero con el copy
//
// Click en cualquier parte = saltar la intro.
// ─────────────────────────────────────────────────────────────────

const ACT_DURATIONS = {
  spiral: 3200,
  lambda: 4800,
};

// ─────────────────────────────────────────────────────────────────
// ⚠️ PENDIENTE — URL del mini VSL
// Reemplazar por la URL definitiva cuando el video corto esté
// publicado (página externa: YouTube, Loom, Vimeo o sitio propio).
// El botón "Mira cómo funciona" del hero abre este enlace en
// una pestaña nueva. Mientras tenga "TU-URL", el botón no funciona.
// ─────────────────────────────────────────────────────────────────
const VSL_URL = "https://TU-URL-DEL-MINI-VSL";

interface ConsultingHeroProps {
  onEnterSite?: () => void;
}

export default function ConsultingHero({ onEnterSite }: ConsultingHeroProps) {
  const [act, setAct] = useState<"spiral" | "lambda" | "content">("spiral");
  const [hasEntered, setHasEntered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fin de la intro: disuelve el overlay y revela el hero ──
  const finishIntro = useCallback(() => {
    if (hasEntered) return;
    setHasEntered(true);
    setAct("content");
    onEnterSite?.();
  }, [hasEntered, onEnterSite]);

  // ── Secuencia de actos ──
  useEffect(() => {
    if (act === "spiral") {
      timerRef.current = setTimeout(() => setAct("lambda"), ACT_DURATIONS.spiral);
    } else if (act === "lambda") {
      timerRef.current = setTimeout(finishIntro, ACT_DURATIONS.lambda);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [act, finishIntro]);

  // ── Click = saltar intro ──
  const handleSkip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    finishIntro();
  }, [finishIntro]);

  return (
    <div className="relative w-full min-h-screen bg-[#050505] overflow-hidden">
      {/* ══════════════════════════════════════════════════════
          CONTENIDO DEL HERO — detrás del overlay de intro
      ══════════════════════════════════════════════════════ */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center max-w-5xl mx-auto select-text">
        {/* Glow ambiental */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(197,160,89,0.06) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial="hidden"
          animate={hasEntered ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
          }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.4em] text-gold uppercase mb-6 md:mb-8"
          >
            Agency OS · Sistema operativo para agencias de marketing
          </motion.p>

          {/* Titular */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light text-neutral-100 leading-[1.12] tracking-wide text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-4xl"
          >
            Tu agencia creció pero el caos también.
            <br />
            <span className="text-gold italic font-normal block mt-3 md:mt-4">
              Facturas más, duermes menos, controlas menos.
            </span>
          </motion.h1>

          {/* Separador */}
          <motion.div
            variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 md:w-32 h-[1px] bg-gold/20 my-7 md:my-9"
          />

          {/* Frase puente */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-400 font-light text-xs md:text-sm leading-relaxed max-w-xl select-text"
          >
            El crecimiento solo expuso lo que faltaba: un sistema.
          </motion.p>

          {/* Copy de apoyo */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-300 font-light text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mt-4"
          >
            Agency OS: un sistema operativo que organiza procesos, responsabilidades
            y prioridades de tu agencia.
          </motion.p>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-400 font-light text-xs md:text-sm leading-relaxed max-w-xl mt-3"
          >
            Lo diseñamos, lo implementamos en ClickUp y tu equipo queda trabajando con claridad.
          </motion.p>

          {/* CTA — enlace externo al mini VSL */}
          <motion.a
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            href={VSL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-hover mt-9 md:mt-11 inline-flex items-center gap-3 bg-gold hover:bg-gold-hover text-[#050505] px-8 md:px-10 py-4 rounded-full font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-bold transition-colors duration-300 shadow-[0_0_40px_rgba(197,160,89,0.15)]"
          >
            Mira cómo funciona
          </motion.a>

          {/* Texto secundario */}
          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 1.2 }}
            className="mt-8 font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-neutral-500 uppercase"
          >
            Diagnóstico · Sistema a medida · Implementación en ClickUp · Adopción del equipo
          </motion.p>
        </motion.div>

        {/* Scroll hint — solo tras la intro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={hasEntered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.6, duration: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none select-none"
        >
          <div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════
          OVERLAY DE INTRO — espiral → lambda → disolución
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            key="intro-overlay"
            className="fixed inset-0 z-[200] bg-[#050505] cursor-pointer"
            onClick={handleSkip}
            exit={{ opacity: 0, transition: { duration: 1.4, ease: "easeInOut" } }}
          >
            <AnimatePresence>
              {act === "spiral" && (
                <motion.div
                  key="spiral"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  <GoldenSpiral isActive={act === "spiral"} />
                </motion.div>
              )}
              {act === "lambda" && (
                <motion.div
                  key="lambda"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
                  transition={{ duration: 1.0, ease: "easeInOut" }}
                >
                  <LambdaCanvas isActive={act === "lambda"} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint de skip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-8 sm:bottom-10 right-6 sm:right-8 z-50 pointer-events-none select-none"
            >
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-white/20 uppercase">
                Toca para ingresar
              </span>
            </motion.div>

            {/* Línea glow inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
