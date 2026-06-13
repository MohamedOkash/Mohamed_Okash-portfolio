import React from 'react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { useLanguageStore } from '../../store/languageStore';
import { ArrowUpRight, Code } from 'lucide-react';

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

export const ProjectCard = ({ project, onClick }) => {
  const { lang } = useLanguageStore();

  const category = project.category[lang] || project.category.en;
  const description = project.description[lang] || project.description.en;

  return (
    <SpotlightCard 
      onClick={onClick}
      className="flex flex-col h-full hover:border-[var(--primary)]/30 transition-all duration-300"
    >
      <div className="flex-1">
        {/* Category badge */}
        <span className="text-[10px] md:text-xs font-semibold tracking-wider text-[var(--primary)] uppercase opacity-85 block mb-3">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight group-hover:text-[var(--primary)]">
          {project.title}
        </h3>

        {/* Short description */}
        <p className="text-sm md:text-base opacity-70 leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>
      </div>

      <div>
        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.slice(0, 4).map((techItem, index) => (
            <span 
              key={index}
              className="px-2.5 py-1 text-[10px] md:text-xs rounded-lg bg-white/[0.03] border border-white/[0.05] opacity-80"
            >
              {techItem[lang] || techItem.en || techItem}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2.5 py-1 text-[10px] md:text-xs rounded-lg bg-white/[0.01] border border-white/[0.02] opacity-50">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Footer links */}
        <div className="flex justify-between items-center pt-4 border-t border-white/[0.05]">
          <span className="text-xs font-bold text-[var(--primary)] flex items-center gap-1 group-hover:underline">
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
                className="hover:text-[var(--primary)] transition-colors p-1"
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
                className="hover:text-[var(--primary)] transition-colors p-1"
              >
                <ArrowUpRight className="w-4.5 h-4.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
};
