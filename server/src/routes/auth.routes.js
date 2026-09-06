import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { config } from '../config/config.js';
import { validate, registerSchema, loginSchema } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Generate random pleasant avatar background color
const AVATAR_COLORS = [
  '#2563EB', '#3B82F6', '#6366F1', '#8B5CF6', 
  '#EC4899', '#F43F5E', '#10B981', '#14B8A6', '#06B6D4'
];

router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
  try {
    const { username, name, email, password, current_age } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.toLowerCase().trim();

    // Check unique email
    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existingEmail) {
      return res.status(400).json({ error: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    // Check unique username
    const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUsername);
    if (existingUsername) {
      return res.status(400).json({ error: 'اسم المستخدم محجوز، يرجى اختيار اسم آخر' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const avatar_color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    // Insert user
    const stmt = db.prepare(`
      INSERT INTO users (username, name, email, password_hash, current_age, avatar_color)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(cleanUsername, name.trim(), cleanEmail, password_hash, current_age, avatar_color);

    const user = {
      id: result.lastInsertRowid,
      username: cleanUsername,
      name: name.trim(),
      email: cleanEmail,
      current_age,
      avatar_color,
      bio: ''
    };

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

    return res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      user,
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب' });
  }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const user = db.prepare(`
      SELECT id, username, name, email, password_hash, current_age, bio, avatar_color
      FROM users WHERE email = ?
    `).get(cleanEmail);

    if (!user) {
      return res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      current_age: user.current_age,
      bio: user.bio,
      avatar_color: user.avatar_color
    };

    return res.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: safeUser,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
