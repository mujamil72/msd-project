import Trip from "../models/Trip.js"
import Expense from "../models/Expense.js"
import User from "../models/User.js"

export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [{ createdBy: req.user.id }, { members: req.user.id }],
    })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 })

    res.json(trips)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createTrip = async (req, res) => {
  try {
    const { name, destination, startDate, endDate, totalBudget, currency, categories, description } = req.body

    const trip = new Trip({
      createdBy: req.user.id,
      name,
      destination,
      startDate,
      endDate,
      budget: totalBudget,
      currency,
      description,
      members: [req.user.id],
      categories: categories || [
        { name: "Accommodation", limit: 0 },
        { name: "Food", limit: 0 },
        { name: "Transport", limit: 0 },
        { name: "Activities", limit: 0 },
        { name: "Other", limit: 0 },
      ],
    })

    await trip.save()
    await trip.populate("createdBy", "name email")

    res.status(201).json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email")

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    // Calculate total expenses
    const expenses = await Expense.find({ trip: req.params.id })
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)

    res.json({
      ...trip.toObject(),
      totalSpent,
      expenseCount: expenses.length,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)

    if (!trip || trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    Object.assign(trip, req.body, { updatedAt: new Date() })
    await trip.save()
    await trip.populate("createdBy", "name email")
    await trip.populate("members", "name email")

    res.json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)

    if (!trip || trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    await Expense.deleteMany({ trip: req.params.id })
    await Trip.findByIdAndDelete(req.params.id)

    res.json({ message: "Trip deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const inviteToTrip = async (req, res) => {
  try {
    const { email } = req.body
    const trip = await Trip.findById(req.params.id)

    if (!trip || trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!trip.members.includes(user._id)) {
      trip.members.push(user._id)
      await trip.save()
    }

    await trip.populate("createdBy", "name email")
    await trip.populate("members", "name email")

    res.json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const removeFromTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)

    if (!trip || trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    trip.members = trip.members.filter((id) => id.toString() !== req.params.userId)
    await trip.save()

    res.json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTripStats = async (req, res) => {
  try {
    const expenses = await Expense.find({ trip: req.params.id }).populate("user", "name email")

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const perPerson = {}
    const perCategory = {}

    expenses.forEach((exp) => {
      if (!perPerson[exp.user.email]) {
        perPerson[exp.user.email] = 0
      }
      perPerson[exp.user.email] += exp.amount

      if (!perCategory[exp.category]) {
        perCategory[exp.category] = 0
      }
      perCategory[exp.category] += exp.amount
    })

    res.json({
      totalSpent,
      expenseCount: expenses.length,
      perPerson,
      perCategory,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
