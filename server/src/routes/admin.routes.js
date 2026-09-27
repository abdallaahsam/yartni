import express from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/reports - Pending reports grouped by advice, plus hidden advices so they can be restored
router.get('/reports', (req, res) => {
  try {
    const reports = db.prepare(`
      SELECT
        a.id as advice_id,
        a.slug,
        a.headline,
        a.is_hidden,
        u.username as author_username,
        COUNT(r.id) as report_count,
        GROUP_CONCAT(r.reason, ' | ') as reasons,
        MAX(r.created_at) as last_reported_at
      FROM reports r
      JOIN advices a ON a.id = r.advice_id
      JOIN users u ON u.id = a.user_id
      WHERE r.status = 'pending' OR a.is_hidden = 1
      GROUP BY a.id
      ORDER BY a.is_hidden ASC, report_count DESC, last_reported_at DESC
    `).all().map(r => ({ ...r, is_hidden: Boolean(r.is_hidden) }));

    return res.json({ reports });
  } catch (err) {
    console.error('Fetch reports error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء جلب البلاغات' });
  }
});

const resolveSchema = z.object({
  action: z.enum(['hide', 'dismiss'], { message: 'الإجراء يجب أن يكون hide أو dismiss' })
});

// POST /api/admin/advices/:id/resolve - Hide the advice or dismiss its reports
router.post('/advices/:id/resolve', validate(resolveSchema), (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const advice = db.prepare('SELECT id FROM advices WHERE id = ?').get(id);
    if (!advice) {
      return res.status(404).json({ error: 'النصيحة غير موجودة' });
    }

    if (action === 'hide') {
      db.prepare('UPDATE advices SET is_hidden = 1 WHERE id = ?').run(id);
    }
    db.prepare(`UPDATE reports SET status = ? WHERE advice_id = ? AND status = 'pending'`)
      .run(action === 'hide' ? 'resolved' : 'dismissed', id);

    return res.json({ message: action === 'hide' ? 'تم إخفاء النصيحة' : 'تم رفض البلاغات' });
  } catch (err) {
    console.error('Resolve report error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء معالجة البلاغ' });
  }
});

// POST /api/admin/advices/:id/unhide - Restore a hidden advice
router.post('/advices/:id/unhide', (req, res) => {
  try {
    const result = db.prepare('UPDATE advices SET is_hidden = 0 WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'النصيحة غير موجودة' });
    }
    return res.json({ message: 'تمت استعادة النصيحة' });
  } catch (err) {
    console.error('Unhide advice error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء استعادة النصيحة' });
  }
});

export default router;
