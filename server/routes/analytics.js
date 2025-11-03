import express from 'express';
import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';
import Budget from '../models/Budget.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ 
      $or: [
        { createdBy: req.user.id },
        { members: req.user.id }
      ]
    });
    
    const tripIds = trips.map(trip => trip._id);
    
    const expenses = await Expense.find({ trip: { $in: tripIds } });
    
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    const monthlySpending = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});
    
    res.json({
      totalTrips: trips.length,
      totalSpent,
      totalBudget,
      budgetUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      categorySpending,
      monthlySpending,
      recentExpenses: expenses.slice(-5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trip analytics
router.get('/trip/:tripId', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ trip: req.params.tripId })
      .populate('paidBy', 'name email');
    
    const trip = await Trip.findById(req.params.tripId);
    const budget = await Budget.findOne({ trip: req.params.tripId });
    
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    const memberSpending = expenses.reduce((acc, expense) => {
      const member = expense.paidBy.name;
      acc[member] = (acc[member] || 0) + expense.amount;
      return acc;
    }, {});
    
    res.json({
      totalSpent,
      budget: budget?.totalBudget || trip.budget,
      categoryBreakdown,
      memberSpending,
      expenseCount: expenses.length,
      averageExpense: expenses.length > 0 ? totalSpent / expenses.length : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;