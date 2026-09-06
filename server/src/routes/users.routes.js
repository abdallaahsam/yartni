import express from 'express';
import { db } from '../db/index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper to calculate gamification badges
function calculateBadges(advicesCount, totalImpacts, targetAges) {
  const badges = [];

  if (advicesCount >= 1) {
    badges.push({
      id: 'first_step',
      name: 'خطوة أولى',
      description: 'نشر أول تجربة ملهمة في المنصة',
      icon: '🌱',
      color: '#10B981'
    });
  }

  if (advicesCount >= 3) {
    badges.push({
      id: 'active_contributor',
      name: 'مساهم نشط',
      description: 'شارك 3 نصائح أو أكثر لدعم الآخرين',
      icon: '⚡',
      color: '#F59E0B'
    });
  }

  if (totalImpacts >= 5) {
    badges.push({
      id: 'golden_impact',
      name: 'أثر ذهبي',
      description: 'نالت نصائحه تأييد أكثر من 5 أشخاص قالوا "أثرت فيّ"',
      icon: '🌟',
      color: '#EAB308'
    });
  }

  const hasTwenties = targetAges.some(age => age >= 20 && age <= 29);
  if (hasTwenties) {
    badges.push({
      id: 'twenties_sage',
      name: 'حكيم العشرينات',
      description: 'قدّم نصائح ثمينة للشباب في مرحلة العشرينات',
      icon: '🎓',
      color: '#6366F1'
    });
  }

  const hasThirtiesOrMore = targetAges.some(age => age >= 30);
  if (hasThirtiesOrMore) {
    badges.push({
      id: 'life_veteran',
      name: 'خبير الحياة',
      description: 'شارك خلاصة تجارب ونضج ما بعد الثلاثين',
      icon: '👑',
      color: '#8B5CF6'
    });
  }

  return badges;
}

// GET /api/users/@:username - Public user profile
router.get('/@:username', optionalAuth, (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    const user = db.prepare(`
      SELECT id, username, name, current_age, bio, avatar_color, created_at
      FROM users WHERE username = ?
    `).get(username.toLowerCase().trim());

    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    // Public advices by this user (exclude anonymous ones for privacy)
    const advices = db.prepare(`
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
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        c.color as category_color,
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
      JOIN categories c ON c.id = a.category_id
      WHERE a.user_id = ? AND a.is_anonymous = 0
      ORDER BY a.created_at DESC
    `).all(currentUserId, currentUserId, currentUserId, currentUserId, user.id).map(a => ({
      ...a,
      author_name: user.name,
      author_username: user.username,
      author_avatar_color: user.avatar_color,
      has_impacted: Boolean(a.has_impacted),
      has_bookmarked: Boolean(a.has_bookmarked),
      is_anonymous: false
    }));

    // Total impact score
    const impactRow = db.prepare(`
      SELECT COUNT(i.id) as total_impacts
      FROM advice_impacts i
      JOIN advices a ON a.id = i.advice_id
      WHERE a.user_id = ? AND a.is_anonymous = 0
    `).get(user.id);

    const totalImpacts = impactRow ? impactRow.total_impacts : 0;
    const targetAges = advices.map(a => a.target_age);
    const badges = calculateBadges(advices.length, totalImpacts, targetAges);

    return res.json({
      user,
      stats: {
        advices_count: advices.length,
        total_impacts: totalImpacts
      },
      badges,
      advices
    });
  } catch (err) {
    console.error('Fetch user profile error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء جلب الملف الشخصي' });
  }
});

// GET /api/users/me/bookmarks - User's private bookmarked advices
router.get('/me/bookmarks', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = db.prepare(`
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
        (SELECT COUNT(*) FROM advice_impacts WHERE advice_id = a.id AND user_id = ?) as has_impacted,
        1 as has_bookmarked
      FROM bookmarks b
      JOIN advices a ON a.id = b.advice_id
      JOIN users u ON u.id = a.user_id
      JOIN categories c ON c.id = a.category_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(userId, userId).map(a => ({
      ...a,
      has_impacted: Boolean(a.has_impacted),
      has_bookmarked: true,
      is_anonymous: Boolean(a.is_anonymous)
    }));

    return res.json({ bookmarks });
  } catch (err) {
    console.error('Fetch bookmarks error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء جلب المحفوظات' });
  }
});

// PUT /api/users/me/profile - Update own profile
router.put('/me/profile', requireAuth, (req, res) => {
  try {
    const { name, bio, current_age } = req.body;
    const userId = req.user.id;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'الاسم يجب أن يكون حرفين على الأقل' });
    }

    const age = parseInt(current_age);
    if (isNaN(age) || age < 12 || age > 100) {
      return res.status(400).json({ error: 'يرجى إدخال عمر صحيح بين 12 و 100' });
    }

    db.prepare(`
      UPDATE users 
      SET name = ?, bio = ?, current_age = ?
      WHERE id = ?
    `).run(name.trim(), bio ? bio.trim() : '', age, userId);

    const updatedUser = db.prepare(`
      SELECT id, username, name, email, current_age, bio, avatar_color
      FROM users WHERE id = ?
    `).get(userId);

    return res.json({
      message: 'تم تحديث الملف الشخصي بنجاح',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء تحديث الملف الشخصي' });
  }
});

export default router;
