import mongoose from 'mongoose';

const connectDatabase = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string.');
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
