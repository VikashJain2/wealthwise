import express from 'express'
import { getAnalytics } from '../controllers/analyticsController.js';
import { analyticsLimiter } from '../middleware/rateLimitMiddleware.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const analyticsRouter = express.Router();

analyticsRouter.use(analyticsLimiter);
analyticsRouter.get('/', authenticate, authorize(['admin', 'user', 'read-only']), getAnalytics);

export default analyticsRouter;