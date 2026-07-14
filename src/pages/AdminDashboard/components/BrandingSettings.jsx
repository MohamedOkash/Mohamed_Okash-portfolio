import React from 'react';
import { AdminInput } from '../../../components/ui/AdminControls';

export const BrandingSettings = React.memo(({ mediaBranding = {}, t, updateField }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.mediaBrandingTitle}</h3>
      <AdminInput 
        label={t.cms.preloaderLogo} 
        value={mediaBranding.preloaderLogo || ''} 
        onChange={(e) => {
          const val = e.target.value;
          updateField((draft) => {
            if (!draft.mediaBranding) draft.mediaBranding = {};
            draft.mediaBranding.preloaderLogo = val;
          });
        }} 
      />
      <AdminInput 
        label={t.cms.faviconPath} 
        value={mediaBranding.favicon || ''} 
        onChange={(e) => {
          const val = e.target.value;
          updateField((draft) => {
            if (!draft.mediaBranding) draft.mediaBranding = {};
            draft.mediaBranding.favicon = val;
          });
        }} 
      />
      <AdminInput 
        label={t.cms.seoImagePath} 
        value={mediaBranding.seoImage || ''} 
        onChange={(e) => {
          const val = e.target.value;
          updateField((draft) => {
            if (!draft.mediaBranding) draft.mediaBranding = {};
            draft.mediaBranding.seoImage = val;
          });
        }} 
      />
      <AdminInput 
        label={t.cms.ogImagePath} 
        value={mediaBranding.openGraphImage || ''} 
        onChange={(e) => {
          const val = e.target.value;
          updateField((draft) => {
            if (!draft.mediaBranding) draft.mediaBranding = {};
            draft.mediaBranding.openGraphImage = val;
          });
        }} 
      />
      <AdminInput 
        label={t.cms.brandLogo} 
        value={mediaBranding.logo || ''} 
        onChange={(e) => {
          const val = e.target.value;
          updateField((draft) => {
            if (!draft.mediaBranding) draft.mediaBranding = {};
            draft.mediaBranding.logo = val;
          });
        }} 
      />
    </div>
  );
});
