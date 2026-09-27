import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminReportsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin');
      return;
    }
    if (!user.is_admin) {
      navigate('/');
      return;
    }

    api.getReports()
      .then(res => setReports(res.reports))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleAction = async (adviceId, action) => {
    try {
      if (action === 'unhide') {
        await api.unhideAdvice(adviceId);
      } else {
        await api.resolveReports(adviceId, action);
      }
      // Hidden items stay listed so the admin can undo; dismissed ones leave the queue
      setReports(prev => action === 'dismiss'
        ? prev.filter(r => r.advice_id !== adviceId)
        : prev.map(r => r.advice_id === adviceId ? { ...r, is_hidden: action === 'hide' } : r));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '18px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
            <ArrowRight size={18} />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <ShieldAlert size={26} color="var(--accent-rose)" />
          <h1 style={{ fontSize: '1.7rem' }}>مراجعة البلاغات</h1>
        </div>

        {error && (
          <p role="alert" style={{ color: 'var(--accent-rose)', marginBottom: '16px' }}>{error}</p>
        )}

        {loading ? (
          <div className="spinner" />
        ) : reports.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reports.map((r) => (
              <article key={r.advice_id} className="advice-card" style={{ opacity: r.is_hidden ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                  <div>
                    <Link to={`/advice/${r.advice_id}/${r.slug}`} style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {r.headline}
                    </Link>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                      @{r.author_username} · {r.report_count} {r.report_count === 1 ? 'بلاغ' : 'بلاغات'}
                      {r.is_hidden && ' · مخفية'}
                    </p>
                  </div>
                </div>
                <p style={{ marginTop: '10px', fontSize: '0.95rem' }}>{r.reasons}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px', justifyContent: 'flex-end' }}>
                  {r.is_hidden ? (
                    <button type="button" className="btn btn-secondary" onClick={() => handleAction(r.advice_id, 'unhide')}>
                      استعادة النصيحة
                    </button>
                  ) : (
                    <>
                      <button type="button" className="btn btn-secondary" onClick={() => handleAction(r.advice_id, 'dismiss')}>
                        رفض البلاغ
                      </button>
                      <button type="button" className="btn btn-primary" style={{ background: 'var(--accent-rose)' }} onClick={() => handleAction(r.advice_id, 'hide')}>
                        إخفاء النصيحة
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h3>لا توجد بلاغات بانتظار المراجعة</h3>
          </div>
        )}
      </main>
    </div>
  );
}
