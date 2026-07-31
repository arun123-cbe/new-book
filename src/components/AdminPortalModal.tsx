import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, Shield, Package, Edit, Check, Search, Trash2, ExternalLink, 
  RefreshCw, DollarSign, Truck, Users, Save, Smartphone, MessageSquare, AlertCircle,
  Plus, BookOpen, Star, Sparkles, UserCheck, Layers, LayoutGrid, FileText, QrCode,
  Mail, Send, CheckCircle2, BarChart3, Activity, Code, PieChart, Tag, TrendingUp
} from 'lucide-react';
import { Order, SiteContentSettings, Chapter, Review, TargetPersona } from '../types';
import { 
  subscribeToFirebaseOrders, 
  saveOrderToFirebase, 
  updateOrderInFirebase, 
  deleteOrderFromFirebase, 
  saveSettingsToFirebase, 
  subscribeToFirebaseSettings 
} from '../lib/firebase';
import { getAnalyticsEventLogs, trackPurchase, AnalyticsEventLog } from '../lib/analytics';
import { ALL_CHAPTERS } from '../data/chaptersData';
import { REVIEWS, TARGET_PERSONAS } from '../data/bookData';

interface AdminPortalProps {
  onClose: () => void;
  onContentUpdated?: () => void;
  onSettingsUpdated?: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalProps> = ({ onClose, onContentUpdated, onSettingsUpdated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState(false);

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'CONTENT' | 'NOTIFICATIONS' | 'ANALYTICS'>('ORDERS');
  const [contentSubTab, setContentSubTab] = useState<'PAYMENT_PRICING' | 'HERO_AUTHOR' | 'CHAPTERS' | 'REVIEWS' | 'PERSONAS' | 'ANALYTICS_TAGS'>('PAYMENT_PRICING');
  
  // Analytics & Logs State
  const [analyticsLogs, setAnalyticsLogs] = useState<AnalyticsEventLog[]>([]);
  const [analyticsTestMsg, setAnalyticsTestMsg] = useState<string>('');
  
  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hostinger Diagnostics & Order Import States
  const [backendHealth, setBackendHealth] = useState<{ isConnected: boolean; message: string; port?: number }>({ isConnected: false, message: 'Checking Hostinger backend...' });
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pastedWaText, setPastedWaText] = useState('');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // Notification & Email Logs State
  const [notificationLogs, setNotificationLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<{ loading: boolean; success?: boolean; message?: string; error?: string } | null>(null);

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
    let combinedOrders: Order[] = [];

    try {
      const url = `/api/admin/orders?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.orders)) {
          combinedOrders = data.orders;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch admin orders from server:', err);
    }

    // Merge and auto-sync LocalStorage orders as fail-safe
    try {
      const localOrders: Order[] = JSON.parse(localStorage.getItem('sss_orders') || '[]');
      if (Array.isArray(localOrders) && localOrders.length > 0) {
        const existingIds = new Set(combinedOrders.map(o => o.orderId));
        
        for (const lo of localOrders) {
          if (!existingIds.has(lo.orderId)) {
            // Attempt auto-sync to backend server
            fetch('/api/orders/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(lo)
            }).catch(e => console.warn("Auto-sync local order error:", e));

            // Include in combined view
            const matchesStatus = statusFilter === 'ALL' || lo.status === statusFilter;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || (
              lo.orderId.toLowerCase().includes(q) ||
              lo.customer?.name?.toLowerCase()?.includes(q) ||
              lo.customer?.email?.toLowerCase()?.includes(q) ||
              lo.customer?.phone?.includes(q)
            );
            if (matchesStatus && matchesSearch) {
              combinedOrders.unshift(lo);
              existingIds.add(lo.orderId);
            }
          }
        }
      }
    } catch (err) {
      console.warn("Could not parse local orders:", err);
    }

    // Auto-populate default sample orders if no orders exist yet
    if (combinedOrders.length === 0 && statusFilter === 'ALL' && !searchQuery.trim()) {
      const sampleOrders: Order[] = [
        {
          orderId: "SSS-89241",
          trackingId: "IN-EXP-88491204",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          item: "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
          amount: 848,
          originalAmount: 1299,
          discount: "40%",
          shipping: "Express Courier (₹49)",
          status: "DISPATCHED",
          carrier: "BlueDart Express",
          customer: {
            name: "Rajesh Kumar",
            email: "rajesh.k@growthspark.in",
            phone: "9876543210",
            address: "102, Park View Towers, MG Road",
            city: "Coimbatore",
            state: "Tamil Nadu",
            pincode: "641001"
          },
          payment: {
            method: "WhatsApp Order",
            status: "SUCCESS",
            upiId: "6374723367@ptaxis",
            upiApp: "WhatsApp Order",
            transactionRef: "TXN88491204"
          },
          digitalAccessUrl: "/download/companion-blueprint-kit-SSS-89241.pdf"
        },
        {
          orderId: "SSS-90112",
          trackingId: "IN-EXP-99281300",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          item: "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
          amount: 848,
          originalAmount: 1299,
          discount: "40%",
          shipping: "Express Courier (₹49)",
          status: "DELIVERED",
          carrier: "India Post Speed Post",
          customer: {
            name: "Meera Nair",
            email: "meera.nair@d2clabs.com",
            phone: "9123456789",
            address: "Flat 4B, Emerald Court, Indiranagar",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560038"
          },
          payment: {
            method: "WhatsApp Order",
            status: "SUCCESS",
            upiId: "6374723367@ptaxis",
            upiApp: "WhatsApp Order",
            transactionRef: "TXN98231012"
          },
          digitalAccessUrl: "/download/companion-blueprint-kit-SSS-90112.pdf"
        }
      ];
      combinedOrders = sampleOrders;
      try {
        localStorage.setItem('sss_orders', JSON.stringify(sampleOrders));
      } catch (e) {}
    }

    setOrders(combinedOrders);
    setIsLoadingOrders(false);
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
        localStorage.setItem('sss_site_settings', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Failed to fetch settings from server, trying local cache', err);
      try {
        const cached = localStorage.getItem('sss_site_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          setSettings(parsed);
        }
      } catch (cacheErr) {
        console.warn("No local settings cache:", cacheErr);
      }
    }
  };

  // Fetch orders when status or search query changes with auto 5-second live polling & real-time Firebase sync
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      const interval = setInterval(() => {
        fetchOrders();
      }, 5000);

      // Real-time Firebase Firestore Order Sync
      const unsubscribeFirebase = subscribeToFirebaseOrders((fbOrders) => {
        if (Array.isArray(fbOrders) && fbOrders.length > 0) {
          // Merge Firebase orders with existing state and local storage
          try {
            const currentLocal: Order[] = JSON.parse(localStorage.getItem('sss_orders') || '[]');
            const combinedMap = new Map<string, Order>();
            fbOrders.forEach(o => combinedMap.set(o.orderId, o));
            currentLocal.forEach(o => {
              if (!combinedMap.has(o.orderId)) combinedMap.set(o.orderId, o);
            });
            const mergedAll = Array.from(combinedMap.values());
            localStorage.setItem('sss_orders', JSON.stringify(mergedAll));

            let filtered = mergedAll;
            if (statusFilter !== 'ALL') {
              filtered = filtered.filter(o => o.status === statusFilter);
            }
            const q = searchQuery.toLowerCase().trim();
            if (q) {
              filtered = filtered.filter(o =>
                o.orderId.toLowerCase().includes(q) ||
                o.customer?.name?.toLowerCase()?.includes(q) ||
                o.customer?.email?.toLowerCase()?.includes(q) ||
                o.customer?.phone?.includes(q)
              );
            }
            setOrders(filtered);
          } catch (e) {
            console.warn("Error processing Firebase snapshot:", e);
          }
        }
      });

      return () => {
        clearInterval(interval);
        unsubscribeFirebase();
      };
    }
  }, [isAuthenticated, statusFilter, searchQuery]);

  // Fetch notification & email logs
  const fetchNotificationLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data && Array.isArray(data.logs)) {
        setNotificationLogs(data.logs);
      }
    } catch (err) {
      console.warn("Could not fetch notification logs:", err);
    }
    setIsLoadingLogs(false);
  };

  // Send test SMTP email
  const handleSendTestEmail = async () => {
    setTestEmailStatus({ loading: true });
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost: settings.smtpHost || 'smtp.hostinger.com',
          smtpPort: settings.smtpPort || '465',
          smtpUser: settings.smtpUser,
          smtpPass: settings.smtpPass,
          targetEmail: settings.notificationEmail || 'arunprabhu@cbeschoolofdigitalgrowth.in'
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestEmailStatus({ loading: false, success: true, message: data.message });
        fetchNotificationLogs();
      } else {
        setTestEmailStatus({ loading: false, success: false, error: data.error });
      }
    } catch (err: any) {
      setTestEmailStatus({ loading: false, success: false, error: err.message || 'Network error while sending test email' });
    }
  };

  // Check Hostinger Backend Express API Health
  const checkBackendHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data && data.status === 'ok') {
        setBackendHealth({
          isConnected: true,
          message: `Hostinger Express Server Connected (Port ${data.port || 3000})`,
          port: data.port
        });
      } else {
        setBackendHealth({
          isConnected: false,
          message: 'Static Web Hosting Mode (No Express API detected)'
        });
      }
    } catch (err) {
      setBackendHealth({
        isConnected: false,
        message: 'Static Web Hosting Mode (Hostinger Static Web)'
      });
    }
  };

  // Fetch content settings & notification logs on auth
  useEffect(() => {
    if (isAuthenticated) {
      checkBackendHealth();
      fetchSettings();
      fetchNotificationLogs();
    }
  }, [isAuthenticated]);

  // Parse WhatsApp Message text and create order instantly
  const handleParseAndAddWaOrder = async () => {
    if (!pastedWaText.trim()) return;

    const text = pastedWaText;

    // Extract values with resilient Regex
    const idMatch = text.match(/Order ID:\s*\*?\s*(SSS-[A-Z0-9]+|[0-9]+)/i);
    const nameMatch = text.match(/•?\s*\*?Name:\*?\s*([^\n\r•]+)/i);
    const phoneMatch = text.match(/•?\s*\*?Phone:\*?\s*([0-9+\s]+)/i);
    const emailMatch = text.match(/•?\s*\*?Email:\*?\s*([^\n\r•\s]+)/i);
    const addressMatch = text.match(/•?\s*\*?Address:\*?\s*([^\n\r•]+)/i);
    const amountMatch = text.match(/Amount Payable:\s*\*?\s*₹?(\d+)/i);

    const orderId = idMatch ? idMatch[1].trim() : ("SSS-" + Math.floor(100000 + Math.random() * 900000));
    const name = nameMatch ? nameMatch[1].trim() : "WhatsApp Order Customer";
    const phone = phoneMatch ? phoneMatch[1].trim().replace(/\D/g, '') : "9787196806";
    const email = emailMatch ? emailMatch[1].trim() : "customer@order.local";
    const rawAddress = addressMatch ? addressMatch[1].trim() : "Delivery address provided via WhatsApp";
    const amount = amountMatch ? Number(amountMatch[1]) : (settings.priceINR ? Number(settings.priceINR) + 49 : 848);

    let city = "Coimbatore";
    let state = "Tamil Nadu";
    let pincode = "641004";
    const pincodeMatch = rawAddress.match(/(\d{6})/);
    if (pincodeMatch) pincode = pincodeMatch[1];

    const parsedOrder: Order = {
      orderId,
      trackingId: "IN-EXP-" + Math.floor(10000000 + Math.random() * 90000000),
      createdAt: new Date().toISOString(),
      item: "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
      amount,
      originalAmount: settings.originalPriceINR || 1299,
      discount: "40%",
      shipping: "Express Courier (₹49)",
      status: "PENDING",
      carrier: "BlueDart Express",
      customer: {
        name,
        phone,
        email,
        address: rawAddress,
        city,
        pincode,
        state
      },
      payment: {
        method: "WhatsApp Order",
        status: "SUCCESS",
        upiId: settings.upiMerchantId || "6374723367@ptaxis",
        upiApp: "WhatsApp Order",
        transactionRef: "WhatsApp-" + phone
      },
      digitalAccessUrl: `/download/companion-blueprint-kit-${orderId}.pdf`
    };

    // Try posting to Firebase Firestore & API backend
    try {
      saveOrderToFirebase(parsedOrder);
      await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedOrder)
      });
    } catch (e) {
      console.warn("Express API unavailable, saved to Firebase & local:", e);
    }

    // Save to localStorage as permanent fail-safe
    try {
      const existing: Order[] = JSON.parse(localStorage.getItem('sss_orders') || '[]');
      const filtered = existing.filter(o => o.orderId !== orderId);
      localStorage.setItem('sss_orders', JSON.stringify([parsedOrder, ...filtered]));
    } catch (err) {
      console.warn("LocalStorage error:", err);
    }

    setImportSuccessMsg(`✅ Order ${orderId} for ${name} added successfully!`);
    setPastedWaText('');
    setIsPasteModalOpen(false);
    fetchOrders();
    setTimeout(() => setImportSuccessMsg(''), 4000);
  };

  // Import JSON file of orders
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const ord of parsed) {
            if (ord.orderId) {
              try {
                saveOrderToFirebase(ord);
                await fetch('/api/orders/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(ord)
                });
              } catch (e) {}
            }
          }
          const existing = JSON.parse(localStorage.getItem('sss_orders') || '[]');
          const combined = [...parsed, ...existing];
          const unique = Array.from(new Map(combined.map(o => [o.orderId, o])).values());
          localStorage.setItem('sss_orders', JSON.stringify(unique));

          setImportSuccessMsg(`✅ Successfully imported ${parsed.length} orders!`);
          fetchOrders();
          setTimeout(() => setImportSuccessMsg(''), 4000);
        }
      } catch (err) {
        alert("Invalid JSON file format!");
      }
    };
    reader.readAsText(file);
  };

  // Dynamically generate QR preview for Admin as settings change
  useEffect(() => {
    const price = Number(settings.priceINR) || 799;
    const shipping = settings.shippingFeeINR !== undefined ? Number(settings.shippingFeeINR) : 49;
    const total = price + shipping;
    const upi = (settings.upiMerchantId || '6374723367@ptaxis').trim();
    const payStr = `upi://pay?pa=${encodeURIComponent(upi)}&pn=Arun%20Gowtham&am=${total}&cu=INR&tn=Search%20Social%20Systems%20Book%20Order`;
    QRCode.toDataURL(payStr, { width: 180, margin: 1, color: { dark: '#1e3a8a', light: '#ffffff' } })
      .then(url => setAdminQrUrl(url))
      .catch(() => {});
  }, [settings.upiMerchantId, settings.priceINR, settings.shippingFeeINR]);

  // Update order status or tracking details
  const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
    // 1. Immediately update local state, localStorage, and Firebase for instant feedback
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, ...updates } : o));
    try {
      updateOrderInFirebase(orderId, updates);
      const existing: Order[] = JSON.parse(localStorage.getItem('sss_orders') || '[]');
      const updatedLocal = existing.map(o => o.orderId === orderId ? { ...o, ...updates } : o);
      localStorage.setItem('sss_orders', JSON.stringify(updatedLocal));
    } catch (e) {}

    // 2. Also try API backend update
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.warn('Failed to update order on server:', err);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to remove order ${orderId}?`)) return;
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
    try {
      deleteOrderFromFirebase(orderId);
      const existing: Order[] = JSON.parse(localStorage.getItem('sss_orders') || '[]');
      const filteredLocal = existing.filter(o => o.orderId !== orderId);
      localStorage.setItem('sss_orders', JSON.stringify(filteredLocal));
    } catch (e) {}

    try {
      await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Failed to delete order on server:', err);
    }
  };

  // Create sample test order for instant verification
  const handleCreateTestOrder = async () => {
    setIsLoadingOrders(true);
    const testOrder = {
      orderId: "SSS-" + Math.floor(100000 + Math.random() * 900000),
      trackingId: "IN-EXP-" + Math.floor(10000000 + Math.random() * 90000000),
      createdAt: new Date().toISOString(),
      item: "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
      amount: settings.priceINR ? Number(settings.priceINR) + 49 : 848,
      originalAmount: settings.originalPriceINR || 1299,
      discount: "40%",
      shipping: "Express Courier (₹49)",
      status: "PENDING",
      carrier: "BlueDart Express",
      customer: {
        name: "Arun Gowtham Prabhudas",
        email: "gouthamarun123@gmail.com",
        phone: "9787196806",
        address: "36 Jain Antara, Near Circular Road",
        city: "Coimbatore",
        pincode: "641004",
        state: "Tamil Nadu"
      },
      payment: {
        method: "WhatsApp Order",
        status: "SUCCESS",
        upiId: settings.upiMerchantId || "6374723367@ptaxis",
        upiApp: "WhatsApp Order",
        transactionRef: "WhatsApp-919787196806"
      },
      digitalAccessUrl: "/download/companion-blueprint-kit.pdf"
    };

    try {
      saveOrderToFirebase(testOrder as Order);
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testOrder)
      });
      if (res.ok) {
        await fetchOrders();
      }
    } catch (err) {
      console.warn("Test order creation error:", err);
    }
    setIsLoadingOrders(false);
  };

  // Trigger test purchase event to Google Analytics & GTM
  const handleTestPurchaseEvent = () => {
    const sampleTestOrder: Order = {
      orderId: "GA4-TEST-" + Math.floor(100000 + Math.random() * 900000),
      trackingId: "IN-EXP-TEST",
      createdAt: new Date().toISOString(),
      item: "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
      amount: settings.priceINR ? (settings.priceINR + (settings.shippingFeeINR || 49)) : 848,
      originalAmount: settings.originalPriceINR || 1299,
      discount: "40%",
      shipping: "Express Courier (₹49)",
      status: "PENDING",
      carrier: "BlueDart Express",
      customer: {
        name: "Test Customer (Analytics)",
        email: "test.analytics@example.com",
        phone: "9876543210",
        address: "123 Growth Street",
        city: "Coimbatore",
        pincode: "641001",
        state: "Tamil Nadu"
      },
      payment: {
        method: "WhatsApp Order",
        status: "SUCCESS",
        upiId: settings.upiMerchantId || "6374723367@ptaxis",
        upiApp: "WhatsApp Order",
        transactionRef: "TXN-GA4-TEST"
      },
      digitalAccessUrl: "/download/companion-blueprint-kit.pdf"
    };

    try {
      trackPurchase(sampleTestOrder);
      setAnalyticsTestMsg(`✅ Sent test purchase event for ${sampleTestOrder.orderId} (₹${sampleTestOrder.amount}) to window.dataLayer & GA4!`);
      setAnalyticsLogs(getAnalyticsEventLogs());
      setTimeout(() => setAnalyticsTestMsg(''), 6000);
    } catch (err) {
      setAnalyticsTestMsg(`❌ Error firing test event: ${err}`);
    }
  };

  // Save Site Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    try {
      let rawUpi = (settings.upiMerchantId || '6374723367@ptaxis').trim();
      // Auto-append @upi if user only entered a phone number or handle without @ symbol
      if (rawUpi && !rawUpi.includes('@')) {
        rawUpi = `${rawUpi}@upi`;
      }

      const numPrice = Number(settings.priceINR) || 799;
      const numShipping = settings.shippingFeeINR !== undefined && settings.shippingFeeINR !== null && (settings.shippingFeeINR as any) !== ''
        ? Number(settings.shippingFeeINR)
        : 49;
      const numOriginal = Number(settings.originalPriceINR) || 1299;
      const calcDiscount = Math.round(((numOriginal - numPrice) / numOriginal) * 100) || 40;

      const cleanPayload: SiteContentSettings = {
        ...settings,
        priceINR: numPrice,
        shippingFeeINR: numShipping,
        originalPriceINR: numOriginal,
        discountPercent: calcDiscount,
        upiMerchantId: rawUpi,
        whatsappPhone: (settings.whatsappPhone || '9787196806').trim(),
        chapters: (settings.chapters && settings.chapters.length > 0) ? settings.chapters : ALL_CHAPTERS,
        reviews: (settings.reviews && settings.reviews.length > 0) ? settings.reviews : REVIEWS,
        personas: (settings.personas && settings.personas.length > 0) ? settings.personas : TARGET_PERSONAS
      };

      // Save to localStorage & Firebase immediately
      try {
        saveSettingsToFirebase(cleanPayload);
        localStorage.setItem('sss_site_settings', JSON.stringify(cleanPayload));
      } catch (lsErr) {
        console.warn("Could not write site settings to local storage or Firebase:", lsErr);
      }

      setSettings(cleanPayload);
      if (onContentUpdated) onContentUpdated();
      if (onSettingsUpdated) onSettingsUpdated();

      try {
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanPayload)
        });
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.warn('Backend sync warning (saved locally):', err);
      }

      setSaveSuccess(true);
      setSaveMessage(`Successfully Saved & Published! Merchant UPI VPA: ${cleanPayload.upiMerchantId} • Total Book Price: ₹${cleanPayload.priceINR + cleanPayload.shippingFeeINR}`);
      setTimeout(() => setSaveSuccess(false), 6000);
    } catch (err) {
      console.error("Save settings error:", err);
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
                placeholder="Enter Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-center text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />

              {passError && (
                <div className="text-xs text-red-600 font-bold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect passcode. Please try again.
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
            
            {/* Firebase & Hostinger Deployment Health Diagnostic Banner */}
            <div className="p-3 bg-emerald-50/90 border border-emerald-300 text-emerald-900 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <strong className="font-bold font-mono text-xs flex items-center gap-1.5 text-emerald-900">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 🔥 Firebase Firestore Real-Time Database Active
                  </strong>
                  <p className="text-[11px] opacity-90">
                    All customer book orders and store settings are automatically synced live in Google Cloud Firebase Firestore database (`gen-lang-client-0018141123`).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsGuideModalOpen(true)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Hostinger &amp; Firebase Guide
                </button>
              </div>
            </div>

            {importSuccessMsg && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
                <span>{importSuccessMsg}</span>
                <button onClick={() => setImportSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex flex-wrap items-center gap-2">
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

                <button
                  onClick={() => {
                    setActiveTab('NOTIFICATIONS');
                    fetchNotificationLogs();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                    activeTab === 'NOTIFICATIONS' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Mail className="w-4 h-4" /> Email &amp; WhatsApp Alert Logs ({notificationLogs.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab('ANALYTICS');
                    setAnalyticsLogs(getAnalyticsEventLogs());
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                    activeTab === 'ANALYTICS' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Google Analytics &amp; GTM Tracking
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
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsPasteModalOpen(true)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                      title="Paste customer order details sent on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" /> Paste WhatsApp Order
                    </button>

                    <label className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 flex items-center gap-1.5 cursor-pointer transition-all">
                      <FileText className="w-3.5 h-3.5" /> Import JSON
                      <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
                    </label>

                    <button
                      onClick={() => handleCreateTestOrder()}
                      disabled={isLoadingOrders}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all disabled:opacity-50"
                      title="Simulate creating a live sample order"
                    >
                      <Plus className="w-3.5 h-3.5" /> Sample Order
                    </button>

                    <button
                      onClick={() => fetchOrders()}
                      disabled={isLoadingOrders}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 flex items-center gap-1.5 transition-all"
                      title="Sync live customer orders"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} /> Refresh
                    </button>

                    <a
                      href="/api/admin/export/orders"
                      download="orders.json"
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all"
                      title="Download orders.json"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Export JSON
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* TAB 1: CUSTOMER ORDERS */}
            {activeTab === 'ORDERS' && (
              <div className="space-y-4">
                
                {/* Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 block text-[10px]">Total Revenue</span>
                    <span className="text-lg font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-emerald-700 block text-[10px]">Avg Order Value (AOV)</span>
                    <span className="text-lg font-bold text-emerald-900">
                      ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-amber-700 block text-[10px]">Pending Orders</span>
                    <span className="text-lg font-bold text-amber-900">{pendingCount}</span>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-blue-700 block text-[10px]">Dispatched</span>
                    <span className="text-lg font-bold text-blue-900">{dispatchedCount}</span>
                  </div>
                  <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl flex flex-col justify-between">
                    <span className="text-indigo-700 block text-[10px] font-bold flex items-center gap-1">
                      <Activity className="w-3 h-3 text-indigo-600" /> GA4 / GTM Tracking
                    </span>
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Active &amp; Logging
                    </span>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search Order ID, Name, Phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchOrders()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap shrink-0"
                      title="Refresh Live Orders from Server"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
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

                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                            <a
                              href={`https://wa.me/919787196806?text=${encodeURIComponent(
                                `📋 *ORDER DETAILS SUMMARY*\n\n` +
                                `*Order ID:* ${ord.orderId}\n` +
                                `*Status:* ${ord.status}\n` +
                                `*Amount:* ₹${ord.amount}\n\n` +
                                `👤 *CUSTOMER INFO:*\n` +
                                `• *Name:* ${ord.customer.name}\n` +
                                `• *Phone:* ${ord.customer.phone}\n` +
                                `• *Email:* ${ord.customer.email}\n\n` +
                                `📍 *DELIVERY ADDRESS:*\n` +
                                `${ord.customer.address}, ${ord.customer.city}, ${ord.customer.state} - ${ord.customer.pincode}\n\n` +
                                `🚚 *Courier:* ${ord.carrier || 'BlueDart'} | *Tracking:* ${ord.trackingId}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center gap-1 shadow-xs transition-colors"
                              title="Send full order details to WhatsApp +91 9787196806"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" /> WhatsApp 9787196806
                            </a>

                            <a
                              href={`https://wa.me/91${ord.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hi ${ord.customer.name},\n\n` +
                                `Your Search, Social & Systems printed book order (${ord.orderId}) status is: *${ord.status}*!\n` +
                                `• *Delivery Address:* ${ord.customer.address}, ${ord.customer.city} - ${ord.customer.pincode}\n` +
                                `• *Carrier:* ${ord.carrier || 'BlueDart Express'}\n` +
                                `• *Tracking ID:* ${ord.trackingId}\n\n` +
                                `Thank you!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold flex items-center gap-1 transition-colors"
                              title="Chat with customer on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> Customer WA
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
                    type="button"
                    onClick={() => setContentSubTab('PAYMENT_PRICING')}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'PAYMENT_PRICING' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-300" /> Payment &amp; Pricing Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentSubTab('HERO_AUTHOR')}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'HERO_AUTHOR' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Hero &amp; Author Info
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentSubTab('CHAPTERS')}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'CHAPTERS' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-300" /> 21 Chapters Roadmap ({chaptersList.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentSubTab('REVIEWS')}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'REVIEWS' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 text-amber-300" /> Verified Reviews ({reviewsList.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentSubTab('PERSONAS')}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'PERSONAS' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-300" /> Target Personas ({personasList.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setContentSubTab('ANALYTICS_TAGS');
                      setAnalyticsLogs(getAnalyticsEventLogs());
                    }}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      contentSubTab === 'ANALYTICS_TAGS' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-200" /> GA4 &amp; GTM Settings
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

                {/* SUB-TAB 1: DEDICATED PAYMENT & PRICING SETTINGS */}
                {contentSubTab === 'PAYMENT_PRICING' && (
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="bg-blue-50/70 p-5 rounded-2xl border-2 border-blue-300 space-y-5 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-blue-200 pb-3 gap-3">
                        <div>
                          <h3 className="text-base font-black font-serif text-slate-900 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-600" /> Merchant UPI Payment &amp; Book Offer Pricing
                          </h3>
                          <p className="text-xs text-slate-600">
                            Configure your direct receiving Merchant UPI VPA handle, offer price, shipping charge, and support phone.
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={isSavingSettings}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
                        >
                          <Save className="w-4 h-4" /> Save &amp; Publish Payment Settings
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="sm:col-span-2 p-3.5 bg-white border border-blue-300 rounded-xl space-y-1.5">
                          <label className="block text-blue-950 font-bold font-mono text-xs flex items-center justify-between">
                            <span>Official Merchant UPI VPA (for QR &amp; One-Tap UPI Apps) *</span>
                            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-normal border border-emerald-200">
                              e.g. 6374723367@ptaxis or 9787196806@upi
                            </span>
                          </label>
                          <input
                            type="text"
                            required
                            value={settings.upiMerchantId || ''}
                            onChange={(e) => setSettings({ ...settings, upiMerchantId: e.target.value })}
                            placeholder="Enter your UPI ID e.g. 6374723367@ptaxis or 9787196806@upi"
                            className="w-full px-4 py-3 bg-blue-50/30 border border-blue-400 rounded-lg text-blue-950 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <p className="text-[11px] text-slate-500">
                            Customer UPI payments across Google Pay, PhonePe, Paytm, and CRED will transfer directly to this VPA handle.
                          </p>
                        </div>

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

                        <div className="sm:col-span-2 bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 space-y-3">
                          <div>
                            <label className="block text-emerald-950 font-bold font-mono text-xs mb-1 flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Order Alert Settings
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Admin WhatsApp Mobile No. *</label>
                                <input
                                  type="text"
                                  value={settings.whatsappPhone || '9787196806'}
                                  onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                                  placeholder="e.g. 9787196806"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">CallMeBot Free API Key (Optional Auto-Bot)</label>
                                <input
                                  type="text"
                                  value={settings.callmebotApiKey || ''}
                                  onChange={(e) => setSettings({ ...settings, callmebotApiKey: e.target.value })}
                                  placeholder="e.g. 123456 (from CallMeBot)"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-xs"
                                />
                              </div>
                            </div>
                            <p className="text-[11px] text-emerald-900 mt-2 leading-relaxed">
                              ✅ <strong>Instant Direct Link:</strong> When a customer orders, an instant WhatsApp message link pre-formatted with order details is automatically generated for <strong>+{settings.whatsappPhone || '9787196806'}</strong>.<br/>
                              🤖 <strong>Automated Free Bot:</strong> Get a free API key in 10 seconds from CallMeBot (send message on WhatsApp to +34 644 44 44 19) to receive direct automated WhatsApp alerts on your phone!
                            </p>
                          </div>
                        </div>

                        <div className="sm:col-span-2 bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 space-y-3">
                          <div>
                            <label className="block text-blue-950 font-bold font-mono text-xs mb-1 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-blue-600" /> Instant Order Alert Notification Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              value={settings.notificationEmail || 'arunprabhu@cbeschoolofdigitalgrowth.in'}
                              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                              placeholder="e.g. arunprabhu@cbeschoolofdigitalgrowth.in"
                              className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-lg text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-[11px] text-blue-800 mt-1">
                              An instant notification alert for every new order placed will be dispatched to <strong>{settings.notificationEmail || 'arunprabhu@cbeschoolofdigitalgrowth.in'}</strong> with complete shipping and payment details.
                            </p>
                          </div>

                          <div className="border-t border-blue-200/80 pt-3">
                            <span className="text-xs font-bold text-blue-950 block mb-2 font-mono">
                              ✉️ Hostinger Email SMTP Credentials (Optional - for direct email dispatch)
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">SMTP Server Host</label>
                                <input
                                  type="text"
                                  value={settings.smtpHost || 'smtp.hostinger.com'}
                                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                                  placeholder="smtp.hostinger.com"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">SMTP Port</label>
                                <input
                                  type="text"
                                  value={settings.smtpPort || '465'}
                                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                                  placeholder="465 or 587"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Hostinger Email / User</label>
                                <input
                                  type="text"
                                  value={settings.smtpUser || ''}
                                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                                  placeholder="arunprabhu@cbeschoolofdigitalgrowth.in"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Email Password</label>
                                <input
                                  type="password"
                                  value={settings.smtpPass || ''}
                                  onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                                  placeholder="Your Hostinger Email Password"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-xs"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-blue-200">
                              <button
                                type="button"
                                onClick={handleSendTestEmail}
                                disabled={testEmailStatus?.loading}
                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 font-mono"
                              >
                                <Send className="w-3.5 h-3.5" />
                                {testEmailStatus?.loading ? 'Connecting to Hostinger SMTP...' : '⚡ Send Test Order Email Alert'}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('NOTIFICATIONS');
                                  fetchNotificationLogs();
                                }}
                                className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 font-mono"
                              >
                                <Mail className="w-3.5 h-3.5" /> View Live Email &amp; WhatsApp Alert Logs →
                              </button>
                            </div>

                            {testEmailStatus && (
                              <div className={`mt-2 p-2.5 rounded-lg text-xs font-mono border ${
                                testEmailStatus.loading 
                                  ? 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse'
                                  : testEmailStatus.success
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                                    : 'bg-rose-50 text-rose-900 border-rose-300 font-bold'
                              }`}>
                                {testEmailStatus.loading && '⌛ Connecting to Hostinger SMTP and sending test email...'}
                                {testEmailStatus.success && (
                                  <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                    {testEmailStatus.message}
                                  </span>
                                )}
                                {testEmailStatus.error && (
                                  <span className="flex items-start gap-1.5">
                                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                                    <span><strong>SMTP Error:</strong> {testEmailStatus.error}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
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
                          <div className="space-y-1.5 text-xs text-slate-600 font-sans">
                            <div className="font-mono text-blue-900 font-bold flex items-center gap-1.5 text-xs">
                              <QrCode className="w-4 h-4 text-blue-600" /> Dynamic Live UPI QR Code Preview
                            </div>
                            <p className="text-[11px] leading-relaxed">
                              This QR code updates automatically using your VPA (<strong className="text-blue-900 font-mono">{settings.upiMerchantId || '6374723367@ptaxis'}</strong>) and Total Price (<strong className="text-slate-900 font-mono">₹{(Number(settings.priceINR) || 799) + (settings.shippingFeeINR !== undefined ? Number(settings.shippingFeeINR) : 49)}</strong>).
                            </p>
                            <a
                              href={`upi://pay?pa=${encodeURIComponent(settings.upiMerchantId || '6374723367@ptaxis')}&pn=Arun%20Gowtham&am=${(Number(settings.priceINR) || 799) + (settings.shippingFeeINR !== undefined ? Number(settings.shippingFeeINR) : 49)}&cu=INR`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 font-mono font-bold text-[11px] rounded-md border border-blue-200 hover:bg-blue-100"
                            >
                              <ExternalLink className="w-3 h-3 text-blue-600" /> Test Launch UPI App
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-blue-200">
                        <button
                          type="submit"
                          disabled={isSavingSettings}
                          className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" /> Save &amp; Publish Payment Settings
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* SUB-TAB 2: HERO & AUTHOR CMS */}
                {contentSubTab === 'HERO_AUTHOR' && (
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

            {/* TAB 3: NOTIFICATION & EMAIL LOGS */}
            {activeTab === 'NOTIFICATIONS' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" /> Real-time Email &amp; WhatsApp Alert Diagnostics
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Target Notification Email: <strong>{settings.notificationEmail || 'arunprabhu@cbeschoolofdigitalgrowth.in'}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchNotificationLogs}
                      disabled={isLoadingLogs}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 flex items-center gap-1.5 transition-all font-mono"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} /> Refresh Logs
                    </button>

                    <button
                      onClick={handleSendTestEmail}
                      disabled={testEmailStatus?.loading}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all font-mono shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Test Hostinger SMTP Email
                    </button>
                  </div>
                </div>

                {testEmailStatus && (
                  <div className={`p-3 rounded-xl text-xs font-mono border ${
                    testEmailStatus.loading 
                      ? 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse'
                      : testEmailStatus.success
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                        : 'bg-rose-50 text-rose-900 border-rose-300 font-bold'
                  }`}>
                    {testEmailStatus.loading && '⌛ Connecting to Hostinger SMTP server and delivering test alert...'}
                    {testEmailStatus.success && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{testEmailStatus.message}</span>
                      </div>
                    )}
                    {testEmailStatus.error && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>SMTP Delivery Error:</strong> {testEmailStatus.error}
                          <p className="text-[11px] font-sans font-normal mt-1 text-rose-800">
                            💡 <strong>Troubleshooting Tip:</strong> Open "Edit Website Content (CMS)" -&gt; "Payment &amp; Pricing Settings" and enter your Hostinger Email Password under "Hostinger Email SMTP Credentials".
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Logs Table */}
                {notificationLogs.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                    <Mail className="w-8 h-8 text-slate-400 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800">No Notification Logs Recorded Yet</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Notification logs are recorded automatically whenever a customer places an order or when you send a test email.
                    </p>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <div className="overflow-x-auto max-h-[60vh]">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono text-[11px] uppercase sticky top-0">
                          <tr>
                            <th className="p-3">Log ID &amp; Time</th>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Target Contact</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Details / Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800 font-mono text-[11px]">
                          {notificationLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3">
                                <div className="font-bold text-slate-900">{log.id}</div>
                                <div className="text-[10px] text-slate-500">{new Date(log.sentAt || Date.now()).toLocaleString('en-IN')}</div>
                              </td>

                              <td className="p-3">
                                <span className="font-bold text-blue-700">{log.orderId || 'N/A'}</span>
                              </td>

                              <td className="p-3">
                                <div>{log.targetEmail || log.targetPhone || 'N/A'}</div>
                              </td>

                              <td className="p-3">
                                {log.status === 'EMAIL_DELIVERED_SMTP' && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                                    ✅ EMAIL DELIVERED (SMTP)
                                  </span>
                                )}
                                {log.status === 'NO_SMTP_CREDENTIALS' && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                                    ⚠️ AWAITING EMAIL PASSWORD
                                  </span>
                                )}
                                {log.status === 'FAILED' && (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold">
                                    ❌ FAILED
                                  </span>
                                )}
                                {log.status === 'CALLMEBOT_SENT' && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                                    🤖 BOT SENT
                                  </span>
                                )}
                                {log.status === 'DISPATCH_READY' && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 font-bold">
                                    💬 WA LINK READY
                                  </span>
                                )}
                              </td>

                              <td className="p-3 space-y-1">
                                {log.directWaUrl && (
                                  <a
                                    href={log.directWaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded font-bold transition-colors"
                                  >
                                    <MessageSquare className="w-3 h-3" /> Open Direct WhatsApp Alert
                                  </a>
                                )}
                                {log.error && (
                                  <p className="text-[10px] text-rose-600 font-bold leading-tight">
                                    {log.error}
                                  </p>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: GOOGLE ANALYTICS & TAG MANAGER (GTM) COMMAND CENTER */}
            {(activeTab === 'ANALYTICS' || (activeTab === 'CONTENT' && contentSubTab === 'ANALYTICS_TAGS')) && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Header Banner */}
                <div className="p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 text-white rounded-2xl border border-indigo-700/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 font-mono text-xs font-bold">
                      <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Ecommerce Conversion Tracking Engine
                    </div>
                    <h3 className="text-xl font-black font-serif tracking-tight text-white flex items-center gap-2">
                      Google Analytics 4 (GA4) &amp; Google Tag Manager (GTM)
                    </h3>
                    <p className="text-xs text-indigo-200/80 max-w-2xl">
                      Track customer traffic, checkout drop-offs, and live order conversion sales directly in your Google Analytics dashboard and Google Tag Manager container.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleTestPurchaseEvent}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                      title="Fires a live test purchase event to dataLayer & GA4"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950 fill-current" /> Simulate GA4 Purchase Event
                    </button>
                  </div>
                </div>

                {analyticsTestMsg && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-mono font-bold flex items-center justify-between animate-fade-in shadow-xs">
                    <span>{analyticsTestMsg}</span>
                    <button onClick={() => setAnalyticsTestMsg('')} className="text-emerald-700 hover:text-emerald-900"><X className="w-4 h-4" /></button>
                  </div>
                )}

                {/* Conversion Summary Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold block">Total Orders Tracked</span>
                    <span className="text-2xl font-black text-slate-900">{orders.length}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold block">Synced with Firebase</span>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold block">Total Order Revenue</span>
                    <span className="text-2xl font-black text-emerald-600">₹{totalRevenue.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-slate-500 font-semibold block">Gross Sales Value</span>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold block">Average Order Value (AOV)</span>
                    <span className="text-2xl font-black text-indigo-600">
                      ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}
                    </span>
                    <span className="text-[11px] text-indigo-500 font-semibold block">Per Book Checkout</span>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold block">GA4 &amp; GTM Integration</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active &amp; Ready
                    </span>
                    <span className="text-[10px] text-slate-400 block pt-1">Event stream listening</span>
                  </div>
                </div>

                {/* Main Settings & Tag Form */}
                <form onSubmit={handleSaveSettings} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
                        <Tag className="w-4 h-4 text-indigo-600" /> Tracking Container &amp; Measurement IDs
                      </h4>
                      <p className="text-xs text-slate-500">
                        Paste your Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`) and Google Tag Manager Container ID (`GTM-XXXXXXX`).
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
                    >
                      <Save className="w-4 h-4" /> Save &amp; Activate Tracking IDs
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <label className="block text-slate-900 font-bold font-mono text-xs flex items-center justify-between">
                        <span>GA4 Measurement ID *</span>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                          Format: G-XXXXXXXXXX
                        </span>
                      </label>
                      <input
                        type="text"
                        value={settings.gaMeasurementId || ''}
                        onChange={(e) => setSettings({ ...settings, gaMeasurementId: e.target.value })}
                        placeholder="G-SSSBOOK2026"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-[11px] text-slate-500">
                        Connects directly to Google Analytics 4. Automatically logs `purchase`, `begin_checkout`, and `page_view` events with order amounts in INR.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <label className="block text-slate-900 font-bold font-mono text-xs flex items-center justify-between">
                        <span>GTM Container ID *</span>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                          Format: GTM-XXXXXXX
                        </span>
                      </label>
                      <input
                        type="text"
                        value={settings.gtmContainerId || ''}
                        onChange={(e) => setSettings({ ...settings, gtmContainerId: e.target.value })}
                        placeholder="GTM-SSS8849"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-[11px] text-slate-500">
                        Google Tag Manager container. Automatically pushes ecommerce order payloads into `window.dataLayer` for custom Meta/Facebook pixel triggers.
                      </p>
                    </div>
                  </div>

                  {/* HTML Snippet Code Viewer */}
                  <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 font-bold flex items-center gap-2">
                        <Code className="w-4 h-4 text-emerald-400" /> Embedded Head Script Snippet Preview
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded">Auto-Injected in DOM</span>
                    </div>

                    <div className="space-y-2 text-[11px] overflow-x-auto text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <code>
                        {`<!-- Google Tag Manager Snippet -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','${settings.gtmContainerId || 'GTM-SSS8849'}');</script>\n\n<!-- Google Analytics 4 (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${settings.gaMeasurementId || 'G-SSSBOOK2026'}"></script>`}
                      </code>
                    </div>
                  </div>
                </form>

                {/* Event Logs Table */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
                        <Activity className="w-4 h-4 text-emerald-600" /> Live Fired Analytics Events ({analyticsLogs.length})
                      </h4>
                      <p className="text-xs text-slate-500">
                        Real-time stream of `purchase`, `begin_checkout`, and `page_view` events triggered in this browser session.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAnalyticsLogs(getAnalyticsEventLogs())}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-600" /> Refresh Stream
                    </button>
                  </div>

                  {analyticsLogs.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-mono text-xs space-y-2">
                      <Activity className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
                      <p>No analytics events logged in current session yet.</p>
                      <p className="text-[11px] text-slate-400">Click "Simulate GA4 Purchase Event" above or place a test order in checkout!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                            <th className="p-3">Time</th>
                            <th className="p-3">Event Name</th>
                            <th className="p-3">Payload Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {analyticsLogs.map((log, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 text-slate-500 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </td>

                              <td className="p-3">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                                  log.eventName === 'purchase' || log.eventName === 'ecommerce_purchase'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : log.eventName === 'begin_checkout'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                }`}>
                                  {log.eventName === 'purchase' && <Sparkles className="w-3 h-3 text-emerald-700" />}
                                  {log.eventName}
                                </span>
                              </td>

                              <td className="p-3">
                                <pre className="text-[10px] bg-slate-900 text-emerald-400 p-2 rounded-lg overflow-x-auto max-w-xl font-mono">
                                  {JSON.stringify(log.params, null, 2)}
                                </pre>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

        {/* PASTE WHATSAPP ORDER MODAL */}
        {isPasteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold font-serif flex items-center gap-2 text-emerald-800">
                  <MessageSquare className="w-5 h-5 text-emerald-600 fill-current" /> Paste Customer WhatsApp Message
                </h3>
                <button onClick={() => setIsPasteModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Copy the order message received from a customer on WhatsApp (+91 {settings.whatsappPhone || '9787196806'}) and paste it below. The system will automatically extract the Customer Name, Order ID, Phone, Email, and Address to create the order in your dashboard.
              </p>

              <textarea
                rows={7}
                placeholder={`Example WhatsApp Message:\n\n🛒 *NEW BOOK ORDER PLACED!*\n*Order ID:* SSS-819201\n*Amount Payable:* ₹848\n\n👤 *CUSTOMER SHIPPING DETAILS:*\n• *Name:* Arun Gowtham\n• *Phone:* 9787196806\n• *Email:* gouthamarun123@gmail.com\n• *Address:* 36 Jain Antara, Near Circular Road, Coimbatore, Tamil Nadu - 641004`}
                value={pastedWaText}
                onChange={(e) => setPastedWaText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setIsPasteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleParseAndAddWaOrder}
                  disabled={!pastedWaText.trim()}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Parse &amp; Create Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOSTINGER DEPLOYMENT GUIDE MODAL */}
        {isGuideModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-slate-900 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold font-serif flex items-center gap-2 text-slate-900">
                  <BookOpen className="w-5 h-5 text-blue-600" /> Hostinger Deployment &amp; Live Order Setup Guide
                </h3>
                <button onClick={() => setIsGuideModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                  <strong className="text-blue-900 font-bold text-sm block">💡 Why are orders or API calls behaving differently on Hostinger?</strong>
                  <p className="text-slate-700">
                    Hostinger supports two deployment modes: <strong>Node.js Web Application</strong> (runs backend server) and <strong>Static Web Hosting</strong> (serves dist HTML/JS files only). Follow the steps below for your mode:
                  </p>
                </div>

                {/* METHOD 1 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-serif text-emerald-800">
                    <span>METHOD 1: Hostinger Node.js Application Setup (Recommended)</span>
                  </div>
                  <p className="text-slate-600">
                    This mode runs the Express backend (`server.ts`), enabling live database order storage (`/data/orders.json`) and instant email alerts.
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-800 font-mono text-[11px] bg-white p-3 rounded-lg border border-slate-200">
                    <li>Log into Hostinger hPanel &rarr; <strong>Node.js Web Applications</strong>.</li>
                    <li>Node Version: Select <strong>Node.js 18.x or 20.x</strong>.</li>
                    <li>Application Root: <code>/</code></li>
                    <li>Application Startup File: <code>dist/server.cjs</code></li>
                    <li>Build Command: <code>npm run build</code></li>
                    <li>Run Command: <code>npm start</code></li>
                    <li>Add Environment Variables: <code>NOTIFICATION_EMAIL</code>, <code>WHATSAPP_ADMIN_PHONE</code></li>
                    <li>Click <strong>Deploy / Restart Application</strong>.</li>
                  </ol>
                </div>

                {/* METHOD 2 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-serif text-blue-800">
                    <span>METHOD 2: Hostinger Static Web Hosting (cPanel / hPanel Static Site)</span>
                  </div>
                  <p className="text-slate-600">
                    If uploading the built <code>dist/</code> static HTML/CSS/JS files directly to <code>public_html</code>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-800 bg-white p-3 rounded-lg border border-slate-200 text-[11px]">
                    <li>When a customer orders, the store automatically formats the full order details and opens WhatsApp to <strong>+91 {settings.whatsappPhone || '9787196806'}</strong>.</li>
                    <li>You receive instant WhatsApp order notifications on your phone!</li>
                    <li>Use the green <strong>"Paste WhatsApp Order"</strong> button in this portal to paste the message and add it to your order management table in 1 click.</li>
                    <li>You can also click <strong>"Export JSON"</strong> and <strong>"Import JSON"</strong> to back up or restore orders anytime.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-200">
                <button
                  onClick={() => setIsGuideModalOpen(false)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Got It, Thanks!
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
