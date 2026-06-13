import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useLanguageStore } from '../../store/languageStore';
import { useAuthStore } from '../../store/authStore';
import { getJsonLdSchema } from '../../utils/seo';
import { DEFAULT_PORTFOLIO_DATA } from '../../data/constants';
import { RootLayout } from '../../app/layouts/RootLayout';
import { Hero } from '../../components/sections/Hero';
import { About } from '../../components/sections/About';
import { WhyOkash } from '../../components/sections/WhyOkash';
import { Skills } from '../../components/sections/Skills';
import { Experience } from '../../components/sections/Experience';
import { Certifications } from '../../components/sections/Certifications';
import { Contact } from '../../components/sections/Contact';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { ProjectDetailsModal } from '../../components/modals/ProjectDetailsModal';
import { LoginModal } from '../../components/modals/LoginModal';
import { Preloader } from '../../components/ui/Preloader';
import { CustomCursor } from '../../components/ui/CustomCursor';
import { translations } from '../../data/translations';
import { Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { SpotlightCard } from '../../components/ui/SpotlightCard';

export default function Home() {
  const { data, loading, loadPortfolio } = usePortfolioStore();
  const { lang } = useLanguageStore();
  const { user } = useAuthStore();
  const t = translations[lang] || translations.ar;

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preloaderActive, setPreloaderActive] = useState(true);

  // Load portfolio data on mount, passing the authenticated user for the bootstrap check
  useEffect(() => {
    loadPortfolio(user);
  }, [loadPortfolio, user]);

  const showPreloader = preloaderActive || loading;

  // Filter projects by featured vs general
  const featuredIds = data?.settings?.featuredProjects || [];
  const projects = data?.projects || [];

  const featuredProjects = projects.filter(p => p.featured === true || featuredIds.includes(p.id));
  const generalProjects = projects.filter(p => p.featured !== true && !featuredIds.includes(p.id));

  const pageTitle = `${data?.translations?.[lang]?.name || t.name} | ${data?.translations?.[lang]?.available || t.available}`;
  const pageDesc = data?.translations?.[lang]?.tagline || t.tagline;

  const renderCustomSection = (sect) => {
    const title = sect.title?.[lang] || sect.title?.en || '';
    const subtitle = sect.subtitle?.[lang] || sect.subtitle?.en || '';
    const content = sect.content?.[lang] || sect.content?.en || '';
    
    // Resolve dynamic Lucide icon
    const getIcon = (iconName, className) => {
      if (!iconName) return null;
      const formattedName = iconName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      const IconComponent = LucideIcons[formattedName] || LucideIcons[iconName] || LucideIcons.Sparkles;
      return <IconComponent className={className} />;
    };

    switch (sect.layoutType) {
      case 'textBlock':
        return (
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {sect.icon && (
              <div className="inline-flex p-3 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-2">
                {getIcon(sect.icon, "w-6 h-6")}
              </div>
            )}
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">{title}</h3>
            {subtitle && <p className="text-sm uppercase tracking-widest text-[var(--primary)] font-bold">{subtitle}</p>}
            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-light text-base text-justify md:text-center mt-4">{content}</div>
          </div>
        );
      case 'glassCard':
        return (
          <div className="max-w-4xl mx-auto">
            <SpotlightCard className="p-8 md:p-12 hover:border-[var(--primary)]/20 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary)] rounded-full blur-[100px] opacity-10 pointer-events-none" />
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                {sect.icon && (
                  <div className="p-4 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 shrink-0">
                    {getIcon(sect.icon, "w-8 h-8")}
                  </div>
                )}
                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{title}</h3>
                  {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">{subtitle}</p>}
                  <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-light text-base">{content}</div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        );
      case 'timeline': {
        const items = content.split('\n').filter(line => line.trim() !== '');
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center md:text-start">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{title}</h3>
              {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">{subtitle}</p>}
            </div>
            <div className="relative border-s border-white/[0.06] ms-4 md:ms-8 space-y-8 py-2">
              {items.map((item, idx) => (
                <div key={idx} className="relative ps-8 group">
                  <div className="absolute top-1.5 -start-[6px] w-3 h-3 rounded-full bg-[#050505] border border-white/20 group-hover:border-[var(--primary)] transition-colors duration-300 flex items-center justify-center z-10">
                    <div className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-[var(--primary)] transition-all duration-300" />
                  </div>
                  <SpotlightCard className="p-5 hover:border-[var(--primary)]/20 transition-all duration-300">
                    <div className="text-zinc-300 leading-relaxed font-light text-sm">{item}</div>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'featureGrid': {
        const items = content.split('\n').filter(line => line.trim() !== '');
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{title}</h3>
              {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">{subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, idx) => (
                <SpotlightCard key={idx} className="p-6 hover:border-[var(--primary)]/20 transition-all duration-300 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    {sect.icon && <div className="text-[var(--primary)]">{getIcon(sect.icon, "w-5 h-5")}</div>}
                    <div className="text-zinc-300 leading-relaxed font-light text-sm">{item}</div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        );
      }
      case 'contactBlock':
        return (
          <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-md">
            {sect.icon && (
              <div className="inline-flex p-3.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-4 animate-bounce">
                {getIcon(sect.icon, "w-6 h-6")}
              </div>
            )}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{title}</h3>
            {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold mb-4">{subtitle}</p>}
            <div className="text-zinc-300 leading-relaxed font-light text-sm mb-6 max-w-xl mx-auto">{content}</div>
            <button 
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 shadow-lg transition-all cursor-pointer"
            >
              {lang === 'ar' ? 'تواصل معي الآن' : lang === 'ur' ? 'مجھ سے رابطہ کریں' : 'Get In Touch'}
            </button>
          </div>
        );
      case 'highlightBanner':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-[var(--primary)]/20 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent)]/5 p-8 sm:p-10 md:p-12 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] rounded-full blur-[120px] opacity-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--accent)] rounded-full blur-[100px] opacity-10 pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
                <div className="space-y-3 text-center md:text-start">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{title}</h3>
                  {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">{subtitle}</p>}
                  <div className="text-zinc-300 leading-relaxed font-light text-sm max-w-2xl">{content}</div>
                </div>
                {sect.icon && (
                  <div className="p-4 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] shrink-0 animate-pulse">
                    {getIcon(sect.icon, "w-8 h-8")}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const sectionRevealVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.96, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
      {/* Premium Preloader reveal */}
      <AnimatePresence mode="wait">
        {showPreloader && (
          <Preloader key="preloader" finishLoading={() => setPreloaderActive(false)} />
        )}
      </AnimatePresence>

      {/* Desktop Custom Cursor */}
      {!showPreloader && <CustomCursor />}

      {/* Hidden Login Modal */}
      <LoginModal />

      <RootLayout>
        {/* React Helmet for Dynamic Premium SEO */}
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDesc} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDesc} />
          
          {/* Schema.org Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(getJsonLdSchema(lang))}
          </script>
        </Helmet>

        {/* Dynamic Section Rendering */}
        {(data?.websiteStructure?.sections || DEFAULT_PORTFOLIO_DATA.websiteStructure.sections)
          .filter((sect) => sect.visible !== false)
          .map((sect) => {
            switch (sect.id) {
              case 'hero':
                return <Hero key="hero" />;
              case 'about':
                return (
                  <motion.div
                    key="about"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={sectionRevealVariants}
                  >
                    <About />
                  </motion.div>
                );
              case 'why-me':
                return (
                  <motion.div
                    key="why-me"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={sectionRevealVariants}
                  >
                    <WhyOkash />
                  </motion.div>
                );
              case 'projects':
                return (
                  <motion.section 
                    key="projects" 
                    id="projects" 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={sectionRevealVariants}
                    className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/[0.04]"
                  >
                    <div className="mb-16">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3 flex items-center gap-1.5 animate-pulse">
                        <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                        {data?.translations?.[lang]?.workTitle || t.workTitle}
                      </span>
                      <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        {data?.translations?.[lang]?.workTitle || t.workTitle}
                      </h2>
                      {(data?.translations?.[lang]?.workSubtitle || t.workSubtitle) && (
                        <p className="text-lg opacity-65 max-w-3xl leading-relaxed">
                          {data?.translations?.[lang]?.workSubtitle || t.workSubtitle}
                        </p>
                      )}
                    </div>

                    {/* Featured Products Track */}
                    {featuredProjects.length > 0 && (
                      <div className="mb-16">
                        <h3 className="text-xs uppercase tracking-widest font-bold opacity-45 mb-6">
                          {data?.translations?.[lang]?.featuredBadge || t.featuredBadge}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ perspective: 1200 }}>
                          {featuredProjects.map((project, idx) => (
                            <motion.div 
                              key={project.id} 
                              initial={{ opacity: 0, y: 40, scale: 0.96, rotateX: 12, filter: 'blur(6px)' }}
                              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
                              viewport={{ once: true, margin: "-60px" }}
                              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                              className="relative group cursor-pointer"
                            >
                              <div className="absolute -inset-1 rounded-[1.6rem] bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 opacity-75 group-hover:opacity-100 blur-sm transition duration-500" />
                              <ProjectCard 
                                project={project} 
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsModalOpen(true);
                                }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* General Products Track */}
                    {generalProjects.length > 0 && (
                      <div>
                        <h3 className="text-xs uppercase tracking-widest font-bold opacity-45 mb-6">
                          {data?.translations?.[lang]?.additionalSolutions || t.additionalSolutions || (lang === 'ar' ? 'أدوات وحلول برمجية إضافية' : 'Additional Solutions')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: 1200 }}>
                          {generalProjects.map((project, idx) => (
                            <motion.div 
                              key={project.id}
                              initial={{ opacity: 0, y: 40, scale: 0.96, rotateX: 12, filter: 'blur(6px)' }}
                              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
                              viewport={{ once: true, margin: "-60px" }}
                              transition={{ duration: 0.8, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <ProjectCard 
                                project={project} 
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsModalOpen(true);
                                }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.section>
                );
              case 'skills':
                return (
                  <motion.div
                    key="skills"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={sectionRevealVariants}
                  >
                    <Skills />
                  </motion.div>
                );
              case 'experience':
                return (
                  <motion.div
                    key="experience"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={sectionRevealVariants}
                  >
                    <Experience />
                  </motion.div>
                );
              case 'certifications':
                return (
                  <motion.div
                    key="certifications"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={sectionRevealVariants}
                  >
                    <Certifications />
                  </motion.div>
                );
              case 'contact':
                return (
                  <motion.div
                    key="contact"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={sectionRevealVariants}
                  >
                    <Contact />
                  </motion.div>
                );
              default:
                if (sect.id.startsWith('custom-')) {
                  const customSect = data?.customSections?.find(cs => cs.id === sect.id);
                  if (customSect && customSect.visible !== false) {
                    return (
                      <motion.section 
                        key={sect.id} 
                        id={sect.id} 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        variants={sectionRevealVariants}
                        className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/[0.04]"
                      >
                        {renderCustomSection(customSect)}
                      </motion.section>
                    );
                  }
                }
                return null;
            }
          })}

        {/* Unified Project Details Modal */}
        <ProjectDetailsModal 
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
        />
      </RootLayout>
    </>
  );
}
