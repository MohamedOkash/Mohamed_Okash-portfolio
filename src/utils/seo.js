/**
 * Generates Structured JSON-LD Data for search engine discovery
 */
export const getJsonLdSchema = (lang, data) => {
  const isAr = lang === 'ar';
  const isUr = lang === 'ur';
  
  const brandName = data?.brandIdentity?.brandName?.[lang] || (isAr ? "محمد عكاش" : isUr ? "محمد عکاش" : "Mohamed Okash");
  const brandSubtitle = data?.brandIdentity?.subtitle?.[lang] || (isAr ? "مهندس سلامة وبنية تحتية IT" : isUr ? "ایچ ایس ای اور آئی تي انفراسٹرکچر انجینئر" : "HSE & IT Infrastructure Engineer");
  const brandDesc = data?.brandIdentity?.seoDescription?.[lang] || (isAr 
    ? "أدمج بين خبرة 7 سنوات في البنية التحتية لتكنولوجيا المعلومات وهندسة الأمن والسلامة المهنية لبناء تطبيقات عملية."
    : "Bridging 7 years of IT infrastructure experience with modern Health & Safety engineering to build practical applications.");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": brandName,
    "jobTitle": brandSubtitle,
    "url": window.location.origin,
    "sameAs": [
      "https://github.com/MohamedOkash",
      "mailto:mohamed.okash1998@gmail.com"
    ],
    "description": brandDesc,
    "knowsAbout": [
      "Health & Safety Engineering",
      "IT Infrastructure",
      "Wireless & Network Support",
      "Fiber Optics & Data Cabling",
      "CCTV & Security Systems",
      "Software Development",
      "React",
      "TailwindCSS"
    ]
  };
};

export const defaultSeoData = {
  title: "Mohamed Okash | HSE & IT Engineering",
  description: "Bridging 7 years of IT infrastructure experience with modern Health & Safety engineering to build practical applications.",
  ogImage: "/og-image.svg"
};
