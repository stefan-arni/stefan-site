import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { label: 'about', href: '#about' },
  { label: 'experience', href: '#experience' },
  { label: 'projects', href: '#projects' },
  { label: 'contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['about', 'experience', 'projects', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(sections[i]);
          return;
        }
      }
      setActive('');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-border' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6 lg:px-10 flex items-center justify-between h-12">
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="font-mono text-sm text-fg-dim hover:text-accent transition-colors cursor-pointer"
          aria-label="Open command palette"
        >
          <span className="text-accent">&gt;</span>{' '}
          <span
            className="inline-block w-[6px] h-[14px] bg-fg-dim/50 align-middle"
            style={{ animation: 'cursor-blink 1s step-end infinite' }}
          />
        </button>

        <div className="flex items-center gap-5">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-xs transition-colors ${
                active === item.label.replace('#', '')
                  ? 'text-accent'
                  : 'text-fg-dim hover:text-fg'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
