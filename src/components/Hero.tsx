import React from 'react';
import { Star, ArrowRight, CheckCircle2, Truck, Sparkles, MessageSquare } from 'lucide-react';
import { BOOK_METADATA } from '../data/bookData';
import { BookMockup3D } from './BookMockup3D';
import { TopLeadOrderForm } from './TopLeadOrderForm';
import { Order, SiteContentSettings } from '../types';

interface HeroProps {
  onBuyClick: () => void;
  onPreviewClick: () => void;
  onOrderSuccess?: (order: Order) => void;
  siteSettings?: SiteContentSettings;
}

export const Hero: React.FC<HeroProps> = ({ onBuyClick, onPreviewClick, onOrderSuccess, siteSettings }) => {
  const priceINR = siteSettings?.priceINR || BOOK_METADATA.priceINR;
  const shippingFeeINR = siteSettings?.shippingFeeINR !== undefined ? siteSettings.shippingFeeINR : BOOK_METADATA.shippingFeeINR;
  const originalPriceINR = siteSettings?.originalPriceINR || BOOK_METADATA.originalPriceINR;
  const discountPercent = siteSettings?.discountPercent || BOOK_METADATA.discountPercent;
  const authorName = siteSettings?.authorName || BOOK_METADATA.author;
  const heroTitle = siteSettings?.heroTitle;
  const heroSubtitle = siteSettings?.heroSubtitle || 'Master Digital Marketing from Scratch with One Complete Guide';
  const tagline = siteSettings?.tagline || 'One Book. Endless Opportunities. Learn Digital Marketing the Right Way.';

  return (
    <section className="relative pt-8 pb-16 md:py-20 bg-white text-slate-800 overflow-hidden border-b border-slate-200">
      {/* Subtle Background Accent Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Left Column: Core Copy & Book Highlights */}
          <div className="lg:col-span-6 space-y-5 text-left pt-2">
            
            {/* Tagline Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-900 font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{tagline}</span>
            </div>

            {/* Main Title Block */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight font-serif text-slate-900 uppercase leading-[1.08]">
                {heroTitle ? (
                  heroTitle
                ) : (
                  <>SEARCH, SOCIAL <span className="text-blue-700">&amp; SYSTEMS</span></>
                )}
              </h1>
              <p className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight font-sans">
                {heroSubtitle}
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Whether you're a beginner, entrepreneur, student, or marketing professional, this book by <strong>{authorName}</strong> gives you the complete roadmap to understand, execute, and grow in digital marketing.
            </p>

            {/* Verified Rating Badge */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900">4.9/5 Rating</span>
              <span className="text-[11px] text-slate-500 font-mono">
                from 1,248+ verified readers &amp; graduates.
              </span>
            </div>

            {/* Book Cover + Specs Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
              <div className="w-20 h-28 flex-shrink-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-lg p-2 text-white flex flex-col justify-between shadow-md border border-slate-800 text-center">
                <div className="text-[7px] font-mono tracking-widest text-blue-300 uppercase">OFFICIAL BOOK</div>
                <div className="text-[9px] font-serif font-black leading-tight text-white uppercase">SEARCH SOCIAL SYSTEMS</div>
                <div className="text-[7px] font-mono text-slate-400">{authorName}</div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Paperback Printed Book + Free Digital Kit
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  ISBN: {BOOK_METADATA.isbn} • 450+ Pages
                </div>
                <div className="text-blue-700 font-bold flex items-center gap-1 text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  {shippingFeeINR > 0 ? `Express Courier (₹${shippingFeeINR})` : 'FREE Express Shipping Across India'}
                </div>
                <div className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Dispatched within 24 Hours
                </div>
              </div>
            </div>

            {/* Key Benefits Guarantee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Instant Digital Companion Kit PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Direct UPI Secure Payment</span>
              </div>
            </div>

          </div>

          {/* Right Column: TOP HIGH LEAD GENERATION ORDER FORM */}
          <div className="lg:col-span-6 w-full">
            <TopLeadOrderForm
              onOrderSuccess={onOrderSuccess || (() => {})}
              siteSettings={siteSettings}
            />
          </div>

        </div>

        {/* Quick Stats Grid Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl font-black text-slate-900 font-mono">450+</div>
            <div className="text-[11px] text-slate-600 font-mono mt-0.5 uppercase">Printed Pages</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl font-black text-slate-900 font-mono">21</div>
            <div className="text-[11px] text-slate-600 font-mono mt-0.5 uppercase">Core Topics</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl font-black text-blue-700 font-mono">3</div>
            <div className="text-[11px] text-slate-600 font-mono mt-0.5 uppercase">Growth Pillars</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl font-black text-slate-900 font-mono">1,200+</div>
            <div className="text-[11px] text-slate-600 font-mono mt-0.5 uppercase">Copies Shipped</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
            <div className="text-2xl font-black text-amber-600 font-mono">4.9 / 5</div>
            <div className="text-[11px] text-slate-600 font-mono mt-0.5 uppercase">Reader Rating</div>
          </div>
        </div>

      </div>
    </section>
  );
};

