import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['flight', 'train', 'bus', 'car', 'taxi', 'other'], required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivalDate: Date,
  departureTime: String,
  arrivalTime: String,
  bookingReference: String,
  cost: { type: Number, default: 0 },
  provider: String,
  notes: String
}, { timestamps: true });

export default mongoose.model('Transport', transportSchema);