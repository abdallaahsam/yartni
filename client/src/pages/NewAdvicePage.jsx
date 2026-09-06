import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Sparkles, Send, Lightbulb, Lock, Globe, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NewAdvicePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [headline, setHeadline] = useState('');
  const [story, setStory] = useState('');
  const [lesson, setLesson] = useState('');
  const [targetAge, setTargetAge] = useState(20);
  const [categoryId, setCategoryId] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Protect route if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/new');
    }
  }, [user, navigate]);

  useEffect(() => {
    api.getCategories()
      .then(res => {
        setCategories(res.categories);
        if (res.categories.length > 0) {
          setCategoryId(res.categories[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!headline.trim() || !story.trim() || !lesson.trim()) {
      setError('يرجى ملء جميع حقول النصيحة والدرس المستفاد');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.createAdvice({
        headline: headline.trim(),
        story: story.trim(),
        lesson: lesson.trim(),
        target_age: parseInt(targetAge),
        category_id: parseInt(categoryId),
        is_anonymous: isAnonymous
      });

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });

      navigate(`/advice/${res.adviceId}/${res.slug}`);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء نشر النصيحة');
      setSubmitting(false);
    }
  };

  const selectedCategoryObj = categories.find(c => c.id === parseInt(categoryId));

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ maxWidth: '820px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '18px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
            <ArrowRight size={18} />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px',
          boxShadow: 'var(--shadow-md)'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
              <Sparkles size={24} />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>شارك خبرتك الحياتية</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              لو رجع بيك الزمن.. إيه النصيحة اللي كنت تحب تعرفها؟
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              كلماتك وتجربتك الواقعية اليوم قد تنقذ شاباً أو فتاة من نفس الخطأ وتغير مسار حياتهم للأفضل.
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--accent-rose-light)',
              color: 'var(--accent-rose)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              fontSize: '0.95rem',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Age and Category Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {/* Target Age */}
              <div className="form-group">
                <label className="form-label">
                  السن المستهدف (العمر الذي تخصه النصيحة):
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="number"
                    min="12"
                    max="90"
                    className="form-input"
                    value={targetAge}
                    onChange={(e) => setTargetAge(e.target.value)}
                    required
                  />
                  <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>سنة</span>
                </div>
                {user && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    (فارق الخبرة: أنت الآن في سن {user.current_age} سنة)
                  </span>
                )}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">
                  مجال وتصنيف النصيحة:
                </label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Headline */}
            <div className="form-group">
              <label className="form-label">
                جملة النصيحة الجوهرية (العنوان):
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: ياريتني بدأت أتعلم برمجة وأنا في أولى جامعة بدل تضييع الإجازات الصيفية"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
              />
            </div>

            {/* Story */}
            <div className="form-group">
              <label className="form-label">
                القصة والتجربة الواقعية (ما الذي حدث معك ولماذا ندمت؟):
              </label>
              <textarea
                className="form-textarea"
                rows="5"
                placeholder="احكِ التفاصيل، الموقف الحقيقي، والأثر اللي حصل عليك في دراستك أو شغلك أو حياتك..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                required
              />
            </div>

            {/* Lesson Box Input */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)' }}>
                <Lightbulb size={18} />
                <span>الدرس العملي المباشر ("لو رجع بيا الزمن هعمل..."):</span>
              </label>
              <textarea
                className="form-textarea"
                rows="3"
                style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}
                placeholder="لو رجع بيا الزمن كنت هعمل كذا كذا فوراً بدون تردد وبنصح أي حد في السن ده إنه..."
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
                required
              />
            </div>

            {/* Anonymous Toggle */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isAnonymous ? <Lock size={20} color="var(--text-muted)" /> : <Globe size={20} color="var(--primary)" />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>
                    {isAnonymous ? 'النشر كمشارك مجهول الهوية' : `النشر باسمك (${user?.name})`}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {isAnonymous 
                      ? 'لن يظهر اسمك أو رابط ملفك الشخصي، وسيظهر عمرك الحالي فقط لتوضيح فارق التجربة.'
                      : 'سيظهر اسمك ورابط ملفك الشخصي وستحصل على أوسمة ونقاط أثر للنصيحة.'}
                  </div>
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: isAnonymous ? 'var(--primary)' : 'var(--border-color-hover)',
                  borderRadius: '34px',
                  transition: '0.3s'
                }}>
                  <span style={{
                    position: 'absolute',
                    height: '20px',
                    width: '20px',
                    left: isAnonymous ? '4px' : '24px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.3s'
                  }} />
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '12px 32px', fontSize: '1.05rem' }}
                disabled={submitting}
              >
                <Send size={18} />
                <span>{submitting ? 'جارٍ النشر...' : 'انشر نصيحتك لتنفع بها غيرك'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
