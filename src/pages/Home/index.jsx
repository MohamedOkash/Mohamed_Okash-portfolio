import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useLanguageStore } from '../../store/languageStore';
import { useAuthStore } from '../../store/authStore';
import { getJsonLdSchema, defaultSeoData } from '../../utils/seo';
import { RootLayout } from '../../app/layouts/RootLayout';
import { Hero } from '../../components/sections/Hero';
import { About } from '../../components/sections/About';
import { Skills } from '../../components/sections/Skills';
import { Experience } from '../../components/sections/Experience';
import { Certifications } from '../../components/sections/Certifications';
import { Contact } from '../../components/sections/Contact';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { ProjectDetailsModal } from '../../components/modals/ProjectDetailsModal';
import { translations } from '../../data/translations';
import { Loader2, Sparkles } from 'lucide-react';

export default function Home() {
  const { data, loading, loadPortfolio } = usePortfolioStore();
  const { lang } = useLanguageStore();
  const { user } = useAuthStore();
  const t = translations[lang] || translations.ar;

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load portfolio data on mount, passing the authenticated user for the bootstrap check
  useEffect(() => {
    loadPortfolio(user);
  }, [loadPortfolio, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-white mb-4" />
        <p className="text-sm tracking-widest uppercase font-medium opacity-65 animate-pulse">
          Loading Personal Brand Platform...
        </p>
      </div>
    );
  }

  // Filter projects by featured vs general
  const featuredIds = data?.settings?.featuredProjects || [];
  const projects = data?.projects || [];

  const featuredProjects = projects.filter(p => featuredIds.includes(p.id));
  const generalProjects = projects.filter(p => !featuredIds.includes(p.id));

  const pageTitle = `${data?.translations?.[lang]?.name || t.name} | ${data?.translations?.[lang]?.available || t.available}`;
  const pageDesc = data?.translations?.[lang]?.tagline || t.tagline;

  return (
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

      {/* Hero Intro */}
      <Hero />

      {/* About Biography & Comparative Bridge */}
      <About />

      {/* Projects Showcase - Presented as Premium Products */}
      <section id="projects" className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/[0.04]">
        <div className="mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {t.workTitle}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {lang === 'ar' ? 'الأنظمة والتطبيقات المطورة.' : lang === 'ur' ? 'میرے پروجیکٹس۔' : 'Systems & Engineered Apps.'}
          </h2>
        </div>

        {/* Featured Products Track */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xs uppercase tracking-widest font-bold opacity-45 mb-6">
              {t.featuredBadge}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div key={project.id} className="relative group cursor-pointer">
                  {/* Subtle pulsing highlight border for featured items */}
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
              {lang === 'ar' ? 'أدوات وحلول برمجية إضافية' : 'Additional Solutions'}
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

      {/* Capabilities / Skills Toolbox */}
      <Skills />

      {/* Milestones / Experience timeline */}
      <Experience />

      {/* Accreditations / Certifications */}
      <Certifications />

      {/* Connect details */}
      <Contact />

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
  );
}
