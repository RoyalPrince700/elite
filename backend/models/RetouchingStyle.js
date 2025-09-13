import mongoose from 'mongoose';

const retouchingStyleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  turnaroundHours: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static method to get active styles
retouchingStyleSchema.statics.getActiveStyles = function() {
  return this.find({ isActive: true }).sort({ basePrice: 1 });
};

export default mongoose.model('RetouchingStyle', retouchingStyleSchema);
