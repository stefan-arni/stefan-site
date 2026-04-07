import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, FileText, ArrowRight, ExternalLink, Lock } from 'lucide-react';

import AuroraCanvas from './components/AuroraCanvas';
import CursorTrail from './components/CursorTrail';
import CommandPalette from './components/CommandPalette';
import Nav from './components/Nav';
import ScrollReveal from './components/ScrollReveal';
import ProjectPage from './pages/ProjectPage';
import PROJECTS from './data/projects';

// ─── Data ─────────────────────────────────────────────────────────────────────

const LINKS = {
  github: 'https://github.com/stefan-arni',
  linkedin: 'https://www.linkedin.com/in/stefán-árni-arnarsson-5129ab354',
  email: 'mailto:sa2467@cornell.edu',
  resume: '/resume.pdf',
};

const PROOF_POINTS = [
  'Deployed clinical ML across 9 hospital wards in Iceland',
  'Medical imaging research at Weill Cornell Medicine / Sabuncu Lab',
  'Built full-stack AI products with RAG, agents, and workflow logic',
];

const FOCUS_AREAS = [
  {
    title: 'Clinical ML & Healthcare',
    description: 'End-to-end ML pipelines for clinical workflows — from retrospective data to production risk scoring. Experience with real hospital adoption, explainability requirements, and regulatory constraints.',
  },
  {
    title: 'Medical Imaging & Computer Vision',
    description: 'Segmentation and analysis pipelines for clinical imaging. Working with nnU-Net, volumetric evaluation, and reproducible research workflows on HPC infrastructure.',
  },
  {
    title: 'Applied LLM Systems & AI Products',
    description: 'Full-stack AI products where the LLM is a component of a larger system — RAG retrieval, agentic tool use, learner modeling, structured output, and real-time streaming.',
  },
];

const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured).sort((a, b) => a.order - b.order);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="font-mono text-label uppercase tracking-[0.08em] text-fg-dimmer">{children}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-block font-mono text-[11px] px-2 py-0.5 border border-border rounded text-fg-dim">
      {children}
    </span>
  );
}

function VisibilityBadge({ visibility }) {
  if (visibility === 'public') return null;
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 border border-border rounded text-fg-dimmer">
      <Lock size={10} />
      {visibility === 'sanitized' ? 'Public-safe summary' : 'Private'}
    </span>
  );
}

function StatusDot({ status }) {
  if (status === 'shipped') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-success" />
        <span className="font-mono text-[11px] text-success">Shipped</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-warning" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
      <span className="font-mono text-[11px] text-warning">In progress</span>
    </span>
  );
}

// ─── Scroll Management ───────────────────────────────────────────────────────

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5">
      <p className="font-display text-[8rem] md:text-[10rem] font-bold leading-none text-fg/10">
        404
      </p>
      <p className="text-fg-dim text-sm mb-6 -mt-2">Page not found</p>
      <Link to="/" className="font-mono text-xs text-accent hover:underline transition-colors">
        &larr; Back home
      </Link>
    </div>
  );
}

// ─── Featured Project Card ───────────────────────────────────────────────────

function FeaturedCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="block group">
      <div className="project-card card-hover relative bg-bg-card border border-border rounded-[var(--radius-card)] p-6 md:p-7 overflow-hidden h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <StatusDot status={project.status} />
          <span className="font-mono text-[11px] text-fg-dimmer">{project.category}</span>
          <VisibilityBadge visibility={project.visibility} />
        </div>

        <h3 className="font-display text-headline-md font-semibold text-fg mb-2 tracking-tight leading-tight">
          {project.title}
        </h3>

        <p className="text-fg-dim text-body-sm leading-relaxed mb-4 flex-1">
          {project.oneLiner}
        </p>

        {project.metrics && project.metrics.length > 0 && project.allowMetrics && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4 py-3 border-t border-border">
            {project.metrics.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-baseline gap-1.5">
                <span className="font-display text-lg font-semibold text-fg">{m.value}</span>
                <span className="font-mono text-[10px] text-fg-dimmer uppercase tracking-wider">{m.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <span className="text-fg-dimmer group-hover:text-accent transition-colors">
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage() {
  return (
    <div className="relative z-10">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-5 md:px-6 lg:px-10 pt-20 pb-16">
        <div className="max-w-4xl mx-auto w-full">
          <ScrollReveal immediate>
            <p className="font-mono text-label uppercase tracking-[0.08em] text-fg-dimmer mb-5">
              Applied ML Engineer · NYC
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1} immediate>
            <h1 className="font-display text-display-xl font-bold text-fg mb-4 leading-[var(--leading-display)] tracking-[var(--tracking-display)]">
              Stefan Arnarsson
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2} immediate>
            <p className="text-fg-dim text-body-lg leading-[1.68] max-w-2xl mb-8">
              Applied ML engineer building healthcare AI and real-world LLM systems. Cornell master's, previously deployed clinical ML across 9 hospital wards in Iceland. Interested in work where models meet real workflows.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3} immediate>
            <div className="flex flex-wrap gap-3 mb-12">
              <a
                href="#work"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                View work
                <ArrowRight size={14} />
              </a>
              <a
                href={LINKS.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm text-fg-dim hover:border-accent hover:text-accent transition-all"
              >
                <FileText size={14} />
                Resume
              </a>
              <a
                href={LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm text-fg-dim hover:border-accent hover:text-accent transition-all"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
              <a
                href={LINKS.email}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm text-fg-dim hover:border-accent hover:text-accent transition-all"
              >
                <Mail size={14} />
                Contact
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4} immediate>
            <div className="space-y-2.5">
              {PROOF_POINTS.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                  <p className="text-fg-dim text-body-sm">{point}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.5} immediate>
            <div className="flex items-center gap-4 mt-10">
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="text-fg-dimmer hover:text-accent transition-colors" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-fg-dimmer hover:text-accent transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href={LINKS.email} className="text-fg-dimmer hover:text-accent transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── SELECTED WORK ────────────────────────────────────── */}
      <section id="work" className="py-16 md:py-24 px-5 md:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <SectionLabel>Selected Work</SectionLabel>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-4">
            {FEATURED_PROJECTS.map((proj, i) => (
              <ScrollReveal key={proj.slug} delay={i * 0.08}>
                <FeaturedCard project={proj} />
              </ScrollReveal>
            ))}
          </div>

          {/* Secondary projects */}
          {PROJECTS.filter((p) => !p.featured).length > 0 && (
            <div className="mt-8">
              <p className="font-mono text-label uppercase tracking-[0.08em] text-fg-dimmer mb-4">Other Projects</p>
              <div className="grid md:grid-cols-2 gap-3">
                {PROJECTS.filter((p) => !p.featured).map((proj, i) => (
                  <ScrollReveal key={proj.slug} delay={i * 0.06}>
                    <Link to={`/projects/${proj.slug}`} className="block group">
                      <div className="bg-bg-card border border-border rounded-[14px] p-5 hover:border-border-hover transition-all flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <StatusDot status={proj.status} />
                          </div>
                          <h4 className="font-display text-base font-medium text-fg mb-0.5">{proj.title}</h4>
                          <p className="text-fg-dim text-sm">{proj.oneLiner}</p>
                        </div>
                        <ArrowRight size={14} className="text-fg-dimmer group-hover:text-accent transition-colors shrink-0 ml-4" />
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── FOCUS AREAS ──────────────────────────────────────── */}
      <section id="focus" className="py-16 md:py-24 px-5 md:px-6 lg:px-10 bg-bg-soft">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <SectionLabel>What I Work On</SectionLabel>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {FOCUS_AREAS.map((area, i) => (
              <ScrollReveal key={area.title} delay={i * 0.08}>
                <div className="bg-bg-card border border-border rounded-[var(--radius-card)] p-6">
                  <h3 className="font-display text-title-lg font-semibold text-fg mb-3 tracking-[var(--tracking-tight)]">
                    {area.title}
                  </h3>
                  <p className="text-fg-dim text-body-sm leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ────────────────────────────────────────────── */}
      <section id="about" className="py-16 md:py-24 px-5 md:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <SectionLabel>About</SectionLabel>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="space-y-4">
              <p className="text-fg text-body-lg leading-[1.68] font-medium">
                Applied ML engineer from Reykjavik, currently finishing a master's at Cornell in New York.
              </p>
              <p className="text-fg-dim text-body leading-[var(--leading-body)]">
                At Iceland's National University Hospital, I built a readmission risk model on 15 years of inpatient records and co-designed its clinical interface with the care team. Now I'm doing medical image segmentation research at Weill Cornell Medicine and building AI products on the side.
              </p>
              <p className="text-fg-dim text-body leading-[var(--leading-body)]">
                I'm drawn to applied ML problems where the hard part isn't the model — it's making the system work in context. Clinical adoption, data quality, evaluation rigor, and building something people actually trust and use.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-border">
              {[
                { label: 'Location', value: 'New York, NY' },
                { label: 'Education', value: 'MEng ECE, Cornell' },
                { label: 'Focus', value: 'Applied ML & AI' },
                { label: 'Status', value: 'Seeking MLE roles — May 2026' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-mono text-[11px] text-fg-dimmer uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-fg text-body-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="grid md:grid-cols-2 gap-3 mt-6">
              <div className="flex items-center gap-4 py-3.5 px-5 rounded-[14px] bg-bg-soft border border-border">
                <div className="flex-1">
                  <p className="text-fg text-body-sm font-medium">Cornell University</p>
                  <p className="text-fg-dim text-[13px]">Master's in Electrical & Computer Engineering · GPA 3.91</p>
                </div>
                <span className="font-mono text-[11px] text-fg-dimmer shrink-0">2025–2026</span>
              </div>
              <div className="flex items-center gap-4 py-3.5 px-5 rounded-[14px] bg-bg-soft border border-border">
                <div className="flex-1">
                  <p className="text-fg text-body-sm font-medium">University of Iceland</p>
                  <p className="text-fg-dim text-[13px]">BS Electrical & Computer Engineering · GPA 3.93 · Full Scholarship</p>
                </div>
                <span className="font-mono text-[11px] text-fg-dimmer shrink-0">2022–2025</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CONTACT CTA ──────────────────────────────────────── */}
      <section id="contact" className="py-16 md:py-24 px-5 md:px-6 lg:px-10 bg-bg-soft">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display text-headline-lg font-semibold text-fg mb-4 tracking-[var(--tracking-tight)]">
              Let's talk
            </h2>
            <p className="text-fg-dim text-body-lg mb-8 max-w-lg mx-auto">
              Open to ML engineering roles, research collaborations, and interesting applied AI problems.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <a
                href={LINKS.email}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                <Mail size={16} />
                sa2467@cornell.edu
              </a>
              <a
                href={LINKS.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm text-fg-dim hover:border-accent hover:text-accent transition-all"
              >
                <FileText size={16} />
                Resume
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex justify-center items-center gap-5">
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="text-fg-dimmer hover:text-accent transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-fg-dimmer hover:text-accent transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href={LINKS.email} className="text-fg-dimmer hover:text-accent transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-border py-6 px-5 md:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-fg-dimmer font-mono">
          <p>Stefan Arnarsson · NYC 2026</p>
          <div className="flex items-center gap-4">
            <a href={LINKS.email} className="hover:text-accent transition-colors">sa2467@cornell.edu</a>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <AuroraCanvas />
      <CursorTrail />
      <CommandPalette />
      <Nav />
      <ScrollToHash />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
