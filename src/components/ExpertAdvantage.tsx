import React from 'react';
import { WHY_THIS_BOOK_POINTS } from '../data/bookData';

export const ExpertAdvantage: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
            THE EXPERT ADVANTAGE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Why This Book Is Different?
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed">
            Engineered from ground zero to solve real marketing campaign challenges with zero fluff.
          </p>
        </div>

        {/* 01 - 08 Numbered Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_THIS_BOOK_POINTS.map((pt) => (
            <div
              key={pt.num}
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 relative overflow-hidden group shadow-xs"
            >
              <div className="text-3xl font-black font-mono text-blue-600 group-hover:text-blue-700 transition-colors">
                {pt.num}.
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors font-sans">
                {pt.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
