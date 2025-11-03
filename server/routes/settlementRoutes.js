import express from "express"
import { getTripSettlements, settlePayment, getSettlementHistory } from "../controllers/settlementController.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.get("/:tripId", authMiddleware, getTripSettlements)
router.post("/:tripId/settle", authMiddleware, settlePayment)
router.get("/:tripId/history", authMiddleware, getSettlementHistory)

export default router
