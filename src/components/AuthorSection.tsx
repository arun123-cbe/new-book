import React from 'react';
import { Award, Quote } from 'lucide-react';
import { SiteContentSettings } from '../types';
import { BOOK_METADATA } from '../data/bookData';

interface AuthorSectionProps {
  siteSettings?: SiteContentSettings;
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({ siteSettings }) => {
  const authorName = siteSettings?.authorName || BOOK_METADATA.author;
  const authorImageUrl = siteSettings?.authorImageUrl;

  return (
    <section id="instructor" className="py-20 bg-white text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
            BEHIND THE CURRICULUM
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Meet Your Instructor
          </h2>
        </div>

        {/* Main Author Card */}
        <div className="p-8 sm:p-10 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-md">
          
          {/* Author Badge & Credentials (No Photo) */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
            <div className="w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-serif font-black shadow-md border-2 border-blue-500">
                AGP
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 font-serif">{authorName}</h3>
                <p className="text-xs font-mono text-blue-700 font-bold uppercase mt-1">
                  Digital Marketing Strategist
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="text-slate-900 font-bold">14+ Years</div>
                  <div className="text-[10px] text-slate-500">Agency Leader</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="text-slate-900 font-bold">21 Chapters</div>
                  <div className="text-[10px] text-slate-500">Master Guide</div>
                </div>
              </div>
            </div>
          </div>

          {/* Author Bio & Personal Note */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-mono text-blue-800 font-bold shadow-xs">
                <Award className="w-3.5 h-3.5 text-blue-600" /> 14 Years Strategic Digital Experience
              </div>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                A digital marketing strategist with over 14 years of experience helping businesses grow through digital transformation. Having worked with startups, enterprises, educational institutions, healthcare, real estate, retail, and eCommerce brands, {authorName} combines practical industry knowledge with easy-to-understand teaching. This book is designed to bridge the gap between learning and real-world execution.
              </p>
            </div>

            {/* A Personal Note Quote Box */}
            <div className="p-6 bg-white rounded-xl border-l-4 border-blue-600 space-y-3 relative shadow-xs">
              <Quote className="w-8 h-8 text-blue-200 absolute top-4 right-4 pointer-events-none" />
              
              <div className="text-xs font-mono text-blue-700 font-bold uppercase tracking-wider">
                A Personal Note:
              </div>

              <p className="text-sm sm:text-base text-slate-700 italic font-serif leading-relaxed">
                "Most textbooks are compiled by academics who have never written ad copy, mapped an automation Zap, or analyzed GBP Map discoverability keywords. This playbook is born out of real-world agency battlegrounds. I wrote it to help you build marketing systems that grow actual commercial cashflow."
              </p>

              <div className="text-xs font-mono text-slate-500 pt-1 font-semibold text-right">
                — {authorName}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
