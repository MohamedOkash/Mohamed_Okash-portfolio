import React from 'react';
import { AdminInput, AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const BrandIdentitySettings = React.memo(({ brandIdentityData = {}, t, updateField, lang }) => {
  const brandName = brandIdentityData.brandName || { ar: '', en: '', ur: '' };
  const shortName = brandIdentityData.shortName || { ar: '', en: '', ur: '' };
  const subtitle = brandIdentityData.subtitle || { ar: '', en: '', ur: '' };
  const heroName = brandIdentityData.heroName || { ar: '', en: '', ur: '' };
  const logoText = brandIdentityData.logoText || { ar: '', en: '', ur: '' };
  const footerText = brandIdentityData.footerText || { ar: '', en: '', ur: '' };
  const preloaderText = brandIdentityData.preloaderText || { ar: '', en: '', ur: '' };
  const browserTitle = brandIdentityData.browserTitle || { ar: '', en: '', ur: '' };
  const seoTitle = brandIdentityData.seoTitle || { ar: '', en: '', ur: '' };
  const seoDescription = brandIdentityData.seoDescription || { ar: '', en: '', ur: '' };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms?.sidebarBrandIdentity || 'Brand Identity'}</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1">{t.cms?.brandIdentityDesc || 'Manage your global brand names, logos, subtitles, preloader, and SEO properties.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] mb-5">
        <div className="md:col-span-3">
          <span className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            {t.cms?.brandNameArabic || 'Arabic Brand Name'} / {t.cms?.brandNameEnglish || 'English Brand Name'} / {t.cms?.brandNameUrdu || 'Urdu Brand Name'}
          </span>
        </div>
        <AdminInput 
          label={t.cms?.brandNameArabic || 'Arabic Brand Name'} 
          value={brandName.ar || ''} 
          dir="rtl"
          onChange={(e) => {
            const val = e.target.value;
            updateField((draft) => {
              if (!draft.brandIdentity) draft.brandIdentity = {};
              if (!draft.brandIdentity.brandName) draft.brandIdentity.brandName = {};
              draft.brandIdentity.brandName.ar = val;
            });
          }} 
        />
        <AdminInput 
          label={t.cms?.brandNameEnglish || 'English Brand Name'} 
          value={brandName.en || ''} 
          dir="ltr"
          onChange={(e) => {
            const val = e.target.value;
            updateField((draft) => {
              if (!draft.brandIdentity) draft.brandIdentity = {};
              if (!draft.brandIdentity.brandName) draft.brandIdentity.brandName = {};
              draft.brandIdentity.brandName.en = val;
            });
          }} 
        />
        <AdminInput 
          label={t.cms?.brandNameUrdu || 'Urdu Brand Name'} 
          value={brandName.ur || ''} 
          dir="rtl"
          onChange={(e) => {
            const val = e.target.value;
            updateField((draft) => {
              if (!draft.brandIdentity) draft.brandIdentity = {};
              if (!draft.brandIdentity.brandName) draft.brandIdentity.brandName = {};
              draft.brandIdentity.brandName.ur = val;
            });
          }} 
        />
      </div>

      <AdminMultiLangInput 
        label={t.cms?.brandNameShort || 'Short Brand Name'} 
        valueObj={shortName} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            if (!draft.brandIdentity) draft.brandIdentity = {};
            if (!draft.brandIdentity.shortName) draft.brandIdentity.shortName = {};
            draft.brandIdentity.shortName[key] = val;
          });
        }} 
      />

      <AdminMultiLangInput 
        label={t.cms?.brandNameSubtitle || 'Brand Subtitle'} 
        valueObj={subtitle} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            if (!draft.brandIdentity) draft.brandIdentity = {};
            if (!draft.brandIdentity.subtitle) draft.brandIdentity.subtitle = {};
            draft.brandIdentity.subtitle[key] = val;
          });
        }} 
      />

      <AdminMultiLangInput 
        label={t.cms?.heroDisplayName || 'Hero Display Name'} 
        valueObj={heroName} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            if (!draft.brandIdentity) draft.brandIdentity = {};
            if (!draft.brandIdentity.heroName) draft.brandIdentity.heroName = {};
            draft.brandIdentity.heroName[key] = val;
          });
        }} 
      />

      <AdminMultiLangInput 
        label={t.cms?.navbarLogoText || 'Navbar Logo Text'} 
        valueObj={logoText} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            if (!draft.brandIdentity) draft.brandIdentity = {};
            if (!draft.brandIdentity.logoText) draft.brandIdentity.logoText = {};
            draft.brandIdentity.logoText[key] = val;
          });
        }} 
      />

      <AdminMultiLangInput 
        label={t.cms?.footerBrandText || 'Footer Brand Text'} 
        valueObj={footerText} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            if (!draft.brandIdentity) draft.brandIdentity = {};
            if (!draft.brandIdentity.footerText) draft.brandIdentity.footerText = {};
            draft.brandIdentity.footerText[key] = val;
          });
        }} 
      />

      <AdminMultiLangInput 
        label={t.cms?.preloaderBrandText || 'Preloader Brand Text'} 
        valueObj={preloaderText} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            if (!draft.brandIdentity) draft.brandIdentity = {};
            if (!draft.brandIdentity.preloaderText) draft.brandIdentity.preloaderText = {};
            draft.brandIdentity.preloaderText[key] = val;
          });
        }} 
      />

      <AdminMultiLangInput 
        label={t.cms?.browserTitle || 'Browser Title'} 
        valueObj={browserTitle} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            if (!draft.brandIdentity) draft.brandIdentity = {};
            if (!draft.brandIdentity.browserTitle) draft.brandIdentity.browserTitle = {};
            draft.brandIdentity.browserTitle[key] = val;
          });
        }} 
      />

      <AdminMultiLangInput 
        label={t.cms?.seoTitle || 'SEO Title'} 
        valueObj={seoTitle} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            if (!draft.brandIdentity) draft.brandIdentity = {};
            if (!draft.brandIdentity.seoTitle) draft.brandIdentity.seoTitle = {};
            draft.brandIdentity.seoTitle[key] = val;
          });
        }} 
      />

      <AdminMultiLangInput 
        label={t.cms?.seoDescription || 'SEO Description'} 
        textarea
        valueObj={seoDescription} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            if (!draft.brandIdentity) draft.brandIdentity = {};
            if (!draft.brandIdentity.seoDescription) draft.brandIdentity.seoDescription = {};
            draft.brandIdentity.seoDescription[key] = val;
          });
        }} 
      />
    </div>
  );
});
