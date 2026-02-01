import express from 'express';
import { getAllOffers, getActiveOffers, createOffer } from '../controllers/offer.controller.js';
import { protect, restrictTo } from '../utils/auth.js';

const router = express.Router();

router.get('/', getAllOffers);
router.get('/active', getActiveOffers);

// Protected admin routes
router.post('/', protect, restrictTo('admin'), createOffer);

export default router;
