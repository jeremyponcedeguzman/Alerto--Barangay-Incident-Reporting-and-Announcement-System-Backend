import mongoose from 'mongoose';

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
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Make sure your MongoDB Atlas IP Access List allows your current IP address (or 0.0.0.0/0 for dev).');
  }
};
