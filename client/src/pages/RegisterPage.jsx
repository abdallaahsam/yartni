import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Sparkles, UserPlus } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentAge, setCurrentAge] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        current_age: parseInt(currentAge)
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      navigate(redirect);
    } catch (err) {
      setError(err.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ maxWidth: '480px', marginTop: '30px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <div className="brand-icon" style={{ margin: '0 auto 14px' }}>
              <Sparkles size={24} />
            </div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>إنشاء حساب جديد</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              انضم لمجتمع تبادل الحكمة ونقل التجارب الحقيقية
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--accent-rose-light)',
              color: 'var(--accent-rose)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              fontSize: '0.92rem',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">الاسم الكامل:</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: أحمد محمود"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">اسم المستخدم (باللغة الإنجليزية):</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: ahmed_tech"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                سيكون رابط ملفك الشخصي: yareetni.com/u/{username || 'username'}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">عمرك الحالي:</label>
              <input
                type="number"
                min="12"
                max="100"
                className="form-input"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                نستخدم عمرك لحساب فارق الخبرة في النصائح التي تنشرها.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني:</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور:</label>
              <input
                type="password"
                className="form-input"
                placeholder="6 أحرف على الأقل"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '8px' }}
              disabled={loading}
            >
              <UserPlus size={18} />
              <span>{loading ? 'جارٍ إنشاء الحساب...' : 'تسجيل والبدء'}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color-light)', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            لديك حساب بالفعل؟{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
