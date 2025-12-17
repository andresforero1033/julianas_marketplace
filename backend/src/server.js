import app from './app.js';
import config from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const startServer = async () => {
  try {
    await connectDatabase(config.database.uri);

    const server = app.listen(config.app.port, () => {
      console.log(
        `Juliana's API running on http://localhost:${config.app.port} (${config.app.nodeEnv})`,
      );
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
