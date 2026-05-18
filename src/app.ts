import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { apiRoutes } from './routes';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares(): void {
    // Security headers
    this.app.use(helmet());

    // Enable CORS
    this.app.use(
      cors({
        origin: config.nodeEnv === 'production' ? process.env.ALLOWED_ORIGIN : '*',
        credentials: true,
      })
    );

    // HTTP request logging
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private configureRoutes(): void {
    // Mount API routes under /api/v1
    this.app.use('/api/v1', apiRoutes);
  }

  private configureErrorHandling(): void {
    // Handle 404 Not Found
    this.app.use(notFoundHandler);

    // Global Error Handler
    this.app.use(errorHandler);
  }
}

export const app = new App().app;
