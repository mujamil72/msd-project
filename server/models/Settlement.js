import mongoose from "mongoose"

const SettlementSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "settled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  settledAt: Date,
})

export default mongoose.model("Settlement", SettlementSchema)
