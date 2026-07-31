import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, ShieldCheck, Truck, Clock, CheckCircle2, Copy, Check, 
  Smartphone, QrCode, Sparkles, Download, ArrowRight, X, MessageSquare, AlertCircle
} from 'lucide-react';
import { BOOK_METADATA } from '../data/bookData';
import { Order, SiteContentSettings } from '../types';
import { saveOrderToFirebase } from '../lib/firebase';
import { trackPurchase, trackBeginCheckout } from '../lib/analytics';

interface CheckoutPortalProps {
  onOrderSuccess: (order: Order) => void;
  siteSettings?: SiteContentSettings;
}

export const CheckoutPortal: React.FC<CheckoutPortalProps> = ({ onOrderSuccess, siteSettings }) => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');

  // Payment Method State: STRICTLY UPI ONLY
  const [upiMethod, setUpiMethod] = useState<'UPI_APP' | 'UPI_QR' | 'UPI_ID'>('UPI_APP');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [upiIdVerified, setUpiIdVerified] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  
  // Status & QR
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const priceINR = siteSettings?.priceINR || BOOK_METADATA.priceINR;
  const shippingFeeINR = siteSettings?.shippingFeeINR !== undefined ? siteSettings.shippingFeeINR : BOOK_METADATA.shippingFeeINR;
  const totalPayable = priceINR + shippingFeeINR;
  const originalPriceINR = siteSettings?.originalPriceINR || BOOK_METADATA.originalPriceINR;
  const discountPercent = siteSettings?.discountPercent || BOOK_METADATA.discountPercent;
  const merchantUpiId = siteSettings?.upiMerchantId || '6374723367@ptaxis';
  const whatsappPhone = siteSettings?.whatsappPhone || BOOK_METADATA.whatsappPhone;

  const upiPayString = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=Arun%20Gowtham&am=${totalPayable}&cu=INR&tn=Search%20Social%20Systems%20Book%20Order`;

  // Generate QR Code dynamically whenever merchantUpiId or totalPayable changes
  useEffect(() => {
    QRCode.toDataURL(upiPayString, {
      width: 260,
      margin: 2,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff'
      }
    }).then(url => setQrDataUrl(url)).catch(err => console.error("QR Code gen error:", err));
  }, [upiPayString, merchantUpiId, totalPayable]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleVerifyCustomUpi = () => {
    if (customUpiId.includes('@')) {
      setUpiIdVerified(true);
    } else {
      alert('Please enter a valid UPI ID (e.g. name@okicici)');
    }
  };

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !pincode) {
      alert('Please fill in all required shipping details.');
      return;
    }

    setIsProcessing(true);
    trackBeginCheckout(totalPayable);

    const targetWaPhone = (whatsappPhone || "9787196806").replace(/\D/g, '');
    const cleanWaPhone = targetWaPhone.length === 10 ? `91${targetWaPhone}` : targetWaPhone;

    const newOrder: Order = {
      orderId: "SSS-" + Math.floor(100000 + Math.random() * 900000),
      trackingId: "IN-EXP-" + Math.floor(10000000 + Math.random() * 90000000),
      createdAt: new Date().toISOString(),
      item: "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
      amount: totalPayable,
      originalAmount: originalPriceINR,
      discount: `${discountPercent}%`,
      shipping: shippingFeeINR > 0 ? `Express Courier (₹${shippingFeeINR})` : "FREE Express Courier",
      status: "PENDING",
      carrier: "BlueDart Express",
      customer: { name, email, phone, address, city, pincode, state },
      payment: {
        method: 'WhatsApp Order',
        upiApp: 'WhatsApp Order',
        upiId: merchantUpiId,
        status: 'PENDING',
        transactionRef: 'WhatsApp-' + cleanWaPhone
      },
      digitalAccessUrl: `/download/companion-blueprint-kit.pdf`
    };

    // 1. Send complete order payload to server
    try {
      const payload = {
        ...newOrder,
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        paymentMethod: 'WhatsApp Order',
        upiId: merchantUpiId,
        upiApp: 'WhatsApp Order',
        transactionRef: 'WhatsApp-' + cleanWaPhone
      };

      let response: Response | null = null;
      let attempts = 0;
      while (attempts < 3 && (!response || !response.ok)) {
        attempts++;
        try {
          response = await fetch('/api/orders/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (fetchErr) {
          console.warn(`Attempt ${attempts} failed to post order:`, fetchErr);
          if (attempts < 3) await new Promise(r => setTimeout(r, 800));
        }
      }

      let serverOrder = newOrder;
      if (response && response.ok) {
        const data = await response.json();
        if (data.success && data.order) {
          serverOrder = data.order;
        }
      }

      // Save synced server order to localStorage and Firebase Firestore
      try {
        saveOrderToFirebase(serverOrder);
        const existingLocal: Order[] = JSON.parse(localStorage.getItem('sss_orders') || '[]');
        const filteredLocal = existingLocal.filter(o => o.orderId !== serverOrder.orderId);
        localStorage.setItem('sss_orders', JSON.stringify([serverOrder, ...filteredLocal]));
      } catch (err) {
        console.warn("Could not save to local storage or Firebase:", err);
      }

      setIsProcessing(false);
      setCompletedOrder(serverOrder);
      onOrderSuccess(serverOrder);

      // Fire Google Analytics & GTM Purchase Event
      try {
        trackPurchase(serverOrder);
      } catch (trackErr) {
        console.warn("Analytics tracking error:", trackErr);
      }

      // Pre-formatted WhatsApp Message
      const waText = `🛒 *NEW BOOK ORDER PLACED!*\n\n` +
        `*Order ID:* ${serverOrder.orderId}\n` +
        `*Book:* SEARCH, SOCIAL & SYSTEMS (Printed Paperback)\n` +
        `*Amount Payable:* ₹${serverOrder.amount} (${serverOrder.shipping})\n\n` +
        `👤 *CUSTOMER SHIPPING DETAILS:*\n` +
        `• *Name:* ${name}\n` +
        `• *Phone:* ${phone}\n` +
        `• *Email:* ${email}\n` +
        `• *Address:* ${address}, ${city}, ${state} - ${pincode}\n\n` +
        `Please process my order and provide payment/courier details!`;

      const waUrl = `https://wa.me/${cleanWaPhone}?text=${encodeURIComponent(waText)}`;

      // Automatically redirect to WhatsApp
      setTimeout(() => {
        const opened = window.open(waUrl, '_blank');
        if (!opened) {
          window.location.href = waUrl;
        }
      }, 300);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("Order server sync error:", err);
      setIsProcessing(false);
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <section id="buy-now" className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 border border-blue-200 rounded-full text-blue-800 font-mono text-xs font-bold uppercase">
            <Smartphone className="w-4 h-4 text-blue-600" /> 100% SECURE UPI DIRECT CHECKOUT
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Order Your Printed Copy Now
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed">
            Fast, zero-gateway-fee instant UPI payment. Free express courier delivery across India + immediate digital companion blueprint download.
          </p>
        </div>

        {/* Main Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Order Summary & Included Package */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-xs font-mono uppercase text-blue-700 font-bold">PRINTED PAPERBACK</span>
              <span className="text-xs font-mono uppercase bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
                {shippingFeeINR > 0 ? `EXPRESS COURIER: ₹${shippingFeeINR}` : 'EXPRESS SHIPPING: FREE'}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 font-serif">
                SEARCH, SOCIAL &amp; SYSTEMS <span className="text-xs text-slate-500 font-normal block font-sans">Printed Edition</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The complete master guide by {siteSettings?.authorName || BOOK_METADATA.author}. Built for career builders, entrepreneurs, and digital marketing professionals.
              </p>
            </div>

            {/* Price Breakdown Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 shadow-inner text-xs font-mono">
              <div className="flex justify-between items-center text-slate-600">
                <span>Book Price:</span>
                <span className="font-bold text-slate-900">₹{priceINR} <span className="line-through text-slate-400 font-normal text-[11px]">₹{originalPriceINR}</span></span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Express Shipping Charge:</span>
                <span className="font-bold text-blue-700">{shippingFeeINR > 0 ? `₹${shippingFeeINR}` : 'FREE'}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-sans">
                <span className="font-mono text-slate-900 font-bold uppercase text-[11px]">Total Payable:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 font-serif">₹{totalPayable}</span>
                  <span className="text-[11px] font-bold font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    SAVE {discountPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Package Items Checklist */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono text-slate-700 uppercase font-bold">
                What is Included in Your Dispatch Package:
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>High-quality printed paperback book (450+ Monochrome Pages)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Free express shipping across India with live tracking link</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Instant access: Digital Marketing Blueprint Checklist (PDF)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Instant access: Meta ads copy worksheets &amp; GBP checklists</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Direct email receipt and secure download access</span>
                </li>
              </ul>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>UPI Encrypted</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Express Courier</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Dispatched 24h</span>
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Form & Pure UPI Payment Options */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-xl">
            
            <form onSubmit={handleProcessCheckout} className="space-y-6">
              
              {/* Shipping Address Header */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" /> 1. Shipping Delivery Address
                </h3>
                <p className="text-xs text-slate-500">Enter where you want your printed paperback delivered across India.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-mono font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arun Gowtham"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-mono font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. gouthamarun123@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-mono font-bold mb-1">Mobile Phone (for Courier Tracking SMS) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9787196806"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-mono font-bold mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 641001"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-mono font-bold mb-1">Full Delivery Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House No, Street, Area, Landmark..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-mono font-bold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Coimbatore / Chennai / Bengaluru"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-mono font-bold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Direct WhatsApp Confirmation Box */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="p-4 bg-emerald-50/90 rounded-2xl border-2 border-emerald-300 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <MessageSquare className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950 font-serif">
                        Instant WhatsApp Order Confirmation
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-mono">
                        Direct Fulfillment with Author Arun Gowtham
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    Once you click <strong>Confirm Order &amp; Open WhatsApp</strong>, your order will be instantly registered in our system and you will be automatically redirected to WhatsApp (<strong>+{whatsappPhone}</strong>) pre-filled with your shipping details!
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Item:</span>
                      <strong className="text-slate-900">Printed Paperback Edition</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Price:</span>
                      <strong className="text-emerald-700">₹{totalPayable} ({shippingFeeINR > 0 ? `+₹${shippingFeeINR} Courier` : 'FREE Shipping'})</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Official Author WhatsApp:</span>
                      <strong className="text-blue-700">+{whatsappPhone}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2 font-mono">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Creating Order &amp; Redirecting to WhatsApp...
                  </span>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 fill-current" />
                    <span>Confirm Order &amp; Open WhatsApp (+91 {whatsappPhone})</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* Order Confirmation & Invoice Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 max-w-2xl w-full space-y-6 relative shadow-2xl my-8 text-slate-800">
            <button
              onClick={() => setCompletedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                Order Confirmed! 🎉
              </h3>
              <p className="text-xs text-slate-600 font-mono">
                Thank you, <strong className="text-slate-900">{completedOrder.customer.name}</strong>! Your printed paperback is queued for dispatch in 24h.
              </p>
            </div>

            {/* Order Receipt Box */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Order ID:</span>
                <span className="text-blue-700 font-bold">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Courier Live Tracking ID:</span>
                <span className="text-slate-900 font-bold">{completedOrder.trackingId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Item Purchased:</span>
                <span className="text-slate-800">{completedOrder.item}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Amount Payable:</span>
                <span className="text-emerald-700 font-bold">₹{completedOrder.amount} ({completedOrder.shipping})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="text-slate-900 text-right font-sans max-w-xs">{completedOrder.customer.address}, {completedOrder.customer.city}, {completedOrder.customer.pincode}</span>
              </div>
            </div>

            {/* Digital Companion Kit Download Box */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Digital Companion Kit Ready
                </div>
                <p className="text-[11px] text-slate-600">
                  Instant access link sent to {completedOrder.customer.email}.
                </p>
              </div>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading Companion Blueprint Package for Order ${completedOrder.orderId}...`);
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold font-mono rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF Kit
              </a>
            </div>

            {/* WhatsApp Confirmation Dispatch Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/91${whatsappPhone}?text=${encodeURIComponent(
                  `🛒 *NEW BOOK ORDER CONFIRMATION*\n\n` +
                  `*Order ID:* ${completedOrder.orderId}\n` +
                  `*Name:* ${completedOrder.customer.name}\n` +
                  `*Phone:* ${completedOrder.customer.phone}\n` +
                  `*Address:* ${completedOrder.customer.address}, ${completedOrder.customer.city} - ${completedOrder.customer.pincode}\n` +
                  `*Amount Paid:* ₹${completedOrder.amount}\n` +
                  `*UTR / Ref:* ${completedOrder.payment.transactionRef || 'N/A'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors font-mono shadow-md"
              >
                <MessageSquare className="w-4 h-4" /> Send Instant WhatsApp Order Alert to {whatsappPhone}
              </a>

              <button
                onClick={() => setCompletedOrder(null)}
                className="w-full sm:w-auto py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-mono font-bold"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
