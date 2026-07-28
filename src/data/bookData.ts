import { Review, TargetPersona, TechSpec, FAQItem } from '../types';

export const BOOK_METADATA = {
  title: 'SEARCH, SOCIAL & SYSTEMS',
  subtitle: 'Master Digital Marketing from Scratch with One Complete Guide',
  tagline: 'One Book. Endless Opportunities. Learn Digital Marketing the Right Way.',
  author: 'Arun Gowtham Prabhudas',
  rating: 4.9,
  verifiedReadersCount: 1248,
  priceINR: 799,
  originalPriceINR: 1299,
  shippingFeeINR: 49,
  discountPercent: 40,
  isbn: '978-93-6012-665-0',
  pages: '450+',
  chaptersCount: 21,
  pillarsCount: 3,
  copiesShipped: '1,200+',
  format: 'Premium Monochrome Paperback',
  shipping: 'Express Delivery (₹49 across India)',
  whatsappPhone: '9787196806',
  whatsappUrl: 'https://wa.me/919787196806?text=Hi%20Arun,%20I%20have%20a%20question%20about%20the%20Search,%20Social%20%26%20Systems%20book!'
};

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Rajesh K.',
    role: 'Founder, GrowthSpark Labs',
    rating: 5,
    date: 'Jun 15',
    content: "Absolutely incredible guide! Before this, we had isolated ads on Facebook and did random SEO. The 'Systems' pillar helped us connect our website forms to a CRM and set up immediate automated WhatsApp follow-ups. Our lead-to-conversion rate jumped by 22% in three weeks. Worth every penny!",
    verified: true,
    avatarBg: 'bg-emerald-900/80 text-emerald-200 border-emerald-500/30',
    initials: 'Ra',
    keywords: ['CRM', 'WhatsApp', 'Systems', 'conversion', 'SEO']
  },
  {
    id: 'rev-2',
    author: 'Sarah Jenkins',
    role: 'Freelance Digital Marketer',
    rating: 5,
    date: 'Jun 20',
    content: "Most digital marketing guides are full of useless filler definitions. Arun cuts straight to the point. The chapters on SEO vs GEO (Generative Engine Optimization) and AEO are worth the price alone. I am already using his Meta Business Manager workflow with two of my new agency clients.",
    verified: true,
    avatarBg: 'bg-blue-900/80 text-blue-200 border-blue-500/30',
    initials: 'Sa',
    keywords: ['SEO', 'GEO', 'AEO', 'Meta', 'freelance', 'agency']
  },
  {
    id: 'rev-3',
    author: 'Ethan Hunt',
    role: 'Marketing Student',
    rating: 4,
    date: 'Jun 26',
    content: "As a student, marketing textbooks are super dry. This book explains complex concepts in a highly visual and digestible way. I loved the breakdown of the Customer Journey Mapping. Lost 1 star only because I wanted more specific code snippets for Tag Manager, but the conceptual explanation was perfect.",
    verified: true,
    avatarBg: 'bg-purple-900/80 text-purple-200 border-purple-500/30',
    initials: 'Et',
    keywords: ['student', 'Customer Journey', 'visual', 'textbook']
  },
  {
    id: 'rev-4',
    author: 'Meera Nair',
    role: 'D2C Brand Creator',
    rating: 5,
    date: 'Jun 28',
    content: "A magnificent read! The 'Social' pillar details exactly how to build authentic, long-term brand trust so customers are pre-sold before they even hit your checkout button. This blueprint completely changed how we write our Instagram hook captions and email newsletters.",
    verified: true,
    avatarBg: 'bg-amber-900/80 text-amber-200 border-amber-500/30',
    initials: 'Me',
    keywords: ['Social', 'brand trust', 'Instagram', 'email', 'D2C']
  }
];

export const TARGET_PERSONAS: TargetPersona[] = [
  {
    id: 'students',
    category: 'For Career Builders',
    badge: 'STUDENTS',
    title: 'Students & Graduates',
    tagline: 'Build job-ready digital marketing skills and hands-on competence before entering the workforce.',
    description: 'Bypass dry college textbook definitions. Master real agency campaign frameworks that make you stand out in corporate job interviews and land high-paying starter roles.',
    keyOutcomes: [
      'Master industry tools & terminology',
      'Build a portfolio of real campaign plans',
      'Acknowledge interview questions with authority'
    ],
    iconName: 'GraduationCap'
  },
  {
    id: 'founders',
    category: 'For Growth Scale',
    badge: 'OWNERS',
    title: 'Entrepreneurs & Founders',
    tagline: 'Learn how to generate leads, increase sales, and grow your business online without depending entirely on expensive agencies.',
    description: 'Gain full clarity over your customer acquisition channels. Audit agency proposals, reduce wasted ad spend, and automate backend lead follow-ups.',
    keyOutcomes: [
      'Lower Customer Acquisition Cost (CAC)',
      'Automate WhatsApp & email nurture funnels',
      'Scale ad spend profitably on Meta & Google'
    ],
    iconName: 'Building2'
  },
  {
    id: 'professionals',
    category: 'For Industry Transition',
    badge: 'PROFESSIONALS',
    title: 'Working Professionals',
    tagline: "Upgrade your skills and transition seamlessly into one of the world's fastest-growing, high-yield digital industries.",
    description: 'Pivot your career into performance marketing, growth hacking, or digital strategy with a complete, structured blueprint that bridges theory and agency execution.',
    keyOutcomes: [
      'Seamless career pivot into growth roles',
      'Understand end-to-end multi-channel strategy',
      'Master GA4 analytics & Looker Studio'
    ],
    iconName: 'Briefcase'
  },
  {
    id: 'freelancers',
    category: 'For Independent Income',
    badge: 'FREELANCERS',
    title: 'Freelancers & Consultants',
    tagline: 'Learn how to attract premium clients, structure high-value services, and create steady, recurring digital income.',
    description: 'Stop undercharging for one-off tasks. Package your services into high-ticket monthly retainers and deliver measurable ROI to your agency clients.',
    keyOutcomes: [
      'Structure $1k-$5k/mo client retainers',
      'Use ready discovery call scripts & decks',
      'Deliver automated client reporting'
    ],
    iconName: 'Laptop'
  },
  {
    id: 'executives',
    category: 'For Skill Upgrades',
    badge: 'EXECUTIVES',
    title: 'Marketing Executives',
    tagline: 'Strengthen your practical, data-driven knowledge and become a highly confident, performance-oriented marketer.',
    description: 'Refine your execution speed. Implement cutting-edge AI workflows, Generative Engine Optimization (GEO), and multi-touch attribution dashboards.',
    keyOutcomes: [
      'Integrate AI prompt workflows in daily operations',
      'Master Search, Social & Systems alignment',
      'Lead high-performing marketing teams'
    ],
    iconName: 'TrendingUp'
  }
];

