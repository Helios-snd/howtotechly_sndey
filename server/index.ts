import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy is required for Vercel/Load Balancers to get correct IP
app.set('trust proxy', 1);

// --- Security Middleware ---
app.use(helmet() as any);

// Configure CORS
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}) as any);

// --- Performance Middleware ---
app.use(compression() as any);

// --- Rate Limiting ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});

app.use('/api', apiLimiter as any);

// --- Logging & Parsing ---
// Vercel serverless functions have a strict 4.5MB body limit. 
// We set json limit to 4mb to be safe.
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev') as any);
app.use(express.json({ limit: '4mb' }) as any);

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    env: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// --- API Routes ---
app.use('/api', routes);

// --- Global Error Handler ---
app.use(errorHandler);

// --- Server Startup ---
// Only listen if running locally (not in Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export the app for Vercel
export default app;