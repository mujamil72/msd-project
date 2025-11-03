import Expense from "../models/Expense.js"
import Trip from "../models/Trip.js"
import User from "../models/User.js"
import { createExpenseNotification } from "../utils/notifications.js"

export const getExpensesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params

    // Verify trip exists and user has access
    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    const isOwnerOrMember =
      trip.createdBy.toString() === req.user.id || trip.members.some((u) => u.toString() === req.user.id)

    if (!isOwnerOrMember) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const expenses = await Expense.find({ trip: tripId })
      .populate("paidBy", "name email _id")
      .sort({ date: -1 })

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)
    const categoryTotals = {}

    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount
    })

    res.json({
      expenses,
      summary: {
        total: totalAmount,
        count: expenses.length,
        categoryTotals,
        averageExpense: expenses.length > 0 ? totalAmount / expenses.length : 0,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createExpense = async (req, res) => {
  try {
    const { trip, category, amount, currency, date, description, payer, splitBetween } = req.body

    if (!trip || !category || !amount || !payer) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" })
    }

    const tripExists = await Trip.findById(trip)
    if (!tripExists) {
      return res.status(404).json({ message: "Trip not found" })
    }

    const expense = new Expense({
      trip,
      paidBy: req.user.id,
      category,
      amount: Number.parseFloat(amount),
      currency: currency || 'USD',
      date: date || new Date(),
      description,
      splitBetween: splitBetween || []
    })

    await expense.save()
    await expense.populate("paidBy", "name email")

    // Create notification for other trip members
    const user = await User.findById(req.user.id)
    await createExpenseNotification(expense, user)

    res.status(201).json(expense)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params
    const expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    if (expense.paidBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    if (req.body.amount && req.body.amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" })
    }

    Object.assign(expense, req.body)
    await expense.save()
    await expense.populate("paidBy", "name email")

    res.json(expense)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params
    const expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    if (expense.paidBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    await Expense.findByIdAndDelete(id)
    res.json({ message: "Expense deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
