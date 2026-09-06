import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { db } from '../db/index.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'يرجى تسجيل الدخول أولاً للقيام بهذا الإجراء' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = db.prepare('SELECT id, username, name, email, current_age, bio, avatar_color FROM users WHERE id = ?').get(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'المستخدم غير موجود أو تم حذف الحساب' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'جلسة الدخول منتهية أو غير صالحة' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = db.prepare('SELECT id, username, name, email, current_age FROM users WHERE id = ?').get(decoded.userId);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
}
