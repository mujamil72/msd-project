import express from 'express';
import Transport from '../models/Transport.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/:tripId', authMiddleware, async (req, res) => {
  try {
    const transports = await Transport.find({ trip: req.params.tripId })
      .sort({ departureDate: 1 });
    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const transport = new Transport({
      ...req.body,
      user: req.user.id
    });
    await transport.save();
    res.status(201).json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const transport = await Transport.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Transport.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Transport deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;