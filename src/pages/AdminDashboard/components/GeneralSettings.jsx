import React from 'react';
import { AdminInput, AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const GeneralSettings = React.memo(({ generalData, t, updateField }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.tabGeneral}</h3>
      <AdminMultiLangInput 
        label={t.cms.siteName} 
        valueObj={generalData.siteName} 
        onChangeKey={(langKey, val) => {
          updateField((draft) => {
            draft.general.siteName[langKey] = val;
          });
        }} 
      />
      <AdminMultiLangInput 
        label={t.cms.logoText} 
        valueObj={generalData.logoText} 
        onChangeKey={(langKey, val) => {
          updateField((draft) => {
            draft.general.logoText[langKey] = val;
          });
        }} 
      />
      <AdminMultiLangInput 
        label={t.cms.brandSubtitle} 
        valueObj={generalData.brandIdentity} 
        onChangeKey={(langKey, val) => {
          updateField((draft) => {
            draft.general.brandIdentity[langKey] = val;
          });
        }} 
      />
      <AdminMultiLangInput 
        label={t.cms.seoDescription} 
        textarea 
        valueObj={generalData.seoDescription} 
        onChangeKey={(langKey, val) => {
          updateField((draft) => {
            draft.general.seoDescription[langKey] = val;
          });
        }} 
      />

      <div className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.socialLinks}</h4>
        <AdminInput 
          label={t.cms.githubUrl} 
          value={generalData.socialLinks.github} 
          onChange={(e) => {
            const val = e.target.value;
            updateField((draft) => {
              draft.general.socialLinks.github = val;
            });
          }} 
        />
        <AdminInput 
          label={t.cms.linkedinUrl} 
          value={generalData.socialLinks.linkedin} 
          onChange={(e) => {
            const val = e.target.value;
            updateField((draft) => {
              draft.general.socialLinks.linkedin = val;
            });
          }} 
        />
        <AdminInput 
          label={t.cms.whatsappNumber} 
          value={generalData.socialLinks.whatsapp} 
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            updateField((draft) => {
              draft.general.socialLinks.whatsapp = val;
            });
          }} 
        />
      </div>
    </div>
  );
});
