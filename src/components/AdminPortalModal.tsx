import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, Shield, Package, Edit, Check, Search, Trash2, ExternalLink, 
  RefreshCw, DollarSign, Truck, Users, Save, Smartphone, MessageSquare, AlertCircle,
  Plus, BookOpen, Star, Sparkles, UserCheck, Layers, LayoutGrid, FileText, QrCode
} from 'lucide-react';
import { Order, SiteContentSettings, Chapter, Review, TargetPersona } from '../types';
import { ALL_CHAPTERS } from '../data/chaptersData';
import { REVIEWS, TARGET_PERSONAS } from '../data/bookData';

interface AdminPortalProps {
  onClose: () => void;
  onContentUpdated?: () => void;
  onSettingsUpdated?: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalProps> = ({ onClose, onContentUpdated, onSettingsUpdated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState(false);

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'CONTENT'>('ORDERS');
  const [contentSubTab, setContentSubTab] = useState<'HERO_PRICING' | 'CHAPTERS' | 'REVIEWS' | 'PERSONAS'>('HERO_PRICING');
  
  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live QR Preview State
  const [adminQrUrl, setAdminQrUrl] = useState('');

  // Content Settings State
  const [settings, setSettings] = useState<SiteContentSettings>({
    heroTitle: 'SEARCH, SOCIAL & SYSTEMS',
    heroSubtitle: 'Master Digital Marketing from Scratch with One Complete Guide',
    priceINR: 799,
    originalPriceINR: 1299,
    discountPercent: 40,
    whatsappPhone: '9787196806',
    upiMerchantId: 'arungowtham@upi',
    authorName: 'Arun Gowtham Prabhudas',
    authorTitle: 'Digital Marketing Strategist & Author',
    authorBio: '14+ years agency leader helping entrepreneurs, students, and businesses build scalable marketing engines.',
    authorImageUrl: '',
    tagline: 'One Book. Endless Opportunities. Learn Digital Marketing the Right Way.',
    announcementText: '⚡ Free Standard Express Courier Delivery Across India + Immediate Digital Companion Blueprint Download Access!',
    chapters: [],
    reviews: [],
    personas: []
  });

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Authenticate handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === '1234' || passcode === '') {
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const url = `/api/admin/orders?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Fetch content settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data && (data.priceINR || data.authorName || data.upiMerchantId)) {
        setSettings({
          ...data,
          chapters: (data.chapters && data.chapters.length > 0) ? data.chapters : ALL_CHAPTERS,
          reviews: (data.reviews && data.reviews.length > 0) ? data.reviews : REVIEWS,
          personas: (data.personas && data.personas.length > 0) ? data.personas : TARGET_PERSONAS
        });
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  // Fetch orders when status or search query changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, statusFilter, searchQuery]);

  // Fetch content settings ONLY on initial login/auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  // Dynamically generate QR preview for Admin as settings change
  useEffect(() => {
    const price = Number(settings.priceINR) || 799;
    const shipping = settings.shippingFeeINR !== undefined ? Number(settings.shippingFeeINR) : 49;
    const total = price + shipping;
    const upi = (settings.upiMerchantId || 'arungowtham@upi').trim();
    const payStr = `upi://pay?pa=${encodeURIComponent(upi)}&pn=Arun%20Gowtham&am=${total}&cu=INR&tn=Search%20Social%20Systems%20Book%20Order`;
    QRCode.toDataURL(payStr, { width: 180, margin: 1, color: { dark: '#1e3a8a', light: '#ffffff' } })
      .then(url => setAdminQrUrl(url))
      .catch(() => {});
  }, [settings.upiMerchantId, settings.priceINR, settings.shippingFeeINR]);

