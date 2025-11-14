// backend/models/Snippet.js
import mongoose from 'mongoose';

const SnippetSchema = new mongoose.Schema({
  // Reference to the User who created the snippet
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    // e.g., 'javascript', 'python', 'css'
  },
  tags: [
    {
      type: String,
    },
  ],
  visibility: {
    type: String,
    enum: ['public', 'private'], // Only allowed values
    default: 'private',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Snippet = mongoose.model('Snippet', SnippetSchema);

export default Snippet;