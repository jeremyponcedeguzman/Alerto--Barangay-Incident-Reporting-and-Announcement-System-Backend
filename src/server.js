import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { isCloudinaryConfigured } from './config/cloudinary.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import residentRoutes from './routes/residentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Enable CORS for frontend communication (Vite default is http://localhost:5173)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local development
    },
    credentials: true,
  })
);

// Body parser (50MB limit to support base64 camera photos)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// HTTP logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check and root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Barangay Emergency Notification System API is running',
    version: '1.0.0',
    cloudinaryEnabled: isCloudinaryConfigured(),
    documentation: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  res.status(isMongoConnected ? 200 : 503).json({
    status: isMongoConnected ? 'healthy' : 'degraded',
    mongoConnected: isMongoConnected,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cloudinaryConfigured: isCloudinaryConfigured(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🌐 Base API URL: http://localhost:${PORT}`);
  if (isCloudinaryConfigured()) {
    console.log(`☁️  Cloudinary: Connected successfully (Cloud: ${process.env.CLOUDINARY_CLOUD_NAME || 'oaxdxwvz'})`);
  } else {
    console.log('⚠️  Cloudinary: Not configured in .env');
  }
});
