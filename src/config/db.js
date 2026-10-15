import mongoose from 'mongoose';
import Incident from '../models/Incident.js';
import { seedInitialData } from '../seeder.js';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.warn('⚠️  WARNING: MONGO_URI is not defined in your .env file.');
      console.warn('⚠️  Please add your MongoDB Atlas connection string in .env');
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed initial demo incidents and advisories on first run if database is empty
    try {
      const incidentCount = await Incident.countDocuments();
      if (incidentCount === 0) {
        console.log('🌱 First-time startup detected: database has 0 incidents. Auto-seeding initial data...');
        await seedInitialData({ isCli: false });
        console.log('✨ Auto-seeding complete! Ready for operations.');
      }
    } catch (seedErr) {
      console.warn('⚠️  Auto-seed check note:', seedErr.message);
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Make sure your MongoDB Atlas IP Access List allows your current IP address (or 0.0.0.0/0 for dev).');
  }
};
