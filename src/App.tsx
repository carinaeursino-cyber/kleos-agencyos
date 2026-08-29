import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, Link } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ConsultingHero from "./components/hero/ConsultingHero";
import ProblemSection from "./components/ProblemSection";
import ValueSection from "./components/ValueSection";
import ServicesSection from "./components/ServicesSection";
import AosSection from "./components/AosSection";
import OnboardingSection from "./components/OnboardingSection";
import AutomationSection from "./components/AutomationSection";
import FitSection from "./components/FitSection";
import AboutSection from "./components/AboutSection";
import CtaBanner from "./components/CtaBanner";
import FaqSection from "./components/FaqSection";
import CustomCursor from "./CustomCursor";
import KleosMenu from "./components/KleosMenu";
import ContactPage from "./pages/ContactPage";
import VslPage from "./pages/VslPage";
import AuditPage from "./pages/AuditPage";
import { AUDIT_ROUTE } from "./lib/audit";

import { ctaFinalItems } from "./data";

// ── Navegación lateral (scroll spy) ──
const RAIL_ITEMS = [
  { id: "problem-section",  label: "PROBLEMA",       idx: 0 },
  { id: "services-section", label: "IMPLEMENTACIÓN", idx: 1 },
  { id: "system-section",   label: "SISTEMA",        idx: 2 },
];

const LEFT_ITEMS = RAIL_ITEMS.filter((i) => i.idx % 2 === 0);
const RIGHT_ITEMS = RAIL_ITEMS.filter((i) => i.idx % 2 === 1);

// ─────────────────────────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────────────────────────
function HomePage() {
  const [introDone, setIntroDone] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // ── Lenis ──
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    let rafId: number;
    const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);

    return () => { cancelAnimationFrame(rafId); lenis.destroy(); lenisRef.current = null; };
  }, []);

  // ── Bloquear scroll durante la intro ──
  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [introDone]);

  // ── Scroll Spy ──
  useEffect(() => {
    if (!introDone) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();

    const triggers: ScrollTrigger[] = [];
    RAIL_ITEMS.forEach((item, idx) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      triggers.push(ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(idx),
        onEnterBack: () => setActiveSection(idx),
      }));
    });

    return () => triggers.forEach((t) => t.kill());
  }, [introDone]);

  useEffect(() => {
    if (introDone && lenisRef.current) {
      const t = setTimeout(() => lenisRef.current?.resize(), 300);
      return () => clearTimeout(t);
    }
  }, [introDone]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen selection:bg-gold/30 selection:text-white overflow-x-hidden font-sans editorial-grain lg:cursor-none safe-bottom">
      <CustomCursor />

      {/* Menú — visible tras la intro */}
      <KleosMenu visible={introDone} onNavigate={scrollToSection} />

      {/* LEFT RAIL */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 h-full border-r border-white/[0.06] flex-col items-center justify-between py-14 z-40 bg-[#050505]/60 backdrop-blur-md select-none">
        <div className="flex flex-col items-center pt-4">
          <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 22 88 L 36 88 L 50 20 L 64 88 L 78 88" stroke="#C5A059" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0 0 2px rgba(197,160,89,0.4))"/>
            <path d="M 22 88 L 36 88 L 50 20 L 64 88 L 78 88" stroke="#E5C383" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          </svg>
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-6 pb-4">
          {LEFT_ITEMS.map((item) => {
            const isActive = activeSection === item.idx;
            return (
              <button key={item.id} onClick={() => scrollToSection(item.id)}
                className={`cursor-hover transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                <span className={`font-mono text-[9px] tracking-[0.25em] uppercase ${isActive ? "text-gold" : "text-white/60"}`}>
                  {String(item.idx + 1).padStart(2, "0")}. {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* RIGHT RAIL */}
      <aside className="hidden lg:flex fixed right-0 top-0 bottom-0 w-24 h-full border-l border-white/[0.06] flex-col items-center justify-between py-14 z-40 bg-[#050505]/60 backdrop-blur-md select-none">
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-6" style={{ writingMode: "vertical-rl" }}>
          <span className="font-mono text-[8px] tracking-[0.3em] text-white/15 uppercase">Operación a la altura</span>
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-6 pb-4">
          {RIGHT_ITEMS.map((item) => {
            const isActive = activeSection === item.idx;
            return (
              <button key={item.id} onClick={() => scrollToSection(item.id)}
                className={`cursor-hover transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                style={{ writingMode: "vertical-rl" }}
              >
                <span className={`font-mono text-[9px] tracking-[0.25em] uppercase ${isActive ? "text-gold" : "text-white/60"}`}>
                  {String(item.idx + 1).padStart(2, "0")}. {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* HERO */}
      <ConsultingHero onEnterSite={() => { if (!introDone) setIntroDone(true); }} />

      {/* CONTENIDO */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <main className="lg:pl-24 lg:pr-24">
            <ProblemSection />
            <ValueSection />
            <ServicesSection />
            <AosSection />
            <OnboardingSection />
            <AutomationSection />
            <FitSection />
            <AboutSection />

            {/* CTA intermedio */}
            <CtaBanner
              id="cta-revision"
              eyebrow="Revisión operativa"
              title="Si todo depende de ti, todavía no tienes"
              highlight="una operación escalable."
              intro="Analizamos tu operación actual para detectar las fugas de tiempo y margen. Te damos un veredicto claro y un plan de acción."
              buttonLabel="Agenda tu sesión exploratoria"
              smallText="Una conversación directa sobre tu operación."
              action="contact"
            />

            <FaqSection />

            {/* CTA final */}
            <CtaBanner
              id="cta-final"
              eyebrow="Escalar con claridad"
              title="Tu agencia ya creció. Ahora necesita"
              highlight="una operación a la altura."
              intro="No necesitas más urgencias, más reuniones ni más información perdida en chats. Necesitas saber:"
              items={ctaFinalItems}
              buttonLabel="Agendar conversación"
              action="contact"
              footerText="Agency OS · Orden. Claridad. Escala."
            />
          </main>

          {/* FOOTER */}
          <footer
            id="footer"
            className="relative bg-[#030304] py-16 sm:py-20 md:py-24 lg:py-32 border-t border-white/10 font-sans text-neutral-400 lg:pl-24 lg:pr-24"
          >
            <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-12 flex flex-col items-center text-center">
              <div className="mb-8 sm:mb-10">
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.15em] font-light">
                  <span className="text-[#C5A059]">K</span>
                  <span className="text-white">·L·E·O·S</span>
                </span>
                <span className="block font-mono text-[8px] sm:text-[9px] tracking-[0.4em] text-gold uppercase mt-2 sm:mt-3 font-medium">
                  Consultoría
                </span>
              </div>
              <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8 sm:mb-10" />
              <p className="font-serif text-lg sm:text-xl md:text-2xl text-neutral-200 font-light tracking-wide mb-6 sm:mb-8 max-w-lg leading-relaxed">
                Ordenemos tu operación. El primer paso es una conversación.
              </p>
              <Link
                to="/contacto"
                className="cursor-hover inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 border border-gold/30 hover:border-gold hover:bg-gold/5 text-gold text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] rounded-full transition-all duration-300"
              >
                Agendar Conversación
              </Link>
              <p className="mt-12 sm:mt-16 font-mono text-[7px] sm:text-[9px] text-neutral-700 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                © 2026 KLEOS CONSULTORÍA · OPERACIONES PARA AGENCIAS
              </p>
            </div>
          </footer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// App root con React Router
// ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/vsl" element={<VslPage />} />
      <Route path={AUDIT_ROUTE} element={<AuditPage />} />
    </Routes>
  );
}
