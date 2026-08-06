import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/db/database.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- API ROUTES ---

// 1. Health & Database Status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/db/status', async (req, res) => {
  try {
    const status = await db.getStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Database status error' });
  }
});

// MySQL DDL Export
app.get('/api/db/export-sql', async (req, res) => {
  try {
    const sqlPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
    if (fs.existsSync(sqlPath)) {
      const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="freelance_db_schema.sql"');
      return res.send(sqlContent);
    }
    res.status(404).json({ error: 'Schema SQL file not found' });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Export failed' });
  }
});

// Firebase Firestore JSON Export
app.get('/api/db/export-firebase', async (req, res) => {
  try {
    const data = await db.getFirebaseExport();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="firebase_firestore_dump.json"');
    res.send(JSON.stringify(data, null, 2));
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Firebase export failed' });
  }
});

// Firebase Blueprint JSON Export
app.get('/api/db/firebase-blueprint', (req, res) => {
  try {
    const bpPath = path.join(process.cwd(), 'firebase-blueprint.json');
    if (fs.existsSync(bpPath)) {
      const bpContent = fs.readFileSync(bpPath, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      return res.send(bpContent);
    }
    res.status(404).json({ error: 'Firebase Blueprint not found' });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Blueprint fetch failed' });
  }
});

// 2. Services Management
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.getServices();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to fetch services' });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const pkg = req.body;
    if (!pkg.id || !pkg.title || !pkg.basePrice) {
      return res.status(400).json({ error: 'Missing required service fields (id, title, basePrice)' });
    }
    const saved = await db.saveService(pkg);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to create service' });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const pkg = { ...req.body, id: req.params.id };
    const saved = await db.saveService(pkg);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to update service' });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    await db.deleteService(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to delete service' });
  }
});

// 3. Orders Management
app.get('/api/orders', async (req, res) => {
  try {
    const { status, search } = req.query;
    const orders = await db.getOrders(status, search);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to fetch order' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { clientName, clientEmail, companyName, serviceId, serviceTitle, category, budget, deadline, requirements } = req.body;
    if (!clientName || !clientEmail || !serviceId || !requirements) {
      return res.status(400).json({ error: 'Client name, email, serviceId, and requirements are required' });
    }
    const created = await db.createOrder({
      clientName,
      clientEmail,
      companyName,
      serviceId,
      serviceTitle: serviceTitle || 'Custom Freelance Service',
      category: category || 'fullstack',
      budget: parseFloat(budget) || 1000,
      deadline: deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      requirements
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to submit order' });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  try {
    const updated = await db.updateOrder(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to update order' });
  }
});

// 4. Order Messages
app.get('/api/orders/:id/messages', async (req, res) => {
  try {
    const messages = await db.getOrderMessages(req.params.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to fetch messages' });
  }
});

app.post('/api/orders/:id/messages', async (req, res) => {
  try {
    const { sender, senderName, text, attachments } = req.body;
    if (!text || !senderName) {
      return res.status(400).json({ error: 'Message text and senderName are required' });
    }
    const msg = await db.addOrderMessage({
      orderId: req.params.id,
      sender: sender || 'client',
      senderName,
      text,
      attachments: attachments || []
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to post message' });
  }
});

// 5. Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await db.getAnalytics();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to calculate analytics' });
  }
});

// 6. Gemini AI Scope & Proposal Estimator
app.post('/api/ai/proposal', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt description is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        recommendedPackageId: 'srv-fullstack',
        recommendedPackageName: 'Full-Stack Web App & Express API',
        estimatedPriceMin: 1400,
        estimatedPriceMax: 2200,
        estimatedDays: 10,
        keyDeliverables: [
          'Responsive React & Tailwind Frontend',
          'Express.js REST API Server',
          'MySQL / Firebase Database Setup',
          'Deployment Staging URL'
        ],
        techStack: ['React', 'JavaScript', 'Node.js', 'Express', 'Firebase', 'Tailwind CSS'],
        reasoning: 'Based on your requirement, a full-stack solution provides complete control over frontend UI, backend logic, and database persistence.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert freelance technical consultant and architect. 
Analyze the client's project prompt below and return a JSON object ONLY (no markdown formatting, no code blocks):

Client Requirement: "${prompt}"

Return JSON matching format:
{
  "recommendedPackageId": "srv-web3d" or "srv-fullstack" or "srv-mobile" or "srv-ai" or "srv-backend",
  "recommendedPackageName": "Title of service",
  "estimatedPriceMin": number,
  "estimatedPriceMax": number,
  "estimatedDays": number,
  "keyDeliverables": ["Deliverable 1", "Deliverable 2", "Deliverable 3", "Deliverable 4"],
  "techStack": ["Tech 1", "Tech 2", "Tech 3"],
  "reasoning": "Clear explanation of why this package fits their goals."
}`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);
    res.json(result);
  } catch (err) {
    console.error('AI proposal generation error:', err);
    res.status(500).json({
      error: 'Failed to generate proposal via AI',
      fallback: {
        recommendedPackageId: 'srv-fullstack',
        recommendedPackageName: 'Full-Stack Web App & Express API',
        estimatedPriceMin: 1500,
        estimatedPriceMax: 2500,
        estimatedDays: 12,
        keyDeliverables: ['Full-stack Application', 'API Integration', 'Database Schemas'],
        techStack: ['React', 'JavaScript', 'Express', 'Firebase'],
        reasoning: 'Custom software architecture tailored to your scope.'
      }
    });
  }
});

// --- VITE MIDDLEWARE & SERVER LISTEN ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AP Web Development Server running at http://0.0.0.0:${PORT}`);
  });
}

// Only start Express standalone server if not on Vercel Serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
