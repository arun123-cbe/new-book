import React, { useState } from 'react';
import { FAQS, BOOK_METADATA } from '../data/bookData';
import { ChevronDown, MessageSquare, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';

interface FaqSectionProps {
  onBuyClick: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onBuyClick }) => {
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  return (
    <section id="faq" className="py-20 bg-neutral-950 text-neutral-100 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
            COMMON INQUIRIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight">
            Frequently Asked Questions
          </h2>
          
          {/* WhatsApp Direct Chat Banner */}
          <div className="pt-2 flex justify-center">
            <a
              href={BOOK_METADATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-full text-xs font-mono font-bold transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Chat directly on WhatsApp (9787196806)</span>
            </a>
          </div>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq) => {
            const isOpen = faq.id === openFaqId;
            return (
              <div
                key={faq.id}
                className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  <span className="flex items-center gap-3 font-serif">
                    <HelpCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light border-t border-neutral-800/60 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final Bottom Call to Action Banner verbatim from prompt */}
        <div className="p-8 sm:p-12 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-emerald-950/60 rounded-2xl border-2 border-emerald-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black text-white font-serif tracking-tight">
              Build a Predictable Digital Marketing System That Scales
            </h3>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-light">
              Search helps customers find you. Social helps customers trust you. Systems help you convert and scale. Get the printed guide and instant digital companion blueprints today.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBuyClick}
              className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-black text-base rounded shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>👉 Order Printed Copy Now (₹799)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href={BOOK_METADATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-mono font-bold rounded flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Questions?</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
