import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  processedUrl: {
    type: String
  },
  cloudinaryProcessedId: {
    type: String
  },
  retouchingStyleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RetouchingStyle'
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded'
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String
  },
  // Cloudinary-specific fields
  cloudinaryPublicId: {
    type: String,
    unique: true,
    sparse: true
  },
  cloudinaryAssetId: {
    type: String,
    unique: true,
    sparse: true
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  // Processing metadata
  processingStartedAt: {
    type: Date
  },
  processingCompletedAt: {
    type: Date
  },
  processingErrors: {
    type: String
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
photoSchema.index({ userId: 1, status: 1 });
photoSchema.index({ orderId: 1 });
photoSchema.index({ cloudinaryPublicId: 1 });
photoSchema.index({ cloudinaryAssetId: 1 });
photoSchema.index({ retouchingStyleId: 1 });
photoSchema.index({ createdAt: -1 });
photoSchema.index({ status: 1 });

// Virtual for checking if photo is processed
photoSchema.virtual('isProcessed').get(function() {
  return this.status === 'completed';
});

// Method to mark as processing
photoSchema.methods.startProcessing = function() {
  this.status = 'processing';
  this.processingStartedAt = new Date();
  return this.save();
};

// Method to mark as completed
photoSchema.methods.completeProcessing = function(processedUrl) {
  this.status = 'completed';
  this.processedUrl = processedUrl;
  this.processingCompletedAt = new Date();
  this.completedAt = new Date();
  return this.save();
};

// Method to mark as failed
photoSchema.methods.failProcessing = function(error) {
  this.status = 'failed';
  this.processingErrors = error;
  this.processingCompletedAt = new Date();
  return this.save();
};

export default mongoose.model('Photo', photoSchema);
