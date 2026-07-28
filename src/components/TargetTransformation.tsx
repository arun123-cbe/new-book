import React from 'react';
import { READER_OUTCOMES } from '../data/bookData';
import { CheckCircle2, Trophy, ArrowRight } from 'lucide-react';

interface TargetTransformationProps {
  onBuyClick: () => void;
}

export const TargetTransformation: React.FC<TargetTransformationProps> = ({ onBuyClick }) => {
  return (
    <section id="outcomes" className="py-20 bg-white text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
            THE TARGET TRANSFORMATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Reader Outcomes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            After completing this guide, you will be equipped with real-world abilities to execute digital campaigns with absolute confidence:
          </p>
        </div>

        {/* 8 Reader Outcome Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {READER_OUTCOMES.map((outcome, idx) => (
            <div
              key={idx}
              className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-400 transition-all flex items-start gap-3.5 group shadow-xs"
            >
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg flex-shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                {outcome}
              </div>
            </div>
          ))}
        </div>

        {/* Action Box */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-lg">
          <div className="space-y-1">
            <div className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Start Your Marketing Transformation Today
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Join 1,200+ readers across India scaling search, social, and systems.
            </div>
          </div>
          <button
            onClick={onBuyClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all whitespace-nowrap font-mono"
          >
            <span>Order Master Copy (₹799)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
