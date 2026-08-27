import { useEffect, useRef } from "react";

interface LambdaCanvasProps {
  isActive?: boolean;
}

export default function LambdaCanvas({ isActive = true }: LambdaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftRef = useRef<SVGPathElement>(null);
  const rightRef = useRef<SVGPathElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  // ── Canvas: estrellas doradas parpadeantes ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let raf: number;

    canvas.width = W;
    canvas.height = H;

    const count = Math.floor((W * H) / 6000);
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 0.9 + 0.1,
      a: Math.random(),
      da: (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
      vy: Math.random() * 0.4 + 0.1,
    }));

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        s.a += s.da;
        if (s.a <= 0 || s.a >= 1) s.da *= -1;
        s.y -= s.vy;
        if (s.y < 0) s.y = H;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${s.a * 0.55})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ── Lambda SVG: reiniciar animación draw ──
  useEffect(() => {
    if (!isActive) return;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    const lenLeft = left.getTotalLength();
    const lenRight = right.getTotalLength();

    left.style.setProperty("--len-left", String(lenLeft));
    left.style.strokeDasharray = String(lenLeft);
    left.style.strokeDashoffset = String(lenLeft);

    right.style.setProperty("--len-right", String(lenRight));
    right.style.strokeDasharray = String(lenRight);
    right.style.strokeDashoffset = String(lenRight);

    const wrap = svgWrapRef.current;
    if (wrap) {
      wrap.style.display = "none";
      void wrap.offsetHeight;
      wrap.style.display = "";
    }

    left.style.animation = "draw-left 2.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards";
    right.style.animation = "draw-right 2.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards";
  }, [isActive]);

  const lambdaPath = "M 80,442 L 112,442 L 250,62";
  const lambdaPathRight = "M 420,442 L 388,442 L 250,62";

  return (
    <div className="absolute inset-0 bg-[#050505] overflow-hidden flex flex-col items-center justify-center">
      {/* Canvas de estrellas doradas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Contenedor Lambda SVG + Marca */}
      <div
        ref={svgWrapRef}
        className="relative z-10 flex flex-col items-center justify-center gap-6 md:gap-8"
      >
        {/* Wrapper SVG */}
        <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] lg:w-[460px] lg:h-[460px] flex items-center justify-center">
          {/* Halo radial dorado */}
          <div
            className="absolute w-[480px] h-[480px] md:w-[520px] md:h-[520px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)",
            }}
          />

          {/* Anillos decorativos */}
          <div
            className="absolute -inset-[14px] md:-inset-[18px] rounded-full border border-[rgba(212,175,55,0.15)] opacity-0"
            style={{ animation: "ring-in 0.8s ease forwards 3.2s" }}
          >
            <div className="absolute inset-3 rounded-full border border-[rgba(212,175,55,0.08)]" />
          </div>

          <style>{`
            @keyframes ring-in {
              to { opacity: 1; }
            }
            @keyframes draw-left {
              from { stroke-dashoffset: var(--len-left); }
              to   { stroke-dashoffset: 0; }
            }
            @keyframes draw-right {
              from { stroke-dashoffset: var(--len-right); }
              to   { stroke-dashoffset: 0; }
            }
            @keyframes spark-in {
              0%   { opacity: 0; r: 2; }
              40%  { opacity: 1; r: 8; }
              100% { opacity: 0; r: 14; }
            }
            @keyframes glow-pulse {
              0%, 100% {
                filter:
                  drop-shadow(0 0 6px rgba(212,175,55,0.85))
                  drop-shadow(0 0 18px rgba(212,175,55,0.50))
                  drop-shadow(0 0 40px rgba(212,175,55,0.22));
              }
              50% {
                filter:
                  drop-shadow(0 0 10px rgba(212,175,55,1.00))
                  drop-shadow(0 0 28px rgba(212,175,55,0.70))
                  drop-shadow(0 0 60px rgba(212,175,55,0.35));
              }
            }
            @keyframes logo-reveal {
              0%   { opacity: 0; transform: translateY(12px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Lambda isotipo KLEOS"
            style={{ animation: "glow-pulse 3.6s ease-in-out infinite 3.5s" }}
          >
            <defs>
              <filter id="inner-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0.85 0 0 0
                          0 0.68 0 0 0
                          0 0    0.21 0 0
                          0 0    0    3 -1"
                  result="colored"
                />
                <feComposite in="colored" in2="SourceGraphic" operator="over" />
              </filter>
            </defs>

            <path
              ref={leftRef}
              d={lambdaPath}
              fill="none"
              stroke="#C5A059"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#inner-glow)"
            />

            <path
              ref={rightRef}
              d={lambdaPathRight}
              fill="none"
              stroke="#C5A059"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#inner-glow)"
            />

            <circle
              cx="250"
              cy="62"
              r="0"
              fill="none"
              stroke="#E5C383"
              strokeWidth="2"
              style={{
                opacity: 0,
                animation: "spark-in 0.6s ease-out forwards 3.05s",
              }}
            />
          </svg>
        </div>

        {/* K·L·E·O·S — aparece tras la lambda */}
        <div
          className="flex items-baseline gap-[3px] select-none"
          style={{
            opacity: 0,
            animation: "logo-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) 3.2s forwards",
          }}
        >
          <span className="font-serif text-xl md:text-2xl lg:text-3xl tracking-[0.15em] text-[#C5A059] font-light">
            K
          </span>
          <span className="font-serif text-xl md:text-2xl lg:text-3xl tracking-[0.15em] text-white/40 font-light">
            ·L·E·O·S
          </span>
        </div>
      </div>
    </div>
  );
}
