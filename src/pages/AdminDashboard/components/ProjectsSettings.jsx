import React, { useState } from 'react';
import { Search, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { AdminInput, AdminMultiLangInput } from '../../../components/ui/AdminControls';

export const ProjectsSettings = React.memo(({ projectsData = [], featuredProjects = [], t, updateField, lang }) => {
  const [localFilter, setLocalFilter] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleAccordion = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProjects = projectsData.filter(p => 
    p.title?.toLowerCase().includes(localFilter.toLowerCase()) || 
    p.id?.toLowerCase().includes(localFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-lg font-black uppercase text-[var(--primary)]">{t.cms.projectsTitleLabel}</h3>
        <button 
          onClick={() => {
            const newId = `project-${Date.now()}`;
            updateField((draft) => {
              draft.projects.push({
                id: newId,
                title: 'New Project',
                category: { ar: '', en: '', ur: '' },
                description: { ar: '', en: '', ur: '' },
                challenges: { ar: '', en: '', ur: '' },
                architecture: { ar: '', en: '', ur: '' },
                businessValue: { ar: '', en: '', ur: '' },
                features: [],
                tech: [],
                iconType: 'shield',
                demoLink: '',
                githubLink: '',
                projectType: 'commercial',
                status: 'completed',
                featured: false
              });
            });
            setExpandedItems(prev => ({ ...prev, [newId]: true }));
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)] font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.cms.addNewProject}
        </button>
      </div>

      {/* Filter Input */}
      <div className="mb-4 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input 
          type="text" 
          value={localFilter} 
          onChange={(e) => setLocalFilter(e.target.value)} 
          placeholder={t.cms.searchProjectsPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--primary)]"
        />
      </div>

      <div className="space-y-4">
        {filteredProjects.map((proj) => {
          const isExpanded = !!expandedItems[proj.id];
          const globalIndex = projectsData.findIndex(p => p.id === proj.id);
          const isFeatured = !!(proj.featured || featuredProjects.includes(proj.id));

          return (
            <div key={proj.id} id={`item-${proj.id}`} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300">
              {/* Accordion Trigger Header */}
              <div 
                onClick={() => toggleAccordion(proj.id)}
                className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      disabled={globalIndex === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.projects;
                          [list[globalIndex - 1], list[globalIndex]] = [list[globalIndex], list[globalIndex - 1]];
                        });
                      }}
                      aria-label={t.cms?.ariaReorderUp || 'Move up'}
                      className="p-1 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                    <button 
                      disabled={globalIndex === projectsData.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateField((draft) => {
                          const list = draft.projects;
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
                    <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                      {proj.title || t.cms.untitledProject || 'Untitled Project'}
                      {isFeatured && <span className="text-[9px] font-black uppercase bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] px-2 py-0.5 rounded">{t.cms.featured}</span>}
                    </h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">{t.cms.projectId}: {proj.id} | {t.cms.projectType}: {proj.projectType || 'N/A'} | {t.cms.projectStatus}: {proj.status || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateField((draft) => {
                        const targetProj = draft.projects[globalIndex];
                        const nextFeatured = !targetProj.featured;
                        targetProj.featured = nextFeatured;
                        
                        if (!draft.settings) draft.settings = { featuredProjects: [] };
                        if (!draft.settings.featuredProjects) draft.settings.featuredProjects = [];

                        if (nextFeatured) {
                          if (!draft.settings.featuredProjects.includes(proj.id)) {
                            draft.settings.featuredProjects.push(proj.id);
                          }
                        } else {
                          draft.settings.featuredProjects = draft.settings.featuredProjects.filter(id => id !== proj.id);
                        }
                      });
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-extrabold border transition-all ${
                      isFeatured 
                        ? 'bg-[var(--status-amber-bg)] border-[var(--status-amber-border)] text-[var(--status-amber)]' 
                        : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {isFeatured ? t.cms.featured : t.cms.makeFeatured}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t.cms.confirmDelete)) {
                        updateField((draft) => {
                          draft.projects = draft.projects.filter(p => p.id !== proj.id);
                          if (draft.settings?.featuredProjects) {
                            draft.settings.featuredProjects = draft.settings.featuredProjects.filter(id => id !== proj.id);
                          }
                        });
                      }
                    }}
                    aria-label={t.cms?.ariaDelete || 'Delete'} className="p-2 text-[var(--text-secondary)] hover:text-[var(--status-red)] hover:bg-[var(--status-red-bg)] rounded transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="p-5 border-t border-[var(--border-color)] bg-[var(--card-bg)] space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput 
                      label={t.cms.projectIdLabel} 
                      value={proj.id} 
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/\s+/g, '-');
                        updateField((draft) => {
                          draft.projects[globalIndex].id = val;
                        });
                      }} 
                    />
                    <AdminInput 
                      label={t.cms.projectTitle} 
                      value={proj.title} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.projects[globalIndex].title = val;
                        });
                      }} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput 
                      label={t.cms.projectTypeLabel} 
                      value={proj.projectType || ''} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.projects[globalIndex].projectType = val;
                        });
                      }} 
                    />
                    <AdminInput 
                      label={t.cms.projectStatusLabel} 
                      value={proj.status || ''} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.projects[globalIndex].status = val;
                        });
                      }} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput 
                      label={t.cms.demoUrl} 
                      value={proj.demoLink || ''} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.projects[globalIndex].demoLink = val;
                        });
                      }} 
                    />
                    <AdminInput 
                      label={t.cms.sourceUrl} 
                      value={proj.githubLink || ''} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.projects[globalIndex].githubLink = val;
                        });
                      }} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput 
                      label={t.cms.projectIconLabel || t.cms.skillIcon} 
                      value={proj.iconType || 'shield'} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateField((draft) => {
                          draft.projects[globalIndex].iconType = val;
                        });
                      }} 
                    />
                    <AdminMultiLangInput 
                      label={t.cms.projectCategory} 
                      valueObj={proj.category} 
                      onChangeKey={(key, val) => {
                        updateField((draft) => {
                          draft.projects[globalIndex].category[key] = val;
                        });
                      }} 
                    />
                  </div>

                  <AdminMultiLangInput 
                    label={t.cms.projectDescLabel} 
                    textarea 
                    valueObj={proj.description} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        draft.projects[globalIndex].description[key] = val;
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.projectChallenges} 
                    textarea 
                    valueObj={proj.challenges} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        draft.projects[globalIndex].challenges[key] = val;
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.projectArch} 
                    textarea 
                    valueObj={proj.architecture} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        draft.projects[globalIndex].architecture[key] = val;
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.projectImpact} 
                    textarea 
                    valueObj={proj.businessValue} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        draft.projects[globalIndex].businessValue[key] = val;
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.problemLabel || 'Problem Context'} 
                    textarea 
                    valueObj={proj.problem || { ar: '', en: '', ur: '' }} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        if (!draft.projects[globalIndex].problem) {
                          draft.projects[globalIndex].problem = { ar: '', en: '', ur: '' };
                        }
                        draft.projects[globalIndex].problem[key] = val;
                      });
                    }} 
                  />

                  <AdminMultiLangInput 
                    label={t.cms.solutionLabel || 'Proposed Solution'} 
                    textarea 
                    valueObj={proj.solution || { ar: '', en: '', ur: '' }} 
                    onChangeKey={(key, val) => {
                      updateField((draft) => {
                        if (!draft.projects[globalIndex].solution) {
                          draft.projects[globalIndex].solution = { ar: '', en: '', ur: '' };
                        }
                        draft.projects[globalIndex].solution[key] = val;
                      });
                    }} 
                  />

                  {/* Features List */}
                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
                    <h5 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.projectKeyFeatures}</h5>
                    <div className="space-y-3">
                      {(proj.features || []).map((feat, fIdx) => (
                        <div key={fIdx} className="p-3 border border-[var(--border-color)] rounded bg-[var(--card-bg)] flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <AdminMultiLangInput 
                              label={`${t.cms.featureLabel || 'Feature'} #${fIdx + 1}`} 
                              valueObj={feat} 
                              onChangeKey={(key, val) => {
                                updateField((draft) => {
                                  draft.projects[globalIndex].features[fIdx][key] = val;
                                });
                              }} 
                            />
                          </div>
                          <button 
                            onClick={() => {
                              updateField((draft) => {
                                draft.projects[globalIndex].features = draft.projects[globalIndex].features.filter((_, i) => i !== fIdx);
                              });
                            }}
                            aria-label={t.cms?.ariaDelete || 'Delete'}
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--status-red)] hover:bg-[var(--status-red-bg)] rounded cursor-pointer shrink-0 self-end mb-5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        updateField((draft) => {
                          if (!draft.projects[globalIndex].features) draft.projects[globalIndex].features = [];
                          draft.projects[globalIndex].features.push({ ar: '', en: '', ur: '' });
                        });
                      }}
                      className="w-full py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t.cms.addNewFeature}
                    </button>
                  </div>

                  {/* Tech Stack List */}
                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-3">
                    <h5 className="font-extrabold text-xs text-[var(--text-secondary)] uppercase">{t.cms.techStackDetails}</h5>
                    <div className="space-y-3">
                      {(proj.tech || []).map((tItem, tIdx) => {
                        const valObj = typeof tItem === 'string' ? { ar: tItem, en: tItem, ur: tItem } : tItem;
                        return (
                          <div key={tIdx} className="p-3 border border-[var(--border-color)] rounded bg-[var(--card-bg)] flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <AdminMultiLangInput 
                                label={`${t.cms.technologyLabel || 'Technology'} #${tIdx + 1}`} 
                                valueObj={valObj} 
                                onChangeKey={(key, val) => {
                                  updateField((draft) => {
                                    if (typeof draft.projects[globalIndex].tech[tIdx] === 'string') {
                                      const prevVal = draft.projects[globalIndex].tech[tIdx];
                                      draft.projects[globalIndex].tech[tIdx] = { ar: prevVal, en: prevVal, ur: prevVal };
                                    }
                                    draft.projects[globalIndex].tech[tIdx][key] = val;
                                  });
                                }} 
                              />
                            </div>
                            <button 
                              onClick={() => {
                                updateField((draft) => {
                                  draft.projects[globalIndex].tech = draft.projects[globalIndex].tech.filter((_, i) => i !== tIdx);
                                });
                              }}
                              aria-label={t.cms?.ariaDelete || 'Delete'}
                              className="p-2 text-[var(--text-secondary)] hover:text-[var(--status-red)] hover:bg-[var(--status-red-bg)] rounded cursor-pointer shrink-0 self-end mb-5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => {
                        updateField((draft) => {
                          if (!draft.projects[globalIndex].tech) draft.projects[globalIndex].tech = [];
                          draft.projects[globalIndex].tech.push({ ar: '', en: '', ur: '' });
                        });
                      }}
                      className="w-full py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t.cms.addNewTech}
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
