import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, FileText, ArrowDown } from 'lucide-react';

import AuroraCanvas from './components/AuroraCanvas';
import CursorTrail from './components/CursorTrail';
import CommandPalette from './components/CommandPalette';
import Nav from './components/Nav';
import ScrollReveal from './components/ScrollReveal';
import AuroraReveal from './components/AuroraReveal';
import CountUp from './components/CountUp';
import ProjectPage from './pages/ProjectPage';
import PROJECTS from './data/projects';

// ─── Data ─────────────────────────────────────────────────────────────────────

const LINKS = [
  { label: 'GitHub', icon: Github, href: 'https://github.com/stefan-arni' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/stefán-árni-arnarsson-5129ab354' },
  { label: 'Email', icon: Mail, href: 'mailto:sa2467@cornell.edu' },
  { label: 'Resume', icon: FileText, href: '/resume.pdf' },
];

const EXPERIENCE = [
  {
    title: 'ML Researcher',
    company: 'Cornell Tech / Weill Cornell Medicine',
    lab: 'Sabuncu Lab',
    labUrl: 'https://sabuncu.engineering.cornell.edu',
    date: 'Jan 2026 - Present',
    location: 'New York, NY',
    description:
      'Building an nnU-Net liver MRI segmentation pipeline for clinical implementation and downstream volumetry. Reproducible training and inference workflows, evaluation with Dice and surface distance metrics, error analysis. The goal is a pipeline that\'s ready for real clinical use.',
    tags: ['PyTorch', 'nnU-Net', 'Medical Imaging'],
  },
  {
    title: 'Clinical ML Engineer',
    company: 'National University Hospital of Iceland',
    lab: 'Landspitali',
    labUrl: 'https://www.linkedin.com/company/landspitali-university-hospital/?originalSubdomain=is',
    date: 'May 2024 - Aug 2025',
    location: 'Reykjavik, Iceland',
    description:
      'Built a 30-day readmission risk prediction model from scratch using 15 years of inpatient records covering ~87% of Iceland\'s population. End-to-end XGBoost pipeline: data ingestion, feature engineering, leakage-proof evaluation, threshold tuning. Deployed as a live risk scoring tool across 9 hospital wards. Patients in the red band were 5.3x more likely to be readmitted within 30 days. Every prediction includes SHAP explainability.',
    highlight: true,
    tags: ['XGBoost', 'SHAP', 'Clinical NLP', 'Production ML'],
  },
];


const STACK = {
  'Languages': ['Python', 'TypeScript', 'SQL', 'C/C++', 'Bash'],
  'ML/AI': ['PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost', 'nnU-Net', 'TotalSegmentator', 'Transformers', 'SHAP', 'Pandas', 'NumPy'],
  'LLM/NLP': ['RAG Systems', 'Agentic AI', 'LLM Function Calling', 'Prompt Engineering', 'Structured Output Parsing', 'Gemini API', 'OpenAI API'],
  'Infrastructure': ['Cloudflare Workers/D1/Pages', 'FastAPI', 'React', 'Vite', 'Slurm/HPC', 'CUDA', 'Git', 'Jupyter/Colab'],
  'Methods': ['Medical Image Segmentation', 'Tabular Modeling', 'Clinical NLP', 'Computer Vision', 'Explainability', 'Calibration', 'Spaced Repetition'],
};

const EDUCATION = [
  {
    school: 'Cornell University, Cornell Tech',
    degree: 'MEng in Electrical and Computer Engineering',
    gpa: '3.91',
    detail: 'Applied ML · Computer Vision · NLP · Generative Models · ML Hardware & Systems',
    years: '2025 - 2026',
  },
  {
    school: 'University of Iceland',
    degree: 'BS in Electrical and Computer Engineering',
    gpa: '3.93',
    detail: 'Full Undergraduate Scholarship · ML · Probabilistic Methods · Embedded Systems',
    years: '2022 - 2025',
  },
];

const ABOUT_CARDS = [
  { label: 'Location', value: 'New York, NY' },
  { label: 'Education', value: 'MEng ECE, Cornell Tech' },
  { label: 'Focus', value: 'Applied ML, Computer Vision, NLP' },
  { label: 'Status', value: 'Looking for MLE roles — May 2026' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h >= 6 && h < 11) return 'probably drinking coffee before class. or sleeping through my alarm. either way:';
  if (h >= 11 && h < 17) return 'probably in class, in the lab, or at a coffee shop. anyway:';
  if (h >= 17 && h < 22) return 'probably working on side projects or pretending to do leetcode. currently:';
  if (h >= 22 || h < 2) return 'definitely up too late. probably coding. currently:';
  return "okay this is late even for me. but if you're here:";
}

// Ambient aurora glow — positioned absolutely behind content
function AuroraGlow({ position = 'left', color = 'green', top = '10%', size = '400px', opacity = 0.04 }) {
  const colors = {
    green: 'rgba(94, 218, 158,',
    purple: 'rgba(123, 140, 222,',
    pink: 'rgba(201, 123, 181,',
  };
  const c = colors[color];
  const posStyle = position === 'left' ? { left: '-10%' } : { right: '-10%' };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...posStyle,
        top,
        width: size,
        height: size,
        background: `radial-gradient(ellipse at center, ${c}${opacity}) 0%, ${c}0) 70%)`,
        filter: 'blur(60px)',
        zIndex: 0,
      }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-dimmer">{children}</span>
      <div className="flex-1 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, rgba(94,218,158,0.15) 0%, rgba(123,140,222,0.12) 50%, rgba(201,123,181,0.08) 80%, transparent 100%)' }} />
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-block font-mono text-[11px] px-2 py-0.5 border border-border rounded text-fg-dim hover:border-accent hover:text-accent hover:bg-accent-dim transition-all cursor-default">
      {children}
    </span>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  return (

      <div className="relative z-10">
        {/* ─── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-5 md:px-6 lg:px-10">
          <div className="max-w-7xl w-full">
            <ScrollReveal immediate>
              <p className="text-xs tracking-[0.1em] text-fg-dimmer mb-5">
                ml engineer · nyc · from reykjavik
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} immediate>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-fg mb-3">
                hey, i'm stefan
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2} immediate>
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-fg mb-5 min-h-[1.3em]">
                <AuroraReveal
                  text="I build ML that actually ships."
                  highlightWord="ships."
                  delay={0.8}
                  onDone={() => {}}
                />
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.3} immediate>
              <p className="text-fg-dim text-sm md:text-base max-w-xl mb-7 leading-relaxed">
                cornell tech meng · previously deployed clinical ml across 9 hospital wards in iceland · now building things in agentic ai and fine-tuning
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4} immediate>
              <div className="flex flex-wrap gap-2.5 mb-16">
                {LINKS.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs text-fg-dim hover:border-accent hover:text-accent hover:bg-accent-glow transition-all"
                  >
                    <Icon size={13} />
                    {label}
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <div className="absolute bottom-8 flex flex-col items-center gap-2 text-fg-dimmer">
            <span className="text-[10px] tracking-wider text-fg-dimmer/60">scroll</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown size={14} />
            </motion.div>
          </div>
        </section>

        {/* ─── ABOUT ────────────────────────────────────────────────────── */}
        <section id="about" className="relative py-12 md:py-16 px-5 md:px-6 lg:px-10 overflow-hidden">
          <AuroraGlow position="right" color="purple" top="-10%" size="500px" opacity={0.045} />
          <div className="max-w-7xl mx-auto relative z-[1]">
            <ScrollReveal>
              <SectionLabel>about</SectionLabel>
            </ScrollReveal>

            <div className="grid md:grid-cols-[1fr_280px] gap-10">
              <div className="space-y-4">
                <ScrollReveal>
                  <p className="text-fg text-base font-medium">ML engineer who likes to ship things.</p>
                </ScrollReveal>
                <ScrollReveal delay={0.1}>
                  <p className="text-fg-dim text-sm leading-relaxed">
                    At Iceland's National University Hospital, I built a 30-day readmission risk model on 15 years of patient records covering roughly 87% of the country's population. It's live in 9 wards today. Co-designed the UI with the care team because a model nobody trusts is a model nobody uses.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <p className="text-fg-dim text-sm leading-relaxed">
                    Now I'm at Cornell Tech doing medical image segmentation research at Weill Cornell Medicine, and building side projects in agentic AI and LLM fine-tuning.
                  </p>
                </ScrollReveal>
              </div>

              <div className="space-y-2.5">
                {ABOUT_CARDS.map((card, i) => (
                  <ScrollReveal key={card.label} delay={i * 0.08}>
                    <div className="aurora-border-card bg-bg-card rounded-lg p-3.5">
                      <p className="font-mono text-[10px] text-fg-dimmer uppercase tracking-wider mb-0.5">{card.label}</p>
                      <p className="text-fg text-sm">{card.value}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── EXPERIENCE ───────────────────────────────────────────────── */}
        <section id="experience" className="relative py-12 md:py-16 px-5 md:px-6 lg:px-10 overflow-hidden">
          <AuroraGlow position="left" color="green" top="20%" size="450px" opacity={0.04} />
          <AuroraGlow position="right" color="pink" top="60%" size="350px" opacity={0.035} />
          <div className="max-w-7xl mx-auto relative z-[1]">
            <ScrollReveal>
              <SectionLabel>experience</SectionLabel>
            </ScrollReveal>

            <div className="space-y-10">
              {EXPERIENCE.map((exp, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="grid md:grid-cols-[160px_1fr] gap-5 pb-10 border-b border-border last:border-0 last:pb-0">
                    <div className="font-mono text-[11px] text-fg-dimmer space-y-0.5">
                      <p>{exp.date}</p>
                      <p>{exp.location}</p>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-fg mb-0.5">{exp.title}</h3>
                      <p className="text-sm mb-0.5 text-accent">{exp.company}</p>
                      {exp.labUrl ? (
                        <a href={exp.labUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-fg-dimmer mb-3 block hover:text-accent transition-colors">{exp.lab}</a>
                      ) : (
                        <p className="font-mono text-[11px] text-fg-dimmer mb-3">{exp.lab}</p>
                      )}
                      <p className="text-fg-dim text-sm leading-relaxed mb-3">{exp.description}</p>

                      {exp.highlight && (
                        <div className="inline-block font-mono text-[11px] px-2.5 py-1 rounded-full mb-3 aurora-gradient-text-bg">
                          <CountUp end={5.3} decimals={1} suffix="x" /> risk stratification · <CountUp end={9} /> wards · live in production
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PROJECTS ─────────────────────────────────────────────────── */}
        <section id="projects" className="relative py-12 md:py-16 px-5 md:px-6 lg:px-10 overflow-hidden">
          <AuroraGlow position="left" color="purple" top="0%" size="400px" opacity={0.04} />
          <AuroraGlow position="right" color="green" top="50%" size="350px" opacity={0.035} />
          <div className="max-w-7xl mx-auto relative z-[1]">
            <ScrollReveal>
              <SectionLabel>projects</SectionLabel>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-3.5">
              {PROJECTS.map((proj, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <Link to={`/projects/${proj.slug}`} className="block h-full cursor-pointer">
                    <div className="project-card relative bg-bg-card border border-border rounded-lg p-5 hover:-translate-y-0.5 transition-all overflow-hidden h-full flex flex-col aurora-card-glow">
                      <div className="flex items-center gap-2 mb-2.5">
                        {proj.status === 'shipped' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span className="font-mono text-[11px] text-accent">shipped</span>
                          </>
                        ) : (
                          <>
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-pink"
                              style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
                            />
                            <span className="font-mono text-[11px] text-pink">building</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display text-base font-semibold text-fg mb-1.5">{proj.title}</h3>
                      <p className="text-fg-dim text-sm leading-relaxed mb-3 flex-1">{proj.description}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {proj.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STACK ────────────────────────────────────────────────────── */}
        <section className="py-12 md:py-16 px-5 md:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <SectionLabel>stack</SectionLabel>
            </ScrollReveal>

            <div className="space-y-5">
              {Object.entries(STACK).map(([category, items], ci) => (
                <ScrollReveal key={category} delay={ci * 0.08}>
                  <div>
                    <p className="font-mono text-[11px] text-fg-dimmer uppercase tracking-wider mb-2">{category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: ci * 0.08 + i * 0.03, duration: 0.4 }}
                        >
                          <Tag>{item}</Tag>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── EDUCATION ────────────────────────────────────────────────── */}
        <section className="relative py-12 md:py-16 px-5 md:px-6 lg:px-10 overflow-hidden">
          <AuroraGlow position="right" color="pink" top="10%" size="380px" opacity={0.035} />
          <div className="max-w-7xl mx-auto relative z-[1]">
            <ScrollReveal>
              <SectionLabel>education</SectionLabel>
            </ScrollReveal>

            <div className="space-y-8">
              {EDUCATION.map((edu, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="grid md:grid-cols-[160px_1fr] gap-5">
                    <div className="font-mono text-[11px] text-fg-dimmer">
                      <p>{edu.years}</p>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-fg mb-0.5">{edu.school}</h3>
                      <p className="text-fg-dim text-sm mb-0.5">{edu.degree} · GPA {edu.gpa}</p>
                      <p className="text-fg-dimmer text-xs">{edu.detail}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── NOW ──────────────────────────────────────────────────────── */}
        <section className="relative py-12 md:py-16 px-5 md:px-6 lg:px-10 overflow-hidden">
          <AuroraGlow position="left" color="purple" top="-20%" size="350px" opacity={0.04} />
          <div className="max-w-7xl mx-auto relative z-[1]">
            <ScrollReveal>
              <SectionLabel>now</SectionLabel>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-fg-dim italic text-sm mb-5">{getTimeGreeting()}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="aurora-border-card bg-bg-card rounded-lg p-5 md:p-6">
                <p className="text-fg text-sm leading-relaxed">
                  finishing my meng at cornell tech. building an icelandic language tutor that nobody asked for. mass applying to MLE roles. mass solving leetcode. trying to wake up at 7:30am. it's going okay.
                </p>
                <p className="text-fg-dimmer text-[11px] font-mono mt-3">last updated march 2026</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── FOOTER ───────────────────────────────────────────────────── */}
        <footer id="contact" className="border-t border-border py-6 px-5 md:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-fg-dimmer font-mono">
            <p>
              built with mass amounts of coffee and claude code · nyc 2026 ·{' '}
              <span className="text-purple/40 hidden md:inline">press cmd+k</span>
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:sa2467@cornell.edu" className="hover:text-accent transition-colors">sa2467@cornell.edu</a>
              <a href="https://github.com/stefan-arni" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/stefán-árni-arnarsson-5129ab354" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
  );
}

export default function App() {
  return (
    <>
      <AuroraCanvas />
      <CursorTrail />
      <CommandPalette />
      <Nav />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </>
  );
}
