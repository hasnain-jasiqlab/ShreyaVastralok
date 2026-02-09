import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import { testConnection, initDB } from './config/database.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import adminRoutes from './routes/admin.routes.js';
import offerRoutes from './routes/offer.routes.js';
import categoryRoutes from './routes/category.routes.js';
import settingsRoutes from './routes/settings.routes.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init app
const app = express();

/* =======================
   SECURITY & MIDDLEWARE
======================= */

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/* =======================
   STATIC FILES (OPTIONAL)
======================= */

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* =======================
   API ROUTES
======================= */

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);

/* =======================
   HEALTH CHECK
======================= */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    environment: process.env.NODE_ENV
  });
});

/* =======================
   404 HANDLER
======================= */

app.use(notFound);

/* =======================
   ERROR HANDLER
======================= */

app.use(errorHandler);

/* =======================
   SERVER START
======================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();
    await initDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
