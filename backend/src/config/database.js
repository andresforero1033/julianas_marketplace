import mongoose from 'mongoose';

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI environment variable. Check your .env file.');
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

const disconnectDatabase = async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB disconnected');
};

export { connectDatabase, disconnectDatabase };
