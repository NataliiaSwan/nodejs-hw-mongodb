import express from 'express';

import cors from 'cors';

import pino from 'pino';

import pinoHttp from 'pino-http';

import { getContact, allContacts } from './controllers/contacts.js';

const logger = pino();
const pinoMiddleware = pinoHttp({ logger });

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(pinoMiddleware);

  app.get('/contacts/:contactId', getContact);
  app.get('/contacts', allContacts);

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });
  console.log('Server setup complete.');
  return app;
};
