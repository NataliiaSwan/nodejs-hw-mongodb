import Contact from '../models/contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

import { SORT_ORDER } from '../constants/index.js';

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error('Error finding contact by ID:', error);
    throw error;
  }
};

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
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

export const createContact = async (contactData) => {
  try {
    const newContact = new Contact(contactData);
    return newContact.save();
  } catch (error) {
    throw new Error('Error saving contact to database');
  }
};

export const updateContactById = async (contactId, updateData) => {
  try {
    return Contact.findByIdAndUpdate(contactId, updateData, { new: true });
  } catch (error) {
    throw new Error('Error updating contact in database');
  }
};

export const deleteContactById = async (contactId) => {
  try {
    return Contact.findByIdAndDelete(contactId);
  } catch (error) {
    throw new Error('Error deleting contact from database');
  }
};
