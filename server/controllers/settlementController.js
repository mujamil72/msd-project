import Settlement from "../models/Settlement.js"
import Expense from "../models/Expense.js"
import Trip from "../models/Trip.js"
import User from "../models/User.js"

const calculateSettlements = (expenses, tripMembers) => {
  const balances = {}

  // Initialize balances
  tripMembers.forEach((id) => {
    balances[id.toString()] = 0
  })

  // Calculate balances from expenses
  expenses.forEach((expense) => {
    if (expense.payer) {
      const payerId = expense.payer._id.toString()
      if (balances.hasOwnProperty(payerId)) {
        balances[payerId] += expense.amount
      }
    }

    if (expense.splitBetween && expense.splitBetween.length > 0) {
      expense.splitBetween.forEach((split) => {
        const userId = split.user._id.toString()
        if (balances.hasOwnProperty(userId)) {
          balances[userId] -= split.amount
        }
      })
    }
  })

  // Generate settlement list
  const settlements = []
  const creditors = []
  const debtors = []

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance > 0.01) {
      creditors.push({ userId, amount: Number.parseFloat(balance.toFixed(2)) })
    } else if (balance < -0.01) {
      debtors.push({ userId, amount: Number.parseFloat(Math.abs(balance).toFixed(2)) })
    }
  })

  // Greedy matching algorithm
  let i = 0,
    j = 0
  while (i < creditors.length && j < debtors.length) {
    const settleAmount = Math.min(creditors[i].amount, debtors[j].amount)
    settlements.push({
      fromUser: debtors[j].userId,
      toUser: creditors[i].userId,
      amount: Number.parseFloat(settleAmount.toFixed(2)),
    })

    creditors[i].amount = Number.parseFloat((creditors[i].amount - settleAmount).toFixed(2))
    debtors[j].amount = Number.parseFloat((debtors[j].amount - settleAmount).toFixed(2))

    if (creditors[i].amount < 0.01) i++
    if (debtors[j].amount < 0.01) j++
  }

  return settlements
}

export const getTripSettlements = async (req, res) => {
  try {
    const { tripId } = req.params
    const trip = await Trip.findById(tripId)
      .populate("owner", "_id name email")
      .populate("invitedUsers", "_id name email")

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    const isOwnerOrMember =
      trip.owner._id.toString() === req.user.id || trip.invitedUsers.some((u) => u._id.toString() === req.user.id)

    if (!isOwnerOrMember) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const expenses = await Expense.find({ trip: tripId })
      .populate("payer", "_id name email")
      .populate("splitBetween.user", "_id name email")

    const tripMembers = [trip.owner._id, ...trip.invitedUsers.map((u) => u._id)]
    const settlements = calculateSettlements(expenses, tripMembers)

    const settlementsWithDetails = await Promise.all(
      settlements.map(async (s) => {
        const fromUser = await User.findById(s.fromUser).select("name email")
        const toUser = await User.findById(s.toUser).select("name email")
        return {
          ...s,
          fromUserDetails: fromUser,
          toUserDetails: toUser,
        }
      }),
    )

    res.json(settlementsWithDetails)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const settlePayment = async (req, res) => {
  try {
    const { tripId } = req.params
    const { fromUserId, toUserId, amount } = req.body

    if (!fromUserId || !toUserId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid settlement data" })
    }

    const settlement = new Settlement({
      trip: tripId,
      fromUser: fromUserId,
      toUser: toUserId,
      amount: Number.parseFloat(amount),
      status: "settled",
      settledAt: new Date(),
    })

    await settlement.save()
    await settlement.populate("fromUser", "name email").populate("toUser", "name email")

    res.status(201).json(settlement)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getSettlementHistory = async (req, res) => {
  try {
    const { tripId } = req.params
    const settlements = await Settlement.find({ trip: tripId })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort({ createdAt: -1 })

    res.json(settlements)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
