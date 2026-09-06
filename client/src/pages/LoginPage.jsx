import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Sparkles, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول، تأكد من البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ maxWidth: '460px', marginTop: '40px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="brand-icon" style={{ margin: '0 auto 14px' }}>
              <Sparkles size={24} />
            </div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>تسجيل الدخول</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              أهلاً بك مجدداً في مجتمع "ياريتني"
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '8px' }}
              disabled={loading}
            >
              <LogIn size={18} />
              <span>{loading ? 'جارٍ التحقق...' : 'دخول'}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color-light)', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            ليس لديك حساب بعد؟{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>
              أنشئ حساباً جديداً
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
