import express from 'express';

import cors from 'cors';

import pino from 'pino';

import pinoHttp from 'pino-http';

import contactsRouter from './routers/contacts.js';

import { errorHandler } from './middlewares/errorHandler.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';

const logger = pino();
const pinoMiddleware = pinoHttp({ logger });

export const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  app.use(pinoMiddleware);

  app.use('/api', contactsRouter);
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  return app;
};
