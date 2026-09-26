import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand-logo" style={{ fontSize: '1.35rem' }}>
              <div className="brand-icon" style={{ width: '34px', height: '34px' }}>
                <Sparkles size={18} />
              </div>
              <div className="brand-text-wrap">
                <span className="brand-name">Yareetny</span>
                <span className="brand-sub">ياريتني</span>
              </div>
            </Link>
            <p className="footer-desc">
              منصة عربية مستقلة لتبادل خلاصة الحكمة والتجارب الحياتية الواقعية بين الأجيال؛ لتسترشد بها في عمرك الحالي وتتخذ قرارات أفضل وأكثر وعياً.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>استكشف</h4>
              <ul>
                <li><Link to="/">أحدث النصائح</Link></li>
                <li><Link to="/?sort=trending">النصائح الصاعدة</Link></li>
                <li><Link to="/?sort=top">الأكثر تأثيراً</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>شارك معنا</h4>
              <ul>
                <li><Link to="/new">أضف تجربة أو نصيحة</Link></li>
                <li><Link to="/saved">النصائح المحفوظة</Link></li>
                <li><Link to="/login">تسجيل الدخول</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>عن المنصة</h4>
              <ul>
                <li><span style={{ color: 'var(--text-muted)' }}>نظام تصميم حديث</span></li>
                <li><span style={{ color: 'var(--text-muted)' }}>تجربة استخدام واضحة وموثوقة</span></li>
                <li><span style={{ color: 'var(--text-muted)' }}>خصوصية وأمان المجتمع</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Yareetny (ياريتني) · جميع الحقوق محفوظة.</p>
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>صُنعت بكل</span>
            <Heart size={14} color="var(--accent-rose)" fill="var(--accent-rose)" />
            <span>لنقل الحكمة للأجيال القادمة</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
