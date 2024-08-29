import { Contact } from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = Contact.find();

  if (typeof filter.type !== 'undefined') {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (typeof filter.isFavorite !== 'undefined') {
    contactsQuery.where('isFavorite').equals(filter.isFavorite);
  }

  contactsQuery.where('userId').equals(userId);

  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = (contactId, userId) =>
  Contact.findOne({ _id: contactId, userId });

export const createContact = (payload) => {
  return Contact.create(payload);
};

export const updateContactById = (contactId, payload, userId) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
  });
};

export const deleteContactById = (contactId, userId) => {
  return Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
};
