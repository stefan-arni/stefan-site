import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      if (!isHome) {
        setActive('');
        return;
      }

      const sections = ['contact', 'about', 'work'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(id);
          return;
        }
      }
      setActive('');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const handleNavClick = (e, item) => {
    const section = item.href.replace('#', '');
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      e.preventDefault();
      navigate(`/#${section}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-border' : ''
      }`}
    >
      <div className="max-w-5xl mx-auto px-5 md:px-6 lg:px-10 flex items-center justify-between h-12">
        <Link
          to="/"
          className="font-display text-sm font-semibold text-fg hover:text-accent transition-colors"
        >
          Stefan Arnarsson
        </Link>

        <div className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={`/${item.href}`}
              onClick={(e) => handleNavClick(e, item)}
              className={`font-body text-[14px] font-medium transition-colors ${
                active === item.href.replace('#', '')
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
