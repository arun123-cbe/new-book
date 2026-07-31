import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyThisBook } from './components/WhyThisBook';
import { ExpertAdvantage } from './components/ExpertAdvantage';
import { SyllabusRoadmap } from './components/SyllabusRoadmap';
import { UnderstandBookAI } from './components/UnderstandBookAI';
import { TargetAudience } from './components/TargetAudience';
import { TargetTransformation } from './components/TargetTransformation';
import { RoiCalculator } from './components/RoiCalculator';
import { AuthorSection } from './components/AuthorSection';
import { ReviewsSection } from './components/ReviewsSection';
import { CheckoutPortal } from './components/CheckoutPortal';
import { Footer } from './components/Footer';
import { OrderTrackModal } from './components/OrderTrackModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { Chapter, Order, SiteContentSettings } from './types';
import { subscribeToFirebaseSettings } from './lib/firebase';
import { initAnalytics, trackPageView } from './lib/analytics';

export default function App() {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedAiChapter, setSelectedAiChapter] = useState<Chapter | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteContentSettings | undefined>(undefined);

  // Fetch initial site content settings from backend
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(data);
      }
    } catch (e) {
      console.error("Could not fetch site settings:", e);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Subscribe to Firebase Firestore live settings updates
    const unsubscribe = subscribeToFirebaseSettings((fbSettings) => {
      if (fbSettings && typeof fbSettings === 'object') {
        setSiteSettings(fbSettings);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    initAnalytics({
      gaMeasurementId: siteSettings?.gaMeasurementId,
      gtmContainerId: siteSettings?.gtmContainerId,
      enableAnalytics: siteSettings?.enableAnalytics !== false
    });
    trackPageView('SEARCH, SOCIAL & SYSTEMS - Official Book', window.location.pathname);
  }, [siteSettings]);

  const scrollToCheckout = () => {
    const el = document.getElementById('buy-now');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAi = (chapter?: Chapter) => {
    if (chapter) {
      setSelectedAiChapter(chapter);
    }
    const el = document.getElementById('understand-book');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Sticky Navigation Bar */}
      <Navbar
        onBuyClick={scrollToCheckout}
        onTrackOrderClick={() => setIsTrackModalOpen(true)}
        onAdminClick={() => setIsAdminModalOpen(true)}
        onReviewsClick={scrollToReviews}
        siteSettings={siteSettings}
      />

      {/* Main Single Page Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          onBuyClick={scrollToCheckout}
          onPreviewClick={() => {
            const el = document.getElementById('syllabus');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          siteSettings={siteSettings}
        />

        {/* Why This Book & Core Value Metric */}
        <WhyThisBook onOrderClick={scrollToCheckout} />

        {/* The Expert Advantage - Why This Book Is Different */}
        <ExpertAdvantage />

        {/* Master Syllabus Roadmap & 21 Chapter Blueprint Inspector */}
        <SyllabusRoadmap
          onBuyClick={scrollToCheckout}
          onSelectChapterForAi={scrollToAi}
          siteSettings={siteSettings}
        />

        {/* Understand the Book with Gemini AI */}
        <UnderstandBookAI initialChapter={selectedAiChapter} />

        {/* Find Your Target Metric - Who Should Read */}
        <TargetAudience
          onBuyClick={scrollToCheckout}
          siteSettings={siteSettings}
        />

        {/* Target Transformation - Reader Outcomes */}
        <TargetTransformation onBuyClick={scrollToCheckout} />

        {/* System ROI & Career Value Calculator */}
        <RoiCalculator onBuyClick={scrollToCheckout} />

        {/* Behind the Curriculum - Meet Your Instructor */}
        <AuthorSection siteSettings={siteSettings} />

        {/* Verified Reader Feedback & Search Filter */}
        <ReviewsSection siteSettings={siteSettings} />

        {/* 100% Secure Direct Checkout Portal with UPI Payment Options */}
        <CheckoutPortal
          onOrderSuccess={(order) => setLastOrder(order)}
          siteSettings={siteSettings}
        />
      </main>

      {/* Footer */}
      <Footer
        onAdminClick={() => setIsAdminModalOpen(true)}
        siteSettings={siteSettings}
      />

      {/* Order Tracking Lookup Modal */}
      {isTrackModalOpen && (
        <OrderTrackModal
          onClose={() => setIsTrackModalOpen(false)}
          recentOrder={lastOrder}
        />
      )}

      {/* Admin Content & Order Management Portal */}
      {isAdminModalOpen && (
        <AdminPortalModal
          onClose={() => setIsAdminModalOpen(false)}
          onContentUpdated={fetchSettings}
          onSettingsUpdated={fetchSettings}
        />
      )}

    </div>
  );
}
