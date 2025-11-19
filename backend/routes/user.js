import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserDeliverables } from '../controllers/adminController.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// User deliverables
router.get('/deliverables', getUserDeliverables);

export default router;
