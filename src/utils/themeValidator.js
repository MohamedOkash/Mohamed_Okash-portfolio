/**
 * Theme Contrast Validator & Health Score System
 * WCAG AA compliance checking for theme profiles
 */

export const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  if (clean.length === 3) return { r: parseInt(clean[0] + clean[0], 16), g: parseInt(clean[1] + clean[1], 16), b: parseInt(clean[2] + clean[2], 16) };
  if (clean.length === 6) return { r: parseInt(clean.slice(0, 2), 16), g: parseInt(clean.slice(2, 4), 16), b: parseInt(clean.slice(4, 6), 16) };
  return { r: 255, g: 255, b: 255 };
};

export const rgbToHex = ({ r, g, b }) =>
  `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;

export const relativeLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const contrastRatio = (hex1, hex2) => {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AA_LARGE = 3.0;

// Page background colors for each theme (from theme-vars.css --bg-primary)
const PAGE_BG = {
  dark: '#050505',
  ocean: '#020b16',
  aurora: '#03100c',
  platinum: '#f4f6f8',
  midnight: '#090414'
};

/**
 * Blend an RGBA color string with a solid background hex
 */
const blendRgbaWithBg = (rgbaStr, bgHex) => {
  const m = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgbaStr;
  const [_, r, g, b] = m;
  const alpha = rgbaStr.includes('rgba') ? parseFloat(rgbaStr.match(/[\d.]+\)?$/)?.[0] || '1') : 1;
  const bg = hexToRgb(bgHex);
  const mixed = {
    r: parseInt(r) * alpha + bg.r * (1 - alpha),
    g: parseInt(g) * alpha + bg.g * (1 - alpha),
    b: parseInt(b) * alpha + bg.b * (1 - alpha)
  };
  return rgbToHex(mixed);
};

/**
 * Resolve a color value to a solid hex, handling rgba by blending with background
 */
const resolveColor = (color, bgFallback) => {
  if (!color || color === 'transparent') return resolveColor(bgFallback, '#ffffff');
  if (color.startsWith('#')) return color;
  if (color.startsWith('rgb')) return blendRgbaWithBg(color, bgFallback);
  return color;
};

export const validateContrasts = (profile, defaultProfile, themeName = 'dark') => {
  const pageBg = PAGE_BG[themeName] || '#050505';
  const d = defaultProfile || {};

  const bgHex = resolveColor(profile?.cardBackground || d.cardBackground, pageBg);
  const fullBg = pageBg;
  const inputBgRaw = profile?.inputBackground || d.inputBackground || 'rgba(0,0,0,0.5)';
  const inputBgHex = resolveColor(inputBgRaw, pageBg);
  const fontColor = profile?.fontColor || d.fontColor || '#fafafa';
  const headingColor = profile?.headingColor || d.headingColor || '#fafafa';
  const accentText = profile?.accentText || d.accentText || '#000000';
  const accentColor = profile?.accentColor || d.accentColor || '#ffffff';
  const cardTitleColor = profile?.cardTitleColor || fontColor;
  const cardDescColor = profile?.cardDescriptionColor || '#a1a1aa';
  const buttonTextColor = profile?.buttonTextColor || accentText;

  const pairs = [
    { key: 'bgBodyText', label: 'Background ↔ Body Text', fg: fontColor, bg: fullBg, threshold: WCAG_AA_NORMAL, section: 'Contrast' },
    { key: 'bgHeadingText', label: 'Background ↔ Heading Text', fg: headingColor, bg: fullBg, threshold: WCAG_AA_NORMAL, section: 'Contrast' },
    { key: 'cardBodyText', label: 'Card Background ↔ Body Text', fg: fontColor, bg: bgHex, threshold: WCAG_AA_NORMAL, section: 'Contrast' },
    { key: 'cardHeadingText', label: 'Card Background ↔ Heading Text', fg: headingColor, bg: bgHex, threshold: WCAG_AA_NORMAL, section: 'Contrast' },
    { key: 'accentAccentText', label: 'Accent ↔ Accent Text', fg: accentText, bg: accentColor, threshold: WCAG_AA_NORMAL, section: 'Accent Colors' },
    { key: 'inputInputText', label: 'Input Background ↔ Input Text', fg: fontColor, bg: inputBgHex, threshold: WCAG_AA_NORMAL, section: 'Inputs' },
    { key: 'cardTitleText', label: 'Card Background ↔ Card Title', fg: cardTitleColor, bg: bgHex, threshold: WCAG_AA_NORMAL, section: 'Typography' },
    { key: 'cardDescText', label: 'Card Background ↔ Card Description', fg: cardDescColor, bg: bgHex, threshold: WCAG_AA_LARGE, section: 'Typography' },
    { key: 'buttonAccent', label: 'Accent ↔ Button Text', fg: buttonTextColor, bg: accentColor, threshold: WCAG_AA_NORMAL, section: 'Borders' },
  ];

  return pairs.map(pair => {
    const ratio = contrastRatio(pair.fg, pair.bg);
    return {
      ...pair,
      ratio: Math.round(ratio * 100) / 100,
      pass: ratio >= pair.threshold,
      score: Math.min(100, Math.round((ratio / pair.threshold) * 100))
    };
  });
};

export const calculateHealthScore = (validations) => {
  if (!validations || validations.length === 0) return 0;
  const total = validations.reduce((sum, v) => sum + v.score, 0);
  return Math.round(total / validations.length);
};

export const getHealthScoreColor = (score) => {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#eab308';
  return '#ef4444';
};

export const getHealthScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 50) return 'Needs Review';
  return 'Unreadable';
};

export const getSectionScores = (validations) => {
  const sections = {};
  validations.forEach(v => {
    if (!sections[v.section]) sections[v.section] = [];
    sections[v.section].push(v);
  });
  const result = {};
  Object.entries(sections).forEach(([key, checks]) => {
    const avg = checks.reduce((s, c) => s + c.score, 0) / checks.length;
    result[key] = { score: Math.round(avg), checks };
  });
  return result;
};

export const autoFixTheme = (profile, defaultProfile, themeName = 'dark') => {
  const pageBg = PAGE_BG[themeName] || '#050505';
  const d = defaultProfile || {};
  const fixed = { ...profile };
  const bgHex = resolveColor(fixed?.cardBackground || d.cardBackground, pageBg);
  const fullBg = pageBg;
  const accentColor = fixed?.accentColor || d.accentColor || '#ffffff';

  const ensureContrast = (color, bg, threshold, preferLighten) => {
    let hex = color;
    let attempts = 0;
    // Determine direction: if preferLighten is true, lighten; otherwise darken
    const currentLum = relativeLuminance(hex);
    const bgLum = relativeLuminance(bg);
    const shouldLighten = preferLighten !== undefined ? preferLighten : currentLum < bgLum;
    while (attempts < 100) {
      const ratio = contrastRatio(hex, bg);
      if (ratio >= threshold) return hex;
      const { r, g, b } = hexToRgb(hex);
      const step = 3;
      let nr, ng, nb;
      if (shouldLighten) {
        nr = Math.min(255, r + step);
        ng = Math.min(255, g + step);
        nb = Math.min(255, b + step);
      } else {
        nr = Math.max(0, r - step);
        ng = Math.max(0, g - step);
        nb = Math.max(0, b - step);
      }
      hex = rgbToHex({ r: nr, g: ng, b: nb });
      attempts++;
    }
    return hex;
  };

  fixed.fontColor = ensureContrast(fixed.fontColor || '#fafafa', fullBg, WCAG_AA_NORMAL);
  fixed.headingColor = ensureContrast(fixed.headingColor || '#fafafa', fullBg, WCAG_AA_NORMAL);

  const isLightTheme = themeName === 'platinum';
  fixed.cardTitleColor = ensureContrast(fixed.cardTitleColor || fixed.fontColor, bgHex, WCAG_AA_NORMAL);
  fixed.cardDescriptionColor = ensureContrast(fixed.cardDescriptionColor || '#a1a1aa', bgHex, WCAG_AA_LARGE);

  fixed.accentText = ensureContrast(fixed.accentText || '#000000', accentColor, WCAG_AA_NORMAL, isLightTheme);
  fixed.buttonTextColor = fixed.buttonTextColor || fixed.accentText;
  fixed.buttonTextColor = ensureContrast(fixed.buttonTextColor, accentColor, WCAG_AA_NORMAL, isLightTheme);

  return fixed;
};
