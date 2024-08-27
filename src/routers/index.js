import { Router } from 'express';
import contactsRouter from '../routers/contacts.js';
import usersRouter from '../routers/auth.js';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/users', usersRouter);

export default router;
