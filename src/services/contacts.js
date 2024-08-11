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
  page = 2,
  perPage = 4,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  type,
  isFavourite,
}) => {
  try {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const sortOptions = { [sortBy]: sortOrder };

    const filterOptions = {};
    if (type) {
      filterOptions.contactType = type;
    }
    if (isFavourite !== undefined) {
      filterOptions.isFavourite = isFavourite === 'true';
    }

    const [contacts, contactsCount] = await Promise.all([
      Contact.find(filterOptions)
        .skip(skip)
        .limit(limit)
        .sort(sortOptions)
        .exec(),
      Contact.countDocuments(filterOptions),
    ]);

    const totalItems = Math.min(contactsCount, 6); // Максимум 6 контактів
    const paginationData = calculatePaginationData(totalItems, perPage, page);

    return {
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: page,
        perPage: perPage,
        totalItems: totalItems,
        totalPages: paginationData.totalPages,
        hasPreviousPage: paginationData.hasPreviousPage,
        hasNextPage: paginationData.hasNextPage,
      },
    };
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    throw new Error('Could not retrieve contacts');
  }
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
