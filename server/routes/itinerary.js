import express from 'express';
import Itinerary from '../models/Itinerary.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/:tripId', authMiddleware, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ trip: req.params.tripId })
      .sort({ date: 1 });
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const itinerary = new Itinerary({
      ...req.body,
      user: req.user.id
    });
    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Itinerary.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Itinerary deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;