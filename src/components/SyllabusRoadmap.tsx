import React, { useState } from 'react';
import { ALL_CHAPTERS } from '../data/chaptersData';
import { Chapter, SiteContentSettings } from '../types';
import { 
  Search, Share2, CheckCircle2, FileText, Sparkles, 
  Target, BarChart3, Mail, Megaphone, Bot, Layers, BookOpen 
} from 'lucide-react';

interface SyllabusProps {
  onBuyClick: () => void;
  onSelectChapterForAi?: (chapter: Chapter) => void;
  siteSettings?: SiteContentSettings;
}

export const SyllabusRoadmap: React.FC<SyllabusProps> = ({ onBuyClick, onSelectChapterForAi, siteSettings }) => {
  const chaptersList = (siteSettings?.chapters && siteSettings.chapters.length > 0) 
    ? siteSettings.chapters 
    : ALL_CHAPTERS;

  const [selectedChapterId, setSelectedChapterId] = useState<string>(chaptersList[0]?.id || 'ch-01');
  const [activePillarFilter, setActivePillarFilter] = useState<'ALL' | 'SEARCH' | 'SOCIAL' | 'SYSTEMS'>('ALL');

  const selectedChapter = chaptersList.find(c => c.id === selectedChapterId) || chaptersList[0] || ALL_CHAPTERS[0];

  const filteredChapters = chaptersList.filter(c => {
    if (activePillarFilter === 'ALL') return true;
    return c.pillar === activePillarFilter;
  });

  const coreModules = [
    {
      title: 'Digital Marketing Fundamentals',
      desc: 'Understand the complete digital ecosystem and how organic search, social validation grids, and lead conversion maps work together.',
      icon: Layers,
      pillar: 'SEARCH'
    },
    {
      title: 'Search Engine Optimization (SEO)',
      desc: "Position your brand inside Google's search indexes, capture active intent keywords, and build organic authority structures.",
      icon: Search,
      pillar: 'SEARCH'
    },
    {
      title: 'Google Ads (PPC)',
      desc: 'Run high-converting Search, Display, and Video campaigns that target active high-intent buyers exactly when they are ready to purchase.',
      icon: Target,
      pillar: 'SEARCH'
    },
    {
      title: 'Meta Advertising (FB & IG)',
      desc: 'Create social media ads that generate consistent lead streams, implement tracking pixels, and define advanced custom audiences.',
      icon: Megaphone,
      pillar: 'SOCIAL'
    },
    {
      title: 'Social Media Marketing',
      desc: 'Structure high-trust content workflows that grow organic audience engagement across LinkedIn, Instagram, and YouTube.',
      icon: Share2,
      pillar: 'SOCIAL'
    },
    {
      title: 'Content Marketing Playbooks',
      desc: 'Produce content that educates and converts. Master the Hub-and-Spoke content strategy to build effortless digital presence.',
      icon: FileText,
      pillar: 'SOCIAL'
    },
    {
      title: 'Email Marketing Systems',
      desc: 'Build highly personalized, automated subscriber sequences that nurture customer retention and maximize lifetime value.',
      icon: Mail,
      pillar: 'SYSTEMS'
    },
    {
      title: 'Performance Analytics & Tracking',
      desc: 'Analyze conversion paths, find customer drop-offs, and monitor advertising spend with custom-engineered dashboards.',
      icon: BarChart3,
      pillar: 'SYSTEMS'
    },
    {
      title: 'Generative AI in Copywriting',
      desc: 'Integrate model workflows like ChatGPT and Gemini to instantly draft compelling copy and automate research on autopilot.',
      icon: Bot,
      pillar: 'SYSTEMS'
    }
  ];

  return (
    <section id="syllabus" className="py-20 bg-white text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
            THE MASTER SYLLABUS ROADMAP
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            What You'll Learn
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Discover the full cycle of modern digital acquisition and retention systems. Each module is engineered to translate concepts directly into active business growth.
          </p>
        </div>

        {/* 9 Core Skill Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white rounded-lg text-blue-700 border border-slate-200 group-hover:border-blue-400 transition-colors shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                    mod.pillar === 'SEARCH' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    mod.pillar === 'SOCIAL' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                    'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {mod.pillar}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {mod.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* EXPLORE WHAT'S INSIDE: Interactive 21-Chapter Curriculum Grid & Blueprint Inspector */}
        <div className="pt-12 border-t border-slate-200 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
                EXPLORE WHAT’S INSIDE
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                The Complete 21-Chapter Roadmap
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Click any chapter below to inspect its core focus, agency templates, and key learnings.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-mono">
              {(['ALL', 'SEARCH', 'SOCIAL', 'SYSTEMS'] as const).map((pillar) => (
                <button
                  key={pillar}
                  onClick={() => setActivePillarFilter(pillar)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activePillarFilter === pillar
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {pillar}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout: Left 21 Chapter Pills, Right Selected Chapter Blueprint */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Scrollable Chapter Cards List */}
            <div className="lg:col-span-6 space-y-2.5 max-h-[500px] overflow-y-auto pr-2">
              {filteredChapters.map((ch) => {
                const isSelected = ch.id === selectedChapterId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapterId(ch.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ch.chapterNumber < 10 ? `0${ch.chapterNumber}` : ch.chapterNumber}
                      </span>
                      <div>
                        <div className={`text-xs font-bold font-sans ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                          {ch.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {ch.focusTag}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                      ch.pillar === 'SEARCH' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      ch.pillar === 'SOCIAL' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {ch.pillar}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Chapter Detailed Blueprint Inspector */}
            <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-sm sticky top-24">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-blue-100 text-blue-800 rounded-lg text-xs font-mono font-bold">
                    CHAPTER {selectedChapter.chapterNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-500 uppercase">{selectedChapter.pillar} PILLAR</span>
                </div>

                {onSelectChapterForAi && (
                  <button
                    onClick={() => onSelectChapterForAi(selectedChapter)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Ask AI Assistant
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900 font-serif">
                  {selectedChapter.title}
                </h4>
                <p className="text-xs font-mono text-blue-700 font-bold uppercase">
                  FOCUS: {selectedChapter.focusTag}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {selectedChapter.summary}
                </p>
              </div>

              {/* Core Skills Checklist */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono text-slate-700 font-bold uppercase">
                  Key Skills You Will Master:
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs text-slate-700">
                  {selectedChapter.coreSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Templates Box */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-mono text-blue-700 font-bold uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Downloadable Templates &amp; Agency Worksheets:
                </div>
                <ul className="text-xs text-slate-600 space-y-1 pl-6 list-disc">
                  {selectedChapter.toolkitTemplates.map((tpl, i) => (
                    <li key={i}>{tpl}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={onBuyClick}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all font-mono"
                >
                  Order Copy to Read Chapter {selectedChapter.chapterNumber}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
