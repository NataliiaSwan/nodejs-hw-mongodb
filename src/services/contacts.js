import Contact from '../models/contact.js';

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error('Error finding contact by ID:', error);
    throw error;
  }
};
export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    throw error;
  }
};
