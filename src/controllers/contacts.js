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
    console.error('Error retrieving contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const allContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved all contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
