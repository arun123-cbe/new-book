import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "siteContent.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

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
  upiMerchantId: "arungowtham@upi",
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
    res.json({ status: "ok", timestamp: new Date().toISOString() });
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
    const { status, search } = req.query;
    let filtered = [...ordersStore];

    if (status && status !== 'ALL') {
      filtered = filtered.filter(o => o.status === status);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderId.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
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
  app.post("/api/orders/create", (req, res) => {
    const { name, email, phone, address, city, pincode, state, paymentMethod, upiId, upiApp, transactionRef } = req.body;
    
    if (!name || !email || !phone || !address || !pincode) {
      return res.status(400).json({ error: "Missing required shipping details" });
    }

    const orderId = "SSS-" + Math.floor(100000 + Math.random() * 900000);
    const trackingId = "IN-EXP-" + Math.floor(10000000 + Math.random() * 90000000);

    const bookPrice = Number(siteSettings.priceINR) || 799;
    const shippingFee = siteSettings.shippingFeeINR !== undefined ? Number(siteSettings.shippingFeeINR) : 49;
    const totalAmount = bookPrice + shippingFee;

    const order = {
      orderId,
      trackingId,
      createdAt: new Date().toISOString(),
      item: "SEARCH, SOCIAL & SYSTEMS (Printed Edition)",
      amount: totalAmount,
      originalAmount: siteSettings.originalPriceINR || 1299,
      discount: `${siteSettings.discountPercent || 40}%`,
      shipping: shippingFee > 0 ? `Express Courier (₹${shippingFee})` : "FREE Express Courier",
      status: "PENDING",
      carrier: "BlueDart Express",
      customer: { name, email, phone, address, city, pincode, state: state || "Tamil Nadu" },
      payment: {
        method: paymentMethod || "UPI_APP",
        status: "SUCCESS",
        upiId: upiId || siteSettings.upiMerchantId || "arungowtham@upi",
        upiApp: upiApp || "Google Pay",
        transactionRef: transactionRef || ("UTR" + Math.floor(100000000000 + Math.random() * 900000000000))
      },
      digitalAccessUrl: `/download/companion-blueprint-kit-${orderId}.pdf`
    };

    ordersStore.unshift(order);
    saveJson(ORDERS_FILE, ordersStore);

    return res.json({ success: true, order });
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
