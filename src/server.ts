import { app } from './app';
import { config } from './config/env';
import { connectDatabase } from './config/prisma';

const startServer = async (): Promise<void> => {
  try {
    // Connect to PostgreSQL Database via Prisma
    await connectDatabase();

    // Start Express HTTP Server
    app.listen(config.port, () => {
      console.log(`🚀 Server is running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`🔗 Health check: http://localhost:${config.port}/api/v1/health`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
