import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const trailRef = useRef(null);

  useEffect(() => {
    const el = trailRef.current;
    if (!el) return;

    let mouseX = -200, mouseY = -200;
    let trailX = -200, trailY = -200;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      trailX += (mouseX - trailX) * 0.1;
      trailY += (mouseY - trailY) * 0.1;
      el.style.transform = `translate(${trailX - 60}px, ${trailY - 60}px)`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div
      ref={trailRef}
      className="fixed top-0 left-0 w-[120px] h-[120px] rounded-full pointer-events-none hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(58,175,169,0.06) 0%, rgba(196,149,106,0.03) 40%, transparent 70%)',
        zIndex: 49,
      }}
    />
  );
}
