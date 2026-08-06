import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

// Seed initial data for fallback storage
const DEFAULT_SERVICES = [
  {
    id: 'srv-ap-customweb',
    title: 'AP Web Development - Custom Website (All Types)',
    category: 'apweb',
    shortDescription: 'Bespoke website creation for E-commerce, Corporate, SaaS, Portfolios & Landing Pages.',
    fullDescription: 'Complete AP Web Development service creating all types of websites with custom designs, fast performance, SEO optimization, and secure backend integrations.',
    basePrice: 990,
    turnaroundDays: 5,
    features: [
      'All Website Types (E-commerce, Corporate, Portfolio, SaaS)',
      'Custom AP Web Development Architecture',
      'Fully Responsive & Mobile-Optimized',
      'SEO & Fast Page Load Optimization',
      'Free Domain & SSL Setup Guidance'
    ],
    threeGeometry: 'dodecahedron',
    color: '#06b6d4',
    popular: true
  },
  {
    id: 'srv-ap-uiux',
    title: 'Modern UI/UX Design & Prototyping',
    category: 'uiux',
    shortDescription: 'Pixel-perfect modern UI/UX design, interactive wireframes, and design systems.',
    fullDescription: 'High-end modern UI/UX design service crafting intuitive user interfaces, cohesive design systems, animated interactive prototypes, and accessibility standards.',
    basePrice: 850,
    turnaroundDays: 4,
    features: [
      'Sleek Modern UI/UX Visual Layouts',
      'Figma / Interactive Design System',
      'Mobile & Desktop High-Fidelity Views',
      'Micro-Interactions & Motion Design',
      'Design Export & Developer Specs'
    ],
    threeGeometry: 'octahedron',
    color: '#ec4899',
    popular: true
  },
  {
    id: 'srv-web3d',
    title: 'Interactive 3D Web Application',
    category: '3d',
    shortDescription: 'High-performance WebGL & Three.js visual web apps with fluid animations.',
    fullDescription: 'Full design & development of custom 3D web experiences using Three.js, React, WebGL shaders, responsive canvas, and Tailwind CSS.',
    basePrice: 1450,
    turnaroundDays: 10,
    features: [
      'Interactive 3D WebGL Scene',
      'Custom Shaders & Lighting',
      'Full React & Tailwind Frontend',
      'Mobile Touch Optimization',
      '3 Revision Rounds'
    ],
    threeGeometry: 'icosahedron',
    color: '#6366f1',
    popular: false
  },
  {
    id: 'srv-fullstack',
    title: 'Full-Stack Web App & Express API',
    category: 'fullstack',
    shortDescription: 'Scalable Node.js & React full-stack application with database integration.',
    fullDescription: 'End-to-end full stack software with Express.js REST API, authentication, database CRUD operations, and responsive modern dashboard UI.',
    basePrice: 1890,
    turnaroundDays: 14,
    features: [
      'Express.js Server & REST API',
      'React 19 Frontend',
      'MySQL / Firebase / SQL Database Setup',
      'Authentication & Security',
      'Deployment Setup'
    ],
    threeGeometry: 'torusKnot',
    color: '#10b981',
    popular: false
  },
  {
    id: 'srv-ai',
    title: 'AI Engine & Gemini API Solution',
    category: 'ai',
    shortDescription: 'Custom AI agent, recommendation, or LLM pipeline integrated into your app.',
    fullDescription: 'Smart AI automation using Gemini API, custom prompts, document parsing, automated workflows, and streaming UI.',
    basePrice: 1250,
    turnaroundDays: 7,
    features: [
      'Gemini API Integration',
      'Custom Agent & Workflows',
      'Streaming AI Responses',
      'Error Recovery & Safeguards',
      'Admin AI Controls'
    ],
    threeGeometry: 'cylinder',
    color: '#f59e0b',
    popular: false
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'ORD-7412',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sarah@vertexmedia.com',
    companyName: 'Vertex Media Group',
    serviceId: 'srv-web3d',
    serviceTitle: 'Interactive 3D Web Application',
    category: '3d',
    budget: 1800,
    deadline: '2026-08-25',
    requirements: 'Need a 3D interactive hero section for our luxury architectural firm showcasing 3D building models and real-time lighting.',
    status: 'in_progress',
    progressPercent: 65,
    deliverableUrl: 'https://github.com/freelancer/vertex-3d-demo',
    privateNotes: 'Initial 3D mesh loads fast. Working on lighting shaders.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'ORD-8930',
    clientName: 'David Chen',
    clientEmail: 'david@nextech.io',
    companyName: 'NexTech Solutions',
    serviceId: 'srv-fullstack',
    serviceTitle: 'Full-Stack Web App & Express API',
    category: 'fullstack',
    budget: 2200,
    deadline: '2026-09-01',
    requirements: 'Build a real-time order dashboard with Express backend and MySQL/Firebase persistent storage for client tracking.',
    status: 'review',
    progressPercent: 90,
    deliverableUrl: 'https://nextech-demo.run.app',
    privateNotes: 'Waiting for client review on final API endpoints.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'ORD-9104',
    clientName: 'Elena Rostova',
    clientEmail: 'elena@designcraft.co',
    companyName: 'DesignCraft Studio',
    serviceId: 'srv-ai',
    serviceTitle: 'AI Engine & Gemini API Solution',
    category: 'ai',
    budget: 1350,
    deadline: '2026-08-18',
    requirements: 'Integrate Gemini API for auto-generating project proposals and design descriptions from user prompts.',
    status: 'completed',
    progressPercent: 100,
    deliverableUrl: 'https://github.com/freelancer/gemini-proposal-engine',
    privateNotes: 'Delivered fully tested API endpoints and React components.',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

const DEFAULT_MESSAGES = [
  {
    id: 'msg-101',
    orderId: 'ORD-7412',
    sender: 'client',
    senderName: 'Sarah Jenkins',
    text: 'Hi! Super excited to get started. I uploaded our brand guidelines and sample 3D CAD files.',
    attachments: ['https://example.com/assets/brand-guide.pdf'],
    createdAt: new Date(Date.now() - 5 * 86400000 + 300000).toISOString()
  },
  {
    id: 'msg-102',
    orderId: 'ORD-7412',
    sender: 'freelancer',
    senderName: 'Freelance Studio',
    text: 'Thanks Sarah! I have set up the 3D scene architecture and particle geometry. You can review the initial draft link above.',
    attachments: [],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'msg-103',
    orderId: 'ORD-8930',
    sender: 'freelancer',
    senderName: 'Freelance Studio',
    text: 'David, the Express REST backend and MySQL database structure are complete! Ready for final staging review.',
    attachments: [],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export class DatabaseService {
  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.filePath = path.join(this.dataDir, 'database.json');
    this.mysqlPool = null;
    this.isUsingMysql = false;
    this.connectionError = null;

    this.initFileStore();
    this.initMySQLIfConfigured();
  }

  initFileStore() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      if (!fs.existsSync(this.filePath)) {
        const initialData = {
          services: DEFAULT_SERVICES,
          orders: DEFAULT_ORDERS,
          messages: DEFAULT_MESSAGES
        };
        fs.writeFileSync(this.filePath, JSON.stringify(initialData, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('Error initializing database file store:', err);
    }
  }

  async initMySQLIfConfigured() {
    const host = process.env.MYSQL_HOST;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE || 'freelance_db';
    const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

    if (host && user) {
      try {
        console.log(`Connecting to MySQL at ${host}:${port}...`);
        const pool = mysql.createPool({
          host,
          user,
          password,
          database,
          port,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });

        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database!');
        connection.release();

        this.mysqlPool = pool;
        this.isUsingMysql = true;

        await this.bootstrapMySQLTables();
      } catch (err) {
        console.warn('MySQL Connection Warning:', err?.message || err);
        this.connectionError = err?.message || 'Failed to connect to MySQL host';
        this.isUsingMysql = false;
      }
    } else {
      console.log('Running with Embedded Storage Engine (Firebase & SQL Export Ready).');
    }
  }

  async bootstrapMySQLTables() {
    if (!this.mysqlPool) return;
    try {
      await this.mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS services (
          id VARCHAR(64) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          category VARCHAR(50) NOT NULL,
          shortDescription TEXT NOT NULL,
          fullDescription TEXT NOT NULL,
          basePrice DECIMAL(10, 2) NOT NULL,
          turnaroundDays INT NOT NULL,
          features JSON NOT NULL,
          threeGeometry VARCHAR(50) NOT NULL,
          color VARCHAR(20) NOT NULL,
          popular TINYINT(1) DEFAULT 0,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await this.mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(32) PRIMARY KEY,
          clientName VARCHAR(255) NOT NULL,
          clientEmail VARCHAR(255) NOT NULL,
          companyName VARCHAR(255) NULL,
          serviceId VARCHAR(64) NOT NULL,
          serviceTitle VARCHAR(255) NOT NULL,
          category VARCHAR(50) NOT NULL,
          budget DECIMAL(10, 2) NOT NULL,
          deadline VARCHAR(50) NOT NULL,
          requirements TEXT NOT NULL,
          status VARCHAR(30) NOT NULL DEFAULT 'pending',
          progressPercent INT NOT NULL DEFAULT 0,
          deliverableUrl TEXT NULL,
          privateNotes TEXT NULL,
          createdAt VARCHAR(64) NOT NULL,
          updatedAt VARCHAR(64) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await this.mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS order_messages (
          id VARCHAR(64) PRIMARY KEY,
          orderId VARCHAR(32) NOT NULL,
          sender VARCHAR(20) NOT NULL,
          senderName VARCHAR(255) NOT NULL,
          text TEXT NOT NULL,
          attachments JSON NULL,
          createdAt VARCHAR(64) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      const [servicesRows] = await this.mysqlPool.query('SELECT COUNT(*) as count FROM services');
      if (servicesRows[0].count === 0) {
        for (const s of DEFAULT_SERVICES) {
          await this.mysqlPool.query(
            `INSERT INTO services (id, title, category, shortDescription, fullDescription, basePrice, turnaroundDays, features, threeGeometry, color, popular)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [s.id, s.title, s.category, s.shortDescription, s.fullDescription, s.basePrice, s.turnaroundDays, JSON.stringify(s.features), s.threeGeometry, s.color, s.popular ? 1 : 0]
          );
        }
      }

      const [ordersRows] = await this.mysqlPool.query('SELECT COUNT(*) as count FROM orders');
      if (ordersRows[0].count === 0) {
        for (const o of DEFAULT_ORDERS) {
          await this.mysqlPool.query(
            `INSERT INTO orders (id, clientName, clientEmail, companyName, serviceId, serviceTitle, category, budget, deadline, requirements, status, progressPercent, deliverableUrl, privateNotes, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [o.id, o.clientName, o.clientEmail, o.companyName || null, o.serviceId, o.serviceTitle, o.category, o.budget, o.deadline, o.requirements, o.status, o.progressPercent, o.deliverableUrl || null, o.privateNotes || null, o.createdAt, o.updatedAt]
          );
        }
      }

      const [msgRows] = await this.mysqlPool.query('SELECT COUNT(*) as count FROM order_messages');
      if (msgRows[0].count === 0) {
        for (const m of DEFAULT_MESSAGES) {
          await this.mysqlPool.query(
            `INSERT INTO order_messages (id, orderId, sender, senderName, text, attachments, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [m.id, m.orderId, m.sender, m.senderName, m.text, JSON.stringify(m.attachments || []), m.createdAt]
          );
        }
      }
    } catch (err) {
      console.error('Failed to bootstrap MySQL tables:', err);
    }
  }

  getFileData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Read error on database file:', err);
    }
    return { services: DEFAULT_SERVICES, orders: DEFAULT_ORDERS, messages: DEFAULT_MESSAGES };
  }

  saveFileData(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Write error on database file:', err);
    }
  }

  // --- Services CRUD ---
  async getServices() {
    if (this.isUsingMysql && this.mysqlPool) {
      try {
        const [rows] = await this.mysqlPool.query('SELECT * FROM services ORDER BY basePrice ASC');
        return rows.map((r) => ({
          ...r,
          basePrice: parseFloat(r.basePrice),
          turnaroundDays: parseInt(r.turnaroundDays, 10),
          popular: Boolean(r.popular),
          features: typeof r.features === 'string' ? JSON.parse(r.features) : (r.features || [])
        }));
      } catch (err) {
        console.error('MySQL error getServices:', err);
      }
    }
    return this.getFileData().services;
  }

  async saveService(pkg) {
    if (this.isUsingMysql && this.mysqlPool) {
      try {
        await this.mysqlPool.query(
          `INSERT INTO services (id, title, category, shortDescription, fullDescription, basePrice, turnaroundDays, features, threeGeometry, color, popular)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             title=VALUES(title), category=VALUES(category), shortDescription=VALUES(shortDescription),
             fullDescription=VALUES(fullDescription), basePrice=VALUES(basePrice), turnaroundDays=VALUES(turnaroundDays),
             features=VALUES(features), threeGeometry=VALUES(threeGeometry), color=VALUES(color), popular=VALUES(popular)`,
          [pkg.id, pkg.title, pkg.category, pkg.shortDescription, pkg.fullDescription, pkg.basePrice, pkg.turnaroundDays, JSON.stringify(pkg.features), pkg.threeGeometry, pkg.color, pkg.popular ? 1 : 0]
        );
        return pkg;
      } catch (err) {
        console.error('MySQL error saveService:', err);
      }
    }

    const store = this.getFileData();
    const idx = store.services.findIndex((s) => s.id === pkg.id);
    if (idx >= 0) {
      store.services[idx] = pkg;
    } else {
      store.services.push(pkg);
    }
    this.saveFileData(store);
    return pkg;
  }

  async deleteService(id) {
    if (this.isUsingMysql && this.mysqlPool) {
      try {
        await this.mysqlPool.query('DELETE FROM services WHERE id = ?', [id]);
        return true;
      } catch (err) {
        console.error('MySQL error deleteService:', err);
      }
    }
    const store = this.getFileData();
    store.services = store.services.filter((s) => s.id !== id);
    this.saveFileData(store);
    return true;
  }

  // --- Orders CRUD ---
  async getOrders(filterStatus, search) {
    let ordersList = [];

    if (this.isUsingMysql && this.mysqlPool) {
      try {
        let sql = 'SELECT * FROM orders';
        const params = [];
        const conditions = [];

        if (filterStatus && filterStatus !== 'all') {
          conditions.push('status = ?');
          params.push(filterStatus);
        }
        if (search) {
          conditions.push('(clientName LIKE ? OR clientEmail LIKE ? OR id LIKE ? OR serviceTitle LIKE ?)');
          const term = `%${search}%`;
          params.push(term, term, term, term);
        }

        if (conditions.length > 0) {
          sql += ' WHERE ' + conditions.join(' AND ');
        }
        sql += ' ORDER BY createdAt DESC';

        const [rows] = await this.mysqlPool.query(sql, params);
        ordersList = rows.map((r) => ({
          ...r,
          budget: parseFloat(r.budget),
          progressPercent: parseInt(r.progressPercent, 10)
        }));
        return ordersList;
      } catch (err) {
        console.error('MySQL error getOrders:', err);
      }
    }

    ordersList = this.getFileData().orders;
    if (filterStatus && filterStatus !== 'all') {
      ordersList = ordersList.filter((o) => o.status === filterStatus);
    }
    if (search) {
      const q = search.toLowerCase();
      ordersList = ordersList.filter((o) =>
        o.clientName.toLowerCase().includes(q) ||
        o.clientEmail.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.serviceTitle.toLowerCase().includes(q)
      );
    }

    return ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrderById(id) {
    if (this.isUsingMysql && this.mysqlPool) {
      try {
        const [rows] = await this.mysqlPool.query('SELECT * FROM orders WHERE id = ?', [id]);
        if (rows.length > 0) {
          const r = rows[0];
          return {
            ...r,
            budget: parseFloat(r.budget),
            progressPercent: parseInt(r.progressPercent, 10)
          };
        }
        return null;
      } catch (err) {
        console.error('MySQL error getOrderById:', err);
      }
    }

    const store = this.getFileData();
    return store.orders.find((o) => o.id.toUpperCase() === id.toUpperCase()) || null;
  }

  async createOrder(newOrder) {
    const id = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString();
    const order = {
      ...newOrder,
      id,
      status: 'pending',
      progressPercent: 0,
      createdAt: now,
      updatedAt: now
    };

    if (this.isUsingMysql && this.mysqlPool) {
      try {
        await this.mysqlPool.query(
          `INSERT INTO orders (id, clientName, clientEmail, companyName, serviceId, serviceTitle, category, budget, deadline, requirements, status, progressPercent, deliverableUrl, privateNotes, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [order.id, order.clientName, order.clientEmail, order.companyName || null, order.serviceId, order.serviceTitle, order.category, order.budget, order.deadline, order.requirements, order.status, order.progressPercent, order.deliverableUrl || null, order.privateNotes || null, order.createdAt, order.updatedAt]
        );

        await this.addOrderMessage({
          orderId: order.id,
          sender: 'system',
          senderName: 'System Engine',
          text: `Order #${order.id} submitted successfully! Your requirements have been logged in the database.`,
          attachments: []
        });

        return order;
      } catch (err) {
        console.error('MySQL error createOrder:', err);
      }
    }

    const store = this.getFileData();
    store.orders.unshift(order);
    this.saveFileData(store);

    await this.addOrderMessage({
      orderId: order.id,
      sender: 'system',
      senderName: 'System Engine',
      text: `Order #${order.id} submitted successfully! Requirements logged into backend persistence store.`,
      attachments: []
    });

    return order;
  }

  async updateOrder(id, updates) {
    const now = new Date().toISOString();

    if (this.isUsingMysql && this.mysqlPool) {
      try {
        const existing = await this.getOrderById(id);
        if (!existing) return null;

        const updated = { ...existing, ...updates, updatedAt: now };
        await this.mysqlPool.query(
          `UPDATE orders SET
             clientName = ?, clientEmail = ?, companyName = ?, budget = ?, deadline = ?,
             requirements = ?, status = ?, progressPercent = ?, deliverableUrl = ?, privateNotes = ?, updatedAt = ?
           WHERE id = ?`,
          [
            updated.clientName, updated.clientEmail, updated.companyName || null, updated.budget, updated.deadline,
            updated.requirements, updated.status, updated.progressPercent, updated.deliverableUrl || null, updated.privateNotes || null, now, id
          ]
        );

        if (updates.status && updates.status !== existing.status) {
          await this.addOrderMessage({
            orderId: id,
            sender: 'system',
            senderName: 'System Tracker',
            text: `Order status updated to "${updates.status.toUpperCase()}" (${updated.progressPercent}% completed).`,
            attachments: []
          });
        }

        return updated;
      } catch (err) {
        console.error('MySQL error updateOrder:', err);
      }
    }

    const store = this.getFileData();
    const idx = store.orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;

    const oldStatus = store.orders[idx].status;
    store.orders[idx] = {
      ...store.orders[idx],
      ...updates,
      updatedAt: now
    };
    this.saveFileData(store);

    if (updates.status && updates.status !== oldStatus) {
      await this.addOrderMessage({
        orderId: id,
        sender: 'system',
        senderName: 'System Tracker',
        text: `Order status updated to "${updates.status.toUpperCase()}" (${store.orders[idx].progressPercent}% completed).`,
        attachments: []
      });
    }

    return store.orders[idx];
  }

  // --- Messages CRUD ---
  async getOrderMessages(orderId) {
    if (this.isUsingMysql && this.mysqlPool) {
      try {
        const [rows] = await this.mysqlPool.query('SELECT * FROM order_messages WHERE orderId = ? ORDER BY createdAt ASC', [orderId]);
        return rows.map((r) => ({
          ...r,
          attachments: typeof r.attachments === 'string' ? JSON.parse(r.attachments) : (r.attachments || [])
        }));
      } catch (err) {
        console.error('MySQL error getOrderMessages:', err);
      }
    }

    const store = this.getFileData();
    return store.messages
      .filter((m) => m.orderId === orderId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async addOrderMessage(msg) {
    const id = 'msg-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date().toISOString();
    const newMsg = {
      ...msg,
      id,
      createdAt: now
    };

    if (this.isUsingMysql && this.mysqlPool) {
      try {
        await this.mysqlPool.query(
          `INSERT INTO order_messages (id, orderId, sender, senderName, text, attachments, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [newMsg.id, newMsg.orderId, newMsg.sender, newMsg.senderName, newMsg.text, JSON.stringify(newMsg.attachments || []), newMsg.createdAt]
        );
        return newMsg;
      } catch (err) {
        console.error('MySQL error addOrderMessage:', err);
      }
    }

    const store = this.getFileData();
    store.messages.push(newMsg);
    this.saveFileData(store);
    return newMsg;
  }

  // --- Analytics ---
  async getAnalytics() {
    const orders = await this.getOrders();
    let totalRevenue = 0;
    let activeOrdersCount = 0;
    let pendingOrdersCount = 0;
    let completedOrdersCount = 0;
    const categoryDist = {};

    for (const o of orders) {
      if (o.status === 'completed') {
        totalRevenue += o.budget;
        completedOrdersCount++;
      } else if (o.status === 'pending') {
        pendingOrdersCount++;
      } else if (o.status === 'in_progress' || o.status === 'accepted' || o.status === 'review') {
        activeOrdersCount++;
      }

      categoryDist[o.category] = (categoryDist[o.category] || 0) + 1;
    }

    return {
      totalRevenue,
      activeOrdersCount,
      pendingOrdersCount,
      completedOrdersCount,
      totalOrdersCount: orders.length,
      avgRating: 4.95,
      categoryDistribution: categoryDist
    };
  }

  // --- Firebase Export Formatting ---
  async getFirebaseExport() {
    const store = this.getFileData();
    return {
      services: store.services,
      orders: store.orders,
      order_messages: store.messages,
      importedAt: new Date().toISOString(),
      schemaVersion: "1.0-firebase-firestore"
    };
  }

  // --- Database Diagnostic Status ---
  async getStatus() {
    const fileData = this.getFileData();
    const host = process.env.MYSQL_HOST;

    if (this.isUsingMysql && this.mysqlPool) {
      try {
        const [srvCount] = await this.mysqlPool.query('SELECT COUNT(*) as count FROM services');
        const [ordCount] = await this.mysqlPool.query('SELECT COUNT(*) as count FROM orders');
        const [msgCount] = await this.mysqlPool.query('SELECT COUNT(*) as count FROM order_messages');

        return {
          connected: true,
          engine: 'MySQL Database Connection',
          host: host || 'localhost',
          database: process.env.MYSQL_DATABASE || 'freelance_db',
          tables: ['services', 'orders', 'order_messages'],
          recordCounts: {
            services: srvCount[0].count,
            orders: ordCount[0].count,
            order_messages: msgCount[0].count
          },
          sqlExportAvailable: true,
          firebaseExportAvailable: true,
          message: `Active MySQL connection to ${host}:${process.env.MYSQL_PORT || '3306'}`
        };
      } catch (err) {
        console.error('Status check error on MySQL:', err);
      }
    }

    return {
      connected: false,
      engine: 'Embedded Persistent Storage Engine (MySQL & Firebase Firestore Compatible)',
      host: host || undefined,
      database: 'freelance_db (embedded)',
      tables: ['services', 'orders', 'order_messages'],
      recordCounts: {
        services: fileData.services.length,
        orders: fileData.orders.length,
        order_messages: fileData.messages.length
      },
      sqlExportAvailable: true,
      firebaseExportAvailable: true,
      message: this.connectionError
        ? `Database Notice: ${this.connectionError}. Operating on embedded persistent backend.`
        : 'Running on Embedded Persistent Storage with native Firebase Firestore and MySQL export options.'
    };
  }
}

export const db = new DatabaseService();
