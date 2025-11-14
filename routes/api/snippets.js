// backend/routes/api/snippets.js
import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../../middleware/auth.js';
import Snippet from '../../models/Snippet.js';

const router = express.Router();

// @route   POST api/snippets
// @desc    Create a new snippet
// @access  Private (Requires JWT)
router.post(
  '/',
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('code', 'Code content is required').not().isEmpty(),
    check('language', 'Language is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newSnippet = new Snippet({
        user: req.user.id, // User ID is attached by the 'auth' middleware
        title: req.body.title,
        code: req.body.code,
        language: req.body.language,
        tags: req.body.tags || [],
        visibility: req.body.visibility || 'private',
      });

      const snippet = await newSnippet.save();
      res.json(snippet);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/snippets/public
// @desc    Get all public snippets (Part of the 5 endpoint requirement)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const snippets = await Snippet.find({ visibility: 'public' })
      .sort({ date: -1 })
      .populate('user', ['name']); // Populate the user field with only the name

    res.json(snippets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/snippets/:id
// @desc    Get a snippet by ID
// @access  Public (Visibility check will be added later for private snippets)
router.get('/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id).populate('user', ['name']);

    if (!snippet) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }

    // Basic visibility check: Only show if public, or if the requester is the owner
    if (snippet.visibility === 'private' && (!req.user || snippet.user.toString() !== req.user.id)) {
        // If not authenticated, or not the owner, deny access to private snippet
        return res.status(403).json({ msg: 'Access denied: Private snippet' });
    }


    res.json(snippet);
  } catch (err) {
    console.error(err.message);
    // Handle invalid ObjectId format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Snippet not found (Invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
});


// Note: For simplicity, I'm only adding POST, GET Public, and GET by ID now.
// The remaining PUT and DELETE endpoints would be added here to complete CRUD and meet the 5 endpoint requirement.
// The register/login endpoints in users.js already cover 2/5 of the initial route requirement.

export default router;