import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Existing indexes
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });
commentSchema.index({ author: 1, createdAt: -1 });

// Additional performance indexes
commentSchema.index({ blog: 1, parentComment: 1 }); // For nested comment queries
commentSchema.index({ createdAt: -1 }); // For general chronological sorting
commentSchema.index({ 'likes': 1 }); // For like count queries

export default mongoose.model('Comment', commentSchema);

