import { Order } from '../types';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

let isInitialized = false;
let currentGaId = '';
let currentGtmId = '';

export interface AnalyticsEventLog {
  timestamp: string;
  eventName: string;
  params: Record<string, any>;
}

const EVENT_LOG_KEY = 'sss_analytics_events';

/**
 * Get recent logged analytics events
 */
export function getAnalyticsEventLogs(): AnalyticsEventLog[] {
  try {
    const raw = localStorage.getItem(EVENT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Log an analytics event locally for debug and portal dashboard display
 */
function logAnalyticsEvent(eventName: string, params: Record<string, any>) {
  try {
    const logs = getAnalyticsEventLogs();
    const newLog: AnalyticsEventLog = {
      timestamp: new Date().toISOString(),
      eventName,
      params
    };
    const updated = [newLog, ...logs].slice(0, 50); // Keep last 50 events
    localStorage.setItem(EVENT_LOG_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to store analytics event log:', e);
  }
}

/**
 * Initialize Google Analytics (GA4) and Google Tag Manager (GTM)
 */
export function initAnalytics(config: { gaMeasurementId?: string; gtmContainerId?: string; enableAnalytics?: boolean } = {}) {
  if (typeof window === 'undefined') return;

  const safeConfig = config || {};
  window.dataLayer = window.dataLayer || [];

  const gaId = safeConfig.gaMeasurementId?.trim() || 'G-SSSBOOK2026';
  const gtmId = safeConfig.gtmContainerId?.trim() || 'GTM-SSS8849';
  const enabled = safeConfig.enableAnalytics !== false;

  if (!enabled) return;

  // Initialize dataLayer
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  // Inject Google Tag Manager (GTM) script if not already present
  if (gtmId && (!isInitialized || currentGtmId !== gtmId)) {
    const existingGtm = document.getElementById('gtm-script');
    if (existingGtm) existingGtm.remove();

    const script = document.createElement('script');
    script.id = 'gtm-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);

    // Initial GTM dataLayer push
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    currentGtmId = gtmId;
  }

  // Inject Google Analytics 4 (GA4) script if not already present
  if (gaId && (!isInitialized || currentGaId !== gaId)) {
    const existingGa = document.getElementById('ga4-script');
    if (existingGa) existingGa.remove();

    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', gaId, {
      send_page_view: true,
      currency: 'INR'
    });

    currentGaId = gaId;
  }

  isInitialized = true;
  console.log(`[Analytics] Initialized GTM (${gtmId}) & GA4 (${gaId})`);
}

/**
 * Track a custom event to GTM & GA4
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  
  // Push to GTM dataLayer
  window.dataLayer.push({
    event: eventName,
    ...params
  });

  // Push to GA4 gtag
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  logAnalyticsEvent(eventName, params);
  console.log(`[Analytics Event Tracked]: ${eventName}`, params);
}

/**
 * Track GA4 & GTM Ecommerce Purchase Event
 */
export function trackPurchase(order: Order) {
  const purchaseParams = {
    transaction_id: order.orderId,
    value: order.amount,
    currency: 'INR',
    tax: 0,
    shipping: order.shipping.includes('49') ? 49 : 0,
    coupon: order.discount || '40% OFF',
    items: [
      {
        item_id: 'SSS-BOOK-PRINTED',
        item_name: order.item || 'SEARCH, SOCIAL & SYSTEMS (Printed Edition)',
        discount: order.originalAmount ? order.originalAmount - order.amount : 451,
        item_category: 'Books & Blueprints',
        price: order.amount,
        quantity: 1
      }
    ],
    customer_city: order.customer?.city || '',
    customer_state: order.customer?.state || '',
    payment_method: order.payment?.method || 'WhatsApp Order'
  };

  trackEvent('purchase', purchaseParams);
  
  // Also push standard GA4 ecommerce payload structure to dataLayer for GTM triggers
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
    window.dataLayer.push({
      event: 'ecommerce_purchase',
      ecommerce: {
        transaction_id: order.orderId,
        value: order.amount,
        currency: 'INR',
        tax: 0,
        shipping: order.shipping.includes('49') ? 49 : 0,
        items: purchaseParams.items
      }
    });
  }
}

/**
 * Track GA4 & GTM Begin Checkout Event
 */
export function trackBeginCheckout(amount: number) {
  trackEvent('begin_checkout', {
    currency: 'INR',
    value: amount,
    items: [
      {
        item_id: 'SSS-BOOK-PRINTED',
        item_name: 'SEARCH, SOCIAL & SYSTEMS (Printed Edition)',
        price: amount,
        quantity: 1
      }
    ]
  });
}

/**
 * Track Page View Event
 */
export function trackPageView(pageTitle: string, pagePath: string) {
  trackEvent('page_view', {
    page_title: pageTitle,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_path: pagePath
  });
}
