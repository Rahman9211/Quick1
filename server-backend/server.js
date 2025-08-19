
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';


const app = express();
await connectCloudinary()

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', // Better CORS configuration
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicit methods
  credentials: true // If using cookies/auth
}));
app.use(express.json());
app.use(clerkMiddleware());

// Public route
app.get('/', (req, res) => res.send('Server is Live!'));

// Apply requireAuth only to protected routes
app.use('/api/ai', aiRouter); // Moved requireAuth here

const PORT = process.env.PORT || 8000; // Use environment variable
app.use(requireAuth())
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Template literal
});

// Error handling middleware (recommended addition)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});