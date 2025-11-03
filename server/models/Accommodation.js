import mongoose from 'mongoose';

const accommodationSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['hotel', 'hostel', 'apartment', 'resort', 'other'], default: 'hotel' },
  location: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  bookingReference: String,
  cost: { type: Number, default: 0 },
  rating: { type: Number, min: 1, max: 5 },
  amenities: [String],
  notes: String
}, { timestamps: true });

export default mongoose.model('Accommodation', accommodationSchema);