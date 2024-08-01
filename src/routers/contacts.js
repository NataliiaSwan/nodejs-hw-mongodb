import { Router } from 'express';

import {
  getContact,
  allContacts,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(allContacts));

router.get('/contacts/:contactId', ctrlWrapper(getContact));

router.post('/contacts', ctrlWrapper(createContactController));

router.patch('/contacts/:contactId', ctrlWrapper(updateContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
