import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import GoldenSpiral from "./GoldenSpiral";
import { openHowItWorks } from "../../lib/howItWorks";
import { AUDIT_ROUTE } from "../../lib/audit";
import { Link } from "react-router-dom";
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
// Copy final del hero (aprobado 2026-08-29). Dos CTAs:
//
//   CTA1 "Audita tu operacion en 3 min" -> AUDIT_ROUTE (/auditoria), el
//     protocolo interactivo KIP. La ruta esta definida una sola vez en
//     src/lib/audit.ts y la consumen App.tsx (para montarla) y este boton,
//     para que no puedan apuntar a sitios distintos.
//   CTA2 "Ver el sistema en accion" -> openHowItWorks()
//     (src/lib/howItWorks.ts), que hoy navega a la landing /vsl y, si esa
//     pagina se diera de baja vaciando VSL_PAGE, vuelve a hacer scroll suave
//     a la seccion Implementacion.
// ─────────────────────────────────────────────────────────────────

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

          {/* Titular — dos lineas y el corte es del copy, no del viewport.
              El escalon xl:text-7xl (72px) que habia se saco: el copy nuevo son
              58 + 90 caracteres, y a 72px en max-w-4xl dan ~28 caracteres por
              linea, o sea 6 renglones de 80px = casi 500px de puro titular y
              los botones se iban abajo del pliegue. Tope lg:text-6xl (60px)
              sobre max-w-4xl md:max-w-5xl (896/1024px): linea 1 = 2 renglones,
              linea 2 = 3. */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light text-neutral-100 leading-[1.12] tracking-wide text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl md:max-w-5xl"
          >
            Tu agencia no necesita más mindset. Necesita un sistema.
            <br />
            {/* <br /> + block: el corte entre las dos frases es del copy, no
                del ancho de la ventana. La segunda linea lleva el enfasis que
                pide la marca: gold + italica, igual que antes. */}
            <span className="text-gold italic font-normal block mt-3 md:mt-4">
              Porque de nada sirve facturar como las grandes agencias si operas como un freelancer con empleados.
            </span>
          </motion.h1>

          {/* Separador */}
          <motion.div
            variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 md:w-32 h-[1px] bg-gold/20 my-7 md:my-9"
          />

          {/* Subtitulo — la objecion ("no hace falta adquirir mas
              herramientas") respondida en dos frases. Mismo tamano que antes
              (16/18px) y max-w-2xl md:max-w-3xl: con el nombre del sistema
              fuera de este parrafo (bajo a su propia linea, abajo) son 143
              caracteres, o sea 2 renglones a 768px en vez de 3. text-balance
              sigue evitando la palabra huerfana. */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-300 font-light text-base md:text-lg leading-relaxed max-w-2xl md:max-w-3xl text-balance select-text"
          >
            Así que no es necesario adquirir más herramientas. Con un sistema que ponga a trabajar a tu equipo sin que tengas que perseguirlos, basta.
          </motion.p>

          {/* El nombre del sistema. Antes era la ultima oracion del parrafo de
              arriba; a pedido baja y queda solo, como cierre del copy y apertura
              de los botones. Tratamiento: la linea dorada suelta del sitio
              (font-serif + italic + text-gold + font-normal, 16/18px), la misma
              del remate de ProblemSection y de la linea de AosSection. Es UN
              item nuevo del stagger (staggerChildren 0.14), o sea que entra 0.14s
              despues del parrafo y los botones corren medio paso mas abajo. */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-7 font-serif italic text-gold text-base md:text-lg font-normal leading-relaxed max-w-2xl md:max-w-3xl text-balance select-text"
          >
            Kleos Agency OS es la arquitectura operativa que te falta.
          </motion.p>

          {/* CTAs — dos columnas desde sm (640px): boton + microcopy propio en
              cada una, para que el texto chico no flote suelto debajo de los
              dos botones. En mobile se apilan y los botones pasan a ancho
              completo (w-full / sm:w-auto), la misma regla de /vsl. Todo el
              bloque es UN solo item del stagger, como era el boton anterior. */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-11 md:mt-14 grid w-full max-w-3xl grid-cols-1 items-start gap-x-6 gap-y-7 sm:grid-cols-2"
          >
            {/* CTA1 — dorado, el destino nuevo */}
            <div className="flex flex-col items-center">
              {/* Navegacion interna (no <a target=_blank>): el protocolo es una
                  ruta del sitio, definida una sola vez en src/lib/audit.ts como
                  AUDIT_ROUTE, que es la misma que monto el Route en App.tsx. Si
                  el cuestionario se mudara a Tally/Typeform, esto vuelve a ser
                  un <a href={URL} target="_blank" rel="noopener noreferrer">. */}
              <Link
                to={AUDIT_ROUTE}
                className="cursor-hover inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#050505] shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-colors duration-300 hover:bg-gold-hover md:px-10 md:text-[11px]"
              >
                Audita tu operación en 3 min
              </Link>
              <p className="mt-3 max-w-[280px] text-center text-neutral-500 font-light text-xs leading-relaxed select-text">
                5 preguntas. Descubre exactamente dónde estás perdiendo margen y tiempo.
              </p>
            </div>

            {/* CTA2 — outline, mismo ghost del header y de /vsl */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={openHowItWorks}
                className="cursor-hover group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-gold/30 px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold/5 md:px-10 md:text-[11px]"
              >
                Ver el sistema en acción
                <svg
                  className="h-3 w-3 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="mt-3 max-w-[280px] text-center text-neutral-500 font-light text-xs leading-relaxed select-text">
                Mira cómo funciona la arquitectura KLEOS.
              </p>
            </div>
          </motion.div>

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