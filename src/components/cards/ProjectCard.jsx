import React from 'react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { useLanguageStore } from '../../store/languageStore';
import { ArrowUpRight, Award, Layers, Activity } from 'lucide-react';
import { translations } from '../../data/translations';

const GithubIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    width="18" 
    height="18" 
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

export const ProjectCard = ({ project, onClick }) => {
  const { lang } = useLanguageStore();
  const t = translations[lang] || translations.ar;

  const category = project.category?.[lang] || project.category?.en || '';
  const description = project.description?.[lang] || project.description?.en || '';

  const getStatusLabel = (status) => {
    if (!status) return '';
    return t.cms?.[status] || status.replace('-', ' ');
  };

  const getTypeLabel = (type) => {
    if (!type) return '';
    return t.cms?.[type] || type;
  };

  return (
    <article className="h-full rounded-3xl">
      <SpotlightCard 
        onClick={onClick}
        className="flex flex-col h-full bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[var(--accent-color)] transition-colors duration-300 relative overflow-hidden group rounded-3xl"
      >
        <div className="flex-1 p-6">
          {/* Badge toolbar */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--accent-color)] uppercase tracking-wider">
                <Award className="w-3 h-3" />
                {t.cms?.featured || 'Featured'}
              </span>
            )}
            {project.projectType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] uppercase tracking-wider">
                <Layers className="w-3 h-3" />
                {getTypeLabel(project.projectType)}
              </span>
            )}
            {project.status && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)]">
                <Activity className="w-3 h-3" />
                {getStatusLabel(project.status)}
              </span>
            )}
          </div>

          {/* Category */}
          <span className="text-[10px] md:text-xs font-bold tracking-wider text-[var(--primary)] uppercase opacity-85 block mb-2">
            {category}
          </span>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-black mb-3 tracking-tight group-hover:text-[var(--accent-color)] transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-6 line-clamp-3 font-light">
            {description}
          </p>
        </div>

        <div className="px-6 pb-6">
          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tech.slice(0, 4).map((techItem, index) => (
              <span 
                key={index}
                className="px-2.5 py-1 text-[10px] md:text-xs rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] opacity-90 font-medium"
              >
                {techItem[lang] || techItem.en || techItem}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-2.5 py-1 text-[10px] md:text-xs rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] opacity-50 font-medium">
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          {/* Footer controls */}
          <div className="flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
            <span className="text-xs font-bold text-[var(--accent-color)] flex items-center gap-1 group-hover:underline">
              {lang === 'ar' ? 'استكشف المنتج' : lang === 'ur' ? 'تفصیلات دیکھیں' : 'Explore Product'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>

            <div className="flex gap-3 text-sm opacity-60">
              {project.githubLink && (
                <a 
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-[var(--accent-color)] transition-colors p-3"
                >
                  <GithubIcon className="w-4.5 h-4.5" />
                </a>
              )}
              {project.demoLink && (
                <a 
                  href={project.demoLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-[var(--accent-color)] transition-colors p-3"
                >
                  <ArrowUpRight className="w-4.5 h-4.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </article>
  );
};