  // Update order status or tracking details
  const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update order', err);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to remove order ${orderId}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to delete order', err);
    }
  };

  // Save Site Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    try {
      const cleanPayload: SiteContentSettings = {
        ...settings,
        priceINR: Number(settings.priceINR) || 799,
        shippingFeeINR: settings.shippingFeeINR !== undefined && settings.shippingFeeINR !== null && settings.shippingFeeINR !== ('' as any)
          ? Number(settings.shippingFeeINR)
          : 49,
        originalPriceINR: Number(settings.originalPriceINR) || 1299,
        discountPercent: Number(settings.discountPercent) || 40,
        upiMerchantId: (settings.upiMerchantId || 'arungowtham@upi').trim(),
        whatsappPhone: (settings.whatsappPhone || '9787196806').trim(),
        chapters: (settings.chapters && settings.chapters.length > 0) ? settings.chapters : ALL_CHAPTERS,
        reviews: (settings.reviews && settings.reviews.length > 0) ? settings.reviews : REVIEWS,
        personas: (settings.personas && settings.personas.length > 0) ? settings.personas : TARGET_PERSONAS
      };

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanPayload)
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        setSaveSuccess(true);
        setSaveMessage(`Successfully Published! Merchant UPI: ${cleanPayload.upiMerchantId} • Price: ₹${cleanPayload.priceINR} + ₹${cleanPayload.shippingFeeINR} Courier Shipping`);
        setTimeout(() => setSaveSuccess(false), 5000);
        if (onContentUpdated) onContentUpdated();
        if (onSettingsUpdated) onSettingsUpdated();
      }
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // --- CHAPTER CMS HANDLERS ---
  const handleAddChapter = () => {
    const currentChapters = settings.chapters && settings.chapters.length > 0 ? settings.chapters : ALL_CHAPTERS;
    const newNum = currentChapters.length + 1;
    const newChapter: Chapter = {
      id: `ch-${newNum < 10 ? '0' + newNum : newNum}`,
      chapterNumber: newNum,
      title: `New Chapter ${newNum}: Digital Strategy`,
      pillar: 'SYSTEMS',
      focusTag: 'New Strategy',
      focus: 'Enter chapter focus area description here.',
      summary: 'Enter comprehensive chapter summary here.',
      coreSkills: ['Strategy Formulation', 'Execution']
    };
    setSettings({ ...settings, chapters: [newChapter, ...currentChapters] });
  };

  const handleUpdateChapter = (index: number, updated: Partial<Chapter>) => {
    const currentChapters = [...(settings.chapters || ALL_CHAPTERS)];
    currentChapters[index] = { ...currentChapters[index], ...updated };
    setSettings({ ...settings, chapters: currentChapters });
  };

  const handleDeleteChapter = (id: string) => {
    if (!window.confirm('Delete this chapter from the roadmap?')) return;
    const currentChapters = (settings.chapters || ALL_CHAPTERS).filter(c => c.id !== id);
    setSettings({ ...settings, chapters: currentChapters });
  };

  // --- REVIEW CMS HANDLERS ---
  const handleAddReview = () => {
    const currentReviews = settings.reviews && settings.reviews.length > 0 ? settings.reviews : REVIEWS;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: 'New Verified Reader',
      role: 'Marketing Lead / Founder',
      rating: 5,
      date: 'Just Now',
      content: 'This book provided an unmatched blueprint for our digital campaigns!',
      verified: true,
      avatarBg: 'bg-blue-900/80 text-blue-200 border-blue-500/30',
      initials: 'NR',
      keywords: ['Practical', 'Verified', 'Strategy']
    };
    setSettings({ ...settings, reviews: [newRev, ...currentReviews] });
  };

  const handleUpdateReview = (index: number, updated: Partial<Review>) => {
    const currentReviews = [...(settings.reviews || REVIEWS)];
    currentReviews[index] = { ...currentReviews[index], ...updated };
    setSettings({ ...settings, reviews: currentReviews });
  };

  const handleDeleteReview = (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    const currentReviews = (settings.reviews || REVIEWS).filter(r => r.id !== id);
    setSettings({ ...settings, reviews: currentReviews });
  };

  // --- PERSONA CMS HANDLERS ---
  const handleAddPersona = () => {
    const currentPersonas = settings.personas && settings.personas.length > 0 ? settings.personas : TARGET_PERSONAS;
    const newPersona: TargetPersona = {
      id: `persona-${Date.now()}`,
      category: 'For Growth Strategists',
      badge: 'STRATEGISTS',
      title: 'New Audience Segment',
      tagline: 'Practical application for targeted growth goals.',
      description: 'Master practical agency frameworks tailored to this audience group.',
      keyOutcomes: ['Accelerated Growth', 'Standard Operating Procedures', 'Measurable Results'],
      iconName: 'Briefcase'
    };
    setSettings({ ...settings, personas: [...currentPersonas, newPersona] });
  };

  const handleUpdatePersona = (index: number, updated: Partial<TargetPersona>) => {
    const currentPersonas = [...(settings.personas || TARGET_PERSONAS)];
    currentPersonas[index] = { ...currentPersonas[index], ...updated };
    setSettings({ ...settings, personas: currentPersonas });
  };

  const handleDeletePersona = (id: string) => {
    if (!window.confirm('Delete this persona profile?')) return;
    const currentPersonas = (settings.personas || TARGET_PERSONAS).filter(p => p.id !== id);
    setSettings({ ...settings, personas: currentPersonas });
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 799), 0);
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const dispatchedCount = orders.filter(o => o.status === 'DISPATCHED').length;

  const chaptersList = settings.chapters && settings.chapters.length > 0 ? settings.chapters : ALL_CHAPTERS;
  const reviewsList = settings.reviews && settings.reviews.length > 0 ? settings.reviews : REVIEWS;
  const personasList = settings.personas && settings.personas.length > 0 ? settings.personas : TARGET_PERSONAS;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 max-w-6xl w-full my-6 shadow-2xl relative text-slate-800 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black font-serif text-slate-900 tracking-tight flex items-center gap-2">
              Publisher Admin &amp; Site Content Studio
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Manage orders, update live website content, edit chapters, and publish reader reviews
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-center">
            <Shield className="w-10 h-10 text-blue-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 font-serif">Publisher Security Login</h3>
            <p className="text-xs text-slate-600">
              Enter admin passcode to access order fulfillment and live website CMS editing tools.
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                placeholder="Enter Passcode (e.g. admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-center text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />

              {passError && (
                <div className="text-xs text-red-600 font-bold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect passcode. Try 'admin123'
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
              >
                Access Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN INTERFACE */
          <div className="flex-1 overflow-y-auto pr-1 space-y-6">
            
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('ORDERS')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                    activeTab === 'ORDERS' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Package className="w-4 h-4" /> Customer Orders ({orders.length})
                </button>

                <button
                  onClick={() => setActiveTab('CONTENT')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                    activeTab === 'CONTENT' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Edit className="w-4 h-4" /> Edit Website Content (CMS)
                </button>
              </div>

              {/* Quick Save All & JSON Export Buttons */}
              <div className="flex items-center gap-2">
                {activeTab === 'CONTENT' && (
                  <>
                    <a
                      href="/api/admin/export/content"
                      download="siteContent.json"
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all"
                      title="Download siteContent.json"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Export Content JSON
                    </a>

                    <button
                      onClick={() => handleSaveSettings()}
                      disabled={isSavingSettings}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" /> Publish CMS Changes
                    </button>
                  </>
                )}

                {activeTab === 'ORDERS' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchOrders()}
                      disabled={isLoadingOrders}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 flex items-center gap-1.5 transition-all"
                      title="Sync live customer orders"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} /> Refresh Orders
                    </button>

                    <a
                      href="/api/admin/export/orders"
                      download="orders.json"
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all"
                      title="Download orders.json"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Export Orders JSON
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* TAB 1: CUSTOMER ORDERS */}
            {activeTab === 'ORDERS' && (
              <div className="space-y-4">
                
                {/* Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 block text-[10px]">Total Revenue</span>
                    <span className="text-lg font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-amber-700 block text-[10px]">Pending Orders</span>
                    <span className="text-lg font-bold text-amber-900">{pendingCount}</span>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-blue-700 block text-[10px]">Dispatched</span>
                    <span className="text-lg font-bold text-blue-900">{dispatchedCount}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-emerald-700 block text-[10px]">Active Orders</span>
                    <span className="text-lg font-bold text-emerald-900">{orders.length}</span>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Order ID, Name, Phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    {['ALL', 'PENDING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors ${
                          statusFilter === st ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List */}
                {isLoadingOrders ? (
                  <div className="text-center py-8 text-slate-400 text-xs font-mono flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" /> Loading customer order records...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs font-mono">
                    No orders match your filter criteria.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div key={ord.orderId} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {ord.orderId}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrder(ord.orderId, { status: e.target.value as any })}
                              className="px-2 py-1 bg-slate-100 font-mono text-[11px] font-bold rounded border border-slate-300 text-slate-800 focus:outline-none"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="DISPATCHED">DISPATCHED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>

                            <span className="font-mono font-bold text-slate-900 bg-emerald-50 px-2 py-1 rounded text-emerald-800 border border-emerald-200">
                              ₹{ord.amount}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-mono block">Customer Details</span>
                            <div className="font-bold text-slate-900">{ord.customer.name}</div>
                            <div className="text-slate-600 font-mono">{ord.customer.phone}</div>
                            <div className="text-slate-500">{ord.customer.email}</div>
                          </div>

                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-mono block">Delivery Address</span>
                            <div className="text-slate-700">{ord.customer.address}</div>
                            <div className="text-slate-600">{ord.customer.city}, {ord.customer.state} - <span className="font-mono font-bold">{ord.customer.pincode}</span></div>
                          </div>

                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-mono block">Payment &amp; Courier</span>
                            <div className="font-mono font-bold text-slate-800">{ord.payment?.method || 'UPI'} ({ord.payment?.upiApp || 'UPI App'})</div>
                            <div className="text-slate-500 font-mono text-[11px]">Ref: {ord.payment?.transactionRef}</div>
                            <div className="text-slate-600 font-semibold">{ord.carrier || 'BlueDart Express'}</div>
                          </div>
                        </div>

                        {/* Courier Tracking ID & Quick Action Bar */}
                        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono">
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-slate-500 whitespace-nowrap">Tracking ID:</span>
                            <input
                              type="text"
                              defaultValue={ord.trackingId}
                              onBlur={(e) => handleUpdateOrder(ord.orderId, { trackingId: e.target.value })}
                              className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-bold focus:outline-none focus:border-blue-500 text-[11px]"
                            />
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <a
                              href={`https://wa.me/91${ord.customer.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(ord.customer.name)},%20your%20Search,%20Social%20%26%20Systems%20book%20order%20(${ord.orderId})%20is%20${ord.status}!%20Tracking%20ID:%20${ord.trackingId}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold flex items-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Customer
                            </a>

                            <button
                              onClick={() => handleDeleteOrder(ord.orderId)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: EDIT WEBSITE CONTENT (CMS) */}
            {activeTab === 'CONTENT' && (
              <div className="space-y-6">
                
                {/* CMS Sub-navigation */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-mono">
                  <button
                    onClick={() => setContentSubTab('HERO_PRICING')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'HERO_PRICING' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Hero &amp; Pricing
                  </button>

                  <button
                    onClick={() => setContentSubTab('CHAPTERS')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'CHAPTERS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" /> 21 Chapters Roadmap ({chaptersList.length})
                  </button>

                  <button
                    onClick={() => setContentSubTab('REVIEWS')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'REVIEWS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400" /> Verified Reviews ({reviewsList.length})
                  </button>

                  <button
                    onClick={() => setContentSubTab('PERSONAS')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'PERSONAS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" /> Target Personas ({personasList.length})
                  </button>
                </div>

                {/* Save Feedback Banner */}
                {saveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-mono font-bold flex items-center justify-between gap-2 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{saveMessage || 'Website payment and content settings updated live!'}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-sans">
                      Live Preview Synced
                    </span>
                  </div>
                )}

                {/* SUB-TAB 1: HERO, PRICING & AUTHOR */}
                {contentSubTab === 'HERO_PRICING' && (
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                      <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" /> Hero &amp; Header Banner Settings
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="sm:col-span-2">
                          <label className="block text-slate-700 font-bold font-mono mb-1">
                            Main Hero Heading Title
                          </label>
                          <input
                            type="text"
                            value={settings.heroTitle || 'SEARCH, SOCIAL & SYSTEMS'}
                            onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-700 font-bold font-mono mb-1">
                            Hero Subtitle / Tagline
                          </label>
                          <input
                            type="text"
                            value={settings.heroSubtitle || ''}
                            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-700 font-bold font-mono mb-1">
                            Top Eyebrow Tagline
                          </label>
                          <input
                            type="text"
                            value={settings.tagline || ''}
                            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-700 font-bold font-mono mb-1">
                            Top Announcement Bar Banner Text
                          </label>
                          <textarea
                            rows={2}
                            value={settings.announcementText || ''}
                            onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-200 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                        <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-600" /> Book Offer Pricing &amp; Merchant UPI Payment Settings
                        </h3>

                        <button
                          type="button"
                          onClick={() => handleSaveSettings()}
                          disabled={isSavingSettings}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Payment &amp; Pricing Changes
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div>
                          <label className="block text-slate-800 font-bold font-mono mb-1">
                            Offer Price (₹ INR) *
                          </label>
                          <input
                            type="number"
                            required
                            value={settings.priceINR !== undefined ? settings.priceINR : 799}
                            onChange={(e) => setSettings({ ...settings, priceINR: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-800 font-bold font-mono mb-1">
                            Courier Shipping Charge (₹ INR) *
                          </label>
                          <input
                            type="number"
                            required
                            value={settings.shippingFeeINR !== undefined ? settings.shippingFeeINR : 49}
                            onChange={(e) => setSettings({ ...settings, shippingFeeINR: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
                            placeholder="e.g. 49"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-800 font-bold font-mono mb-1">
                            Original List Price (₹ INR) *
                          </label>
                          <input
                            type="number"
                            required
                            value={settings.originalPriceINR !== undefined ? settings.originalPriceINR : 1299}
                            onChange={(e) => setSettings({ ...settings, originalPriceINR: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-800 font-bold font-mono mb-1">
                            Official Merchant UPI VPA (for Dynamic QR &amp; Apps) *
                          </label>
                          <input
                            type="text"
                            required
                            value={settings.upiMerchantId || ''}
                            onChange={(e) => setSettings({ ...settings, upiMerchantId: e.target.value })}
                            placeholder="e.g. arungowtham@upi or 9787196806@upi"
                            className="w-full px-3.5 py-2.5 bg-white border border-blue-300 rounded-lg text-blue-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-800 font-bold font-mono mb-1">
                            Author WhatsApp Customer Support Phone *
                          </label>
                          <input
                            type="text"
                            required
                            value={settings.whatsappPhone || ''}
                            onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                            placeholder="e.g. 9787196806"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Live Generated QR Code Preview Box */}
                        <div className="sm:col-span-2 p-4 bg-white border border-blue-300 rounded-xl flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                          {adminQrUrl ? (
                            <img src={adminQrUrl} alt="Dynamic Admin UPI QR Preview" className="w-28 h-28 border-2 border-blue-600 rounded-lg p-1 bg-white shadow-sm" />
                          ) : (
                            <div className="w-28 h-28 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-mono text-[10px]">
                              Loading QR...
                            </div>
                          )}
                          <div className="space-y-1 text-xs text-slate-600 font-sans">
                            <div className="font-mono text-blue-900 font-bold flex items-center gap-1.5 text-xs">
                              <QrCode className="w-4 h-4 text-blue-600" /> Dynamic Live UPI QR Code Preview
                            </div>
                            <p className="text-[11px] leading-relaxed">
                              This QR code is generated dynamically using your entered VPA (<strong className="text-blue-900 font-mono">{settings.upiMerchantId || 'arungowtham@upi'}</strong>) and Total Price (<strong className="text-slate-900 font-mono">₹{(Number(settings.priceINR) || 799) + (settings.shippingFeeINR !== undefined ? Number(settings.shippingFeeINR) : 49)}</strong>).
                            </p>
                            <span className="inline-block text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              Auto-updates live as you edit UPI ID &amp; Pricing
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                      <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-purple-600" /> Author Profile &amp; Custom Photo URL
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div>
                          <label className="block text-slate-700 font-bold font-mono mb-1">
                            Author Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={settings.authorName || ''}
                            onChange={(e) => setSettings({ ...settings, authorName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold font-mono mb-1">
                            Author Title / Designation
                          </label>
                          <input
                            type="text"
                            value={settings.authorTitle || ''}
                            onChange={(e) => setSettings({ ...settings, authorTitle: e.target.value })}
                            placeholder="e.g. Digital Marketing Strategist & Author"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-700 font-bold font-mono mb-1">
                            Custom Author Photo Image URL (Optional)
                          </label>
                          <input
                            type="text"
                            value={settings.authorImageUrl || ''}
                            onChange={(e) => setSettings({ ...settings, authorImageUrl: e.target.value })}
                            placeholder="https://example.com/author-photo.jpg (Leave empty to use high-precision portrait illustration)"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">
                            Paste a direct image URL of the author holding the book, or leave blank to automatically display the vector portrait card.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSavingSettings}
                        className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" /> Save General &amp; Author Changes
                      </button>
                    </div>
                  </form>
                )}

                {/* SUB-TAB 2: 21-CHAPTER ROADMAP CMS */}
                {contentSubTab === 'CHAPTERS' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold font-serif text-slate-900">
                          Curriculum Chapters Roadmap CMS ({chaptersList.length} Chapters)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Add, edit, or remove book chapters. Changes apply instantly to the interactive syllabus inspector.
                        </p>
                      </div>

                      <button
                        onClick={handleAddChapter}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Chapter
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                      {chaptersList.map((ch, idx) => (
                        <div key={ch.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                            <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded text-[11px]">
                              Chapter #{ch.chapterNumber} ({ch.id})
                            </span>

                            <div className="flex items-center gap-2">
                              <select
                                value={ch.pillar}
                                onChange={(e) => handleUpdateChapter(idx, { pillar: e.target.value as any })}
                                className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[11px] font-bold text-slate-800"
                              >
                                <option value="SEARCH">SEARCH</option>
                                <option value="SOCIAL">SOCIAL</option>
                                <option value="SYSTEMS">SYSTEMS</option>
                              </select>

                              <button
                                onClick={() => handleDeleteChapter(ch.id)}
                                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                title="Remove Chapter"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Chapter Title
                              </label>
                              <input
                                type="text"
                                value={ch.title}
                                onChange={(e) => handleUpdateChapter(idx, { title: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Focus Badge Tag
                              </label>
                              <input
                                type="text"
                                value={ch.focusTag}
                                onChange={(e) => handleUpdateChapter(idx, { focusTag: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-[11px] focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Focus Goal Description
                              </label>
                              <input
                                type="text"
                                value={ch.focus}
                                onChange={(e) => handleUpdateChapter(idx, { focus: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Full Chapter Summary
                              </label>
                              <textarea
                                rows={2}
                                value={ch.summary}
                                onChange={(e) => handleUpdateChapter(idx, { summary: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: VERIFIED REVIEWS CMS */}
                {contentSubTab === 'REVIEWS' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold font-serif text-slate-900">
                          Reader Reviews CMS ({reviewsList.length} Reviews)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Manage reader feedback cards displayed on the homepage. Add new reader testimonials easily.
                        </p>
                      </div>

                      <button
                        onClick={handleAddReview}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Testimonial
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                      {reviewsList.map((rev, idx) => (
                        <div key={rev.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                            <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded text-[11px] flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {rev.rating} / 5 Rating
                            </span>

                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Author Name
                              </label>
                              <input
                                type="text"
                                value={rev.author}
                                onChange={(e) => handleUpdateReview(idx, { author: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Role / Title
                              </label>
                              <input
                                type="text"
                                value={rev.role}
                                onChange={(e) => handleUpdateReview(idx, { role: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Rating (1-5)
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={5}
                                value={rev.rating}
                                onChange={(e) => handleUpdateReview(idx, { rating: Number(e.target.value) })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Review Content / Testimonial Text
                              </label>
                              <textarea
                                rows={2}
                                value={rev.content}
                                onChange={(e) => handleUpdateReview(idx, { content: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 4: TARGET PERSONAS CMS */}
                {contentSubTab === 'PERSONAS' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold font-serif text-slate-900">
                          Target Persona Cards CMS ({personasList.length} Profiles)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Define target audience categories (Students, Founders, Freelancers, etc.) on the landing page.
                        </p>
                      </div>

                      <button
                        onClick={handleAddPersona}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold font-mono rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Persona
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                      {personasList.map((p, idx) => (
                        <div key={p.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                            <span className="font-mono font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded text-[11px]">
                              {p.badge || 'PERSONA'}
                            </span>

                            <button
                              onClick={() => handleDeletePersona(p.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete Persona"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={p.title}
                                onChange={(e) => handleUpdatePersona(idx, { title: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Category Tagline
                              </label>
                              <input
                                type="text"
                                value={p.category}
                                onChange={(e) => handleUpdatePersona(idx, { category: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-[11px] focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-slate-600 text-[10px] uppercase font-mono font-bold mb-1">
                                Short Description
                              </label>
                              <textarea
                                rows={2}
                                value={p.description}
                                onChange={(e) => handleUpdatePersona(idx, { description: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
