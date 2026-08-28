import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────
// ContactPage — Página de Contacto KLEOS CONSULTORÍA
// Formspree: cada envío llega a carina@carinaursino.com
// ─────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name:    "",
    email:   "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://formspree.io/f/mvznavlv", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    formData.name,
          email:   formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) throw new Error("Error al enviar.");
      setSent(true);
    } catch {
      setError("Hubo un error. Escríbenos a carina@carinaursino.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans" style={{ overflowX: "hidden" }}>

      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(197,160,89,0.05) 0%, transparent 60%)" }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 md:px-16 py-8 border-b border-white/[0.06]">
        <button onClick={() => navigate("/")} className="flex items-center gap-3 group cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="#C5A059" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/25 uppercase group-hover:text-gold/50 transition-colors duration-300">
            Volver
          </span>
        </button>

        <div className="flex items-baseline gap-[3px] select-none">
          <span className="font-serif text-base tracking-[0.15em] text-[#C5A059] font-light">K</span>
          <span className="font-serif text-base tracking-[0.15em] text-white/30 font-light">·L·E·O·S</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <motion.section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-10">
          <svg viewBox="0 0 500 500" width="52" height="52" fill="none"
            style={{ overflow: "visible", filter: "drop-shadow(0 0 8px rgba(197,160,89,0.6)) drop-shadow(0 0 24px rgba(197,160,89,0.2))" }}
          >
            <path d="M 80,442 L 112,442 L 250,62" stroke="#C5A059" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 420,442 L 388,442 L 250,62" stroke="#C5A059" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="font-serif font-light text-white/90"
          style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "16ch" }}
        >
          Ordenemos tu operación.
          <br />
          <em style={{ color: "#C5A059" }}>Hablemos.</em>
        </h1>

        <p className="font-sans text-white/30 mt-6 max-w-sm leading-relaxed" style={{ fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)" }}>
          Completa el formulario y coordinamos una primera conversación exploratoria para conocer tu situación actual, tus objetivos y tus principales desafíos operativos.
        </p>
      </motion.section>

      {/* ── Formulario ── */}
      <motion.section
        className="relative z-10 max-w-xl mx-auto px-6 md:px-0 pb-32"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Divisor */}
        <div className="flex items-center gap-6 mb-14">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="font-mono text-[9px] tracking-[0.3em] text-gold/40 uppercase shrink-0">Contacto directo</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <AnimatePresence mode="wait">

          {/* ── Enviado ── */}
          {sent && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-6 py-16 border border-gold/10 rounded-2xl"
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" stroke="#C5A059" strokeOpacity="0.3" strokeWidth="1"/>
                <path d="M12 20L17 25L28 14" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <span className="font-mono text-[9px] tracking-[0.3em] text-gold/50 uppercase block mb-3">
                  Mensaje recibido
                </span>
                <p className="font-sans text-white/35 text-sm leading-relaxed max-w-xs">
                  Gracias por escribirnos. Te respondemos en menos de 48 horas.
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="font-mono text-[9px] tracking-[0.3em] text-white/20 uppercase hover:text-gold/40 transition-colors duration-300 cursor-pointer mt-4"
              >
                Volver al sitio
              </button>
            </motion.div>
          )}

          {/* ── Formulario ── */}
          {!sent && (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-10"
            >
              {/* Nombre */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] tracking-[0.3em] text-gold/50 uppercase">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  className="bg-transparent border-b border-white/10 focus:border-gold/40 outline-none py-3 text-white/80 placeholder:text-white/20 font-sans text-base transition-colors duration-300"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] tracking-[0.3em] text-gold/50 uppercase">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="bg-transparent border-b border-white/10 focus:border-gold/40 outline-none py-3 text-white/80 placeholder:text-white/20 font-sans text-base transition-colors duration-300"
                  required
                />
              </div>

              {/* Mensaje */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] tracking-[0.3em] text-gold/50 uppercase">
                  Mensaje *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Cuéntame brevemente: ¿cuántas personas son en el equipo, qué servicios venden y qué es lo que hoy más te traba en la operación diaria?"
                  rows={5}
                  className="bg-transparent border-b border-white/10 focus:border-gold/40 outline-none py-3 text-white/80 placeholder:text-white/20 font-sans text-base transition-colors duration-300 resize-none"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <p className="font-mono text-[10px] tracking-[0.2em] text-red-400/70 uppercase leading-relaxed">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="self-start flex items-center gap-4 px-8 py-4 border border-gold/30 hover:border-gold hover:bg-gold/5 text-gold font-mono text-[10px] tracking-[0.3em] uppercase rounded-full transition-all duration-300 cursor-pointer disabled:opacity-40"
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              <p className="-mt-4 font-light text-[13px] leading-relaxed text-white/30 select-text">
                No hace falta que tengas nada preparado. Empezamos por entender cómo trabajás hoy.
              </p>
            </motion.form>
          )}

        </AnimatePresence>
      </motion.section>

      {/* ── Footer mínimo ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-8 md:px-16 flex items-center justify-between">
        <span className="font-mono text-[8px] tracking-[0.3em] text-white/15 uppercase">© 2026 KLEOS Consultoría</span>
        <span className="font-mono text-[8px] tracking-[0.3em] text-white/15 uppercase">Consultoría de operaciones para agencias</span>
      </footer>

    </div>
  );
}
