import express from "express"
import Settlement from "../models/Settlement.js"
import Expense from "../models/Expense.js"
import Trip from "../models/Trip.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

const calculateSettlements = (expenses, tripMembers) => {
  // Create a balance map for each user
  const balances = {}
  tripMembers.forEach((id) => {
    balances[id] = 0
  })

  // Calculate net balance for each person
  expenses.forEach((expense) => {
    if (expense.payer) {
      balances[expense.payer._id] = (balances[expense.payer._id] || 0) + expense.amount
    }

    // If split between people
    if (expense.splitBetween && expense.splitBetween.length > 0) {
      const splitAmount = expense.amount / expense.splitBetween.length
      expense.splitBetween.forEach((split) => {
        balances[split.user] = (balances[split.user] || 0) - splitAmount
      })
    }
  })

  // Convert balances to transactions
  const settlements = []
  const creditors = []
  const debtors = []

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance > 0.01) creditors.push({ userId, amount: balance })
    if (balance < -0.01) debtors.push({ userId, amount: Math.abs(balance) })
  })

  // Match creditors and debtors
  let i = 0,
    j = 0
  while (i < creditors.length && j < debtors.length) {
    const amount = Math.min(creditors[i].amount, debtors[j].amount)
    settlements.push({
      fromUser: debtors[j].userId,
      toUser: creditors[i].userId,
      amount,
    })

    creditors[i].amount -= amount
    debtors[j].amount -= amount

    if (creditors[i].amount < 0.01) i++
    if (debtors[j].amount < 0.01) j++
  }

  return settlements
}

router.get("/:tripId", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate("invitedUsers", "_id")
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    const expenses = await Expense.find({ trip: req.params.tripId })
      .populate("payer", "_id name email")
      .populate("splitBetween.user", "_id name email")

    const tripMembers = [trip.owner, ...trip.invitedUsers.map((u) => u._id)]
    const settlements = calculateSettlements(expenses, tripMembers)

    res.json(settlements)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:tripId/settle", authMiddleware, async (req, res) => {
  try {
    const { fromUserId, toUserId, amount } = req.body

    const settlement = new Settlement({
      trip: req.params.tripId,
      fromUser: fromUserId,
      toUser: toUserId,
      amount,
      status: "settled",
      settledAt: new Date(),
    })

    await settlement.save()
    res.status(201).json(settlement)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
