import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Github, ExternalLink, Lock, Briefcase, Calendar, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import PROJECTS from '../data/projects';
import ScrollReveal from '../components/ScrollReveal';

// ─── Reusable pieces ─────────────────────────────────────────────────────────

function Tag({ children }) {
  return (
    <span className="inline-block font-mono text-[11px] px-2 py-0.5 border border-border rounded text-fg-dim">
      {children}
    </span>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="font-display text-headline-md font-semibold text-fg mb-4 tracking-[var(--tracking-tight)] leading-[var(--leading-headline)]">
      {children}
    </h2>
  );
}

function SectionDivider() {
  return <div className="h-[1px] my-10 md:my-12 bg-border" />;
}

function RestrictedNotice({ note }) {
  if (!note) return null;
  return (
    <div className="flex items-start gap-2.5 py-3 px-4 rounded-[12px] bg-bg-soft border border-border mb-8">
      <Lock size={14} className="text-fg-dimmer mt-0.5 shrink-0" />
      <p className="text-fg-dim text-body-sm">{note}</p>
    </div>
  );
}

// ─── Quick Facts Bar ─────────────────────────────────────────────────────────

function QuickFacts({ project }) {
  const facts = [
    { icon: Briefcase, label: 'Role', value: project.role },
    { icon: Calendar, label: 'Timeline', value: project.timeline },
    { icon: Layers, label: 'Category', value: project.category },
  ].filter((f) => f.value);

  if (facts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
      {facts.map((fact, i) => (
        <div key={i} className="flex items-start gap-3 py-3 px-4 rounded-[12px] bg-bg-soft border border-border">
          <fact.icon size={14} className="text-fg-dimmer mt-0.5 shrink-0" />
          <div>
            <p className="font-mono text-[10px] text-fg-dimmer uppercase tracking-wider mb-0.5">{fact.label}</p>
            <p className="text-fg text-body-sm">{fact.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Metrics Strip ───────────────────────────────────────────────────────────

function MetricsStrip({ metrics, allowed }) {
  if (!metrics || metrics.length === 0 || !allowed) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {metrics.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
          className="bg-bg-card border border-border rounded-[14px] p-4 text-center"
        >
          <p className="font-display text-2xl font-bold text-fg mb-1">{m.value}</p>
          <p className="font-mono text-[10px] text-fg-dimmer uppercase tracking-wider leading-tight">{m.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Architecture Flow ───────────────────────────────────────────────────────

function ArchitectureFlow({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mb-8">
      <p className="font-mono text-[11px] text-fg-dimmer uppercase tracking-wider mb-4">System Flow</p>
      <div className="flex flex-wrap items-center gap-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="flex items-center"
          >
            <span className="font-mono text-[11px] px-2.5 py-1 bg-bg-card border border-border rounded text-fg-dim whitespace-nowrap">
              {step}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight size={10} className="text-fg-dimmer/40 mx-1.5 shrink-0" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Formula Block ───────────────────────────────────────────────────────────

function FormulaBlock({ formula }) {
  if (!formula) return null;

  return (
    <div className="my-5 rounded-[12px] border border-border bg-bg-soft overflow-hidden">
      <div className="px-4 py-2 border-b border-border">
        <p className="font-mono text-[10px] text-fg-dimmer uppercase tracking-wider">{formula.label}</p>
      </div>
      <div className="px-4 py-3">
        {formula.lines.map((line, i) => (
          <p key={i} className="font-mono text-sm text-accent leading-relaxed">{line || '\u00A0'}</p>
        ))}
      </div>
    </div>
  );
}

// ─── Tool Cards ──────────────────────────────────────────────────────────────

function ToolCards({ tools }) {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-5">
      {tools.map((tool, i) => (
        <div key={i} className="bg-bg-soft border border-border rounded-[12px] p-3.5">
          <p className="font-mono text-xs text-accent mb-1">{tool.name}</p>
          <p className="text-fg-dim text-[12px] leading-relaxed">{tool.detail}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Decision List ───────────────────────────────────────────────────────────

function DecisionList({ decisions }) {
  if (!decisions || decisions.length === 0) return null;

  return (
    <>
      <SectionHeading>Technical Decisions</SectionHeading>
      <div className="space-y-4 mb-2">
        {decisions.map((d, i) => (
          <div key={i} className="bg-bg-soft border border-border rounded-[14px] p-5">
            <h4 className="font-display text-base font-medium text-fg mb-2">{d.title}</h4>
            <p className="text-fg-dim text-body-sm leading-relaxed">{d.detail}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Outcome List ────────────────────────────────────────────────────────────

function OutcomeList({ outcomes }) {
  if (!outcomes || outcomes.length === 0) return null;

  return (
    <>
      <SectionHeading>Outcomes</SectionHeading>
      <ul className="space-y-2.5 mb-2">
        {outcomes.map((o, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
            <span className="text-fg-dim text-body-sm leading-relaxed">{o}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

function LessonsList({ lessons }) {
  if (!lessons || lessons.length === 0) return null;

  return (
    <>
      <SectionHeading>Lessons</SectionHeading>
      <div className="space-y-3">
        {lessons.map((l, i) => (
          <p key={i} className="text-fg-dim text-body-sm leading-relaxed pl-4 border-l-2 border-border">
            {l}
          </p>
        ))}
      </div>
    </>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find((p) => p.slug === slug);

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <p className="text-fg-dim text-sm mb-4">Project not found</p>
        <Link to="/" className="text-accent text-sm hover:underline">&larr; Back home</Link>
      </div>
    );
  }

  const hasDetailedContent = project.sections && project.sections.length > 0;
  const hasStructuredContent = project.problem || project.contributions?.length > 0 || project.decisions?.length > 0;
  const hasContent = hasDetailedContent || hasStructuredContent;

  return (
    <div className="relative z-10 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-6 lg:px-10 py-16 md:py-24">

        {/* Back link */}
        <ScrollReveal immediate>
          <a href="/#work" onClick={handleBackClick}
            className="inline-flex items-center gap-1.5 text-fg-dim text-xs hover:text-accent transition-colors mb-10"
          >
            <ArrowLeft size={12} /> Back to work
          </a>
        </ScrollReveal>

        {/* ─── Header ─────────────────────────────────────────── */}
        <ScrollReveal delay={0.1} immediate>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[11px] text-fg-dimmer">{project.category}</span>
              <StatusBadge status={project.status} />
              {project.visibility !== 'public' && (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 border border-border rounded text-fg-dimmer">
                  <Lock size={10} /> Public-safe summary
                </span>
              )}
            </div>

            <h1 className="font-display text-display-lg font-bold text-fg mb-4 leading-[1] tracking-[var(--tracking-display)]">
              {project.title}
            </h1>

            <p className="text-fg-dim text-body-lg leading-[1.68] max-w-[60ch]">
              {project.summary}
            </p>
          </div>
        </ScrollReveal>

        {/* ─── Links ──────────────────────────────────────────── */}
        {(project.links?.demo || project.links?.github || project.links?.external) && (
          <ScrollReveal delay={0.2} immediate>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {project.links.demo && (
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors">
                  <ExternalLink size={12} /> Try it live
                </a>
              )}
              {project.links.github && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-xs text-fg-dim hover:border-accent hover:text-accent transition-all">
                  <Github size={12} /> View source
                </a>
              )}
              {project.links.external && (
                <a href={project.links.external} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-xs text-fg-dim hover:border-accent hover:text-accent transition-all">
                  <ExternalLink size={12} /> Lab website
                </a>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* ─── Quick Facts ────────────────────────────────────── */}
        <ScrollReveal delay={0.2} immediate>
          <QuickFacts project={project} />
        </ScrollReveal>

        {/* ─── Restricted Notice ──────────────────────────────── */}
        <RestrictedNotice note={project.restrictedNote} />

        {/* ─── Metrics ────────────────────────────────────────── */}
        <MetricsStrip metrics={project.metrics} allowed={project.allowMetrics} />

        {/* ─── Architecture Flow ──────────────────────────────── */}
        {project.flow && (
          <ScrollReveal>
            <ArchitectureFlow steps={project.flow} />
          </ScrollReveal>
        )}

        {hasContent && <SectionDivider />}

        {/* ─── Structured Case Study Sections ─────────────────── */}

        {/* Problem / Context */}
        {project.problem && (
          <ScrollReveal>
            <div className="mb-2">
              <SectionHeading>Problem</SectionHeading>
              <p className="text-fg-dim text-body leading-[var(--leading-body)] max-w-[62ch]">{project.problem}</p>
            </div>
            <SectionDivider />
          </ScrollReveal>
        )}

        {/* System Overview */}
        {project.systemOverview && (
          <ScrollReveal>
            <div className="mb-2">
              <SectionHeading>System Overview</SectionHeading>
              <p className="text-fg-dim text-body leading-[var(--leading-body)] max-w-[62ch]">{project.systemOverview}</p>
            </div>
            <SectionDivider />
          </ScrollReveal>
        )}

        {/* Role / Contributions */}
        {project.contributions && project.contributions.length > 0 && (
          <ScrollReveal>
            <div className="mb-2">
              <SectionHeading>Role & Contributions</SectionHeading>
              <ul className="space-y-2">
                {project.contributions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                    <span className="text-fg-dim text-body-sm leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <SectionDivider />
          </ScrollReveal>
        )}

        {/* Technical Decisions */}
        {project.decisions && project.decisions.length > 0 && (
          <ScrollReveal>
            <DecisionList decisions={project.decisions} />
            <SectionDivider />
          </ScrollReveal>
        )}

        {/* Detailed sections (for projects with rich writeups) */}
        {hasDetailedContent && (
          <div>
            {project.sections.map((section, i) => (
              <div key={i}>
                <ScrollReveal>
                  <div>
                    <SectionHeading>{section.heading}</SectionHeading>
                    <p className="text-fg-dim text-body-sm leading-relaxed whitespace-pre-line max-w-[62ch]">
                      {section.body}
                    </p>
                    {section.formula && <FormulaBlock formula={section.formula} />}
                    {section.tools && <ToolCards tools={section.tools} />}
                  </div>
                </ScrollReveal>
                {i < project.sections.length - 1 && <SectionDivider />}
              </div>
            ))}
            <SectionDivider />
          </div>
        )}

        {/* Outcomes */}
        {project.outcomes && project.outcomes.length > 0 && (
          <ScrollReveal>
            <OutcomeList outcomes={project.outcomes} />
            <SectionDivider />
          </ScrollReveal>
        )}

        {/* Lessons */}
        {project.lessons && project.lessons.length > 0 && (
          <ScrollReveal>
            <LessonsList lessons={project.lessons} />
            <SectionDivider />
          </ScrollReveal>
        )}

        {/* Placeholder for empty projects */}
        {!hasContent && (
          <ScrollReveal delay={0.2} immediate>
            <div className="bg-bg-soft border border-border rounded-[14px] p-6 mb-8">
              <p className="text-fg-dim text-body-sm">
                {project.status === 'building'
                  ? 'This project is still in progress — details coming soon.'
                  : 'Detailed writeup coming soon.'}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* ─── Stack ──────────────────────────────────────────── */}
        {project.stack && project.stack.length > 0 && (
          <ScrollReveal>
            <div>
              <p className="font-mono text-[11px] text-fg-dimmer uppercase tracking-wider mb-3">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
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
