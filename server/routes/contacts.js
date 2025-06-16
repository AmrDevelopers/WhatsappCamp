import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new contact
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Phone number already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Update contact
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Phone number already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk import contacts
router.post('/bulk-import', async (req, res) => {
  try {
    const { contacts } = req.body;
    const result = await Contact.insertMany(contacts, { ordered: false });
    res.status(201).json({ 
      message: `${result.length} contacts imported successfully`,
      imported: result.length 
    });
  } catch (error) {
    if (error.writeErrors) {
      const successful = error.result.nInserted;
      const failed = error.writeErrors.length;
      res.status(207).json({
        message: `${successful} contacts imported, ${failed} failed`,
        imported: successful,
        failed: failed,
        errors: error.writeErrors
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

export default router;