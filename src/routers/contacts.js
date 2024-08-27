import { Router } from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactShema,
  updateContactSchema,
} from '../validation/contactValidation.js';
import { isValidId } from '../middlewares/isValidId.js';

import {
  getContact,
  allContacts,
  createContactController,
  updateContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(allContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContact));
router.post(
  '/',
  validateBody(createContactShema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
router.put(
  '/:contactId',
  isValidId,
  validateBody(createContactShema),
  ctrlWrapper(updateContactController),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
