import rateLimit from 'express-rate-limit';

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { msg: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Transaction rate limiting
const transactionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per hour
  message: { msg: 'Too many transaction requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Analytics rate limiting
const analyticsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 requests per hour
  message: { msg: 'Too many analytics requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export { authLimiter, transactionLimiter, analyticsLimiter };