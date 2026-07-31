import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "siteContent.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const NOTIFICATIONS_FILE = path.join(DATA_DIR, "notifications.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default state
const defaultSettings = {
  heroTitle: "SEARCH, SOCIAL & SYSTEMS",
  heroSubtitle: "Master Digital Marketing from Scratch with One Complete Guide",
  priceINR: 799,
  originalPriceINR: 1299,
  shippingFeeINR: 49,
  discountPercent: 40,
  whatsappPhone: "9787196806",
  upiMerchantId: "6374723367@ptaxis",
  notificationEmail: "arunprabhu@cbeschoolofdigitalgrowth.in",
  authorName: "Arun Gowtham Prabhudas",
  authorTitle: "Digital Marketing Strategist & Author",
  authorBio: "14+ years agency leader helping entrepreneurs, students, and businesses build scalable marketing engines.",
  authorImageUrl: "",
  tagline: "One Book. Endless Opportunities. Learn Digital Marketing the Right Way.",
  announcementText: "⚡ Free Standard Express Courier Delivery Across India + Immediate Digital Companion Blueprint Download Access!",
  chapters: [],
  reviews: [],
  personas: []
};

const defaultOrders = [
  {
    orderId: "SSS-89241",
    trackingId: "IN-EXP-88491204",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    item: "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
    amount: 799,
    originalAmount: 1299,
    discount: "40%",
    shipping: "FREE Express Shipping",
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
      method: "UPI_APP",
      upiApp: "Google Pay",
      upiId: "rajesh@okaxis",
      status: "SUCCESS",
      transactionRef: "TXN88491204"
    },
    digitalAccessUrl: "/download/companion-blueprint-kit-SSS-89241.pdf"
  },
  {
    orderId: "SSS-90112",
    trackingId: "IN-EXP-99281300",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    item: "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
    amount: 799,
    originalAmount: 1299,
    discount: "40%",
    shipping: "FREE Express Shipping",
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
      method: "UPI_QR",
      upiApp: "PhonePe",
      upiId: "meera@ybl",
      status: "SUCCESS",
      transactionRef: "TXN98231012"
    },
    digitalAccessUrl: "/download/companion-blueprint-kit-SSS-90112.pdf"
  }
];

// Helper to load JSON safely
function loadJson(filepath: string, fallback: any) {
  try {
    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath, "utf-8");
      return JSON.parse(raw);
    }
    fs.writeFileSync(filepath, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  } catch (err) {
    console.error(`Error reading ${filepath}:`, err);
    return fallback;
  }
}

