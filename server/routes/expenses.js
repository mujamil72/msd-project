import express from "express"
import Expense from "../models/Expense.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.get("/:tripId", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ trip: req.params.tripId })
      .populate("user", "name email")
      .populate("payer", "name email")
      .sort({ date: -1 })

    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { trip, category, amount, currency, date, description, payer, splitBetween } = req.body

    const expense = new Expense({
      trip,
      user: req.user.id,
      category,
      amount,
      currency,
      date,
      description,
      payer,
      splitBetween,
    })

    await expense.save()
    await expense.populate("user", "name email")
    await expense.populate("payer", "name email")

    res.status(201).json(expense)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    Object.assign(expense, req.body)
    await expense.save()

    res.json(expense)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    await Expense.findByIdAndDelete(req.params.id)
    res.json({ message: "Expense deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
