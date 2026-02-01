import express from 'express';
import { getAnnouncement, updateAnnouncement } from '../controllers/settings.controller.js';

const router = express.Router();

// Public routes
router.get('/announcement', getAnnouncement);
router.post('/announcement', updateAnnouncement);

export default router;