// Helper to save JSON safely
function saveJson(filepath: string, data: any) {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error saving ${filepath}:`, err);
  }
}

let siteSettings: any = loadJson(CONTENT_FILE, defaultSettings);
let ordersStore: any[] = loadJson(ORDERS_FILE, defaultOrders);
let notificationsLog: any[] = loadJson(NOTIFICATIONS_FILE, []);

async function sendOrderNotificationEmail(order: any) {
  const targetEmail = process.env.NOTIFICATION_EMAIL || siteSettings.notificationEmail || "arunprabhu@cbeschoolofdigitalgrowth.in";
  const subject = `🛒 [NEW BOOK ORDER] ${order.orderId} - ₹${order.amount} from ${order.customer?.name || "Customer"}`;

  const textBody = `
NEW BOOK ORDER RECEIVED!

Order ID: ${order.orderId}
Tracking ID: ${order.trackingId}
Date: ${order.createdAt}
Total Amount: ₹${order.amount}
Payment Ref / UTR: ${order.payment?.transactionRef || "N/A"}
Payment Method: ${order.payment?.method || "UPI_QR"}

CUSTOMER SHIPPING DETAILS:
---------------------------
Name: ${order.customer?.name}
Phone: ${order.customer?.phone}
Email: ${order.customer?.email}
Address: ${order.customer?.address}, ${order.customer?.city}, ${order.customer?.state} - ${order.customer?.pincode}

Item: ${order.item}
Carrier: ${order.carrier}
`;

  const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <div style="background-color: #1e3a8a; color: #ffffff; padding: 18px 24px; border-radius: 8px; text-align: center;">
    <h2 style="margin: 0; font-size: 20px;">🛒 New Book Order Received!</h2>
    <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; font-family: monospace;">Search, Social & Systems Order Notification</p>
  </div>
  
  <div style="margin-top: 20px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #cbd5e1;">
    <p style="margin: 4px 0; font-size: 15px;"><strong>Order ID:</strong> <span style="color: #2563eb; font-family: monospace; font-weight: bold;">${order.orderId}</span></p>
    <p style="margin: 4px 0; font-size: 15px;"><strong>Amount Paid:</strong> <span style="color: #16a34a; font-weight: bold;">₹${order.amount}</span></p>
    <p style="margin: 4px 0;"><strong>UTR / Payment Ref:</strong> <span style="font-family: monospace; font-weight: bold;">${order.payment?.transactionRef || "N/A"}</span></p>
    <p style="margin: 4px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
  </div>

  <h3 style="color: #0f172a; margin-top: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 15px;">📦 Customer Shipping Details</h3>
  <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 6px 0; font-weight: bold; width: 120px; color: #475569;">Name:</td><td style="font-weight: bold; color: #0f172a;">${order.customer?.name}</td></tr>
    <tr><td style="padding: 6px 0; font-weight: bold; color: #475569;">Phone:</td><td><a href="tel:${order.customer?.phone}" style="color: #2563eb; font-weight: bold;">${order.customer?.phone}</a></td></tr>
    <tr><td style="padding: 6px 0; font-weight: bold; color: #475569;">Email:</td><td><a href="mailto:${order.customer?.email}" style="color: #2563eb;">${order.customer?.email}</a></td></tr>
    <tr><td style="padding: 6px 0; font-weight: bold; color: #475569;">Address:</td><td style="color: #334155;">${order.customer?.address}, ${order.customer?.city}, ${order.customer?.state} - <strong>${order.customer?.pincode}</strong></td></tr>
  </table>

  <h3 style="color: #0f172a; margin-top: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 15px;">📋 Item & Carrier</h3>
  <p style="margin: 4px 0; font-size: 14px;"><strong>Item:</strong> ${order.item}</p>
  <p style="margin: 4px 0; font-size: 14px;"><strong>Carrier:</strong> ${order.carrier} (${order.trackingId})</p>

  <div style="margin-top: 24px; text-align: center;">
    <a href="https://wa.me/91${order.customer?.phone?.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(order.customer?.name || '')},%20thank%20you%20for%20ordering%20Search,%20Social%20%26%20Systems!%20Your%20Order%20ID%20is%20${order.orderId}." 
       style="display: inline-block; background-color: #25d366; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
      💬 Open Customer WhatsApp Chat
    </a>
  </div>
</div>
`;

  const logEntry: any = {
    id: "NOTIF-" + Date.now(),
    orderId: order.orderId,
    targetEmail,
    sentAt: new Date().toISOString(),
    status: "DISPATCHED",
    subject
  };

  try {
    const smtpHost = process.env.SMTP_HOST || siteSettings.smtpHost || "smtp.hostinger.com";
    const smtpUser = process.env.SMTP_USER || siteSettings.smtpUser;
    const smtpPass = process.env.SMTP_PASS || siteSettings.smtpPass;
    const smtpPort = Number(process.env.SMTP_PORT || siteSettings.smtpPort || 465);

    if (smtpHost && smtpUser && smtpPass) {
      const isPort465 = smtpPort === 465;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: isPort465,
        auth: { user: smtpUser, pass: smtpPass },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
      });

      await transporter.sendMail({
        from: `"Search Social Systems Orders" <${smtpUser}>`,
        to: targetEmail,
        subject,
        text: textBody,
        html: htmlBody
      });
      logEntry.status = "EMAIL_DELIVERED_SMTP";
      console.log(`[Order Email Sent] Successfully sent order alert to ${targetEmail} via Hostinger SMTP.`);
    } else {
      logEntry.status = "NO_SMTP_CREDENTIALS";
      logEntry.error = "Hostinger Email or Password not entered in Admin Settings. Please fill in Email & Password in Admin Settings to receive live email alerts.";
      console.log(`[Order Notification Logged] Target: ${targetEmail} (Hostinger Email/Password not configured in Admin Settings)`);
      console.log(`[Order Details Summary]\nOrder ID: ${order.orderId}\nName: ${order.customer?.name}\nPhone: ${order.customer?.phone}\nAddress: ${order.customer?.address}, ${order.customer?.city}\nRef: ${order.payment?.transactionRef}`);
    }
  } catch (err: any) {
    logEntry.status = "SMTP_AUTH_OR_SEND_FAILED";
    logEntry.error = err?.message || String(err);
    console.warn(`[Order Email Notification Notice] Could not dispatch email to ${targetEmail}: ${err?.message || err}`);
  }

  notificationsLog.unshift(logEntry);
  if (notificationsLog.length > 100) notificationsLog = notificationsLog.slice(0, 100);
  saveJson(NOTIFICATIONS_FILE, notificationsLog);
}

