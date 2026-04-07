import { useEffect, useRef } from 'react';

export default function AuroraCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Single muted slate-blue blob — very subtle
    const blobs = [
      { color: [79, 107, 138], x: 0.3, y: 0.25, radius: 0.4, opacity: 0.025, speedX: 0.005, speedY: 0.004, phaseX: 0, phaseY: 0.5 },
      { color: [79, 107, 138], x: 0.7, y: 0.65, radius: 0.35, opacity: 0.018, speedX: 0.004, speedY: 0.006, phaseX: 1.5, phaseY: 1.0 },
    ];

    let startTime = performance.now();

    const draw = (now) => {
      const t = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const blob of blobs) {
        const [r, g, b] = blob.color;
        const cx = (blob.x + Math.sin(t * blob.speedX + blob.phaseX) * 0.08) * w;
        const cy = (blob.y + Math.cos(t * blob.speedY + blob.phaseY) * 0.06) * h;
        const radius = blob.radius * Math.max(w, h);
        const breathe = blob.opacity * (0.8 + 0.2 * Math.sin(t * 0.1 + blob.phaseX));

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${breathe})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${breathe * 0.3})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none hidden md:block"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
