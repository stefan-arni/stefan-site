import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMANDS = {
  help: () => ({ type: 'text', content: 'available commands: help, about, projects, experience, contact, email, github, linkedin, resume, coffee, hire me, iceland' }),
  about: () => ({ type: 'scroll', target: 'about' }),
  projects: () => ({ type: 'scroll', target: 'projects' }),
  experience: () => ({ type: 'scroll', target: 'experience' }),
  contact: () => ({ type: 'link', href: 'mailto:sa2467@cornell.edu' }),
  email: () => ({ type: 'link', href: 'mailto:sa2467@cornell.edu' }),
  github: () => ({ type: 'external', href: 'https://github.com/stefan-arni' }),
  linkedin: () => ({ type: 'external', href: 'https://www.linkedin.com/in/stef%C3%A1n-%C3%A1rni-arnarsson-5129ab354' }),
  resume: () => ({ type: 'external', href: '/resume.pdf' }),
  cv: () => ({ type: 'external', href: '/resume.pdf' }),
  coffee: () => ({ type: 'text', content: 'always.' }),
  'hire me': () => ({ type: 'html', content: '<a href="mailto:sa2467@cornell.edu" class="text-accent hover:underline">sa2467@cornell.edu</a> — let\'s talk.' }),
  iceland: () => ({ type: 'text', content: 'where i built ml for 87% of a country' }),
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const inputRef = useRef(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    setInput('');
    setResponse(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => {
          if (v) {
            handleClose();
            return false;
          }
          return true;
        });
      }
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const handler = COMMANDS[cmd];
    if (!handler) {
      setResponse({ type: 'text', content: 'command not found. type help for options.' });
      return;
    }

    const result = handler();
    if (result.type === 'scroll') {
      const el = document.getElementById(result.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      handleClose();
    } else if (result.type === 'link') {
      window.location.href = result.href;
      handleClose();
    } else if (result.type === 'external') {
      window.open(result.href, '_blank');
      handleClose();
    } else {
      setResponse(result);
    }
    setInput('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-fg/10 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            className="relative w-full max-w-[500px] mx-4 bg-bg-card border border-border rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <form onSubmit={handleSubmit} className="flex items-center px-4 py-3 border-b border-border">
              <span className="text-accent font-mono mr-2 select-none">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-fg font-mono text-sm outline-none placeholder:text-fg-dimmer"
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
              />
              <span className="text-fg-dimmer text-xs font-mono ml-2">esc</span>
            </form>

            {response && (
              <div className="px-4 py-3">
                {response.type === 'html' ? (
                  <p
                    className="font-mono text-sm text-accent"
                    dangerouslySetInnerHTML={{ __html: response.content }}
                  />
                ) : (
                  <p className="font-mono text-sm text-accent">{response.content}</p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
