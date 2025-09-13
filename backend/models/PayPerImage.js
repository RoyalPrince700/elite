import mongoose from 'mongoose';

const payPerImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USD', 'NGN'],
    default: 'USD'
  },
  // Form data from user
  companyName: String,
  contactPerson: String,
  phone: String,
  email: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  taxId: String,
  specialInstructions: String,

  // Admin processing
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'invoice_sent', 'completed'],
    default: 'pending'
  },
  adminNotes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,

  // Invoice reference (when invoice is created)
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  invoiceNumber: String,

  // Payment tracking
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paidAt: Date,

  // Usage tracking for active pay-per-image subscriptions
  imagesUsed: {
    type: Number,
    default: 0
  },
  imagesRemaining: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
payPerImageSchema.index({ userId: 1, status: 1 });
payPerImageSchema.index({ status: 1 });
payPerImageSchema.index({ createdAt: -1 });
payPerImageSchema.index({ email: 1 });
payPerImageSchema.index({ paymentStatus: 1 });

// Virtual for checking if pay-per-image is active (paid and has remaining images)
payPerImageSchema.virtual('isActive').get(function() {
  return this.paymentStatus === 'paid' && this.imagesRemaining > 0;
});

// Method to increment images used
payPerImageSchema.methods.incrementImagesUsed = function(count = 1) {
  this.imagesUsed += count;
  this.imagesRemaining = Math.max(0, this.quantity - this.imagesUsed);
  return this.save();
};

// Method to check if user has remaining images
payPerImageSchema.methods.hasRemainingImages = function() {
  return this.imagesRemaining > 0;
};

// Method to initialize usage tracking when payment is confirmed
payPerImageSchema.methods.initializeUsage = function() {
  this.imagesUsed = 0;
  this.imagesRemaining = this.quantity;
  return this.save();
};

// Pre-save middleware to update imagesRemaining
payPerImageSchema.pre('save', function(next) {
  if (this.isModified('imagesUsed') || this.isModified('quantity')) {
    this.imagesRemaining = Math.max(0, this.quantity - this.imagesUsed);
  }
  next();
});

export default mongoose.model('PayPerImage', payPerImageSchema);
