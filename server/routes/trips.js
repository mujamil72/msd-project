import express from "express"
import Trip from "../models/Trip.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [{ owner: req.user.id }, { invitedUsers: req.user.id }],
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 })

    res.json(trips)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, destination, startDate, endDate, totalBudget, currency } = req.body

    const trip = new Trip({
      owner: req.user.id,
      name,
      destination,
      startDate,
      endDate,
      totalBudget,
      currency,
      categories: [
        { name: "Accommodation", limit: 0 },
        { name: "Food", limit: 0 },
        { name: "Transport", limit: 0 },
        { name: "Activities", limit: 0 },
        { name: "Miscellaneous", limit: 0 },
      ],
    })

    await trip.save()
    await trip.populate("owner", "name email")

    res.status(201).json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("owner", "name email")
      .populate("invitedUsers", "name email")

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    res.json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)

    if (!trip || trip.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    Object.assign(trip, req.body)
    await trip.save()

    res.json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)

    if (!trip || trip.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    await Trip.findByIdAndDelete(req.params.id)
    res.json({ message: "Trip deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:id/invite", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body
    const trip = await Trip.findById(req.params.id)

    if (!trip || trip.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    if (!trip.invitedUsers.includes(userId)) {
      trip.invitedUsers.push(userId)
      await trip.save()
    }

    await trip.populate("owner", "name email")
    await trip.populate("invitedUsers", "name email")

    res.json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/:id/invite/:userId", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)

    if (!trip || trip.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    trip.invitedUsers = trip.invitedUsers.filter((id) => id.toString() !== req.params.userId)
    await trip.save()

    res.json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
