import { useEffect, useRef } from 'react';

export default function AuroraCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let mouse = { x: -9999, y: -9999 };

    // --- Resize ---
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // --- Mouse tracking ---
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // --- Simple noise-like function (no dependencies) ---
    // Hash-based smooth noise using sine
    const noise = (x) => {
      const s1 = Math.sin(x * 1.0) * 0.5;
      const s2 = Math.sin(x * 2.3 + 1.7) * 0.25;
      const s3 = Math.sin(x * 4.1 + 3.2) * 0.125;
      return s1 + s2 + s3;
    };

    // 2D noise approximation
    const noise2d = (x, y) => {
      return noise(x + y * 0.7) * 0.6 + noise(x * 1.3 - y * 0.5) * 0.4;
    };

    // --- Aurora curtain parameters ---
    // Each curtain is a band of vertical light columns
    const curtains = [
      {
        color: [94, 218, 158],   // aurora green
        baseOpacity: 0.12,
        xOffset: 0,
        yBase: 0.08,             // how high up the curtain starts (fraction of height)
        height: 0.45,            // how tall the curtain extends down
        waveSpeed: 0.15,         // horizontal wave speed
        waveAmp: 60,             // horizontal wave amplitude in pixels
        shimmerSpeed: 0.4,       // vertical shimmer speed
        driftSpeed: 0.02,        // slow horizontal drift
        columns: 80,             // number of light columns
        width: 1.2,              // fraction of canvas width the curtain spans
        centerX: 0.45,           // horizontal center (fraction)
      },
      {
        color: [123, 140, 222],  // blue-purple
        baseOpacity: 0.18,
        xOffset: 200,
        yBase: 0.02,
        height: 0.5,
        waveSpeed: 0.12,
        waveAmp: 55,
        shimmerSpeed: 0.35,
        driftSpeed: -0.015,
        columns: 70,
        width: 1.1,
        centerX: 0.6,
      },
      {
        color: [201, 123, 181],  // pink
        baseOpacity: 0.14,
        xOffset: 400,
        yBase: 0.06,
        height: 0.38,
        waveSpeed: 0.1,
        waveAmp: 40,
        shimmerSpeed: 0.3,
        driftSpeed: 0.01,
        columns: 55,
        width: 0.85,
        centerX: 0.3,
      },
    ];

    // --- Particles ---
    const PARTICLE_COUNT = 70;
    const particles = [];

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const rand = Math.random();
        let color, alpha;
        if (rand < 0.8) {
          color = '58, 68, 80';
          alpha = 0.3 + Math.random() * 0.3;
        } else if (rand < 0.95) {
          color = '94, 218, 158';
          alpha = 0.4 + Math.random() * 0.3;
        } else {
          color = '123, 140, 222';
          alpha = 0.35 + Math.random() * 0.25;
        }
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 1.2 + Math.random() * 1.2,
          color,
          alpha,
        });
      }
    };
    initParticles();

    // --- Offscreen buffer for aurora (performance: draw at quarter res) ---
    const auroraCanvas = document.createElement('canvas');
    const actx = auroraCanvas.getContext('2d');

    // Second buffer for blur pass
    const blurCanvas = document.createElement('canvas');
    const bctx = blurCanvas.getContext('2d');

    // --- Animation loop ---
    let startTime = performance.now();

    const draw = (now) => {
      const t = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      // Aurora at quarter resolution — we'll blur it anyway
      const aw = Math.floor(w / 3);
      const ah = Math.floor(h / 3);
      if (auroraCanvas.width !== aw || auroraCanvas.height !== ah) {
        auroraCanvas.width = aw;
        auroraCanvas.height = ah;
        blurCanvas.width = aw;
        blurCanvas.height = ah;
      }

      ctx.clearRect(0, 0, w, h);
      actx.clearRect(0, 0, aw, ah);

      // Global breathing: slow opacity pulse (20s cycle)
      const breathe = 0.7 + 0.3 * Math.sin(t * (2 * Math.PI / 20));

      // Draw aurora curtains onto offscreen buffer
      for (const c of curtains) {
        const [cr, cg, cb] = c.color;
        const curtainWidth = aw * c.width;
        const startX = aw * c.centerX - curtainWidth / 2 + Math.sin(t * c.driftSpeed * Math.PI * 2) * aw * 0.1;
        const colWidth = curtainWidth / c.columns;

        for (let i = 0; i < c.columns; i++) {
          const colFraction = i / c.columns;
          const x = startX + i * colWidth;

          if (x < -colWidth * 2 || x > aw + colWidth * 2) continue;

          // Horizontal wave: each column is offset vertically by a sine wave
          const waveOffset = Math.sin(colFraction * Math.PI * 3 + t * c.waveSpeed + c.xOffset * 0.01) * c.waveAmp * 0.35;

          // Shimmer: brightness varies over time per column
          const shimmer = 0.5 + 0.5 * Math.sin(colFraction * Math.PI * 5 + t * c.shimmerSpeed + noise(colFraction * 10 + t * 0.2) * 2);

          // Intensity envelope: smooth bell curve, not just sin
          const edgeFade = Math.pow(Math.sin(colFraction * Math.PI), 1.5);
          // Additional noise-based intensity variation — more dramatic clumping
          const noiseIntensity = 0.4 + 0.6 * (0.5 + 0.5 * noise2d(colFraction * 6 + t * 0.06, t * 0.04));

          const intensity = edgeFade * shimmer * noiseIntensity;
          const alpha = c.baseOpacity * intensity * breathe;

          if (alpha < 0.003) continue;

          // Each column is a vertical gradient: bright at top, fading down
          const yStart = ah * c.yBase + waveOffset;
          const columnHeight = ah * c.height * (0.6 + 0.4 * noise(colFraction * 6 + t * 0.1));
          const yEnd = yStart + columnHeight;

          const grad = actx.createLinearGradient(0, yStart, 0, yEnd);
          grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
          grad.addColorStop(0.1, `rgba(${cr},${cg},${cb},${alpha * 0.5})`);
          grad.addColorStop(0.25, `rgba(${cr},${cg},${cb},${alpha})`);
          grad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${alpha * 0.6})`);
          grad.addColorStop(0.8, `rgba(${cr},${cg},${cb},${alpha * 0.2})`);
          grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);

          // Use wider, overlapping columns for organic blending
          actx.fillStyle = grad;
          actx.fillRect(x - colWidth * 0.5, yStart, colWidth * 2, yEnd - yStart);
        }
      }

      // Blur pass: draw aurora to blur canvas with filter, then composite
      bctx.clearRect(0, 0, aw, ah);
      bctx.filter = 'blur(8px)';
      bctx.drawImage(auroraCanvas, 0, 0);
      bctx.filter = 'none';

      // Draw blurred aurora to main canvas (upscaled)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(blurCanvas, 0, 0, w, h);

      // --- Particles on top ---
      const connectionDist = 120;

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1) {
          p.vx = (p.vx / speed);
          p.vy = (p.vy / speed);
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const opacity = (1 - dist / connectionDist) * 0.35;
            ctx.strokeStyle = `rgba(30, 39, 51, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
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
