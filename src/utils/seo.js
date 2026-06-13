/**
 * Generates Structured JSON-LD Data for search engine discovery
 */
export const getJsonLdSchema = (lang) => {
  const isAr = lang === 'ar';
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": isAr ? "محمد عكاش" : "Mohamed Okash",
    "jobTitle": isAr ? "مهندس أمن وسلامة وبنية تحتية للشبكات" : "HSE & IT Infrastructure Engineer",
    "url": window.location.origin,
    "sameAs": [
      "https://github.com/MohamedOkash",
      "mailto:mohamed.okash1998@gmail.com"
    ],
    "description": isAr 
      ? "أدمج بين خبرة 7 سنوات في البنية التحتية لتكنولوجيا المعلومات وهندسة الأمن والسلامة المهنية لبناء تطبيقات عملية."
      : "Bridging 7 years of IT infrastructure experience with modern Health & Safety engineering to build practical applications.",
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
  ogImage: "/og-image.jpg"
};
