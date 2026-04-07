import { useState, useEffect, useRef, useCallback } from 'react';

export default function AuroraReveal({ text, highlightWord = 'ships.', delay = 0.8, onDone }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const calledDone = useRef(false);

  const DURATION = 2000;

  const handleDone = useCallback(() => {
    if (!calledDone.current) {
      calledDone.current = true;
      onDone?.();
    }
  }, [onDone]);

  useEffect(() => {
    setProgress(0);
    setDone(false);
    calledDone.current = false;
    startRef.current = null;

    const delayTimer = setTimeout(() => {
      const animate = (now) => {
        if (!startRef.current) startRef.current = now;
        const elapsed = now - startRef.current;
        const p = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setProgress(eased);

        if (p < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDone(true);
          handleDone();
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(delayTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [delay, handleDone]);

  const parts = [];
  const idx = text.indexOf(highlightWord);
  if (idx === -1) {
    parts.push({ text, highlight: false });
  } else {
    if (idx > 0) parts.push({ text: text.slice(0, idx), highlight: false });
    parts.push({ text: highlightWord, highlight: true });
    if (idx + highlightWord.length < text.length) {
      parts.push({ text: text.slice(idx + highlightWord.length), highlight: false });
    }
  }

  const clipPercent = progress * 100;
  const sweepPercent = Math.min(progress * 100 + 3, 103);

  return (
    <span className="relative inline">
      <span className="relative" style={{ clipPath: `inset(0 ${100 - clipPercent}% 0 0)` }}>
        {parts.map((part, i) =>
          part.highlight ? (
            <span key={i} className="aurora-gradient-text">{part.text}</span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </span>

      {progress > 0 && !done && (
        <span
          className="absolute pointer-events-none"
          style={{
            left: `${sweepPercent - 10}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '200%',
            background: 'radial-gradient(ellipse 50% 50% at center, rgba(58,175,169,0.2) 0%, rgba(196,149,106,0.1) 50%, transparent 100%)',
            filter: 'blur(18px)',
            zIndex: 1,
          }}
        />
      )}

      {done && (
        <span
          className="absolute pointer-events-none"
          style={{
            right: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '120px',
            height: '200%',
            background: 'radial-gradient(ellipse 50% 50% at center, rgba(58,175,169,0.15) 0%, rgba(196,149,106,0.08) 40%, transparent 100%)',
            filter: 'blur(18px)',
            zIndex: 1,
            opacity: 0,
            transition: 'opacity 0.8s ease-out',
          }}
        />
      )}

      {done && (
        <span
          className="absolute pointer-events-none"
          style={{
            right: '-2px',
            top: '-6px',
            bottom: '-6px',
            width: `${highlightWord.length * 0.7}em`,
            background: 'radial-gradient(ellipse at center, rgba(58,175,169,0.06) 0%, rgba(196,149,106,0.03) 50%, transparent 70%)',
            zIndex: -1,
          }}
        />
      )}
    </span>
  );
}
