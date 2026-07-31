import React, { useState } from 'react';
import { BookOpen, ShoppingBag, Truck, Menu, X, Shield } from 'lucide-react';
import { BOOK_METADATA } from '../data/bookData';
import { SiteContentSettings } from '../types';

interface NavbarProps {
  onBuyClick: () => void;
  onTrackOrderClick: () => void;
  onReviewsClick: () => void;
  onAdminClick: () => void;
  siteSettings?: SiteContentSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBuyClick,
  onTrackOrderClick,
  onReviewsClick,
  onAdminClick,
  siteSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const priceINR = siteSettings?.priceINR || BOOK_METADATA.priceINR;
  const shippingFeeINR = siteSettings?.shippingFeeINR !== undefined ? siteSettings.shippingFeeINR : BOOK_METADATA.shippingFeeINR;
  const originalPriceINR = siteSettings?.originalPriceINR || BOOK_METADATA.originalPriceINR;
  const discountPercent = siteSettings?.discountPercent || BOOK_METADATA.discountPercent;

  const navLinks = [
    { label: 'Why This Book', href: '#why-this-book' },
    { label: 'Quick Order', href: '#top-lead-order' },
    { label: 'Who Should Read', href: '#target-metric' },
    { label: 'Outcomes', href: '#outcomes' },
    { label: 'Instructor', href: '#instructor' },
    { label: 'Reviews', href: '#reviews' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 py-1.5 px-4 text-center text-xs font-mono text-slate-200 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span className="text-white font-medium">SPECIAL AUTHOR LAUNCH OFFER:</span>
        <span className="text-emerald-400 font-bold">₹{priceINR}</span>
        <span className="line-through text-slate-400">₹{originalPriceINR}</span>
        <span className="hidden sm:inline text-slate-300">(SAVE {discountPercent}%)</span>
        <span className="mx-1">•</span>
        <span className="text-slate-200 flex items-center gap-1 font-sans">
          <Truck className="w-3.5 h-3.5 text-blue-400" /> {shippingFeeINR > 0 ? `Express Courier (₹${shippingFeeINR})` : 'Free Shipping Across India'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-slate-900 font-serif uppercase leading-tight">
                SEARCH, SOCIAL &amp; SYSTEMS
              </div>
              <div className="text-[10px] font-mono text-slate-500 tracking-tight hidden sm:block">
                BY {siteSettings?.authorName || BOOK_METADATA.author}
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onAdminClick}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
              title="Open Backend Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={onTrackOrderClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>Track Order</span>
            </button>

            <button
              onClick={onBuyClick}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Now • ₹{priceINR}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-800 pt-2 border-t border-slate-100 font-sans font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 bg-slate-50 rounded-lg text-xs font-semibold hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onTrackOrderClick();
              }}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-blue-600" /> Track Courier Delivery
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAdminClick();
              }}
              className="w-full py-2.5 px-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-blue-600" /> Author &amp; Admin Backend Portal
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
