import express from 'express';
import { db } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import { validate, commentSchema } from '../middleware/validate.js';

const router = express.Router({ mergeParams: true });

// GET /api/advices/:id/comments
router.get('/', (req, res) => {
  try {
    const { id } = req.params;

    const comments = db.prepare(`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.id as user_id,
        u.name as user_name,
        u.username as user_username,
        u.avatar_color as user_avatar_color,
        u.current_age as user_current_age
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.advice_id = ?
      ORDER BY c.created_at ASC
    `).all(id);

    return res.json({ comments });
  } catch (err) {
    console.error('Fetch comments error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء جلب التعليقات' });
  }
});

// POST /api/advices/:id/comments
router.post('/', requireAuth, validate(commentSchema), (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const advice = db.prepare('SELECT id, user_id FROM advices WHERE id = ?').get(id);
    if (!advice) {
      return res.status(404).json({ error: 'النصيحة غير موجودة' });
    }

    const stmt = db.prepare(`
      INSERT INTO comments (advice_id, user_id, content)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(id, userId, content.trim());

    // Add notification to advice owner if someone else commented
    if (advice.user_id !== userId) {
      db.prepare(`
        INSERT INTO notifications (user_id, actor_id, advice_id, type)
        VALUES (?, ?, ?, 'comment')
      `).run(advice.user_id, userId, id);
    }

    const newComment = db.prepare(`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.id as user_id,
        u.name as user_name,
        u.username as user_username,
        u.avatar_color as user_avatar_color,
        u.current_age as user_current_age
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `).get(result.lastInsertRowid);

    return res.status(201).json({
      message: 'تم إضافة تعليقك بنجاح',
      comment: newComment
    });
  } catch (err) {
    console.error('Add comment error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء إضافة التعليق' });
  }
});

export default router;
