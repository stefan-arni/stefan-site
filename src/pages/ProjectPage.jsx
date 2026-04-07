import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PROJECTS from '../data/projects';
import ScrollReveal from '../components/ScrollReveal';
import CountUp from '../components/CountUp';

// ─── Reusable pieces ─────────────────────────────────────────────────────────

function Tag({ children }) {
  return (
    <span className="inline-block font-mono text-[11px] px-2 py-0.5 border border-border rounded text-fg-dim">
      {children}
    </span>
  );
}

function SectionDivider() {
  return (
    <div
      className="h-[1px] my-10"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, rgba(58,175,169,0.2) 20%, rgba(196,149,106,0.12) 60%, transparent 100%)',
      }}
    />
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ stats }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
          className="aurora-border-card bg-bg-card rounded-lg p-3.5 text-center"
        >
          <p className="font-display text-2xl md:text-3xl font-bold text-fg mb-0.5">
            {stat.value}
          </p>
          <p className="font-mono text-[10px] text-fg-dimmer uppercase tracking-wider leading-tight">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Architecture flow ────────────────────────────────────────────────────────

function ArchitectureFlow({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mb-10">
      <p className="font-mono text-[11px] text-fg-dimmer uppercase tracking-wider mb-4">
        data flow per turn
      </p>
      <div className="flex flex-wrap items-center gap-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="flex items-center"
          >
            <span className="font-mono text-[11px] px-2.5 py-1 bg-bg-card border border-border rounded text-fg-dim whitespace-nowrap">
              {step}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight size={10} className="text-accent/40 mx-1.5 shrink-0" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Formula block ────────────────────────────────────────────────────────────

function FormulaBlock({ formula }) {
  if (!formula) return null;

  return (
    <div className="my-5 rounded-lg border border-border bg-bg-card overflow-hidden">
      <div className="px-4 py-2 border-b border-border">
        <p className="font-mono text-[10px] text-fg-dimmer uppercase tracking-wider">
          {formula.label}
        </p>
      </div>
      <div className="px-4 py-3">
        {formula.lines.map((line, i) => (
          <p key={i} className="font-mono text-sm text-accent leading-relaxed">
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Tool cards grid ──────────────────────────────────────────────────────────

function ToolCards({ tools }) {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-5">
      {tools.map((tool, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="bg-bg-card border border-border rounded-lg p-3.5 hover:border-border-hover transition-colors"
        >
          <p className="font-mono text-xs text-accent mb-1">{tool.name}</p>
          <p className="text-fg-dim text-[12px] leading-relaxed">{tool.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Screenshot placeholder ───────────────────────────────────────────────────

function ScreenshotSlot({ slug, index = 0 }) {
  // Will render images when they exist in /public/projects/{slug}/
  // For now, returns null — no empty boxes
  return null;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find((p) => p.slug === slug);

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate('/');
    // Wait for navigation, then scroll to the projects section
    setTimeout(() => {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <p className="text-fg-dim text-sm mb-4">project not found</p>
        <Link to="/" className="text-accent text-sm hover:underline">
          ← back home
        </Link>
      </div>
    );
  }

  const hasContent = project.hero || project.sections.length > 0;

  return (
    <div className="relative z-10 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-6 lg:px-10 py-16 md:py-24">
        {/* Back link */}
        <ScrollReveal immediate>
          <a
            href="/#projects"
            onClick={handleBackClick}
            className="inline-flex items-center gap-1.5 text-fg-dim text-xs hover:text-accent transition-colors mb-10"
          >
            <ArrowLeft size={12} />
            back to projects
          </a>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal delay={0.1} immediate>
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-3">
              {project.status === 'shipped' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="font-mono text-[11px] text-accent">shipped</span>
                </>
              ) : (
                <>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-warm"
                    style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
                  />
                  <span className="font-mono text-[11px] text-warm">building</span>
                </>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-fg mb-3">
              {project.title}
            </h1>

            {project.hero ? (
              <p className="text-fg-dim text-base md:text-lg leading-relaxed">
                {project.hero}
              </p>
            ) : (
              <p className="text-fg-dim text-base leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Links */}
        {(project.github || project.demo) && (
          <ScrollReveal delay={0.2} immediate>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-xs text-accent hover:bg-accent/20 transition-all"
                >
                  <ExternalLink size={12} />
                  try it live
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border text-xs text-fg-dim hover:border-accent hover:text-accent transition-all"
                >
                  <Github size={12} />
                  view source
                </a>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* Stats bar */}
        {hasContent && <StatsBar stats={project.stats} />}

        {/* Architecture flow (Kenni-specific) */}
        {project.flow && (
          <ScrollReveal>
            <ArchitectureFlow steps={project.flow} />
          </ScrollReveal>
        )}

        {hasContent && <SectionDivider />}

        {/* Content sections with visual components */}
        {hasContent && project.sections.length > 0 && (
          <div>
            {project.sections.map((section, i) => (
              <div key={i}>
                <ScrollReveal>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-fg mb-3">
                      {section.heading}
                    </h2>
                    <p className="text-fg-dim text-sm leading-relaxed whitespace-pre-line">
                      {section.body}
                    </p>
                    {section.formula && <FormulaBlock formula={section.formula} />}
                    {section.tools && <ToolCards tools={section.tools} />}
                  </div>
                </ScrollReveal>
                {i < project.sections.length - 1 && <SectionDivider />}
              </div>
            ))}
          </div>
        )}

        {/* Placeholder for projects with no content yet */}
        {!hasContent && (
          <ScrollReveal delay={0.2} immediate>
            <div className="aurora-border-card bg-bg-card rounded-lg p-5 md:p-6 mb-10">
              <p className="text-fg-dim text-sm leading-relaxed">
                {project.status === 'building'
                  ? 'this project is still in progress — details coming soon.'
                  : 'detailed writeup coming soon.'}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Stack */}
        {project.stack.length > 0 && (
          <>
            <SectionDivider />
            <ScrollReveal>
              <div>
                <p className="font-mono text-[11px] text-fg-dimmer uppercase tracking-wider mb-3">
                  stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
}
