import { Chapter } from '../types';

export const ALL_CHAPTERS: Chapter[] = [
  {
    id: 'ch-01',
    chapterNumber: 1,
    title: 'Digital Marketing Basics',
    pillar: 'SEARCH',
    focusTag: 'BASICS',
    focus: 'Understand the core foundations of digital marketing and how organic, paid, and automated ecosystems connect to drive revenue.',
    coreSkills: [
      'Defining standard digital terminology and concepts',
      'Transitioning from legacy outbound to high-yield inbound marketing',
      'Understanding key ROI and customer acquisition formulas'
    ],
    toolkitTemplates: [
      '📁 Digital Ecosystem Map',
      '📁 Growth Core Workbook'
    ],
    summary: 'Master the fundamental architecture of modern digital marketing. Learn how customer touchpoints interconnect across search indexes, social validation channels, and backend funnels.',
    sampleExcerpt: 'Modern marketing is no longer about shouting louder than your competitors. It is about engineering predictable acquisition systems. In this chapter, we disassemble traditional funnel leaks and replace them with a connected three-pillar model: Search captures active intent, Social builds radical brand trust, and Systems automate conversion and long-term retention.',
    estimatedReadMinutes: 18
  },
  {
    id: 'ch-02',
    chapterNumber: 2,
    title: 'Search Engine Optimization (SEO)',
    pillar: 'SEARCH',
    focusTag: 'SEO ARCHITECTURE',
    focus: 'Position your brand inside Google search indexes, capture active intent keywords, and build organic authority structures.',
    coreSkills: [
      'Google indexation & web crawling mechanics',
      'Search intent mapping (Informational, Transactional, Navigational)',
      'On-Page SEO architecture and semantic markup'
    ],
    toolkitTemplates: [
      '📁 SEO Content Optimization Checklist',
      '📁 Keyword Research & Clustering Matrix'
    ],
    summary: 'A complete playbook for dominating Google search results without relying purely on paid ads. Uncover keyword intent clustering, semantic site hierarchy, and internal linking strategies.',
    sampleExcerpt: 'When a user searches for a solution on Google, they are signaling high commercial intent. Keywords are not just words; they are human intent signals. We analyze how Google algorithms index content and how to construct semantic topic clusters that signal unquestionable niche authority.',
    estimatedReadMinutes: 24
  },
  {
    id: 'ch-03',
    chapterNumber: 3,
    title: 'Technical SEO & Site Indexation',
    pillar: 'SEARCH',
    focusTag: 'TECHNICAL SEO',
    focus: 'Audit crawl budgets, optimize Core Web Vitals, fix indexation blockers, and construct XML sitemaps for instant search discoverability.',
    coreSkills: [
      'Core Web Vitals & page speed performance tuning',
      'Schema markup & structured data implementation',
      'Canonicalization & handling duplicate content'
    ],
    toolkitTemplates: [
      '📁 Technical SEO Audit Template',
      '📁 Schema Markup Generator Cheat Sheet'
    ],
    summary: 'Eliminate technical errors preventing search engines from ranking your pages. Master site speed optimization, schema JSON-LD, crawl budget efficiency, and mobile indexation.',
    sampleExcerpt: 'You can write the greatest content on the internet, but if search engine bots hit 404 loops, slow server responses, or broken canonical tags, your rankings will remain invisible. Technical SEO is the foundation upon which organic growth sits.',
    estimatedReadMinutes: 22
  },
  {
    id: 'ch-04',
    chapterNumber: 4,
    title: 'Google Ads (PPC)',
    pillar: 'SEARCH',
    focusTag: 'PAID SEARCH',
    focus: 'Run high-converting Search, Display, and Video campaigns that target active high-intent buyers exactly when they are ready to purchase.',
    coreSkills: [
      'Google Search Ad copywriting and extension structuring',
      'Bidding strategies (Target CPA, Target ROAS, Maximize Conversions)',
      'Quality Score optimization & negative keyword filters'
    ],
    toolkitTemplates: [
      '📁 Google Ads Campaign Setup Matrix',
      '📁 Ad Copy Variation & Headlines Swipelist'
    ],
    summary: 'Learn how to architect, launch, and scale profitable Google Ads campaigns. Master keyword match types, negative keywords, high Quality Scores, and ad extensions.',
    sampleExcerpt: 'Paid search is the fastest method to validate commercial offers. By bidding on exact transactional queries, you place your product directly at the point of buy decisions. The key lies in maintaining high Quality Scores to pay less per click than competitors.',
    estimatedReadMinutes: 26
  },
  {
    id: 'ch-05',
    chapterNumber: 5,
    title: 'Organic Authority & Link Building',
    pillar: 'SEARCH',
    focusTag: 'OFF-PAGE SEO',
    focus: 'Build high-trust backlinks, execute digital PR campaigns, and establish domain authority across Google search ecosystem.',
    coreSkills: [
      'Ethical backlink acquisition strategies',
      'Digital PR & HARO media outreach',
      'Unlinked brand mentions recovery'
    ],
    toolkitTemplates: [
      '📁 Link Building Outreach Scripts',
      '📁 Domain Authority Tracker Sheet'
    ],
    summary: 'Construct an impenetrable backlink profile using digital PR, guest contributor strategies, and resource page placements that search algorithms trust.',
    estimatedReadMinutes: 20
  },
  {
    id: 'ch-06',
    chapterNumber: 6,
    title: 'Google Search Console & Local SEO',
    pillar: 'SEARCH',
    focusTag: 'LOCAL MAPS & GSC',
    focus: 'Optimize Google Business Profiles, dominate local map packs, and extract deep keyword performance insights from Google Search Console.',
    coreSkills: [
      'Google Business Profile (GBP) optimization',
      'Local citation building & NAP consistency',
      'Search Console impression & click path analysis'
    ],
    toolkitTemplates: [
      '📁 Local SEO GBP Checklist',
      '📁 Search Console Performance Analyzer'
    ],
    summary: 'A step-by-step framework for capturing local search traffic and mastering Google Search Console data to uncover hidden keyword goldmines.',
    estimatedReadMinutes: 21
  },
  {
    id: 'ch-07',
    chapterNumber: 7,
    title: 'Generative Engine Optimization (GEO & AEO)',
    pillar: 'SEARCH',
    focusTag: 'FUTURE OF SEARCH',
    focus: 'Adapt search strategies for AI Overviews, SearchGPT, and conversational search engines to capture zero-click answers.',
    coreSkills: [
      'AEO (Answer Engine Optimization) content structuring',
      'Formatting content for LLM entity extraction',
      'Brand positioning in ChatGPT & Perplexity responses'
    ],
    toolkitTemplates: [
      '📁 GEO Content Formatting Blueprint',
      '📁 AI Citation Readiness Scorecard'
    ],
    summary: 'Prepare your brand for the new era of AI search. Learn how generative answer engines index sources and how to ensure your brand is cited as the definitive answer.',
    estimatedReadMinutes: 25
  },
  {
    id: 'ch-08',
    chapterNumber: 8,
    title: 'Meta Advertising (FB & IG)',
    pillar: 'SOCIAL',
    focusTag: 'SOCIAL ADS',
    focus: 'Create social media ads that generate consistent lead streams, implement tracking pixels, and define advanced custom audiences.',
    coreSkills: [
      'Meta Business Manager & Ad Account configuration',
      'Targeting strategies (Broad, Interest, Lookalike 1-5%)',
      'Ad creative testing frameworks (Hook, Body, CTA variations)'
    ],
    toolkitTemplates: [
      '📁 Meta Ads Campaign Architecture Blueprint',
      '📁 High-Converting Creative Framework'
    ],
    summary: 'Master Meta Ad Account structure, campaign budget optimization (CBO), creative iteration frameworks, and scale profitable Facebook & Instagram campaigns.',
    sampleExcerpt: 'Social ads interrupt user browsing with compelling value propositions. Success on Meta relies 80% on creative hooks and messaging angle testing, and 20% on algorithm feed placement. We build ad creative matrices that stop the scroll.',
    estimatedReadMinutes: 28
  },
  {
    id: 'ch-09',
    chapterNumber: 9,
    title: 'Meta Pixel & Conversions API (CAPI)',
    pillar: 'SOCIAL',
    focusTag: 'DATA & CAPI',
    focus: 'Configure server-side event tracking, bypass iOS tracking restrictions, and feed high-quality conversion signals back into Meta algorithms.',
    coreSkills: [
      'Meta Conversions API (CAPI) server-side setup',
      'Event Deduplication & Event Quality Score optimization',
      'Custom Conversion tracking for leads & purchases'
    ],
    toolkitTemplates: [
      '📁 Meta Pixel & CAPI Audit Template',
      '📁 Event Tracking Mapping Sheet'
    ],
    summary: 'Never lose track of ad performance. Implement server-to-server Conversions API tracking to maintain accurate attribution and train ad algorithms.',
    estimatedReadMinutes: 23
  },
  {
    id: 'ch-10',
    chapterNumber: 10,
    title: 'Social Media Marketing & Brand Trust',
    pillar: 'SOCIAL',
    focusTag: 'ORGANIC BRAND',
    focus: 'Structure high-trust content workflows that grow organic audience engagement across LinkedIn, Instagram, and YouTube.',
    coreSkills: [
      'Building organic brand authority & trust grids',
      'Platform-specific content formats (Reels, Carousels, Text Posts)',
      'Community engagement & DM strategy'
    ],
    toolkitTemplates: [
      '📁 Social Media Content Calendar Blueprint',
      '📁 Brand Trust Building Playbook'
    ],
    summary: 'Transform passive followers into passionate brand advocates. Uncover content pillars, brand storytelling, and high-converting visual grids.',
    estimatedReadMinutes: 22
  },
  {
    id: 'ch-11',
    chapterNumber: 11,
    title: 'Content Marketing Playbooks',
    pillar: 'SOCIAL',
    focusTag: 'HUB & SPOKE',
    focus: 'Produce content that educates and converts. Master the Hub-and-Spoke content strategy to build effortless digital presence.',
    coreSkills: [
      'The Hub-and-Spoke content repurposing framework',
      'Creating pillar assets (Ebooks, Whitepapers, Case Studies)',
      'Distribution channels & syndication maps'
    ],
    toolkitTemplates: [
      '📁 Hub-and-Spoke Content Distribution Map',
      '📁 High-Yield Repurposing Worksheet'
    ],
    summary: 'Stop creating content from scratch every single day. Learn how 1 comprehensive long-form pillar asset produces 20+ micro-content pieces across channels.',
    estimatedReadMinutes: 21
  },
  {
    id: 'ch-12',
    chapterNumber: 12,
    title: 'LinkedIn & B2B Lead Generation',
    pillar: 'SOCIAL',
    focusTag: 'B2B GROWTH',
    focus: 'Position personal brands on LinkedIn, execute account-based marketing (ABM), and generate premium corporate leads.',
    coreSkills: [
      'LinkedIn Profile Optimization for high-ticket leads',
      'Thought leadership content creation',
      'Social selling & outbound warm outreach'
    ],
    toolkitTemplates: [
      '📁 LinkedIn B2B Profile Blueprint',
      '📁 Outbound Outreach Sequence Templates'
    ],
    summary: 'The ultimate guide for consultants, agencies, and B2B professionals to capture high-value clients directly on LinkedIn.',
    estimatedReadMinutes: 20
  },
  {
    id: 'ch-13',
    chapterNumber: 13,
    title: 'YouTube Growth & Video Marketing',
    pillar: 'SOCIAL',
    focusTag: 'VIDEO ENGINES',
    focus: 'Engine video thumbnails, retain audience watch time, and turn YouTube search traffic into recurring business leads.',
    coreSkills: [
      'YouTube SEO & Title/Thumbnail click-through rate tuning',
      'Scripting retention hooks (0-30 second window)',
      'End screens & video call-to-action funnels'
    ],
    toolkitTemplates: [
      '📁 YouTube Video Scripting Blueprint',
      '📁 CTR & Retention Audit Checklist'
    ],
    summary: 'Build an evergreen organic video growth channel that drives high-trust views and customers for years after publishing.',
    estimatedReadMinutes: 25
  },
  {
    id: 'ch-14',
    chapterNumber: 14,
    title: 'Short-Form Video (Reels & Shorts)',
    pillar: 'SOCIAL',
    focusTag: 'VIRAL FORMATS',
    focus: 'Master viral short-form video hooks, visual pacing, audio trends, and rapid audience growth on Instagram Reels and YouTube Shorts.',
    coreSkills: [
      'Short-form hook psychology and retention edits',
      'Batch creation & editing production pipelines',
      'Converting viral Reel traffic into email leads'
    ],
    toolkitTemplates: [
      '📁 50 High-Converting Hook Formulas',
      '📁 Short-Form Production Pipeline Sheet'
    ],
    summary: 'Capture short attention spans with psychological hooks and turn viral reel views into measurable lead capture funnel conversions.',
    estimatedReadMinutes: 19
  },
  {
    id: 'ch-15',
    chapterNumber: 15,
    title: 'Sales Funnels & Conversion Engineering',
    pillar: 'SYSTEMS',
    focusTag: 'FUNNELS',
    focus: 'Architect high-converting landing pages, value ladders, lead magnet opt-ins, and frictionless checkout flows.',
    coreSkills: [
      'Value Ladder & Offer Design (Front-end to Back-end)',
      'Landing Page UX/UI copy & wireframing',
      'A/B testing headlines, CTA buttons & order bumps'
    ],
    toolkitTemplates: [
      '📁 High-Converting Landing Page Wireframe',
      '📁 Offer Value Ladder Planner'
    ],
    summary: 'Turn cold traffic into eager paying customers. Blueprint complete conversion paths with high-converting copy layouts and bump offers.',
    estimatedReadMinutes: 27
  },
  {
    id: 'ch-16',
    chapterNumber: 16,
    title: 'Email Marketing Systems & Automation',
    pillar: 'SYSTEMS',
    focusTag: 'EMAIL AUTOMATION',
    focus: 'Build highly personalized, automated subscriber sequences that nurture customer retention and maximize lifetime value.',
    coreSkills: [
      'Lead magnet delivery & welcome nurture sequences',
      'Cart abandonment & re-engagement workflows',
      'List segmentation & deliverability optimization'
    ],
    toolkitTemplates: [
      '📁 5-Part Automated Email Nurture Sequence',
      '📁 Cart Abandonment High-Yield Swipelist'
    ],
    summary: 'Email marketing generates the highest ROI in digital business. Build automated sequences that generate sales 24/7 on autopilot.',
    sampleExcerpt: 'Your social media followers belong to the platform algorithm. Your email list belongs to you. In this chapter, we build automated welcome sequences, abandoned cart triggers, and segmented broadcasts that convert subscribers into multi-time repeat buyers.',
    estimatedReadMinutes: 26
  },
  {
    id: 'ch-17',
    chapterNumber: 17,
    title: 'CRM Integration & No-Code Automation',
    pillar: 'SYSTEMS',
    focusTag: 'NO-CODE & CRM',
    focus: 'Connect lead forms directly to CRMs, automate WhatsApp & SMS follow-ups using Zapier/Make, and streamline sales pipelines.',
    coreSkills: [
      'CRM pipeline setup (HubSpot, LeadSquared, Zoho)',
      'Automated instant WhatsApp & SMS notifications',
      'Zapier & Make multi-step webhook integrations'
    ],
    toolkitTemplates: [
      '📁 Zapier Automation Blueprints',
      '📁 CRM Sales Pipeline Stage Configurator'
    ],
    summary: 'Eliminate manual lead follow-up delays. Connect every web opt-in form directly to your CRM with instant instant automated WhatsApp notifications.',
    estimatedReadMinutes: 23
  },
  {
    id: 'ch-18',
    chapterNumber: 18,
    title: 'Performance Analytics & Tracking Dashboards',
    pillar: 'SYSTEMS',
    focusTag: 'ANALYTICS',
    focus: 'Analyze conversion paths, find customer drop-offs, and monitor advertising spend with custom-engineered dashboards.',
    coreSkills: [
      'Google Analytics 4 (GA4) custom event tracking',
      'Looker Studio real-time marketing dashboard creation',
      'UTM parameter taxonomy & attribution modeling'
    ],
    toolkitTemplates: [
      '📁 Looker Studio Marketing Dashboard Template',
      '📁 UTM Builder & Tracking Taxonomy Sheet'
    ],
    summary: 'Stop guessing what works. Build custom real-time analytics dashboards that show exact Customer Acquisition Costs (CAC) and Return on Ad Spend (ROAS).',
    estimatedReadMinutes: 25
  },
  {
    id: 'ch-19',
    chapterNumber: 19,
    title: 'Generative AI in Copywriting & Marketing',
    pillar: 'SYSTEMS',
    focusTag: 'AI WORKFLOWS',
    focus: 'Integrate model workflows like ChatGPT and Gemini to instantly draft compelling copy and automate research on autopilot.',
    coreSkills: [
      'Prompt engineering for ad headlines, emails & SEO articles',
      'Custom GPT/Gemini workflow creation for market research',
      'Automating competitor analysis with AI models'
    ],
    toolkitTemplates: [
      '📁 Master Marketing Prompt Library (100+ Prompts)',
      '📁 AI Copywriting Workflow Blueprint'
    ],
    summary: 'Supercharge your output 10x without sacrificing human quality. Build custom AI workflows that generate ad copy, customer avatars, and strategy briefs.',
    estimatedReadMinutes: 24
  },
  {
    id: 'ch-20',
    chapterNumber: 20,
    title: 'Freelancing, Client Acquisition & Retainers',
    pillar: 'SYSTEMS',
    focusTag: 'FREELANCE & AGENCY',
    focus: 'Structure high-value digital marketing service packages, land premium retainers, and build a high-income consulting business.',
    coreSkills: [
      'Pricing digital marketing packages ($1k-$5k/mo retainers)',
      'Client discovery calls & pitch proposal decks',
      'Client reporting & monthly ROI presentation'
    ],
    toolkitTemplates: [
      '📁 Client Discovery Call Script',
      '📁 High-Value Marketing Proposal Deck Template'
    ],
    summary: 'Turn your digital marketing skills into a profitable freelance practice or agency. Learn pricing, proposal pitching, and monthly client retainer structures.',
    estimatedReadMinutes: 28
  },
  {
    id: 'ch-21',
    chapterNumber: 21,
    title: 'The Master Growth Operating System',
    pillar: 'SYSTEMS',
    focusTag: 'MASTER OPERATING SYSTEM',
    focus: 'Synthesize Search, Social, and Systems into one cohesive, automated marketing flywheel that scales business revenue predictably.',
    coreSkills: [
      'Mapping the complete end-to-end customer journey',
      'Deploying the 90-day growth execution plan',
      'Measuring lifetime value (LTV) and scaling budgets safely'
    ],
    toolkitTemplates: [
      '📁 Master Growth Operating System Blueprint',
      '📁 90-Day Execution Calendar & KPI Scorecard'
    ],
    summary: 'The capstone chapter where all 21 chapters unite. Build your custom 90-day execution roadmap and scale your marketing system with total clarity.',
    sampleExcerpt: 'Digital marketing is not a collection of disconnected tactics. It is a single, synchronized machine. When your Search capture feeds your Social trust engine, and your Systems automate conversion and retention, growth becomes predictable, scalable, and unstoppable.',
    estimatedReadMinutes: 30
  }
];
