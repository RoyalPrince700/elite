import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['Blog', 'Comment'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

// Existing indexes
likeSchema.index(
  { user: 1, targetType: 1, targetId: 1 },
  { unique: true }
);
likeSchema.index({ targetType: 1, targetId: 1 });

// Additional performance indexes
likeSchema.index({ user: 1, createdAt: -1 }); // For user like history
likeSchema.index({ targetType: 1, targetId: 1, createdAt: -1 }); // For recent likes
likeSchema.index({ createdAt: -1 }); // For general chronological queries

export default mongoose.model('Like', likeSchema);

