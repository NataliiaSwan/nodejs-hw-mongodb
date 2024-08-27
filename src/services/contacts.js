import Contact from '../db/models/Contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

import { SORT_ORDER } from '../constants/index.js';

export const getContactById = async (filter) => {
  return Contact.findOne(filter);
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

  const contactsQuery = Contact.find(filter);

  const [contactsCount, contacts] = await Promise.all([
    contactsQuery.countDocuments(),
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
    const savedContact = await newContact.save();
    return savedContact;
  } catch (error) {
    throw new Error('Failed to save contact. Please try again later.');
  }
};
export const updateContactById = async (filter, updateData) => {
  try {
    return Contact.findOneAndUpdate(filter, updateData, { new: true });
  } catch (error) {
    throw new Error('Error updating contact in database');
  }
};

export const deleteContactById = async (filter) => {
  try {
    return Contact.findOneAndDelete(filter);
  } catch (error) {
    throw new Error('Error deleting contact from database');
  }
};
