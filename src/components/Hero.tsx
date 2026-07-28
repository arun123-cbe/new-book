import React from 'react';
import { Star, ShieldCheck, ArrowRight, CheckCircle2, Truck, Sparkles, BookOpen } from 'lucide-react';
import { BOOK_METADATA } from '../data/bookData';
import { BookMockup3D } from './BookMockup3D';
import { SiteContentSettings } from '../types';

interface HeroProps {
  onBuyClick: () => void;
  onPreviewClick: () => void;
  siteSettings?: SiteContentSettings;
}

export const Hero: React.FC<HeroProps> = ({ onBuyClick, onPreviewClick, siteSettings }) => {
  const priceINR = siteSettings?.priceINR || BOOK_METADATA.priceINR;
  const originalPriceINR = siteSettings?.originalPriceINR || BOOK_METADATA.originalPriceINR;
  const discountPercent = siteSettings?.discountPercent || BOOK_METADATA.discountPercent;
  const authorName = siteSettings?.authorName || BOOK_METADATA.author;
  const heroTitle = siteSettings?.heroTitle;
  const heroSubtitle = siteSettings?.heroSubtitle || 'Master Digital Marketing from Scratch with One Complete Guide';
  const tagline = siteSettings?.tagline || 'One Book. Endless Opportunities. Learn Digital Marketing the Right Way.';

  return (
    <section className="relative pt-12 pb-20 md:py-24 bg-white text-slate-800 overflow-hidden border-b border-slate-200">
      {/* Subtle Background Accent Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tagline Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-900 font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{tagline}</span>
            </div>

            {/* Main Title Block */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-serif text-slate-900 uppercase leading-[1.05]">
                {heroTitle ? (
                  heroTitle
                ) : (
                  <>SEARCH, SOCIAL <span className="text-blue-700">&amp; SYSTEMS</span></>
                )}
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight font-sans">
                {heroSubtitle}
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              Whether you're a beginner, entrepreneur, student, or marketing professional, this book by <strong>{authorName}</strong> gives you the complete roadmap to understand, execute, and grow in digital marketing.
            </p>

            {/* Verified Rating Badge */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900">4.9/5 Rating</span>
              <span className="text-xs text-slate-500 font-mono">
                from 1,248+ verified readers, graduates, and business owners.
              </span>
            </div>

            {/* Format metadata bullet strip */}
            <div className="py-3 px-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                FORMAT: <strong className="text-slate-900">Premium Monochrome Paperback</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span>ISBN: <strong className="text-slate-900">{BOOK_METADATA.isbn}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" /> Free Shipping Across India
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onBuyClick}
                className="group relative px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>👉 Buy Now (₹{priceINR})</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onPreviewClick}
                className="px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-2 transition-colors font-mono"
              >
                <BookOpen className="w-4 h-4 text-blue-600" /> View 21-Chapter Syllabus
              </button>
            </div>

            {/* Key Benefits Guarantee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Instant Digital Companion Kit PDF Included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Direct UPI Secure Checkout</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Interactive Book Mockup & Quick Specs */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            
            {/* 3D Book Box */}
            <BookMockup3D onPreviewClick={onPreviewClick} />

            {/* Quick Pricing Badge */}
            <div className="w-full max-w-sm mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm flex items-center justify-between text-left">
              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">PAPERBACK PRICE</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 font-serif">₹{priceINR}</span>
                  <span className="text-sm line-through text-slate-400">₹{originalPriceINR}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 font-mono">
                    SAVE {discountPercent}%
                  </span>
                </div>
              </div>
              <button
                onClick={onBuyClick}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Order Copy
              </button>
            </div>

          </div>

        </div>

        {/* Quick Stats Grid Bar */}
        <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">450+</div>
            <div className="text-xs text-slate-600 font-mono mt-1 uppercase">Printed Pages</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">21</div>
            <div className="text-xs text-slate-600 font-mono mt-1 uppercase">Expert Chapters</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">3</div>
            <div className="text-xs text-slate-600 font-mono mt-1 uppercase">Connected Pillars</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">1,200+</div>
            <div className="text-xs text-slate-600 font-mono mt-1 uppercase">Copies Shipped</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">4.9</div>
            <div className="text-xs text-slate-600 font-mono mt-1 uppercase">Reader Average</div>
          </div>
        </div>

      </div>
    </section>
  );
};
