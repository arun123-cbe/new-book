import React from 'react';
import { Target, Zap, Layers, CheckCircle2, FileSpreadsheet, ArrowRight } from 'lucide-react';

interface WhyThisBookProps {
  onOrderClick: () => void;
}

export const WhyThisBook: React.FC<WhyThisBookProps> = ({ onOrderClick }) => {
  return (
    <section id="why-this-book" className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Block 1: Practical Mindset Over Theory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
              PRACTICAL MINDSET OVER THEORY
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
              Why This Book?
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Most digital marketing books teach dry, unapplied theories. This playbook is designed from active agency campaigns to show you how modern growth systems actually function in the real world.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Written in a simple, highly structured blueprint format, you'll master essential concepts along with practical strategies that can be deployed immediately to attract consumers, automate funnels, and scale cashflows.
            </p>

            {/* Practical Callout Card */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-blue-100 border border-blue-200 text-blue-700 rounded-lg flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">100% Practical &amp; Actionable</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ditch the lecture slides. Learn from active agency campaign checklists and proven conversion-first frameworks.
                </p>
              </div>
            </div>

          </div>

          {/* Right Visual Card: Comparison Table */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-sm">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
              THE COMPARISON: TRADITIONAL VS. SYSTEMS PLAYBOOK
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <div className="font-bold text-rose-800 uppercase font-mono flex items-center gap-2">
                  <span>❌ Traditional Marketing Books</span>
                </div>
                <ul className="text-slate-700 space-y-1.5 list-disc list-inside">
                  <li>Dry academic definitions without real click paths</li>
                  <li>Isolated chapters with zero connection between channels</li>
                  <li>Outdated algorithms &amp; dead social media tactics</li>
                  <li>No downloadable agency templates or checklists</li>
                </ul>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="font-bold text-emerald-800 uppercase font-mono flex items-center gap-2">
                  <span>✅ Search, Social &amp; Systems Playbook</span>
                </div>
                <ul className="text-slate-800 space-y-1.5 list-disc list-inside">
                  <li>Active agency campaign checklists &amp; live click paths</li>
                  <li>3 Connected Pillars: Search + Social + Systems unified</li>
                  <li>Generative AI, GEO/AEO, and server-side Meta CAPI</li>
                  <li>Instant companion kit with 21 downloadable tools</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Block 2: The Core Value Metric - Stop Wasting Years */}
        <div className="p-8 sm:p-10 bg-white rounded-2xl border border-slate-200 space-y-8 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Target className="w-64 h-64 text-blue-600" />
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
              THE CORE VALUE METRIC
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
              Stop Wasting Years on Scattered Internet Noise
            </h3>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Instead of watching endless scattered YouTube tutorials or reading outdated, conflicting marketing blogs, you'll unlock one unified master guide. It covers everything you need to confidently architect campaign strategies, configure analytics, deploy automated workflows, and build a high-income freelance career or fast-scaling business.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 border border-blue-200 rounded-lg text-blue-700">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Interactive Companion Kit Included</div>
                <div className="text-xs text-slate-500 font-mono">
                  Includes Checklists, Automation Templates &amp; KPI Sheets
                </div>
              </div>
            </div>

            <button
              onClick={onOrderClick}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md flex items-center gap-2 transition-all"
            >
              <span>Order Master Copy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
