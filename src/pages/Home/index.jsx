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
import { Achievements } from '../../components/sections/Achievements';
import { Contact } from '../../components/sections/Contact';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { ProjectDetailsModal } from '../../components/modals/ProjectDetailsModal';
import { LoginModal } from '../../components/modals/LoginModal';
import { Preloader } from '../../components/ui/Preloader';
import { CustomCursor } from '../../components/ui/CustomCursor';
import { translations } from '../../data/translations';
import { Sparkles, Quote, HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { SpotlightCard } from '../../components/ui/SpotlightCard';

// Local Counter helper for custom stats block
const StatCounterLocal = ({ target, duration = 1200 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end) || start === end) {
      setCount(target);
      return;
    }
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
};

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

  // Connect SEO page parameters to brandIdentity
  const browserTitleVal = data?.brandIdentity?.browserTitle?.[lang] || (lang === 'ar' ? 'محمد عكاش' : lang === 'ur' ? 'محمد عکاش' : 'Mohamed Okash');
  const seoTitleVal = data?.brandIdentity?.seoTitle?.[lang] || browserTitleVal;
  const seoDescVal = data?.brandIdentity?.seoDescription?.[lang] || data?.translations?.[lang]?.tagline || t.tagline;


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
      const IconComponent = LucideIcons[formattedName] || LucideIcons[iconName] || HelpCircle;
      return <IconComponent className={className} />;
    };

    switch (sect.layoutType) {
      case 'heroBanner':
        return (
          <div className="relative rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 p-10 md:p-16 overflow-hidden shadow-2xl text-center max-w-5xl mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] rounded-full blur-[100px] opacity-10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              {sect.icon && (
                <div className="inline-flex p-4 rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)] mb-2 animate-pulse">
                  {getIcon(sect.icon, "w-8 h-8")}
                </div>
              )}
              <h3 className="text-3xl sm:text-5xl font-black text-white leading-tight">{title}</h3>
              {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-extrabold">{subtitle}</p>}
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-light text-base md:text-lg max-w-3xl mx-auto">{content}</div>
              <button 
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-xl font-bold text-xs bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 shadow-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                {lang === 'ar' ? 'تواصل معي' : lang === 'ur' ? 'مجھ سے رابطہ کریں' : 'Get in Touch'}
              </button>
            </div>
          </div>
        );

      case 'glassCard':
      case 'cardsGrid':
      case 'glassCardGrid': {
        const items = content.split('\n').map(line => line.trim()).filter(line => line !== '');
        if (items.length <= 1) {
          return (
            <div className="max-w-4xl mx-auto">
              <SpotlightCard className="p-8 md:p-12 hover:border-[var(--primary)]/20 transition-all duration-500 relative overflow-hidden bg-[#0d0d11]/85 border-white/[0.08] rounded-3xl backdrop-blur-xl">
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
        } else {
          return (
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">{title}</h3>
                {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">{subtitle}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, idx) => (
                  <SpotlightCard key={idx} className="p-6 md:p-8 bg-[#0d0d11]/85 border-white/[0.08] hover:border-[var(--primary)]/20 transition-all duration-300 rounded-2xl backdrop-blur-xl flex gap-4">
                    {sect.icon && <div className="text-[var(--primary)] shrink-0 mt-1">{getIcon(sect.icon, "w-5 h-5")}</div>}
                    <div className="space-y-2">
                      <div className="text-zinc-300 leading-relaxed font-light text-sm whitespace-pre-wrap">{item}</div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          );
        }
      }

      case 'timeline': {
        const items = content.split('\n').map(line => line.trim()).filter(line => line !== '');
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
                  <SpotlightCard className="p-5 hover:border-[var(--primary)]/20 transition-all duration-300 bg-[#0d0d11]/85 border-white/[0.08] rounded-xl backdrop-blur-xl">
                    <div className="text-zinc-300 leading-relaxed font-light text-sm">{item}</div>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'features':
      case 'featureGrid': {
        const items = content.split('\n').map(line => line.trim()).filter(line => line !== '');
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">{title}</h3>
              {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">{subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, idx) => (
                <SpotlightCard key={idx} className="p-6 bg-[#0d0d11]/85 border-white/[0.08] hover:border-[var(--primary)]/20 transition-all duration-300 flex flex-col justify-between h-full rounded-2xl backdrop-blur-xl">
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

      case 'ctaBlock':
      case 'contactBlock':
        return (
          <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl border border-white/[0.08] bg-[#0d0d11]/80 backdrop-blur-xl shadow-2xl">
            {sect.icon && (
              <div className="inline-flex p-3.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-4 animate-bounce">
                {getIcon(sect.icon, "w-6 h-6")}
              </div>
            )}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{title}</h3>
            {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold mb-4">{subtitle}</p>}
            <div className="text-zinc-300 leading-relaxed font-light text-sm mb-6 max-w-xl mx-auto whitespace-pre-wrap">{content}</div>
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
            <div className="relative rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent)]/5 p-8 sm:p-10 md:p-12 overflow-hidden shadow-2xl">
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

      case 'statisticsBlock': {
        const items = content.split('\n').map(line => line.trim()).filter(line => line !== '');
        return (
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">{title}</h3>
              {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">{subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {items.map((item, idx) => {
                const parts = item.split('|');
                const val = (parts[0] || '').trim();
                const label = (parts[1] || '').trim();
                return (
                  <SpotlightCard key={idx} className="p-8 text-center bg-[#0d0d11]/85 border-white/[0.08] hover:border-[var(--primary)]/20 transition-all rounded-3xl backdrop-blur-xl">
                    <span className="text-4xl sm:text-5xl font-mono font-black text-[var(--primary)] block mb-2">
                      <StatCounterLocal target={val} />
                    </span>
                    <span className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1 block">
                      {label}
                    </span>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>
        );
      }

      case 'textBlock':
      case 'richContent':
      case 'imageText': {
        const lines = content.split('\n');
        const firstLine = (lines[0] || '').trim();
        const textLines = lines.slice(1).join('\n');
        const allowImage = sect.layoutType === 'imageText';
        const isUrl = allowImage && (firstLine.startsWith('http') || firstLine.startsWith('/') || firstLine.startsWith('./'));
        const imageUrl = isUrl ? firstLine : '';
        const bodyContent = isUrl ? textLines : content;

        return (
          <div className={`max-w-5xl mx-auto grid grid-cols-1 ${allowImage ? 'md:grid-cols-2' : ''} gap-8 items-center bg-[#0d0d11]/40 border border-white/[0.05] p-6 md:p-10 rounded-[2rem] backdrop-blur-md`}>
            {allowImage && (imageUrl ? (
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg relative aspect-video">
                <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="rounded-2xl aspect-video bg-gradient-to-br from-white/[0.02] to-white/[0.08] border border-white/10 flex items-center justify-center text-[var(--primary)] p-8">
                {sect.icon ? getIcon(sect.icon, "w-16 h-16 opacity-30 animate-pulse") : <Sparkles className="w-16 h-16 opacity-30" />}
              </div>
            ))}
            <div className="space-y-4">
              {sect.icon && imageUrl && <div className="text-[var(--primary)]">{getIcon(sect.icon, "w-6 h-6")}</div>}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{title}</h3>
              {subtitle && <p className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">{subtitle}</p>}
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-light text-sm">{bodyContent}</div>
            </div>
          </div>
        );
      }

      case 'quoteBlock':
        return (
          <div className="max-w-4xl mx-auto relative px-6 text-center">
            <Quote className="w-16 h-16 mx-auto text-[var(--primary)] opacity-10 mb-6" />
            <div className="relative z-10 space-y-4">
              <blockquote className="text-xl sm:text-2xl md:text-3xl font-light italic text-zinc-100 leading-relaxed">
                "{content}"
              </blockquote>
              <div className="pt-4">
                <cite className="not-italic text-sm font-bold text-[var(--primary)] uppercase tracking-widest">— {title}</cite>
                {subtitle && <span className="block text-[10px] text-zinc-500 uppercase mt-1">{subtitle}</span>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 3D Exit scroll reveal configuration variants
  const sectionRevealVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.92,
      y: 80,
      rotateX: 6,
      filter: 'blur(12px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
      {/* Premium Preloader reveal with custom brand identity preloader text */}
      <AnimatePresence mode="wait">
        {showPreloader && (
          <Preloader 
            key="preloader" 
            finishLoading={() => setPreloaderActive(false)} 
            preloaderText={data?.brandIdentity?.preloaderText?.[lang] || (lang === 'ar' ? 'محمد عكاش' : lang === 'ur' ? 'محمد عکاش' : 'Mohamed Okash')} 
          />
        )}
      </AnimatePresence>

      {/* Desktop Custom Cursor */}
      {!showPreloader && <CustomCursor />}

      {/* Hidden Login Modal */}
      <LoginModal />

      <RootLayout>
        {/* React Helmet for Dynamic Premium SEO */}
        <Helmet>
          <title>{browserTitleVal}</title>
          <meta name="description" content={seoDescVal} />
          <meta property="og:title" content={seoTitleVal} />
          <meta property="og:description" content={seoDescVal} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoTitleVal} />
          <meta name="twitter:description" content={seoDescVal} />
          
          {/* Schema.org Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(getJsonLdSchema(lang, data))}
          </script>
        </Helmet>

        {/* Dynamic Section Rendering with reusable 3D scroll entrance and exit wraps */}
        {(data?.websiteStructure?.sections || DEFAULT_PORTFOLIO_DATA.websiteStructure.sections)
          .filter((sect) => sect.visible !== false)
          .map((sect) => {
            const wrapSection = (comp) => (
              <motion.div
                key={sect.id}
                initial="hidden"
                whileInView="visible"
                exit="hidden"
                viewport={{ once: false, margin: "-120px" }}
                variants={sectionRevealVariants}
                style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
              >
                {comp}
              </motion.div>
            );

            switch (sect.id) {
              case 'hero':
                return <Hero key="hero" />;
              case 'about':
                return wrapSection(<About />);
              case 'why-me':
                return wrapSection(<WhyOkash />);
              case 'projects':
                return wrapSection(
                  <section id="projects" className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/[0.04]">
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

                    {/* Featured Projects Track */}
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

                    {/* General Projects Track */}
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
                  </section>
                );
              case 'skills':
                return wrapSection(<Skills />);
              case 'experience':
                return wrapSection(<Experience />);
              case 'certifications':
                return wrapSection(<Certifications />);
              case 'achievements':
                return wrapSection(<Achievements />);
              case 'contact':
                return wrapSection(<Contact />);
              default:
                if (sect.id.startsWith('custom-')) {
                  const customSect = data?.customSections?.find(cs => cs.id === sect.id);
                  if (customSect && customSect.visible !== false) {
                    return wrapSection(
                      <section 
                        id={sect.id} 
                        className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/[0.04]"
                      >
                        {renderCustomSection(customSect)}
                      </section>
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
