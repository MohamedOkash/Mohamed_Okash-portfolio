/**
 * Validates a multilingual text object (requiring en, ar, and ur keys)
 */
export const validateMultiLang = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  return typeof obj.ar === 'string' && typeof obj.en === 'string' && typeof obj.ur === 'string';
};

/**
 * Validates the entire portfolio data structure before saving to Firestore
 */
export const validatePortfolioData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid portfolio root data object");
  }

  // Hero validation
  if (!data.hero || !validateMultiLang(data.hero.title1) || !validateMultiLang(data.hero.title2) || !validateMultiLang(data.hero.tagline)) {
    throw new Error("Hero section contains invalid or missing multilingual fields");
  }

  if (!data.hero.statistics || typeof data.hero.statistics.experienceYears !== 'number' || typeof data.hero.statistics.projectsBuilt !== 'number') {
    throw new Error("Hero statistics are invalid or missing");
  }

  // About validation
  if (!data.about || !validateMultiLang(data.about.title) || !validateMultiLang(data.about.subtitle) || !validateMultiLang(data.about.text)) {
    throw new Error("About section contains invalid or missing multilingual fields");
  }

  // Skills validation
  if (!Array.isArray(data.skills)) {
    throw new Error("Skills section must be an array");
  }
  for (const group of data.skills) {
    if (!group.id || !validateMultiLang(group.category) || !Array.isArray(group.items)) {
      throw new Error("Skill group contains invalid fields or structure");
    }
    for (const item of group.items) {
      if (!validateMultiLang(item)) {
        throw new Error("Skill item must contain translation keys (ar, en, ur)");
      }
    }
  }

  // Projects validation
  if (!Array.isArray(data.projects)) {
    throw new Error("Projects section must be an array");
  }
  for (const proj of data.projects) {
    if (!proj.id || !proj.title || !validateMultiLang(proj.category) || !validateMultiLang(proj.description) || !validateMultiLang(proj.challenges)) {
      throw new Error(`Project [${proj.title || 'Unknown'}] is missing required multilingual details`);
    }
    if (!Array.isArray(proj.features) || !Array.isArray(proj.tech)) {
      throw new Error(`Project [${proj.title}] features or tech stack must be arrays`);
    }
  }

  // Experience validation
  if (!Array.isArray(data.experience)) {
    throw new Error("Experience section must be an array");
  }
  for (const exp of data.experience) {
    if (!exp.id || !validateMultiLang(exp.role) || !validateMultiLang(exp.company) || !validateMultiLang(exp.period) || !validateMultiLang(exp.description)) {
      throw new Error(`Experience entry [${exp.id}] has malformed multilingual fields`);
    }
  }

  // Certifications validation
  if (!Array.isArray(data.certifications)) {
    throw new Error("Certifications section must be an array");
  }
  for (const cert of data.certifications) {
    const hasOldFields = typeof cert.en === 'string' && typeof cert.ar === 'string' && typeof cert.ur === 'string';
    const hasNewFields = cert.name && validateMultiLang(cert.name);
    if (!cert.id || (!hasOldFields && !hasNewFields)) {
      throw new Error(`Certification [${cert.id || 'Unknown'}] is missing required name fields`);
    }
  }

  // Contact validation
  if (!data.contact || typeof data.contact.email !== 'string' || typeof data.contact.github !== 'string' || typeof data.contact.whatsapp !== 'string') {
    throw new Error("Contact information contains invalid fields or missing details");
  }

  return true;
};
