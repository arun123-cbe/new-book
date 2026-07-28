import React, { useState } from 'react';
import { TARGET_PERSONAS } from '../data/bookData';
import { SiteContentSettings } from '../types';
import { 
  GraduationCap, Building2, Briefcase, Laptop, TrendingUp, CheckCircle2, ArrowRight 
} from 'lucide-react';

interface TargetAudienceProps {
  onBuyClick: () => void;
  siteSettings?: SiteContentSettings;
}

export const TargetAudience: React.FC<TargetAudienceProps> = ({ onBuyClick, siteSettings }) => {
  const personasList = (siteSettings?.personas && siteSettings.personas.length > 0)
    ? siteSettings.personas
    : TARGET_PERSONAS;

  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(personasList[0]?.id || 'students');

  const selectedPersona = personasList.find(p => p.id === selectedPersonaId) || personasList[0] || TARGET_PERSONAS[0];

  const getIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap': return GraduationCap;
      case 'Building2': return Building2;
      case 'Briefcase': return Briefcase;
      case 'Laptop': return Laptop;
      case 'TrendingUp': return TrendingUp;
      default: return Briefcase;
    }
  };

  return (
    <section id="target-metric" className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
            FIND YOUR TARGET METRIC
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Who Should Read This Book?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            No matter where you are in your career or entrepreneurial journey, this playbook provides a custom path to marketing competence and business growth.
          </p>
        </div>

        {/* Persona Selectors Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TARGET_PERSONAS.map((p) => {
            const Icon = getIcon(p.iconName);
            const isSelected = p.id === selectedPersonaId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersonaId(p.id)}
                className={`p-4 rounded-xl border text-left transition-all space-y-2 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-lg ${
                    isSelected ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {p.badge}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-slate-500 font-mono">{p.category}</div>
                  <div className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{p.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Deep-Dive Card */}
        <div className="p-8 bg-white rounded-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full font-mono text-xs font-bold uppercase">
                {selectedPersona.category}
              </span>
              <span className="text-xs font-mono text-slate-500">• BADGE: {selectedPersona.badge}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              {selectedPersona.title}
            </h3>

            <p className="text-base font-bold text-blue-700 leading-relaxed font-sans">
              "{selectedPersona.tagline}"
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedPersona.description}
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="text-xs font-mono text-slate-700 font-bold uppercase">
              Core Career &amp; Revenue Outcomes:
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              {selectedPersona.keyOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onBuyClick}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-mono"
            >
              <span>Order Copy for {selectedPersona.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
