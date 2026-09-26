import React, { useEffect } from 'react';
import { X, Compass, Check } from 'lucide-react';

export default function MobileCategoriesDrawer({ 
  isOpen, 
  onClose, 
  categories = [], 
  selectedCategory = 'all', 
  onSelectCategory 
}) {
  // Prevent background scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mobile-drawer-backdrop" onClick={onClose}>
      <div 
        className="mobile-drawer-sheet" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Drag Handle Bar */}
        <div className="drawer-drag-pill" />

        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <Compass size={20} color="var(--primary)" />
            <h3 id="drawer-title" className="drawer-title">مجالات وتصنيفات الحياة</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="drawer-close-btn"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        <p className="drawer-subtitle">
          اختر المجال الذي ترغب في استكشاف تجارب وحكمة الآخرين حوله:
        </p>

        {/* Categories Grid / List */}
        <div className="drawer-categories-list">
          {/* All Categories Option */}
          <button
            type="button"
            className={`drawer-cat-item ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => {
              onSelectCategory('all');
              onClose();
            }}
          >
            <div className="drawer-cat-right">
              <span className="drawer-cat-icon">🌐</span>
              <div className="drawer-cat-text">
                <span className="drawer-cat-name">كل المجالات</span>
                <span className="drawer-cat-desc">استعراض كافة النصائح دون تقييد</span>
              </div>
            </div>
            {selectedCategory === 'all' && (
              <span className="drawer-cat-check">
                <Check size={18} />
              </span>
            )}
          </button>

          {/* Individual Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                className={`drawer-cat-item ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  onClose();
                }}
              >
                <div className="drawer-cat-right">
                  <span 
                    className="drawer-cat-icon"
                    style={{ backgroundColor: `${cat.color || 'var(--primary)'}15` }}
                  >
                    {cat.icon}
                  </span>
                  <div className="drawer-cat-text">
                    <span className="drawer-cat-name">{cat.name}</span>
                    {cat.description && (
                      <span className="drawer-cat-desc">{cat.description}</span>
                    )}
                  </div>
                </div>

                <div className="drawer-cat-left">
                  {cat.advice_count > 0 && (
                    <span className="drawer-cat-count">{cat.advice_count}</span>
                  )}
                  {isSelected && (
                    <span className="drawer-cat-check">
                      <Check size={18} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Cultural Reminder */}
        <div className="drawer-footer-note">
          🌿 <strong>Yareetny</strong> · حكمة مصرية أصيلة عابرة للأجيال
        </div>
      </div>
    </div>
  );
}
