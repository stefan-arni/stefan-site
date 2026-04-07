import { useEffect, useRef } from 'react';

export default function AuroraCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
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

    const blobs = [
      { color: [58, 175, 169], x: 0.25, y: 0.2, radius: 0.35, opacity: 0.045, speedX: 0.008, speedY: 0.006, phaseX: 0, phaseY: 0.5 },
      { color: [196, 149, 106], x: 0.7, y: 0.6, radius: 0.3, opacity: 0.035, speedX: 0.006, speedY: 0.009, phaseX: 1.2, phaseY: 0.8 },
      { color: [143, 163, 176], x: 0.5, y: 0.8, radius: 0.28, opacity: 0.03, speedX: 0.007, speedY: 0.005, phaseX: 2.4, phaseY: 1.6 },
    ];

    let startTime = performance.now();

    const draw = (now) => {
      const t = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const blob of blobs) {
        const [r, g, b] = blob.color;
        const cx = (blob.x + Math.sin(t * blob.speedX + blob.phaseX) * 0.12) * w;
        const cy = (blob.y + Math.cos(t * blob.speedY + blob.phaseY) * 0.1) * h;
        const radius = blob.radius * Math.max(w, h);
        const breathe = blob.opacity * (0.7 + 0.3 * Math.sin(t * 0.15 + blob.phaseX));

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${breathe})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${breathe * 0.4})`);
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
    />
  );
}
