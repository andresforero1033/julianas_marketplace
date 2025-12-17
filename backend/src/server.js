import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Juliana's API running on http://localhost:${PORT}`);
    });

    const gracefulShutdown = async () => {
      console.log('Shutting down server...');
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
