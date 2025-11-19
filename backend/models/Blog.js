import mongoose from 'mongoose';

const WORDS_PER_MINUTE = 200;

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    default: 'Untitled Blog Post',
    trim: true
  },
  subheading: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: false,
    default: '',
    trim: true
  },
  headerImage: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  metaDescription: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Text index for search functionality
blogSchema.index({
  title: 'text',
  subheading: 'text',
  tags: 'text',
  metaDescription: 'text'
}, {
  weights: {
    title: 10,
    subheading: 5,
    tags: 8,
    metaDescription: 3
  },
  name: 'blog_text_search'
});

// Existing indexes
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ tags: 1, published: 1 });
blogSchema.index({ author: 1, createdAt: -1 });

// Additional performance indexes
blogSchema.index({ published: 1, updatedAt: -1 }); // For admin sorting
blogSchema.index({ createdAt: -1 }); // For general chronological sorting
blogSchema.index({ tags: 1 }); // For tag aggregation queries

blogSchema.virtual('readingTime').get(function() {
  if (!this.content) return 0;

  const text = this.content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return 0;

  const wordCount = text.split(' ').length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
});

export default mongoose.model('Blog', blogSchema);

