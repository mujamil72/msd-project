import express from 'express';
import Accommodation from '../models/Accommodation.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/:tripId', authMiddleware, async (req, res) => {
  try {
    const accommodations = await Accommodation.find({ trip: req.params.tripId })
      .sort({ checkIn: 1 });
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const accommodation = new Accommodation({
      ...req.body,
      user: req.user.id
    });
    await accommodation.save();
    res.status(201).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const accommodation = await Accommodation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Accommodation.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Accommodation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;