export const WHY_THIS_BOOK_POINTS = [
  {
    num: '01',
    title: 'Beginner Friendly',
    desc: 'No prior marketing or technical knowledge is required. We start from absolute scratch.'
  },
  {
    num: '02',
    title: 'Practical Examples',
    desc: 'Every theory is paired with visual step-by-step walk-throughs and exact click paths.'
  },
  {
    num: '03',
    title: 'Step-by-Step Learning',
    desc: 'A beautifully structured educational roadmap from basic terms to advanced setups.'
  },
  {
    num: '04',
    title: 'Real Business Case Studies',
    desc: 'Based on real agency campaigns across e-commerce, B2B, retail, and local maps.'
  },
  {
    num: '05',
    title: 'Easy-to-Understand Language',
    desc: 'Zero boring corporate jargon or overly dense academic textbook language.'
  },
  {
    num: '06',
    title: 'Complete Marketing Ecosystem',
    desc: 'Covers the entire circle: SEO, Meta, Google Ads, funnels, AI, and backend CRM.'
  },
  {
    num: '07',
    title: 'Actionable Strategies',
    desc: 'Provides concrete checklists and templates you can execute immediately.'
  },
  {
    num: '08',
    title: 'Career & Business Growth',
    desc: 'Optimized for students seeking jobs, freelancers landing clients, and founders scaling sales.'
  }
];

export const READER_OUTCOMES = [
  'Understand digital marketing with confidence',
  'Build complete marketing strategies',
  'Plan and execute campaigns',
  'Improve business visibility online',
  'Generate leads and sales',
  'Prepare for digital marketing interviews',
  'Start freelancing',
  'Build your own personal brand'
];

export const TECH_SPECS: TechSpec[] = [
  { label: 'Book Title', value: 'SEARCH, SOCIAL & SYSTEMS' },
  { label: 'Book Subtitle', value: 'Master Digital Marketing from Scratch with One Complete Guide' },
  { label: 'Author', value: 'Arun Gowtham Prabhudas' },
  { label: 'Print Format', value: 'Premium Monochrome Paperback' },
  { label: 'Companion Access', value: 'Instant Private Server Download (Checklists, Automation templates, KPI Sheets)' },
  { label: 'Page Count', value: '450+ High-Quality Monochrome Pages' },
  { label: 'Language', value: 'English' },
  { label: 'ISBN-13', value: '978-93-6012-665-0' }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Is this book suitable for absolute marketing beginners?',
    answer: 'Yes, 100%! "Search, Social & Systems" is specifically engineered to take you from total scratch to confident execution. No prior coding, marketing, or business experience is required. Every concept starts with simple real-world analogies before stepping into step-by-step click paths.'
  },
  {
    id: 'faq-2',
    question: 'How do I access the Digital Companion Blueprints?',
    answer: 'Upon completing your order, you receive instant access to our private blueprint server download link via your email and order confirmation screen. The companion kit includes downloadable PDF checklists, Meta Ads copywriting swipe files, Zapier automation workflows, Looker Studio dashboards, and KPI tracking spreadsheets.'
  },
  {
    id: 'faq-3',
    question: 'What is the delivery timeline across India?',
    answer: 'We offer FREE direct express shipping to every address across India! Orders are processed and dispatched from our printing center within 24 hours. Delivery typically takes 2 to 4 business days depending on your location, and you will receive a real-time courier tracking link via SMS & email.'
  },
  {
    id: 'faq-4',
    question: 'Does this book cover generative AI search algorithms?',
    answer: 'Yes! Chapter 7 and Chapter 19 are dedicated specifically to Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), and using AI models like ChatGPT and Gemini to automate copy, keyword clustering, and research workflows.'
  },
  {
    id: 'faq-5',
    question: 'Is there support or direct interaction with the author?',
    answer: 'Yes! Readers receive direct access to Arun Gowtham Prabhudas via WhatsApp (9787196806) and quarterly live Q&A webinars reserved exclusively for verified book owners to answer specific campaign or career questions.'
  }
];
