import express from 'express';
import Insurance from '../models/Insurance.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user insurance policies
router.get('/', authMiddleware, async (req, res) => {
  try {
    const policies = await Insurance.find({ user: req.user.id })
      .populate('trip', 'name destination startDate endDate');
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get insurance for specific trip
router.get('/trip/:tripId', authMiddleware, async (req, res) => {
  try {
    const insurance = await Insurance.findOne({ 
      trip: req.params.tripId, 
      user: req.user.id 
    }).populate('trip', 'name destination');
    res.json(insurance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Purchase insurance
router.post('/', authMiddleware, async (req, res) => {
  try {
    const insurance = new Insurance({
      ...req.body,
      user: req.user.id
    });
    await insurance.save();
    res.json(insurance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;