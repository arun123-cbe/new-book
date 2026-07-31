export type PillarType = 'SEARCH' | 'SOCIAL' | 'SYSTEMS';

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  pillar: PillarType;
  focusTag: string;
  focus: string;
  coreSkills: string[];
  toolkitTemplates?: string[];
  summary: string;
  sampleExcerpt?: string;
  estimatedReadMinutes?: number;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
  avatarBg: string;
  initials: string;
  helpfulCount?: number;
  keywords?: string[];
}

export interface TargetPersona {
  id: string;
  category: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  keyOutcomes: string[];
  iconName: string;
}

export interface TechSpec {
  label: string;
  value: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface UPIPaymentDetails {
  method: 'UPI_APP' | 'UPI_QR' | 'UPI_ID' | 'WhatsApp Order' | string;
  upiApp?: string;
  upiId?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transactionRef?: string;
}

export interface Order {
  orderId: string;
  trackingId: string;
  createdAt: string;
  item: string;
  amount: number;
  originalAmount: number;
  discount: string;
  shipping: string;
  status: 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  carrier?: string;
  customer: OrderCustomer;
  payment: UPIPaymentDetails;
  digitalAccessUrl: string;
}

export interface AdvantageItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  pillar: string;
}

export interface SiteContentSettings {
  heroTitle?: string;
  heroSubtitle?: string;
  priceINR: number;
  originalPriceINR: number;
  shippingFeeINR?: number;
  discountPercent: number;
  whatsappPhone: string;
  upiMerchantId: string;
  authorName: string;
  authorTitle?: string;
  authorBio?: string;
  authorImageUrl?: string;
  tagline: string;
  announcementText: string;

  // Notification & SMTP Settings
  notificationEmail?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  callmebotApiKey?: string;
  whatsappWebhookUrl?: string;

  // Google Analytics & Google Tag Manager Settings
  gaMeasurementId?: string;
  gtmContainerId?: string;
  enableAnalytics?: boolean;

  // Editable lists across the site
  chapters?: Chapter[];
  reviews?: Review[];
  personas?: TargetPersona[];
  advantages?: AdvantageItem[];
}

