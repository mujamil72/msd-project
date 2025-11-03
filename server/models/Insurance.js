import mongoose from 'mongoose';

const insuranceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  planType: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true
  },
  coverage: {
    medical: Number,
    baggage: Number,
    cancellation: Number,
    delay: Number
  },
  premium: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  policyNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

insuranceSchema.pre('save', function(next) {
  if (!this.policyNumber) {
    this.policyNumber = 'POL' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

export default mongoose.model('Insurance', insuranceSchema);