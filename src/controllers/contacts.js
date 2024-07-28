import { getContactById, getAllContacts } from '../services/contacts.js';

export const getContact = async (req, res) => {
  const { contactId } = req.params;

  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const allContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    const formattedContacts = contacts.map((contact) => ({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
      isFavourite: contact.isFavourite,
      contactType: contact.contactType,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }));

    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved all contacts!',
      data: formattedContacts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
