import { translations } from '../data/translations';

export const checkTranslations = (options = { silent: false }) => {
  const { silent } = options;
  const langs = ['en', 'ar', 'ur'];
  const languages = ['en', 'ar', 'ur'];
  const enKeys = Object.keys(translations.en).filter(k => k !== 'dir');
  const cmsKeys = Object.keys(translations.en.cms);

  const report = {
    root: { en: 0, ar: 0, ur: 0 },
    cms: { en: 0, ar: 0, ur: 0 },
    missingRoot: {},
    missingCms: {},
    totalKeys: { root: 0, cms: 0 },
    coverage: {}
  };

  for (const rootKey of enKeys) {
    if (rootKey === 'cms') continue;
    report.totalKeys.root++;
    for (const lang of langs) {
      if (translations[lang][rootKey] !== undefined) report.root[lang]++;
      else {
        if (!report.missingRoot[rootKey]) report.missingRoot[rootKey] = [];
        report.missingRoot[rootKey].push(lang);
      }
    }
  }

  for (const cmsKey of cmsKeys) {
    report.totalKeys.cms++;
    for (const lang of langs) {
      if (translations[lang].cms[cmsKey] !== undefined) report.cms[lang]++;
      else {
        if (!report.missingCms[cmsKey]) report.missingCms[cmsKey] = [];
        report.missingCms[cmsKey].push(lang);
      }
    }
  }

  for (const lang of langs) {
    const rootPct = ((report.root[lang] / report.totalKeys.root) * 100).toFixed(1);
    const cmsPct = ((report.cms[lang] / report.totalKeys.cms) * 100).toFixed(1);
    report.coverage[lang] = { root: `${rootPct}%`, cms: `${cmsPct}%` };
  }

  if (!silent) {
    console.log('=== Translation Health Checker ===');
    console.log(`Root keys: ${report.totalKeys.root} total`);
    console.log(`CMS keys: ${report.totalKeys.cms} total`);
    console.log('');
    for (const lang of langs) {
      console.log(`[${lang.toUpperCase()}]`);
      console.log(`  Root: ${report.root[lang]}/${report.totalKeys.root} (${report.coverage[lang].root})`);
      console.log(`  CMS:  ${report.cms[lang]}/${report.totalKeys.cms} (${report.coverage[lang].cms})`);
    }
    console.log('');
    if (Object.keys(report.missingRoot).length > 0) {
      console.log('Missing root keys:', JSON.stringify(report.missingRoot, null, 2));
    } else {
      console.log('All root keys: 100% coverage ✓');
    }
    if (Object.keys(report.missingCms).length > 0) {
      console.log('Missing CMS keys:', JSON.stringify(report.missingCms, null, 2));
    } else {
      console.log('All CMS keys: 100% coverage ✓');
    }
    console.log('===============================');
  }

  return report;
};

if (typeof window !== 'undefined') {
  window.checkTranslations = checkTranslations;
}
