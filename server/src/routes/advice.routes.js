import express from 'express';
import { db } from '../db/index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validate, adviceSchema, reportSchema } from '../middleware/validate.js';
import { slugify } from '../utils/slugify.js';

const router = express.Router();

// GET /api/advices - List & filter advices
router.get('/', optionalAuth, (req, res) => {
  try {
    const { target_age, category_slug, sort = 'latest', q, page = 1, limit = 12 } = req.query;
    const currentUserId = req.user ? req.user.id : null;
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    let whereConditions = [];
    let params = [];

    // Filter by target age
    if (target_age && target_age !== 'all') {
      const cleanAge = target_age.toString().trim();
      if (cleanAge === '40+' || cleanAge === '40_plus' || target_age === '40 ' || cleanAge === '40') {
        whereConditions.push('a.target_age >= ?');
        params.push(40);
      } else {
        whereConditions.push('a.target_age = ?');
        params.push(parseInt(cleanAge));
      }
    }

    // Filter by category slug
    if (category_slug && category_slug !== 'all') {
      whereConditions.push('c.slug = ?');
      params.push(category_slug);
    }

    // Full-Text Search via FTS5 with Arabic morphology handling
    if (q && q.trim()) {
      const sanitizedQ = q.trim().replace(/['"*]/g, '');
      if (sanitizedQ) {
        const raw = sanitizedQ;
        const stripped = raw.startsWith('ال') ? raw.slice(2) : raw;
        const ftsQuery = `"${raw}"* OR "${stripped}"* OR "ال${stripped}"*`;

        whereConditions.push('(a.id IN (SELECT rowid FROM advices_fts WHERE advices_fts MATCH ?) OR a.headline LIKE ? OR a.story LIKE ? OR a.lesson LIKE ?)');
        params.push(ftsQuery, `%${raw}%`, `%${raw}%`, `%${raw}%`);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Sorting algorithm
    let orderBy = 'a.created_at DESC';
    if (sort === 'top') {
      orderBy = 'impact_count DESC, a.created_at DESC';
    } else if (sort === 'trending') {
      // Trending gravity: (impact_count * 3 + view_count) / (hours_old + 2)^1.3
      orderBy = `
        (
          ((SELECT COUNT(*) FROM advice_impacts WHERE advice_id = a.id) * 4 + a.view_count) / 
          POW((strftime('%s', 'now') - strftime('%s', a.created_at)) / 3600.0 + 2, 1.2)
        ) DESC
      `;
    }

    // Count total matching
    const countSql = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM advices a
      JOIN categories c ON c.id = a.category_id
      ${whereClause}
    `;
    const totalRow = db.prepare(countSql).get(...params);
    const total = totalRow ? totalRow.total : 0;

    // Fetch advices
    const querySql = `
      SELECT 
        a.id,
        a.slug,
        a.target_age,
        a.author_age_at_post,
        a.headline,
        a.story,
        a.lesson,
        a.is_anonymous,
        a.view_count,
        a.created_at,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        c.color as category_color,
        CASE 
          WHEN a.is_anonymous = 1 THEN 'مشارك مجهول'
          ELSE u.name
        END as author_name,
        CASE 
          WHEN a.is_anonymous = 1 THEN NULL
          ELSE u.username
        END as author_username,
        CASE 
          WHEN a.is_anonymous = 1 THEN '#64748B'
          ELSE u.avatar_color
        END as author_avatar_color,
        (SELECT COUNT(*) FROM advice_impacts WHERE advice_id = a.id) as impact_count,
        (SELECT COUNT(*) FROM comments WHERE advice_id = a.id) as comments_count,
        CASE 
          WHEN ? IS NOT NULL THEN (SELECT COUNT(*) FROM advice_impacts WHERE advice_id = a.id AND user_id = ?)
          ELSE 0
        END as has_impacted,
        CASE 
          WHEN ? IS NOT NULL THEN (SELECT COUNT(*) FROM bookmarks WHERE advice_id = a.id AND user_id = ?)
          ELSE 0
        END as has_bookmarked
      FROM advices a
      JOIN users u ON u.id = a.user_id
      JOIN categories c ON c.id = a.category_id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const allParams = [
      currentUserId, currentUserId,
      currentUserId, currentUserId,
      ...params,
      parseInt(limit), offset
    ];

    const advices = db.prepare(querySql).all(...allParams).map(item => ({
      ...item,
      has_impacted: Boolean(item.has_impacted),
      has_bookmarked: Boolean(item.has_bookmarked),
      is_anonymous: Boolean(item.is_anonymous)
    }));

    return res.json({
      advices,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Fetch advices error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء جلب النصائح' });
  }
});

// GET /api/advices/:id - Get single advice details and increment view_count
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    // Increment view count asynchronously
    db.prepare('UPDATE advices SET view_count = view_count + 1 WHERE id = ?').run(id);

    const advice = db.prepare(`
      SELECT 
        a.id,
        a.slug,
        a.target_age,
        a.author_age_at_post,
        a.headline,
        a.story,
        a.lesson,
        a.is_anonymous,
        a.view_count,
        a.created_at,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        c.color as category_color,
        CASE 
          WHEN a.is_anonymous = 1 THEN 'مشارك مجهول'
          ELSE u.name
        END as author_name,
        CASE 
          WHEN a.is_anonymous = 1 THEN NULL
          ELSE u.username
        END as author_username,
        CASE 
          WHEN a.is_anonymous = 1 THEN '#64748B'
          ELSE u.avatar_color
        END as author_avatar_color,
        CASE 
          WHEN a.is_anonymous = 1 THEN NULL
          ELSE u.bio
        END as author_bio,
        (SELECT COUNT(*) FROM advice_impacts WHERE advice_id = a.id) as impact_count,
        (SELECT COUNT(*) FROM comments WHERE advice_id = a.id) as comments_count,
        CASE 
          WHEN ? IS NOT NULL THEN (SELECT COUNT(*) FROM advice_impacts WHERE advice_id = a.id AND user_id = ?)
          ELSE 0
        END as has_impacted,
        CASE 
          WHEN ? IS NOT NULL THEN (SELECT COUNT(*) FROM bookmarks WHERE advice_id = a.id AND user_id = ?)
          ELSE 0
        END as has_bookmarked
      FROM advices a
      JOIN users u ON u.id = a.user_id
      JOIN categories c ON c.id = a.category_id
      WHERE a.id = ?
    `).get(currentUserId, currentUserId, currentUserId, currentUserId, id);

    if (!advice) {
      return res.status(404).json({ error: 'النصيحة غير موجودة' });
    }

    return res.json({
      advice: {
        ...advice,
        has_impacted: Boolean(advice.has_impacted),
        has_bookmarked: Boolean(advice.has_bookmarked),
        is_anonymous: Boolean(advice.is_anonymous)
      }
    });
  } catch (err) {
    console.error('Fetch advice detail error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء جلب تفاصيل النصيحة' });
  }
});

// POST /api/advices - Create new advice
router.post('/', requireAuth, validate(adviceSchema), (req, res) => {
  try {
    const { headline, story, lesson, target_age, category_id, is_anonymous } = req.body;
    const authorAge = req.user.current_age;

    // Validate category exists
    const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
    if (!category) {
      return res.status(400).json({ error: 'التصنيف المختار غير صالح' });
    }

    // Generate slug
    let baseSlug = slugify(headline);
    const existingSlug = db.prepare('SELECT id FROM advices WHERE slug = ?').get(baseSlug);
    if (existingSlug) {
      baseSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const stmt = db.prepare(`
      INSERT INTO advices (
        user_id, category_id, target_age, author_age_at_post,
        slug, headline, story, lesson, is_anonymous
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.id,
      category_id,
      target_age,
      authorAge,
      baseSlug,
      headline.trim(),
      story.trim(),
      lesson.trim(),
      is_anonymous ? 1 : 0
    );

    return res.status(201).json({
      message: 'تم نشر نصيحتك بنجاح لتفيد بها الآخرين',
      adviceId: result.lastInsertRowid,
      slug: baseSlug
    });
  } catch (err) {
    console.error('Create advice error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء نشر النصيحة' });
  }
});

// POST /api/advices/:id/impact - Toggle "أثرت فيّ"
router.post('/:id/impact', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify advice exists
    const advice = db.prepare('SELECT id, user_id FROM advices WHERE id = ?').get(id);
    if (!advice) {
      return res.status(404).json({ error: 'النصيحة غير موجودة' });
    }

    // Check if already impacted
    const existing = db.prepare('SELECT id FROM advice_impacts WHERE advice_id = ? AND user_id = ?').get(id, userId);

    let hasImpacted = false;
    if (existing) {
      db.prepare('DELETE FROM advice_impacts WHERE id = ?').run(existing.id);
      hasImpacted = false;
    } else {
      db.prepare('INSERT INTO advice_impacts (advice_id, user_id) VALUES (?, ?)').run(id, userId);
      hasImpacted = true;

      // Add notification for author if not self-impact
      if (advice.user_id !== userId) {
        db.prepare(`
          INSERT INTO notifications (user_id, actor_id, advice_id, type)
          VALUES (?, ?, ?, 'impact')
        `).run(advice.user_id, userId, id);
      }
    }

    const impactCountRow = db.prepare('SELECT COUNT(*) as count FROM advice_impacts WHERE advice_id = ?').get(id);

    return res.json({
      has_impacted: hasImpacted,
      impact_count: impactCountRow ? impactCountRow.count : 0
    });
  } catch (err) {
    console.error('Impact toggle error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء تحديث التفاعل' });
  }
});

// POST /api/advices/:id/bookmark - Toggle bookmark
router.post('/:id/bookmark', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const advice = db.prepare('SELECT id FROM advices WHERE id = ?').get(id);
    if (!advice) {
      return res.status(404).json({ error: 'النصيحة غير موجودة' });
    }

    const existing = db.prepare('SELECT id FROM bookmarks WHERE advice_id = ? AND user_id = ?').get(id, userId);

    let hasBookmarked = false;
    if (existing) {
      db.prepare('DELETE FROM bookmarks WHERE id = ?').run(existing.id);
      hasBookmarked = false;
    } else {
      db.prepare('INSERT INTO bookmarks (advice_id, user_id) VALUES (?, ?)').run(id, userId);
      hasBookmarked = true;
    }

    return res.json({
      has_bookmarked: hasBookmarked,
      message: hasBookmarked ? 'تم حفظ النصيحة في مفضلتك' : 'تمت إزالة النصيحة من المفضلة'
    });
  } catch (err) {
    console.error('Bookmark toggle error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء تحديث المحفوظات' });
  }
});

// POST /api/advices/:id/report - Report advice
router.post('/:id/report', optionalAuth, validate(reportSchema), (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user ? req.user.id : null;

    const advice = db.prepare('SELECT id FROM advices WHERE id = ?').get(id);
    if (!advice) {
      return res.status(404).json({ error: 'النصيحة غير موجودة' });
    }

    db.prepare(`
      INSERT INTO reports (advice_id, user_id, reason)
      VALUES (?, ?, ?)
    `).run(id, userId, reason.trim());

    return res.json({ message: 'شكراً لمساهمتك، سيتم مراجعة البلاغ من قبل المشرفين' });
  } catch (err) {
    console.error('Report error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء إرسال البلاغ' });
  }
});

export default router;
