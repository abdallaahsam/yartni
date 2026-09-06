import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// GET /api/categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT 
        c.id, c.name, c.slug, c.icon, c.color, c.display_order, c.description,
        COUNT(a.id) as advice_count
      FROM categories c
      LEFT JOIN advices a ON a.category_id = c.id
      GROUP BY c.id
      ORDER BY c.display_order ASC
    `).all();

    return res.json({ categories });
  } catch (err) {
    console.error('Fetch categories error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء جلب التصنيفات' });
  }
});

// GET /api/ages
router.get('/ages', (req, res) => {
  try {
    const ages = db.prepare(`
      SELECT 
        target_age as age,
        COUNT(id) as advice_count
      FROM advices
      GROUP BY target_age
      ORDER BY target_age ASC
    `).all();

    return res.json({ ages });
  } catch (err) {
    console.error('Fetch ages error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء جلب الأعمار' });
  }
});

export default router;
