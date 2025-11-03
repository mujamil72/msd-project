import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
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
  categories: {
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    shopping: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  totalBudget: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, {
  timestamps: true
});

export default mongoose.model('Budget', budgetSchema);