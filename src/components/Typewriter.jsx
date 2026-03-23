import { useState, useEffect, useRef } from 'react';

export default function Typewriter({ text, speed = 80, onDone }) {
  const [displayed, setDisplayed] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [done, setDone] = useState(false);
  const blinksRef = useRef(0);

  useEffect(() => {
    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!done) {
      setDone(true);
      onDone?.();
      // Blink 3 more times then fade out
      const blinkInterval = setInterval(() => {
        blinksRef.current++;
        setCursorVisible((v) => !v);
        if (blinksRef.current >= 6) {
          clearInterval(blinkInterval);
          setCursorVisible(false);
        }
      }, 500);
      return () => clearInterval(blinkInterval);
    }
  }, [displayed, text, speed, done, onDone]);

  // Render with "ships." highlighted
  const renderText = () => {
    const idx = displayed.indexOf('ships.');
    if (idx === -1) return displayed;
    return (
      <>
        {displayed.slice(0, idx)}
        <span className="text-accent">{displayed.slice(idx, idx + 6)}</span>
        {displayed.slice(idx + 6)}
      </>
    );
  };

  return (
    <span>
      {renderText()}
      <span
        className="inline-block w-[3px] h-[0.85em] bg-accent ml-0.5 align-middle"
        style={{
          opacity: cursorVisible ? 1 : 0,
          animation: done ? 'none' : 'cursor-blink 0.8s step-end infinite',
        }}
      />
    </span>
  );
}
