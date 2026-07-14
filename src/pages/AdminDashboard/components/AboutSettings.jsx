import React from 'react';
import { AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const AboutSettings = React.memo(({ aboutData, t, updateField }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black uppercase text-[var(--primary)] border-b border-[var(--border-color)] pb-3 mb-4">{t.cms.sidebarAbout}</h3>
      <AdminMultiLangInput 
        label={t.cms.aboutTitleLabel} 
        valueObj={aboutData.title} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            draft.about.title[key] = val;
          });
        }} 
      />
      <AdminMultiLangInput 
        label={t.cms.aboutSubtitleLabel} 
        valueObj={aboutData.subtitle} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            draft.about.subtitle[key] = val;
          });
        }} 
      />
      <AdminMultiLangInput 
        label={t.cms.aboutTextLabel} 
        textarea 
        valueObj={aboutData.text} 
        onChangeKey={(key, val) => {
          updateField((draft) => {
            draft.about.text[key] = val;
          });
        }} 
      />
    </div>
  );
});
