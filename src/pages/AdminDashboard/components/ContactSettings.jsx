import React, { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { AdminInput } from '../../../components/ui/AdminControls';

export const ContactSettings = React.memo(({ contactMethods = [], t, updateField, lang }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleAccordion = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.contactMethodsTitleLabel || 'Contact Methods'}</h3>
        <button 
          type="button"
          onClick={() => {
            const newId = `method-${Date.now()}`;
            updateField((draft) => {
              if (!draft.contactMethods) draft.contactMethods = [];
              draft.contactMethods.push({ id: newId, type: 'link', label: 'Custom Link', value: '', visible: true });
            });
            setExpandedItems(prev => ({ ...prev, [newId]: true }));
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewContactMethod || 'Add Method'}
        </button>
      </div>

      <div className="space-y-4">
        {contactMethods.map((method, idx) => {
          const isExpanded = !!expandedItems[method.id];
          const globalIndex = contactMethods.findIndex(m => m.id === method.id);

          return (
            <div key={method.id} id={`item-${method.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
              <div 
                onClick={() => toggleAccordion(method.id)}
                className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      disabled={globalIndex === 0} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.contactMethods;
                          [list[globalIndex - 1], list[globalIndex]] = [list[globalIndex], list[globalIndex - 1]];
                        });
                      }} 
                      aria-label={t.cms?.ariaReorderUp || 'Move up'} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                    <button 
                      disabled={globalIndex === contactMethods.length - 1} 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.contactMethods;
                          [list[globalIndex + 1], list[globalIndex]] = [list[globalIndex], list[globalIndex + 1]];
                        });
                      }} 
                      aria-label={t.cms?.ariaReorderDown || 'Move down'} 
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{method.label || t.cms.untitledContactMethod || 'Untitled Method'}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] capitalize">{method.type} • {method.visible ? (t.cms.visible || 'Visible') : (t.cms.hidden || 'Hidden')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateField((draft) => {
                        draft.contactMethods[globalIndex].visible = !draft.contactMethods[globalIndex].visible;
                      });
                    }}
                    aria-label={t.cms?.ariaToggleVisibility || 'Toggle visibility'}
                    className={`p-1.5 rounded hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer ${method.visible ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}
                  >
                    {method.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t.cms.confirmDelete || 'Are you sure you want to delete this item?')) {
                        updateField((draft) => {
                          draft.contactMethods.splice(globalIndex, 1);
                        });
                      }
                    }}
                    aria-label={t.cms?.ariaDelete || 'Delete'}
                    className="p-1.5 rounded hover:bg-[var(--status-red-bg)] text-[var(--status-red)] hover:text-[var(--status-red)] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="text-[var(--text-secondary)]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 bg-[var(--card-bg)] border-t border-[var(--border-color)] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">{t.cms.contactMethodType || 'Type'}</label>
                      <select 
                        value={method.type} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateField((draft) => {
                            draft.contactMethods[globalIndex].type = val;
                          });
                        }}
                        className="w-full p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] text-sm"
                      >
                        <option value="email">{t.cms?.contactTypeEmail || 'Email'}</option>
                        <option value="whatsapp">{t.cms?.contactTypeWhatsApp || 'WhatsApp'}</option>
                        <option value="linkedin">{t.cms?.contactTypeLinkedIn || 'LinkedIn'}</option>
                        <option value="github">{t.cms?.contactTypeGitHub || 'GitHub'}</option>
                        <option value="facebook">{t.cms?.contactTypeFacebook || 'Facebook'}</option>
                        <option value="telegram">{t.cms?.contactTypeTelegram || 'Telegram'}</option>
                        <option value="twitter">{t.cms?.contactTypeTwitter || 'X (Twitter)'}</option>
                        <option value="instagram">{t.cms?.contactTypeInstagram || 'Instagram'}</option>
                        <option value="link">{t.cms?.contactTypeCustom || 'Custom Link'}</option>
                      </select>
                    </div>

                    <AdminInput 
                      label={t.cms.contactMethodLabel || 'Label'} 
                      value={method.label} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.contactMethods[globalIndex].label = val;
                        });
                      }} 
                    />
                  </div>

                  <AdminInput 
                    label={t.cms.contactMethodValue || 'Value/URL'} 
                    value={method.value} 
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField((draft) => {
                        draft.contactMethods[globalIndex].value = val;
                      });
                    }} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
