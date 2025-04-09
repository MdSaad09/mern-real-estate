import  express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';

dotenv.config();

const app = express();
mongoose.connect('mongodb://localhost:27017/mern-estate').then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.use('/api/user', userRoute);