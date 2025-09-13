import mongoose from 'mongoose';

const subscriptionRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: String,
    ref: 'SubscriptionPlan',
    required: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
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

  // Pricing calculation
  calculatedPrice: {
    type: Number,
    required: true
  },
  usdPrice: {
    type: Number
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
subscriptionRequestSchema.index({ userId: 1, status: 1 });
subscriptionRequestSchema.index({ status: 1 });
subscriptionRequestSchema.index({ createdAt: -1 });

export default mongoose.model('SubscriptionRequest', subscriptionRequestSchema);
