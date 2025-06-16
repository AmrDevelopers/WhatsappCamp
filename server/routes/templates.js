import express from 'express';
import Template from '../models/Template.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all templates
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = { createdBy: req.user._id };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const templates = await Template.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get template by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const template = await Template.findOne({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    }).populate('createdBy', 'name email');
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new template
router.post('/', authenticate, async (req, res) => {
  try {
    // Extract variables from content
    const variables = extractVariables(req.body.content);
    const template = new Template({
      ...req.body,
      variables,
      createdBy: req.user._id
    });
    await template.save();
    await template.populate('createdBy', 'name email');
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update template
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Extract variables from content
    const variables = extractVariables(req.body.content);
    const template = await Template.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { ...req.body, variables },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete template
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const template = await Template.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    });
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to extract variables from template content
function extractVariables(content) {
  const matches = content.match(/\{\{(\w+)\}\}/g);
  return matches ? [...new Set(matches.map(match => match.slice(2, -2)))] : [];
}

export default router;