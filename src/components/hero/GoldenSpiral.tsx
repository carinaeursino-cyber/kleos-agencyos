import { useEffect, useRef, useState } from "react";

export default function GoldenSpiral({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  // Force re-render/re-animate when slide becomes active
  useEffect(() => {
    if (isActive) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let W = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let H = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        W = canvas.width = canvas.offsetWidth || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // ── KLEOS Elite Branding Color Palette ─────────────────────────
    const GOLD = "rgba(197,160,89,";
    const GOLD_LIGHT = "rgba(229,195,131,";

    let t = 0; // Independent high-res tick for rings and dot breathing

    const animate = () => {
      if (!ctx || !canvas) return;

      // Absolute Deep Black Background (#050505 - KLEOS Brand Standard)
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const maxRadius = Math.min(W, H) * 0.35; // responsive boundary for expanding rings

      // ── PART 1: Concentric Expanding Rings (3 phase-shifted wave rings) ──
      [0, 0.33, 0.66].forEach((offset) => {
        const phase = ((t * 0.012 + offset) % 1);
        const ringRadius = 6 + phase * (maxRadius * 1.15);
        const ringAlpha = (1 - phase) * 0.28;

        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${GOLD}${ringAlpha})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      });

      // ── PART 2: Breathing Central Dot with Glowing Radial Gradient Halo ──
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.035);
      const dotRadius = 5.2 + pulse * 2.2;
      const dotAlpha = 0.8 + pulse * 0.2;

      // Soft blooming golden halo behind the core dot
      const haloRadius = dotRadius + 5.5 + pulse * 3.5;
      const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloRadius);
      haloGrad.addColorStop(0, `${GOLD_LIGHT}0.16)`);
      haloGrad.addColorStop(1, `${GOLD}0)`);

      ctx.beginPath();
      ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // Solid metallic gold core dot
      ctx.beginPath();
      ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = `${GOLD}${dotAlpha})`;
      ctx.fill();

      // Only increment time tick if slide is currently active
      if (isActive) {
        t += 1;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive, animationKey]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* High-performance responsive canvas layer */}
      <canvas
        ref={canvasRef}
        key={animationKey}
        className="absolute inset-0 w-full h-full block filter drop-shadow-[0_0_10px_rgba(197,160,89,0.35)] select-none pointer-events-none"
      />
    </div>
  );
}
