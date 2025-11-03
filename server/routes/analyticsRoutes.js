import express from "express"
import { getTripAnalytics } from "../controllers/analyticsController.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.get("/:tripId", authMiddleware, getTripAnalytics)

export default router
