import express from "express"
import {
  getAllTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
  inviteToTrip,
  removeFromTrip,
  getTripStats,
} from "../controllers/tripController.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.get("/", authMiddleware, getAllTrips)
router.post("/", authMiddleware, createTrip)
router.get("/:id", authMiddleware, getTripById)
router.put("/:id", authMiddleware, updateTrip)
router.delete("/:id", authMiddleware, deleteTrip)
router.post("/:id/invite", authMiddleware, inviteToTrip)
router.delete("/:id/invite/:userId", authMiddleware, removeFromTrip)
router.get("/:id/stats", authMiddleware, getTripStats)

export default router
