import express from 'express';
import Budget from '../models/Budget.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get budget for a trip
router.get('/:tripId', authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOne({ 
      trip: req.params.tripId, 
      user: req.user.id 
    });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update budget
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { trip, categories, totalBudget, currency } = req.body;
    
    let budget = await Budget.findOne({ trip, user: req.user.id });
    
    if (budget) {
      budget.categories = categories;
      budget.totalBudget = totalBudget;
      budget.currency = currency;
      await budget.save();
    } else {
      budget = new Budget({
        user: req.user.id,
        trip,
        categories,
        totalBudget,
        currency
      });
      await budget.save();
    }
    
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;