import  express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRoute from './routes/listing.route.js';
import uploadRoute from './routes/upload.route.js';

import path from 'path';

import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
mongoose.connect('mongodb://localhost:27017/mern-estate').then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
app.use(express.json());

app.use(cookieParser());

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/listing', listingRoute);

// Serve static files from the "uploads" directory
console.log('Serving static files from:', path.join(__dirname, 'uploads'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', uploadRoute);


// Error handling middleware
// This middleware should be defined after all routes
app.use((err, req, res, next) => {
 const statusCode = err.statusCode || 500;
 const message = err.message || 'Internal Server Error';  
  res.status(statusCode).json({
    status: false,
    statusCode,
    message,
  });
}
);