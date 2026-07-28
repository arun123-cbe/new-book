import React from 'react';
import { BOOK_METADATA } from '../data/bookData';
import { BookOpen, ShieldCheck, Truck, MessageSquare, Shield } from 'lucide-react';
import { SiteContentSettings } from '../types';

interface FooterProps {
  onAdminClick?: () => void;
  siteSettings?: SiteContentSettings;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, siteSettings }) => {
  const authorName = siteSettings?.authorName || BOOK_METADATA.author;
  const whatsappPhone = siteSettings?.whatsappPhone || BOOK_METADATA.whatsappPhone;
  const priceINR = siteSettings?.priceINR || BOOK_METADATA.priceINR;

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-white font-serif uppercase tracking-wider">
                SEARCH, SOCIAL &amp; SYSTEMS
              </span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Master Digital Marketing from Scratch with One Complete Guide. Written by {authorName}. 450+ pages of active agency campaign blueprints, SEO checklists, Meta ad strategies, and CRM automation.
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              ISBN-13: {BOOK_METADATA.isbn} • Premium Monochrome Paperback Edition
            </div>
          </div>

          <div className="space-y-2 font-mono">
            <div className="text-white font-bold uppercase text-xs">Quick Links</div>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#why-this-book" className="hover:text-blue-400 transition-colors">Why This Book?</a></li>
              <li><a href="#syllabus" className="hover:text-blue-400 transition-colors">21-Chapter Syllabus</a></li>
              <li><a href="#target-metric" className="hover:text-blue-400 transition-colors">Target Readers</a></li>
              <li><a href="#outcomes" className="hover:text-blue-400 transition-colors">Reader Outcomes</a></li>
              <li><a href="#buy-now" className="hover:text-emerald-400 text-emerald-400 font-bold transition-colors">Buy Printed Copy (₹{priceINR})</a></li>
            </ul>
          </div>

          <div className="space-y-3 font-mono">
            <div className="text-white font-bold uppercase text-xs">Direct Author Contact</div>
            <p className="text-slate-400 text-[11px] leading-tight">
              {authorName}<br />
              Digital Marketing Strategist
            </p>
            <a
              href={`https://wa.me/91${whatsappPhone}?text=Hi%20Arun,%20I%20have%20a%20question%20about%20the%20Search,%20Social%20%26%20Systems%20book!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-lg text-[11px] hover:bg-emerald-900 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp ({whatsappPhone})
            </a>

            {onAdminClick && (
              <div className="pt-1">
                <button
                  onClick={onAdminClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Author Admin Portal
                </button>
              </div>
            )}
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-mono text-slate-400">
          <div>
            © {new Date().getFullYear()} SEARCH, SOCIAL &amp; SYSTEMS by {authorName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> UPI Direct Payments
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-400" /> Free Express Courier Shipping
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