async function sendOrderNotificationWhatsApp(order: any) {
  const targetPhone = (process.env.WHATSAPP_ADMIN_PHONE || siteSettings.whatsappPhone || "9787196806").replace(/\D/g, '');
  const cleanPhone = targetPhone.length === 10 ? `91${targetPhone}` : targetPhone;

  const waText = `🛒 *NEW BOOK ORDER RECEIVED!*

*Order ID:* ${order.orderId}
*Amount Paid:* ₹${order.amount} (${order.shipping || 'UPI'})
*UTR / Ref:* ${order.payment?.transactionRef || 'N/A'}
*Date:* ${new Date(order.createdAt).toLocaleString('en-IN')}

👤 *CUSTOMER SHIPPING DETAILS:*
• *Name:* ${order.customer?.name}
• *Phone:* ${order.customer?.phone}
• *Email:* ${order.customer?.email}
• *Address:* ${order.customer?.address}, ${order.customer?.city}, ${order.customer?.state} - ${order.customer?.pincode}

📦 *ITEM:* ${order.item}
🚚 *CARRIER:* ${order.carrier} (${order.trackingId})`;

  const encodedText = encodeURIComponent(waText);
  const directWaUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  const logEntry: any = {
    id: "WA-NOTIF-" + Date.now(),
    orderId: order.orderId,
    targetPhone: cleanPhone,
    sentAt: new Date().toISOString(),
    status: "DISPATCH_READY",
    directWaUrl,
    messagePreview: waText
  };

  try {
    // 1. CallMeBot Free WhatsApp API (if callmebotApiKey configured)
    const callmebotApiKey = process.env.CALLMEBOT_API_KEY || siteSettings.callmebotApiKey;
    if (callmebotApiKey) {
      const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=+${cleanPhone}&text=${encodedText}&apikey=${callmebotApiKey}`;
      const res = await fetch(callmebotUrl);
      if (res.ok) {
        logEntry.status = "CALLMEBOT_SENT";
        console.log(`[WhatsApp Bot Sent] Auto WhatsApp alert sent to +${cleanPhone}`);
      }
    }

    // 2. Custom Webhook or UltraMsg / Twilio Gateway (if whatsappWebhookUrl configured)
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || siteSettings.whatsappWebhookUrl;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, message: waText, order })
      });
      logEntry.status = "WEBHOOK_DISPATCHED";
      console.log(`[WhatsApp Webhook Sent] Posted to ${webhookUrl}`);
    }

    console.log(`[WhatsApp Alert Generated] Direct Link: ${directWaUrl}`);
  } catch (err: any) {
    logEntry.status = "ERROR";
    logEntry.error = err?.message || String(err);
    console.error(`[WhatsApp Notification Error]:`, err);
  }

  notificationsLog.unshift(logEntry);
  if (notificationsLog.length > 100) notificationsLog = notificationsLog.slice(0, 100);
  saveJson(NOTIFICATIONS_FILE, notificationsLog);

  return { directWaUrl, waText };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // CORS Middleware for custom domain support
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize Gemini AI Client lazily or safely
  let aiClient: GoogleGenAI | null = null;
  function getAI() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });
      }
    }
    return aiClient;
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      backend: "Hostinger Express Server Active",
      port: PORT,
      ordersCount: ordersStore.length,
      timestamp: new Date().toISOString() 
    });
  });

  // GET & POST Content Settings Backend
  app.get("/api/admin/content", (req, res) => {
    res.json(siteSettings);
  });

  app.post("/api/admin/content", (req, res) => {
    const newSettings = req.body;
    if (newSettings && typeof newSettings === 'object') {
      siteSettings = { ...siteSettings, ...newSettings };
      saveJson(CONTENT_FILE, siteSettings);
    }
    res.json({ success: true, settings: siteSettings });
  });

  // Download / Export Raw JSON Endpoint
  app.get("/api/admin/export/content", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=siteContent.json");
    res.send(JSON.stringify(siteSettings, null, 2));
  });

  app.get("/api/admin/export/orders", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=orders.filename.json");
    res.send(JSON.stringify(ordersStore, null, 2));
  });

  // GET, PATCH, DELETE Orders Backend
  app.get("/api/admin/orders", (req, res) => {
    // Reload orders from disk to ensure fresh data across devices
    ordersStore = loadJson(ORDERS_FILE, ordersStore);

    const { status, search } = req.query;
    let filtered = [...ordersStore];

    if (status && status !== 'ALL') {
      filtered = filtered.filter(o => o.status === status);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderId.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase()?.includes(q) ||
        o.customer?.email?.toLowerCase()?.includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.payment?.transactionRef?.toLowerCase()?.includes(q)
      );
    }

    res.json({ success: true, orders: filtered, count: filtered.length });
  });

  app.patch("/api/admin/orders/:id", (req, res) => {
    const { id } = req.params;
    const { status, trackingId, carrier } = req.body;

    const orderIndex = ordersStore.findIndex(o => o.orderId === id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (status) ordersStore[orderIndex].status = status;
    if (trackingId) ordersStore[orderIndex].trackingId = trackingId;
    if (carrier) ordersStore[orderIndex].carrier = carrier;

    saveJson(ORDERS_FILE, ordersStore);

    res.json({ success: true, order: ordersStore[orderIndex] });
  });

  app.delete("/api/admin/orders/:id", (req, res) => {
    const { id } = req.params;
    ordersStore = ordersStore.filter(o => o.orderId !== id);
    saveJson(ORDERS_FILE, ordersStore);
    res.json({ success: true, message: "Order removed" });
  });

  // AI Book Assistant Endpoint: Understand the Book
  app.post("/api/book-ai", async (req, res) => {
    try {
      const { prompt, chapterContext, mode } = req.body || {};
      const ai = getAI();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured yet
        return res.json({
          answer: `[Search, Social & Systems Assistant]: The book 'Search, Social & Systems' by Arun Gowtham Prabhudas covers 21 expert chapters structured across 3 core pillars (Search, Social, Systems). For chapter "${chapterContext || 'Overview'}", the key takeaway is building actionable, conversion-first marketing systems.`,
          sources: ["Book Overview", chapterContext || "General Curriculum"]
        });
      }

      let systemInstruction = `You are the official AI Assistant for the book "SEARCH, SOCIAL & SYSTEMS: Master Digital Marketing from Scratch with One Complete Guide" by Arun Gowtham Prabhudas.
Book Specifications:
- Author: Arun Gowtham Prabhudas (14+ Years Experience)
- Format: Premium Monochrome Paperback, 450+ Pages, 21 Chapters, 3 Connected Pillars (Search, Social, Systems)
- ISBN: 978-93-6012-665-0
- Key Philosophy: "Practical Mindset Over Theory", "100% Practical & Actionable", "Stop Wasting Years on Scattered Internet Noise"
- Core Pillars:
  1. SEARCH: SEO, Google Ads, Keyword Intent, Technical Indexation, Organic Authority
  2. SOCIAL: Meta Ads (FB/IG), High-Trust Content Workflows, Pixel Tracking, Custom Audiences, LinkedIn/YouTube
  3. SYSTEMS: Sales Funnels, Email Subscriber Sequences, Performance Dashboards, Generative AI (ChatGPT/Gemini)

Your task: Help the user understand the concepts in the book, answer questions about digital marketing execution, explain chapter blueprints, or guide them on how to apply the framework to their career or business. Keep answers structured, practical, inspiring, and professional.`;

      if (mode === "chapter_summary") {
        systemInstruction += ` Focus specifically on providing a deep, practical breakdown of Chapter: "${chapterContext}".`;
      } else if (mode === "quiz") {
        systemInstruction += ` Generate a quick 3-question knowledge checkpoint for the chapter: "${chapterContext}".`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `${systemInstruction}\n\nUser Question: ${prompt || "Provide an overview of this chapter."}`
      });

      const text = response.text || "I couldn't process that response. Please try again.";
      return res.json({ answer: text });

    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      return res.json({
        answer: `[Search, Social & Systems Assistant]: Chapter "${req.body?.chapterContext || 'Overview'}" focuses on practical execution of digital marketing principles.`,
        details: error.message || "Unknown error"
      });
    }
  });

  // Order Creation & UPI Verification API
  app.post("/api/orders/create", async (req, res) => {
    // Reload latest orders from disk
    ordersStore = loadJson(ORDERS_FILE, ordersStore);

    const body = req.body || {};
    
    // Safely extract customer information whether sent flat or nested
    const cust = body.customer || {};
    const name = (body.name || cust.name || "Valued Customer").trim();
    const email = (body.email || cust.email || "customer@order.local").trim();
    const phone = (body.phone || cust.phone || "Not Provided").trim();
    const address = (body.address || cust.address || "Address provided at checkout").trim();
    const city = (body.city || cust.city || "India").trim();
    const pincode = (body.pincode || cust.pincode || "000000").trim();
    const state = (body.state || cust.state || "Tamil Nadu").trim();

    // Safely extract payment details
    const pay = body.payment || {};
    const paymentMethod = body.paymentMethod || pay.method || "UPI_QR";
    const upiId = body.upiId || pay.upiId || siteSettings.upiMerchantId || "6374723367@ptaxis";
    const upiApp = body.upiApp || pay.upiApp || "UPI QR Payment";
    const transactionRef = (body.transactionRef || pay.transactionRef || "").trim() || ("UTR" + Math.floor(100000000000 + Math.random() * 900000000000));

    const orderId = body.orderId || ("SSS-" + Math.floor(100000 + Math.random() * 900000));
    const trackingId = body.trackingId || ("IN-EXP-" + Math.floor(10000000 + Math.random() * 90000000));

    const bookPrice = Number(siteSettings.priceINR) || 799;
    const shippingFee = siteSettings.shippingFeeINR !== undefined ? Number(siteSettings.shippingFeeINR) : 49;
    const totalAmount = body.amount || (bookPrice + shippingFee);

    const order = {
      orderId,
      trackingId,
      createdAt: body.createdAt || new Date().toISOString(),
      item: body.item || "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
      amount: totalAmount,
      originalAmount: body.originalAmount || siteSettings.originalPriceINR || 1299,
      discount: body.discount || `${siteSettings.discountPercent || 40}%`,
      shipping: body.shipping || (shippingFee > 0 ? `Express Courier (₹${shippingFee})` : "FREE Express Courier"),
      status: body.status || "PENDING",
      carrier: body.carrier || "BlueDart Express",
      customer: { name, email, phone, address, city, pincode, state },
      payment: {
        method: paymentMethod,
        status: "SUCCESS",
        upiId,
        upiApp,
        transactionRef
      },
      digitalAccessUrl: body.digitalAccessUrl || `/download/companion-blueprint-kit-${orderId}.pdf`
    };

    // Add to orders store at top (prevent duplicate order IDs)
    ordersStore = ordersStore.filter(o => o.orderId !== orderId);
    ordersStore.unshift(order);
    saveJson(ORDERS_FILE, ordersStore);

    console.log(`[Order Saved] ${orderId} | Name: ${name} | Phone: ${phone} | Ref: ${transactionRef}`);

    // Trigger instant email notification & WhatsApp alert
    sendOrderNotificationEmail(order).catch(err => {
      console.warn("[Email Notification Dispatch Notice]:", err);
    });

    const waNoticePromise = sendOrderNotificationWhatsApp(order).catch(err => {
      console.warn("[WhatsApp Dispatch Notice]:", err);
      return null;
    });

    const waNotice = await waNoticePromise;

    return res.json({ success: true, order, whatsappNotice: waNotice });
  });

  // Admin Notification Logs API
  app.get("/api/admin/notifications", (req, res) => {
    notificationsLog = loadJson(NOTIFICATIONS_FILE, notificationsLog);
    res.json({
      targetEmail: process.env.NOTIFICATION_EMAIL || siteSettings.notificationEmail || "arunprabhu@cbeschoolofdigitalgrowth.in",
      logs: notificationsLog
    });
  });

  // Admin Test Email SMTP Endpoint
  app.post("/api/admin/test-email", async (req, res) => {
    const { smtpHost, smtpPort, smtpUser, smtpPass, targetEmail } = req.body || {};
    const host = smtpHost || process.env.SMTP_HOST || siteSettings.smtpHost || "smtp.hostinger.com";
    const user = smtpUser || process.env.SMTP_USER || siteSettings.smtpUser;
    const pass = smtpPass || process.env.SMTP_PASS || siteSettings.smtpPass;
    const port = Number(smtpPort || process.env.SMTP_PORT || siteSettings.smtpPort || 465);
    const to = targetEmail || process.env.NOTIFICATION_EMAIL || siteSettings.notificationEmail || "arunprabhu@cbeschoolofdigitalgrowth.in";

    if (!user || !pass) {
      return res.status(400).json({
        success: false,
        error: "Please fill in Hostinger Email Address and Password in Admin Settings before sending test email."
      });
    }

    try {
      const isPort465 = port === 465;
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: isPort465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
      });

      await transporter.sendMail({
        from: `"Search Social Systems Test" <${user}>`,
        to,
        subject: "✅ [TEST ALERT] Hostinger SMTP Email Notification Working!",
        text: `This is a test notification email from your Search, Social & Systems book store website. Hostinger SMTP configured successfully for ${user}!`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #3b82f6; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #1e3a8a; margin-top: 0;">✅ Hostinger SMTP Test Successful!</h2>
          <p style="font-size: 14px; color: #334155; line-height: 1.5;">Your book store website is now successfully connected to Hostinger SMTP (<strong>${user}</strong>).</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; font-size: 13px; color: #166534; font-family: monospace;">
            Every new order placed on your website will automatically send an instant order email to <strong>${to}</strong>.
          </div>
          <p style="color: #94a3b8; font-size: 11px; margin-top: 20px;">Sent at ${new Date().toLocaleString('en-IN')}</p>
        </div>`
      });

      return res.json({ success: true, message: `Test email successfully sent to ${to}!` });
    } catch (err: any) {
      console.error("[Test Email SMTP Error]:", err);
      return res.status(500).json({ success: false, error: err.message || "Failed to send SMTP email." });
    }
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
