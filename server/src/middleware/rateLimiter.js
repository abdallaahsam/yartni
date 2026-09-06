import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'تم تجاوز الحد المسموح من المحاولات، يرجى المحاولة بعد 15 دقيقة'
  }
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // limit each IP to 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'طلبات كثيرة جداً في وقت قصير، يرجى الانتظار قليلاً'
  }
});
