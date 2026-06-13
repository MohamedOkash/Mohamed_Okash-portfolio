import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
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
                return <About key="about" />;
              case 'why-me':
                return <WhyOkash key="why-me" />;
              case 'projects':
                return (
                  <section key="projects" id="projects" className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/[0.04]">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {featuredProjects.map((project) => (
                            <div key={project.id} className="relative group cursor-pointer">
                              <div className="absolute -inset-1 rounded-[1.6rem] bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 opacity-75 group-hover:opacity-100 blur-sm transition duration-500" />
                              <ProjectCard 
                                project={project} 
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsModalOpen(true);
                                }}
                              />
                            </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {generalProjects.map((project) => (
                            <ProjectCard 
                              key={project.id}
                              project={project} 
                              onClick={() => {
                                setSelectedProject(project);
                                setIsModalOpen(true);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                );
              case 'skills':
                return <Skills key="skills" />;
              case 'experience':
                return <Experience key="experience" />;
              case 'certifications':
                return <Certifications key="certifications" />;
              case 'contact':
                return <Contact key="contact" />;
              default:
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
