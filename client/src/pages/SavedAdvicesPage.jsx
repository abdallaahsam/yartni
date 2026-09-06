import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AdviceCard from '../components/AdviceCard';
import { Bookmark, ArrowRight } from 'lucide-react';

export default function SavedAdvicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/saved');
      return;
    }

    setLoading(true);
    api.getMyBookmarks()
      .then(res => setBookmarks(res.bookmarks))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

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
          <Bookmark size={26} color="var(--accent-amber)" />
          <h1 style={{ fontSize: '1.7rem' }}>النصائح المحفوظة في مفضلتك</h1>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : bookmarks.length > 0 ? (
          <div className="advices-feed">
            {bookmarks.map((advice) => (
              <AdviceCard 
                key={advice.id} 
                advice={advice}
                onUpdate={(u) => {
                  if (!u.has_bookmarked) {
                    setBookmarks(prev => prev.filter(a => a.id !== u.id));
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔖</div>
            <h3>لم تحفظ أي نصائح بعد</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              اضغط على أيقونة الحفظ في أي نصيحة تعجبك لتعود إليها في أي وقت.
            </p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '10px' }}>
              تصفح النصائح الآن
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
