import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Shield, Server, Monitor, Code } from 'lucide-react';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const getIcon = (type, className) => {
  switch (type) {
    case 'shield': return <Shield className={className} />;
    case 'server': return <Server className={className} />;
    case 'monitor': return <Monitor className={className} />;
    default: return <Code className={className} />;
  }
};

export const Skills = React.memo(() => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;

  const skillGroups = data?.skills || [];

  return (
    <section id="skills" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <div className="mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3">
          {lang === 'ar' ? 'القدرات والخبرات العملية' : lang === 'ur' ? 'تکنیکی مہارتیں' : 'Core Capabilities'}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {lang === 'ar' ? 'المهارات الفنية والتقنية.' : lang === 'ur' ? 'مہارتیں اور آلات۔' : 'Technical Toolbox.'}
        </h2>
      </div>

      {/* Skills Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {skillGroups.map((group) => (
          <motion.div key={group.id} variants={itemVariants} className="h-full">
            <SpotlightCard 
              className="flex flex-col h-full hover:border-[var(--primary)]/20 transition-all duration-300"
            >
              {/* Header Icon + Category Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--primary)]">
                  {getIcon(group.iconType, "w-6 h-6")}
                </div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  {group.category[lang] || group.category.en}
                </h3>
              </div>

              {/* List of Skills tags */}
              <div className="flex flex-wrap gap-2.5 mt-auto">
                {group.items.map((item, index) => (
                  <span 
                    key={index}
                    className="px-3.5 py-1.5 text-xs rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]/30 hover:text-[var(--primary)] transition-all duration-300 font-medium"
                  >
                    {item[lang] || item.en}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
});
