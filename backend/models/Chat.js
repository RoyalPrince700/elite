import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Admin might not be assigned initially
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    user: {
      type: Number,
      default: 0
    },
    admin: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
chatSchema.index({ user: 1, isActive: 1 });
chatSchema.index({ admin: 1, isActive: 1 });
chatSchema.index({ lastMessageTime: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
