import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, Truck, Sparkles, CheckCircle2, ArrowRight,
  User, Phone, Mail, MapPin, Send, QrCode, Smartphone, Copy, Check, MessageSquare, AlertCircle
} from 'lucide-react';
import { BOOK_METADATA } from '../data/bookData';
import { Order, SiteContentSettings } from '../types';
import { saveOrderToFirebase } from '../lib/firebase';
import { trackPurchase, trackBeginCheckout } from '../lib/analytics';

interface TopLeadOrderFormProps {
  onOrderSuccess: (order: Order) => void;
  siteSettings?: SiteContentSettings;
  className?: string;
}

export const TopLeadOrderForm: React.FC<TopLeadOrderFormProps> = ({ 
  onOrderSuccess, 
  siteSettings,
  className = "" 
}) => {
  // Form Input States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('Tamil Nadu');

  // UPI Payment Details
  const [selectedUpiApp, setSelectedUpiApp] = useState<'Google Pay' | 'PhonePe' | 'Paytm' | 'Any UPI'>('Google Pay');
  const [paymentStep, setPaymentStep] = useState<'DETAILS' | 'UPI_PAY'>('DETAILS');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const priceINR = siteSettings?.priceINR || BOOK_METADATA.priceINR;
  const shippingFeeINR = siteSettings?.shippingFeeINR !== undefined ? siteSettings.shippingFeeINR : BOOK_METADATA.shippingFeeINR;
  const totalPayable = priceINR + shippingFeeINR;
  const originalPriceINR = siteSettings?.originalPriceINR || BOOK_METADATA.originalPriceINR;
  const discountPercent = siteSettings?.discountPercent || BOOK_METADATA.discountPercent;
  const merchantUpiId = siteSettings?.upiMerchantId || '6374723367@ptaxis';
  const whatsappPhone = siteSettings?.whatsappPhone || BOOK_METADATA.whatsappPhone;

  const upiPayString = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=Arun%20Gowtham&am=${totalPayable}&cu=INR&tn=Search%20Social%20Systems%20Book%20Order`;

  useEffect(() => {
    QRCode.toDataURL(upiPayString, {
      width: 220,
      margin: 2,
      color: { dark: '#1e3a8a', light: '#ffffff' }
    }).then(url => setQrDataUrl(url)).catch(err => console.error("QR Code error:", err));
  }, [upiPayString]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim() || !pincode.trim()) {
      alert('Please complete all required fields (Name, Phone, Email, Address, Pincode).');
      return;
    }
    trackBeginCheckout(totalPayable);
    setPaymentStep('UPI_PAY');
  };

  const handleFinalOrderSubmit = async () => {
    setIsSubmitting(true);

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
      customer: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim() || 'Coimbatore',
        state: state || 'Tamil Nadu',
        pincode: pincode.trim()
      },
      payment: {
        method: "UPI_APP",
        status: "SUCCESS",
        upiApp: selectedUpiApp,
        upiId: merchantUpiId
      },
      digitalAccessUrl: "/download/companion-blueprint-kit.pdf"
    };

    try {
      // 1. Send Order to Server API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const data = await response.json();

      // 2. Save to Firestore DB
      await saveOrderToFirebase(newOrder);

      // 3. Analytics & Confetti
      trackPurchase(newOrder);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);

      // Auto open WhatsApp confirmation link
      const waMsg = encodeURIComponent(
        `Hi! I have placed an order for Search, Social & Systems Book.\n` +
        `Order ID: ${newOrder.orderId}\n` +
        `Name: ${newOrder.customer.name}\n` +
        `Phone: ${newOrder.customer.phone}\n` +
        `Amount Paid: ₹${totalPayable}\n` +
        `Address: ${newOrder.customer.address}, ${newOrder.customer.pincode}`
      );
      window.open(`https://wa.me/${cleanWaPhone}?text=${waMsg}`, '_blank');
    } catch (err) {
      console.error("Order submission notice:", err);
      // Fallback completion even if offline
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className={`bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-2xl border border-blue-500/30 ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full uppercase font-bold border border-emerald-500/30">
              Order Confirmed!
            </span>
            <h3 className="text-2xl font-black font-serif text-white mt-2">
              Thank You, {completedOrder.customer.name}!
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              Your copy is booked and scheduled for express dispatch.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl text-left font-mono text-xs space-y-2 border border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Order ID:</span>
              <span className="text-emerald-400 font-bold">{completedOrder.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tracking Ref:</span>
              <span className="text-blue-300">{completedOrder.trackingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Paid:</span>
              <span className="text-white font-bold">₹{completedOrder.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mobile:</span>
              <span className="text-white">{completedOrder.customer.phone}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/${(whatsappPhone || "9787196806").replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I want to track my Order ${completedOrder.orderId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm Order & Track on WhatsApp</span>
            </a>
            
            <button
              onClick={() => {
                setCompletedOrder(null);
                setPaymentStep('DETAILS');
                setName('');
                setPhone('');
                setEmail('');
                setAddress('');
                setPincode('');
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="top-lead-order" className={`bg-white rounded-2xl shadow-2xl border-2 border-blue-600 overflow-hidden ${className}`}>
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 p-4 sm:p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono uppercase font-bold text-blue-200 tracking-wider">
              FAST ORDER &amp; INSTANT LEAD CLAIM
            </span>
          </div>
          <span className="bg-emerald-500 text-slate-950 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            SAVE {discountPercent}%
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight">
              Order Your Printed Copy
            </h3>
            <p className="text-xs text-blue-200 font-sans">
              Enter details below for fast express delivery across India
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-white font-serif">₹{priceINR}</div>
            <div className="text-[11px] line-through text-blue-300 font-mono">₹{originalPriceINR}</div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-5 space-y-4">
        {paymentStep === 'DETAILS' ? (
          <form onSubmit={handleProceedToPayment} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" /> Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arun Gowtham"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            {/* Mobile & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" /> Mobile / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9787196806"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Shipping Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No, Street Name, Area / Landmark"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            {/* City & Pincode Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / District</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Coimbatore"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 641001"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Benefits bullet strip */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
              <span className="flex items-center gap-1 font-bold">
                <Truck className="w-3.5 h-3.5 text-blue-600" /> Free Express Shipping
              </span>
              <span className="flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> PDF Kit Included
              </span>
            </div>

            {/* Primary WhatsApp Direct Order Button (Exact match to screenshot) */}
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                if (!name.trim() || !phone.trim()) {
                  alert('Please enter your Name and Mobile / WhatsApp number.');
                  return;
                }
                await handleFinalOrderSubmit();
              }}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all tracking-wide"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Confirm Order &amp; Open WhatsApp (+91 {whatsappPhone || "9787196806"})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: UPI PAYMENT STEP */
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Customer: {name}</span>
                <button
                  type="button"
                  onClick={() => setPaymentStep('DETAILS')}
                  className="text-blue-600 underline text-[11px]"
                >
                  Edit Details
                </button>
              </div>
              <p className="text-[11px] text-slate-500 truncate">Deliver to: {address}, {pincode}</p>
            </div>

            {/* UPI QR & App Selector */}
            <div className="text-center space-y-3">
              <div className="inline-block p-2 bg-white rounded-xl border border-slate-200 shadow-md">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="UPI QR Code" className="w-40 h-40 mx-auto rounded-lg" />
                ) : (
                  <div className="w-40 h-40 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                    Generating QR...
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800">Scan QR or Copy Merchant UPI ID:</div>
                <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg font-mono text-xs font-bold text-slate-900">
                  <span>{merchantUpiId}</span>
                  <button
                    onClick={handleCopyUpi}
                    className="p-1 hover:bg-slate-200 rounded text-blue-600 transition-colors"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {copiedUpi && <p className="text-[10px] text-emerald-600 font-bold mt-0.5">UPI ID Copied to clipboard!</p>}
              </div>

              {/* Direct UPI App Launch Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={upiPayString}
                  onClick={() => setSelectedUpiApp('Google Pay')}
                  className="py-2 px-2 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-bold text-slate-800 transition-colors text-center"
                >
                  Google Pay
                </a>
                <a
                  href={upiPayString}
                  onClick={() => setSelectedUpiApp('PhonePe')}
                  className="py-2 px-2 bg-slate-100 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-[11px] font-bold text-slate-800 transition-colors text-center"
                >
                  PhonePe
                </a>
                <a
                  href={upiPayString}
                  onClick={() => setSelectedUpiApp('Paytm')}
                  className="py-2 px-2 bg-slate-100 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg text-[11px] font-bold text-slate-800 transition-colors text-center"
                >
                  Paytm / Other
                </a>
              </div>
            </div>

            {/* Complete Order Confirmation Button */}
            <button
              onClick={handleFinalOrderSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all tracking-wide"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>Confirm Order &amp; Open WhatsApp (+91 {whatsappPhone || "9787196806"})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Direct Author Dispatch
          </span>
        </div>
      </div>
    </div>
  );
};
