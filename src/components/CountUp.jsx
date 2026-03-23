import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CountUp({ end, decimals = 0, duration = 1500, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOut
      setValue(eased * end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}{suffix}
    </span>
  );
}
