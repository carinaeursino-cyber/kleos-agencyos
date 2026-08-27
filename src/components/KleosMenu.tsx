import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────
// KleosMenu — Morphing Button → Fullscreen Overlay
// 4 destinos: Problema · Implementación · Sistema · Contacto
// ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Problema",       id: "problem-section",  number: "01", type: "scroll" },
  { label: "Implementación", id: "services-section", number: "02", type: "scroll" },
  { label: "Sistema",        id: "system-section",   number: "03", type: "scroll" },
  { label: "Contacto",       id: "/contacto",        number: "04", type: "route"  },
];

interface KleosMenuProps {
  visible: boolean;
  onNavigate: (id: string) => void;
}

export default function KleosMenu({ visible, onNavigate }: KleosMenuProps) {
  const [isOpen, setIsOpen]           = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Bloquear scroll cuando está abierto
  useEffect(() => {
    document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleNavigate = (item: typeof NAV_ITEMS[0]) => {
    setIsOpen(false);
    if (item.type === "route") {
      setTimeout(() => navigate(item.id), 600);
    } else {
      setTimeout(() => onNavigate(item.id), 600);
    }
  };

  return (
    <>
      {/* ── Botón trigger ── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed top-0 right-0 z-[100] p-6 md:p-8"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-hover group relative flex items-center gap-3"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <div className="flex flex-col gap-[5px] w-5">
                <motion.span
                  className="block h-px origin-center"
                  animate={isOpen
                    ? { rotate: 45, y: 3, backgroundColor: "#C5A059" }
                    : { rotate: 0,  y: 0, backgroundColor: "rgba(255,255,255,0.7)" }
                  }
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="block h-px origin-center"
                  animate={isOpen
                    ? { rotate: -45, y: -3, backgroundColor: "#C5A059" }
                    : { rotate: 0,   y: 0,  backgroundColor: "rgba(255,255,255,0.7)" }
                  }
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <motion.span
                className="font-mono text-[9px] tracking-[0.3em] uppercase"
                animate={isOpen
                  ? { color: "#C5A059" }
                  : { color: "rgba(255,255,255,0.45)" }
                }
                transition={{ duration: 0.3 }}
              >
                {isOpen ? "cerrar" : "menú"}
              </motion.span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Overlay fullscreen ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu-overlay"
            className="fixed inset-0 z-[99] bg-[#050505] flex flex-col overflow-y-auto overscroll-contain"
            initial={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 48px) 48px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Línea láser superior */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: "linear-gradient(90deg, transparent 0%, #C5A059 30%, #E5C383 50%, #C5A059 70%, transparent 100%)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.6 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            />

            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(197,160,89,0.04) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 flex flex-col h-full px-10 md:px-20 lg:px-32 py-20 md:py-24">

              {/* Logo */}
              <motion.div
                className="flex items-baseline gap-[3px] select-none"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-serif text-lg tracking-[0.15em] text-[#C5A059] font-light">K</span>
                <span className="font-serif text-lg tracking-[0.15em] text-white/30 font-light">·L·E·O·S</span>
                <span className="font-mono text-[8px] tracking-[0.4em] text-white/20 uppercase ml-3">Consultoría</span>
              </motion.div>

              {/* ── Links ── */}
              <nav className="flex-1 flex flex-col justify-center gap-0 mt-8">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.3 + i * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <button
                      onClick={() => handleNavigate(item)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="cursor-hover group w-full text-left flex items-baseline gap-6 md:gap-10 py-4 md:py-5 border-b border-white/[0.06] relative overflow-hidden"
                    >
                      {/* Número */}
                      <span className="font-mono text-[10px] tracking-[0.3em] text-gold/40 group-hover:text-gold/70 transition-colors duration-300 shrink-0 w-8">
                        {item.number}
                      </span>

                      {/* Label */}
                      <span
                        className="font-serif font-light leading-none transition-all duration-500"
                        style={{
                          fontSize: "clamp(2.4rem, 6vw, 5.5rem)",
                          letterSpacing: "-0.02em",
                          color: item.label === "Contacto"
                            ? hoveredItem === item.id
                              ? "#C5A059"
                              : hoveredItem !== null
                                ? "rgba(197,160,89,0.2)"
                                : "rgba(197,160,89,0.55)"
                            : hoveredItem === item.id
                              ? "#C5A059"
                              : hoveredItem !== null
                                ? "rgba(245,245,245,0.15)"
                                : "rgba(245,245,245,0.88)",
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Línea láser al hover */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-px bg-gold/35"
                        initial={{ width: "0%" }}
                        animate={{ width: hoveredItem === item.id ? "100%" : "0%" }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </button>
                  </motion.div>
                ))}
              </nav>

              {/* Footer del overlay */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
