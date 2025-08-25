import mongoose from 'mongoose';
import { config } from './environment';

export const connectMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};