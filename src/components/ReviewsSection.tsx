import React, { useState, useEffect } from 'react';
import { REVIEWS } from '../data/bookData';
import { Review, SiteContentSettings } from '../types';
import { Star, Search, Plus, X, CheckCircle2 } from 'lucide-react';

interface ReviewsSectionProps {
  siteSettings?: SiteContentSettings;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ siteSettings }) => {
  const initialReviews = (siteSettings?.reviews && siteSettings.reviews.length > 0)
    ? siteSettings.reviews
    : REVIEWS;

  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);

  useEffect(() => {
    if (siteSettings?.reviews && siteSettings.reviews.length > 0) {
      setReviewsList(siteSettings.reviews);
    }
  }, [siteSettings]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // New review state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const filteredReviews = reviewsList.filter(rev => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rev.author.toLowerCase().includes(q) ||
      rev.role.toLowerCase().includes(q) ||
      rev.content.toLowerCase().includes(q) ||
      (rev.keywords && rev.keywords.some(k => k.toLowerCase().includes(q)))
    );
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newContent) return;

    const initials = newAuthor.slice(0, 2).toUpperCase();
    const createdRev: Review = {
      id: 'rev-' + Date.now(),
      author: newAuthor,
      role: newRole || 'Verified Reader',
      rating: newRating,
      date: 'Just now',
      content: newContent,
      verified: true,
      avatarBg: 'bg-blue-100 text-blue-800 border-blue-200',
      initials,
      keywords: ['verified reader']
    };

    setReviewsList([createdRev, ...reviewsList]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsWriteModalOpen(false);
      setNewAuthor('');
      setNewRole('');
      setNewContent('');
    }, 1500);
  };

  return (
    <section id="reviews" className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
            Reader Feedback
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Real Reader Reviews
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed">
            See what business owners, agency freelancers, and students say about Search, Social &amp; Systems.
          </p>
        </div>

        {/* Simplified Rating Summary & Search Bar */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          
          {/* Left: Overall Rating & Stars */}
          <div className="flex items-center gap-4 text-left">
            <div className="text-4xl font-black text-slate-900 font-serif">4.9</div>
            <div className="space-y-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                1,248+ Verified Reader Submissions
              </div>
            </div>
          </div>

          {/* Center/Right: Search Filter & Add Review Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Write a Review
            </button>
          </div>

        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono border ${rev.avatarBg || 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                      {rev.initials || rev.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{rev.author}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{rev.role}</div>
                    </div>
                  </div>

                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center text-amber-500 pt-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{rev.date}</span>
                <span className="uppercase text-blue-700 font-bold">{rev.keywords?.[0] || 'Paperback Edition'}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Write Your Reader Review</h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedMessage ? (
              <div className="py-8 text-center space-y-2 text-emerald-700 font-mono text-sm">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p>Thank you! Your review has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Role or Organization</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Digital Marketing Lead / Entrepreneur"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Great)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Your Honest Review *</label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Share how Search, Social & Systems helped your marketing..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
