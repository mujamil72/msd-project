import mongoose from "mongoose"

const TripSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  destination: String,
  description: String,
  startDate: Date,
  endDate: Date,
  budget: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "USD",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  coverImageUrl: String,
  categories: [
    {
      name: String,
      limit: Number,
    },
  ],
  status: {
    type: String,
    enum: ["active", "completed", "archived", "planning"],
    default: "planning",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Trip", TripSchema)
