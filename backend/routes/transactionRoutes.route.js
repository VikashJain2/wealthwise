import express from 'express'
import { addTransaction, deleteTransaction, editTransaction, getTransactions } from '../controllers/transactionController.js';
import {transactionLimiter} from '../middleware/rateLimitMiddleware.js'
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const transactionRouter = express.Router();

transactionRouter.use(transactionLimiter);
transactionRouter.get('/', authenticate, authorize(['admin', 'user', 'read-only']), getTransactions);
transactionRouter.post('/',authenticate, authorize(['admin', 'user']), addTransaction);

transactionRouter.put('/:id',authenticate, authorize(['admin', 'user']), editTransaction);
transactionRouter.delete('/:id',authenticate, authorize(['admin', 'user']), deleteTransaction);

export default transactionRouter;