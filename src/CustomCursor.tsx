import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  angle: number;
  drift: number;
}

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const lastSpawn = useRef({ x: -100, y: -100 });
  const particleId = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  const spawnParticle = useCallback((x: number, y: number) => {
    const id = particleId.current++;
    const p: Particle = {
      id,
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      size: 1.5 + Math.random() * 2.5,
      opacity: 0.5 + Math.random() * 0.4,
      life: 0,
      maxLife: 30 + Math.random() * 20, // frames
      angle: Math.random() * Math.PI * 2,
      drift: 0.15 + Math.random() * 0.25,
    };
    particlesRef.current = [...particlesRef.current.slice(-18), p];
    setParticles(particlesRef.current);
  }, []);

  useEffect(() => {
    if ("ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.1;
      pos.current.y += (target.current.y - pos.current.y) * 0.1;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%)`;
      }

      // Spawn trail particles when moved enough
      const dx = target.current.x - lastSpawn.current.x;
      const dy = target.current.y - lastSpawn.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 6) {
        spawnParticle(target.current.x, target.current.y);
        lastSpawn.current.x = target.current.x;
        lastSpawn.current.y = target.current.y;
      }

      // Age particles
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current
          .map((p) => ({
            ...p,
            life: p.life + 1,
            x: p.x + Math.cos(p.angle) * p.drift,
            y: p.y + Math.sin(p.angle) * p.drift + 0.1, // slight gravity
          }))
          .filter((p) => p.life < p.maxLife);
        setParticles(particlesRef.current);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hover detection
    const onOver = () => setIsHovering(true);
    const onOut = () => setIsHovering(false);

    const bindHover = () => {
      const nodes = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, label, .cursor-hover'
      );
      nodes.forEach((n) => {
        n.addEventListener("mouseenter", onOver);
        n.addEventListener("mouseleave", onOut);
      });
    };

    const timeout = setTimeout(bindHover, 800);
    const observer = new MutationObserver(bindHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [spawnParticle]);

  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Stardust Trail */}
      <div
        ref={trailRef}
        className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden hidden lg:block"
      >
        {particles.map((p) => {
          const progress = p.life / p.maxLife;
          const opacity = p.opacity * (1 - progress);
          const scale = 1 - progress * 0.6;
          return (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                background:
                  progress < 0.3
                    ? "rgba(229, 195, 131, 0.9)" // bright gold
                    : "rgba(197, 160, 89, 0.6)", // deeper gold
                boxShadow:
                  progress < 0.2
                    ? `0 0 ${p.size * 3}px rgba(229, 195, 131, 0.4)`
                    : "none",
                opacity,
                transform: `translate(-50%, -50%) scale(${scale})`,
                transition: "none",
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </div>

      {/* Ring: dorado, más grande */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-[width,height,border-color,background-color] duration-300 ease-out hidden lg:block border
          ${
            isHovering
              ? "w-20 h-20 border-gold/50 bg-gold/[0.04]"
              : "w-12 h-12 border-gold/40 bg-transparent"
          }
        `}
        style={{ mixBlendMode: "difference" }}
      />

      {/* Dot: dorado, un poco más grande */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-[5px] h-[5px] bg-gold rounded-full hidden lg:block"
        style={{
          mixBlendMode: "difference",
          boxShadow: "0 0 8px rgba(197, 160, 89, 0.6)",
        }}
      />
    </>
  );
}
