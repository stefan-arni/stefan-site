import { motion } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0, className = '', immediate = false }) {
  const scrollProps = immediate
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      {...scrollProps}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
