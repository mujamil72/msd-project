import Expense from "../models/Expense.js"
import Trip from "../models/Trip.js"

export const getTripAnalytics = async (req, res) => {
  try {
    const tripId = req.params.tripId
    const trip = await Trip.findById(tripId)

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    const expenses = await Expense.find({ trip: tripId }).populate("user", "name email")

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const categoryBreakdown = {}
    const dailySpending = {}
    const perPersonSpending = {}

    expenses.forEach((exp) => {
      // Category breakdown
      if (!categoryBreakdown[exp.category]) {
        categoryBreakdown[exp.category] = { amount: 0, count: 0 }
      }
      categoryBreakdown[exp.category].amount += exp.amount
      categoryBreakdown[exp.category].count += 1

      // Daily spending
      const dateKey = new Date(exp.date).toISOString().split("T")[0]
      if (!dailySpending[dateKey]) {
        dailySpending[dateKey] = 0
      }
      dailySpending[dateKey] += exp.amount

      // Per person spending
      const personKey = exp.user.email
      if (!perPersonSpending[personKey]) {
        perPersonSpending[personKey] = 0
      }
      perPersonSpending[personKey] += exp.amount
    })

    const dailyArray = Object.entries(dailySpending)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    res.json({
      totalSpent,
      expenseCount: expenses.length,
      categoryBreakdown,
      dailySpending: dailyArray,
      perPersonSpending,
      tripDays: trip.endDate
        ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
        : 0,
      averageDailySpend: trip.endDate
        ? totalSpent / Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
        : 0,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
