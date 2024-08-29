import express from 'express';

import cors from 'cors';

import pino from 'pino';

import pinoHttp from 'pino-http';

import contactsRouter from './routers/contacts.js';

import usersRouter from './routers/auth.js';

import { errorHandler } from './middlewares/errorHandler.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';

import cookieParser from 'cookie-parser';

const logger = pino();
const pinoMiddleware = pinoHttp({ logger });

export const setupServer = () => {
  const app = express();

  app.use(cookieParser());

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  app.use(pinoMiddleware);

  app.use('/users', usersRouter);
  app.use('/contacts', contactsRouter);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
};
