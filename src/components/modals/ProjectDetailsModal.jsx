import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, ShieldAlert, Cpu, HardHat } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../data/translations';

const GithubIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-5xl bg-[#0a0a0c]/90 border border-[var(--border)] rounded-[2rem] shadow-2xl p-6 md:p-10 z-10 overflow-hidden max-h-[90vh] overflow-y-auto liquid-glass"
          >
            {/* Ambient inner blob */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none bg-[var(--primary)]" />

            {/* Header toolbar */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-[var(--primary)]">
                  {getIcon(project.iconType, "w-6 h-6")}
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-wider text-[var(--primary)] uppercase opacity-80 block">
                    {project.category[lang] || project.category.en}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    {project.title}
                  </h2>
                </div>
              </div>

              <button 
                onClick={onClose} 
                className="p-3 rounded-xl border border-white/[0.08] hover:bg-white/10 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Details & Narrative (2/3 width) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold opacity-40 mb-3">{t.overview}</h4>
                  <p className="text-base md:text-lg opacity-80 leading-relaxed font-light">
                    {project.description[lang] || project.description.en}
                  </p>
                </div>

                {/* Narrative split: Problem vs Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/[0.04]">
                  <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">{t.problemLabel}</h5>
                    <p className="text-sm opacity-75 leading-relaxed">
                      {project.challenges[lang] || project.challenges.en}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/10">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">{t.solutionLabel}</h5>
                    <p className="text-sm opacity-75 leading-relaxed">
                      {project.architecture[lang] || project.architecture.en}
                    </p>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="pt-4 border-t border-white/[0.04]">
                  <h4 className="text-xs uppercase tracking-widest font-bold opacity-40 mb-4">{t.keyFeatures}</h4>
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

                {/* Business Value */}
                {project.businessValue && (
                  <div className="pt-4 border-t border-white/[0.04]">
                    <h4 className="text-xs uppercase tracking-widest font-bold opacity-40 mb-3">{t.businessImpactLabel}</h4>
                    <p className="text-sm opacity-75 leading-relaxed">
                      {project.businessValue[lang] || project.businessValue.en}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar (1/3 width) */}
              <div className="space-y-6 lg:border-l lg:border-white/[0.05] lg:pl-8">
                {/* Tech Environment */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold opacity-40 mb-4">{t.techStack}</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((techItem, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 text-xs rounded-xl bg-white/[0.02] border border-white/[0.05] font-medium opacity-90"
                      >
                        {techItem[lang] || techItem.en || techItem}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project links */}
                <div className="pt-6 border-t border-white/[0.05] space-y-3">
                  {project.demoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 shadow-lg cursor-pointer"
                    >
                      <ExternalLink className="w-4.5 h-4.5" />
                      {t.demoLink}
                    </a>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm border border-white/20 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <GithubIcon className="w-4.5 h-4.5" />
                      {t.sourceLink}
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
