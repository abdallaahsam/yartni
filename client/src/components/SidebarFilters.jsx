import React from 'react';
import { Compass, Sparkles, TrendingUp } from 'lucide-react';

export default function SidebarFilters({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory 
}) {
  return (
    <aside className="sidebar-panel">
      {/* Categories Filter */}
      <div>
        <div className="filter-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Compass size={16} />
          <span>مجالات الحياة</span>
        </div>
        <div className="category-filter-list">
          <button
            type="button"
            className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => onSelectCategory('all')}
          >
            <div className="category-info">
              <span>🌐</span>
              <span>كل المجالات</span>
            </div>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-item ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.slug)}
            >
              <div className="category-info">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </div>
              {cat.advice_count > 0 && (
                <span className="category-badge-count">{cat.advice_count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Community Wisdom Box */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.95rem' }}>
          <Sparkles size={18} />
          <span>رسالة المنصة</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          بدل أن تتعلم من أخطائك فقط، استفد من خلاصة وتجارب من سبقوك لنفس مرحلتك العمرية.
        </p>
      </div>
    </aside>
  );
}
