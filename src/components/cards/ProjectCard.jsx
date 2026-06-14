import React, { useState } from 'react';
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

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Calculate tilt angles (max 8 degrees for a premium organic feel)
    setTilt({
      x: -y / (rect.height / 2) * 8,
      y: x / (rect.width / 2) * 8
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

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
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${tilt.x !== 0 ? -6 : 0}px)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
      }}
      className="h-full rounded-3xl"
    >
      <SpotlightCard 
        onClick={onClick}
        className="flex flex-col h-full bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[var(--primary)]/40 transition-all duration-300 shadow-2xl backdrop-blur-xl relative overflow-hidden group rounded-3xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] rounded-full blur-[60px] opacity-10 pointer-events-none group-hover:opacity-25 transition-opacity" />

        <div className="flex-1 p-6">
          {/* Badge toolbar */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase tracking-wider">
                <Award className="w-3 h-3" />
                {t.cms?.featured || 'Featured'}
              </span>
            )}
            {project.projectType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 uppercase tracking-wider">
                <Layers className="w-3 h-3" />
                {getTypeLabel(project.projectType)}
              </span>
            )}
            {project.status && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                project.status === 'completed'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
              }`}>
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
          <h3 className="text-xl md:text-2xl font-black mb-3 tracking-tight group-hover:text-[var(--primary)] transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm md:text-base opacity-70 leading-relaxed mb-6 line-clamp-3 font-light">
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
    </div>
  );
};
