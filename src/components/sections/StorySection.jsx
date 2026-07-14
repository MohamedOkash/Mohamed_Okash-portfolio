import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { translations } from '../../data/translations';

export const StorySection = React.memo(() => {
  const { lang } = useLanguageStore();
  const { data } = usePortfolioStore();
  const t = translations[lang] || translations.ar;
  const section = data?.storySection;
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const paragraphRefs = useRef([]);

  const title = section?.title?.[lang] || section?.title?.en || t.storySectionTitle;
  const paragraphs = useMemo(() => {
    const localized = section?.content?.[lang] || section?.content?.en || [];
    return localized.filter((line) => typeof line === 'string' && line.trim() !== '');
  }, [section?.content, lang]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleChange = (event) => setReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || paragraphs.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible?.target?.dataset?.index) {
          setActiveIndex(Number(mostVisible.target.dataset.index));
        }
      },
      {
        root: null,
        rootMargin: '-35% 0px -35% 0px',
        threshold: [0.35, 0.5, 0.65, 0.8]
      }
    );

    paragraphRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [paragraphs.length, reducedMotion]);

  if (section?.enabled === false || paragraphs.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.12
      }
    }
  };

  const paragraphVariants = {
    hidden: reducedMotion ? { y: 0, scale: 1 } : { y: 40, scale: 0.98 },
    visible: {
      y: 0,
      scale: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.9,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const getParagraphOpacity = (index) => {
    if (reducedMotion) return 1;
    if (index === activeIndex) return 1;
    if (index < activeIndex) return 0.45;
    return 0.15;
  };

  const spotlightTop = paragraphs.length <= 1
    ? 50
    : 12 + (activeIndex / (paragraphs.length - 1)) * 76;

  return (
    <section
      id="story"
      data-section-id="story"
      aria-label={title}
      className="relative z-10 overflow-hidden py-28 sm:py-36 lg:py-44 px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full opacity-[0.06] will-change-transform"
        style={{
          top: `${spotlightTop}%`,
          transform: 'translate3d(-50%, -50%, 0)',
          background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 68%)',
          transition: reducedMotion ? 'none' : 'top 700ms cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      />

      <div className="relative mx-auto max-w-[700px]">
        <p className="mb-12 text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-color)]">
          {title}
        </p>

        <motion.div
          variants={containerVariants}
          initial={reducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-12 sm:space-y-14 lg:space-y-16"
        >
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={`${paragraph}-${index}`}
              ref={(node) => {
                paragraphRefs.current[index] = node;
              }}
              data-index={index}
              variants={paragraphVariants}
              className="max-w-[700px] text-[clamp(1.1rem,4vw,1.6rem)] font-extrabold leading-[1.25] tracking-[-0.02em] text-[var(--text-primary)] sm:text-[clamp(1.3rem,2.5vw,2rem)]"
              style={{
                opacity: getParagraphOpacity(index),
                transition: reducedMotion ? 'none' : 'opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                transform: 'translateZ(0)'
              }}
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
});
