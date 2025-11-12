import express from 'express';
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  joinEvent, 
  leaveEvent 
} from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes - accessible without authentication
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes - require authentication
router.post('/', authenticateToken, createEvent);
router.post('/:eventId/join', authenticateToken, joinEvent);
router.post('/:eventId/leave', authenticateToken, leaveEvent);

export default router;