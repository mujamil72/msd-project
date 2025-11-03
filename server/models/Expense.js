import mongoose from "mongoose"

const ExpenseSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["Accommodation", "Food", "Transport", "Activities", "Miscellaneous"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  splitBetween: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      amount: Number,
    },
  ],
  receiptUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Expense", ExpenseSchema)
