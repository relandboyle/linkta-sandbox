import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { getEnv } from '@server/utils/environment';
import { globalErrorHandler } from '@server/middleware/errorHandling';
import { MongoClient, ServerApiVersion } from 'mongodb';
import type { Express, NextFunction, Request, Response } from 'express';
import type { Server } from 'http';
import genAI from '@server/routes/genAi';
import { LinktaFlowRouter } from './routes/linktaFlowRouter';
import cors from 'cors';
import { getLogger } from 'log4js';
import { Log4jsConfig } from './utils/log4js.config';
getEnv();

Log4jsConfig(process.env.LOG_LEVEL || 'info');
const logger = getLogger('[Linkta Server]');

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const uri = process.env.MONGO_DB_URI;
mongoose.set('strictQuery', false);
/**
 * Start the server.
 */
function startServer() {
  const app: Express = express();
  const PORT = process.env.PORT || 3000;

  if (!uri) {
    throw new Error('Missing DB connection string!');
  }

  connectToDatabase(uri).catch(console.dir);

  app.use(bodyParser.json());

  app.use(cors(corsOptions));

  /**
   * Test route for the server. This should direct to the frontend.
   */
  app.get('/', (_: Request, res: Response) => {
    logger.info('HIT LINKTA SERVER')
    res.send({ message: 'Hello from the Backend!' });
  });

  /**
   * Routes.
   */
  app.use('/gen-ai', genAI, (req: Request, res: Response, next: NextFunction) => {
    logger.debug(req.params);
    logger.debug(res);
    next();
  });

  app.use('/api/trees', LinktaFlowRouter, (req: Request, res: Response, next: NextFunction) => {
    logger.debug(req.params);
    logger.debug(res);
    next();
  });

  /**
   * Default route for unknown routes. This should be the last route.
   * There should be handling for this in the frontend.
   */
  app.use((_: Request, res: Response) => {
    res.status(404).send({ message: 'Route not found' });
  });

  /**
   * Global Error Handler. Place this at the end to catch all errors.
   */
  app.use(globalErrorHandler);

  /**
   * Start the server.
   */
  const server: Server = app.listen(PORT, () => {
    // console.log(
    //   `Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode.`
    // );
    logger.info(`Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode.`);
  });

  /**
   * Handle shutdown gracefully.
   */
  const shutdown = () => stopServer(server);
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

/**
 * Stop the server process.
 *
 * From PR #37, we should integrate the database disconnection here.
 *
 * https://github.com/Linkta-org/core/pull/37
 */
function stopServer(server: Server) {
  server.close(() => {
    // console.log('Server stopped.');
    logger.warn('Server stopped.');

    // disconnect from the database

    process.exit(0);
  });
}

/**
 * Connect to the database.
 *
 * This should return the connection so that stopServer can use it to disconnect.
 */

async function connectToDatabase(link: string) {
  // connect to the database
  const client = new MongoClient(link, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    // console.log(
    //   'Pinged your deployment. You successfully connected to MongoDB!'
    // );
    logger.info('Pinged your deployment. You successfully connected to MongoDB!')
    await mongoose.connect(uri ?? '')
      .then(() => {
        // console.log('MONGOOSE connected!');
        logger.info('MONGOOSE connected!')
      })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

/**
 * Start the server.
 */
startServer();
