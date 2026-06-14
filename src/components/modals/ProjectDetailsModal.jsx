import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, ShieldAlert, Cpu, HardHat, Code2, AlertTriangle, Lightbulb, BarChart3, Binary, Wrench, TrendingUp } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

const GithubIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    width="20" 
    height="20" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const getIcon = (type, className) => {
  switch (type) {
    case 'shield': return <ShieldAlert className={className} />;
    case 'hardhat': return <HardHat className={className} />;
    default: return <Cpu className={className} />;
  }
};

export const ProjectDetailsModal = ({ project, isOpen, onClose }) => {
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  if (!project) return null;

  // Multi-lingual fallbacks for problem/solution fields if they are missing in the schema
  const problemContent = project.problem?.[lang] || project.problem?.en || project.description?.[lang] || project.description?.en || '';
  const solutionContent = project.solution?.[lang] || project.solution?.en || project.architecture?.[lang] || project.architecture?.en || '';
  const architectureContent = project.architecture?.[lang] || project.architecture?.en || '';
  const challengesContent = project.challenges?.[lang] || project.challenges?.en || '';
  const businessImpactContent = project.businessValue?.[lang] || project.businessValue?.en || '';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--card-bg)] backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title || 'Project details'}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl bg-[var(--bg-primary)]/90 border border-[var(--border-color)] rounded-[2rem] shadow-2xl p-6 md:p-10 z-10 overflow-hidden max-h-[90vh] overflow-y-auto liquid-glass"
          >
            {/* Ambient inner blob */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none bg-[var(--primary)]" />

            {/* Header toolbar */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--primary)]">
                  {getIcon(project.iconType, "w-6 h-6")}
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-wider text-[var(--primary)] uppercase opacity-80 block">
                    {project.category?.[lang] || project.category?.en || ''}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)]">
                    {project.title}
                  </h2>
                </div>
              </div>

              <button 
                onClick={onClose} 
                aria-label={t.cms?.ariaCloseModal || 'Close'}
                className="p-3 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Grid (9 Case Study Sections) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Details & Narrative (2/3 width) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Problem Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <h4 className="text-xs uppercase tracking-widest font-black">{t.problemLabel || 'Problem Context'}</h4>
                  </div>
                  <p className="text-sm md:text-base opacity-80 leading-relaxed font-light bg-red-500/[0.02] border border-red-500/10 p-5 rounded-2xl">
                    {problemContent}
                  </p>
                </div>

                {/* 2. Solution Section */}
                <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <Lightbulb className="w-5 h-5 shrink-0" />
                    <h4 className="text-xs uppercase tracking-widest font-black">{t.solutionLabel || 'Proposed Solution'}</h4>
                  </div>
                  <p className="text-sm md:text-base opacity-80 leading-relaxed font-light bg-green-500/[0.02] border border-green-500/10 p-5 rounded-2xl">
                    {solutionContent}
                  </p>
                </div>

                {/* 3. Architecture Section */}
                {architectureContent && (
                  <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                    <div className="flex items-center gap-2 text-[var(--primary)]">
                      <Cpu className="w-5 h-5 shrink-0" />
                      <h4 className="text-xs uppercase tracking-widest font-black">{t.architecture || 'System Architecture'}</h4>
                    </div>
                    <p className="text-sm md:text-base opacity-85 leading-relaxed font-light bg-[var(--surface-hover)] border border-[var(--border-color)] p-5 rounded-2xl">
                      {architectureContent}
                    </p>
                  </div>
                )}

                {/* 4. Features Section */}
                {project.features && project.features.length > 0 && (
                  <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                    <h4 className="text-xs uppercase tracking-widest font-bold opacity-45">{t.keyFeatures || 'Key Features'}</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-3 items-start text-sm">
                          <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                          <span className="opacity-80">
                            {feature[lang] || feature.en}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 5. Challenges Section */}
                {challengesContent && (
                  <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                    <div className="flex items-center gap-2 text-orange-400">
                      <Wrench className="w-5 h-5 shrink-0" />
                      <h4 className="text-xs uppercase tracking-widest font-black">{t.techChallenges || 'Engineering Challenges'}</h4>
                    </div>
                    <p className="text-sm md:text-base opacity-80 leading-relaxed font-light bg-orange-500/[0.02] border border-orange-500/10 p-5 rounded-2xl">
                      {challengesContent}
                    </p>
                  </div>
                )}

                {/* 6. Business Impact Section */}
                {businessImpactContent && (
                  <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <TrendingUp className="w-5 h-5 shrink-0" />
                      <h4 className="text-xs uppercase tracking-widest font-black">{t.businessImpactLabel || 'Business Impact & Value'}</h4>
                    </div>
                    <p className="text-sm md:text-base opacity-80 leading-relaxed font-light bg-yellow-500/[0.02] border border-yellow-500/10 p-5 rounded-2xl">
                      {businessImpactContent}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar / Tech Stack & Links (1/3 width) */}
              <div className="space-y-6 lg:border-l lg:border-[var(--border-color)] lg:pl-8">
                
                {/* 7. Tech Stack Section */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold opacity-45 mb-4">{t.techStack || 'Technology Stack'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech && project.tech.map((techItem, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 text-xs rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] font-medium opacity-90 flex items-center gap-1.5"
                      >
                        <Binary className="w-3.5 h-3.5 opacity-60 text-[var(--primary)]" />
                        {techItem[lang] || techItem.en || techItem}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 8. Demo & 9. GitHub Links */}
                <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                  {project.demoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      <ExternalLink className="w-4.5 h-4.5" />
                      {t.demoLink || 'Live Demo'}
                    </a>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm border border-[var(--border-color)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer hover:-translate-y-0.5"
                    >
                      <GithubIcon className="w-4.5 h-4.5" />
                      {t.sourceLink || 'Source Code'}
                    </a>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
