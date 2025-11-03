import express from "express"
import { getExpensesByTrip, createExpense, updateExpense, deleteExpense } from "../controllers/expenseController.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

router.get("/:tripId", authMiddleware, getExpensesByTrip)
router.post("/", authMiddleware, createExpense)
router.put("/:id", authMiddleware, updateExpense)
router.delete("/:id", authMiddleware, deleteExpense)

export default router
