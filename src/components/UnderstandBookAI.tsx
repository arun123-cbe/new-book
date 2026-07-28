import React, { useState } from 'react';
import { ALL_CHAPTERS } from '../data/chaptersData';
import { Chapter } from '../types';
import { Bot, Sparkles, Send, BookOpen, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';

interface UnderstandBookAIProps {
  initialChapter?: Chapter | null;
}

export const UnderstandBookAI: React.FC<UnderstandBookAIProps> = ({ initialChapter }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(
    initialChapter ? initialChapter.chapterNumber : 1
  );
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const selectedChapter = ALL_CHAPTERS.find(c => c.chapterNumber === selectedChapterNumber) || ALL_CHAPTERS[0];

  const handleAskAi = async (customPrompt?: string, mode: 'general' | 'chapter_summary' | 'quiz' = 'general') => {
    const query = customPrompt || prompt || `Explain how Chapter ${selectedChapter.chapterNumber}: ${selectedChapter.title} works in real marketing campaigns.`;
    
    setLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/book-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          chapterContext: `Ch ${selectedChapter.chapterNumber}: ${selectedChapter.title}`,
          mode
        })
      });

      const data = await res.json();
      setLoading(false);
      if (data.answer) {
        setAiResponse(data.answer);
      } else {
        setAiResponse('Could not process AI response. Please check your network connection.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setAiResponse(
        `[Search, Social & Systems AI Assistant]: Chapter ${selectedChapter.chapterNumber} (${selectedChapter.title}) focuses on: ${selectedChapter.focus}. Core skills mastered include: ${selectedChapter.coreSkills.join(', ')}.`
      );
    }
  };

  return (
    <section id="understand-book" className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-100 text-blue-900 border border-blue-200 rounded-full text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> POWERED BY GEMINI AI ASSISTANT
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Understand the Book with AI
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed">
            Have a question about a chapter, concept, or how to apply Search, Social &amp; Systems to your business? Ask our official AI Book Assistant!
          </p>
        </div>

        {/* AI Assistant Container */}
        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start shadow-xl">
          
          {/* Left Column: Chapter & Quick Action Selectors */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-700 uppercase font-bold">
                1. Select Chapter to Explore
              </label>
              <select
                value={selectedChapterNumber}
                onChange={(e) => setSelectedChapterNumber(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ALL_CHAPTERS.map(c => (
                  <option key={c.id} value={c.chapterNumber}>
                    Ch {c.chapterNumber < 10 ? `0${c.chapterNumber}` : c.chapterNumber}: {c.title} ({c.pillar})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-700 uppercase font-bold">
                2. Quick AI Explanations
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleAskAi(`Summarize Chapter ${selectedChapter.chapterNumber}: ${selectedChapter.title} and its core outcomes.`, 'chapter_summary')}
                  className="w-full p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-left text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Summarize Chapter {selectedChapter.chapterNumber}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </button>

                <button
                  onClick={() => handleAskAi(`Generate a 3-question knowledge checkpoint quiz for Chapter ${selectedChapter.chapterNumber}.`, 'quiz')}
                  className="w-full p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-left text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" /> Chapter Knowledge Checkpoint Quiz
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
            </div>

            {/* Custom Question Input Form */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-mono text-slate-700 uppercase font-bold">
                3. Ask Any Specific Question
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Ask about Ch ${selectedChapter.chapterNumber} or general strategy...`}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleAskAi()}
                  disabled={loading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: AI Output Response Area */}
          <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700">
                  <Bot className="w-4 h-4" /> AI Assistant Response
                </div>
                <span className="text-[10px] font-mono text-slate-400">Context: Ch {selectedChapter.chapterNumber}</span>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500 font-mono text-xs">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <span>Consulting Search, Social &amp; Systems Knowledge Base...</span>
                </div>
              ) : aiResponse ? (
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
                  {aiResponse}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 font-mono text-xs space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Select a chapter or ask a question on the left to receive instant practical insights from the book curriculum.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Book Curriculum: 21 Chapters</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active AI Knowledge Base
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
