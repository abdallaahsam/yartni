import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config.js';
import { initDatabase } from './db/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import adviceRoutes from './routes/advice.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();

// Initialize Database & Tables
try {
  initDatabase();
  console.log('✅ SQLite Database initialized successfully with FTS5 and indexes');
} catch (err) {
  console.error('❌ Database initialization error:', err);
}

// Security & Utility Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'Yareetni API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', categoriesRoutes);
app.use('/api/advices', adviceRoutes);
app.use('/api/advices/:id/comments', commentsRoutes);
app.use('/api/users', usersRoutes);

// Serve client production bundle if available (Railway / Cloud deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// 404 Handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'المسار المطلوب غير موجود' });
});

// SPA fallback for frontend client routing
app.get('*', (req, res) => {
  const indexHtml = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.status(404).json({ error: 'المسار المطلوب غير موجود' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'حدث خطأ غير متوقع في الخادم' });
});

const server = app.listen(config.port, () => {
  console.log(`🚀 Yareetni Server running on http://localhost:${config.port}`);
});

export { app, server };
export default app;
