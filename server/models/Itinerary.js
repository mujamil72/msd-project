import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['sightseeing', 'food', 'rest', 'transport', 'other'], default: 'sightseeing' },
  startTime: String,
  endTime: String,
  location: String,
  cost: { type: Number, default: 0 },
  notes: String
});

const itinerarySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  activities: [activitySchema]
}, { timestamps: true });

export default mongoose.model('Itinerary', itinerarySchema);