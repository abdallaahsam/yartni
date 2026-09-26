import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

const POPULAR_SEARCHES = [
  'مهنة',
  'ادخار',
  'استثمار',
  'زواج',
  'صحة نفسية',
  'علاقات',
  'جامعة',
  'سفر'
];

export default function MobileSearchModal({ isOpen, onClose, onSearch, initialValue = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
    onClose();
  };

  const handleQuickTagClick = (tag) => {
    setSearchTerm(tag);
    if (onSearch) {
      onSearch(tag);
    }
    onClose();
  };

  const handleClear = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  return (
    <div className="mobile-search-modal-backdrop" onClick={onClose}>
      <div 
        className="mobile-search-modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <form className="mobile-search-form" onSubmit={handleSubmit}>
          <button 
            type="button" 
            onClick={onClose} 
            className="mobile-search-back-btn" 
            aria-label="الرجوع"
          >
            <ArrowRight size={22} />
          </button>

          <div className="mobile-search-input-wrap">
            <Search size={18} className="mobile-search-icon" />
            <input
              ref={inputRef}
              type="search"
              className="mobile-search-input"
              placeholder="ابحث في حكمة وتجارب Yareetny..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
            {searchTerm && (
              <button 
                type="button" 
                onClick={handleClear} 
                className="mobile-search-clear-btn"
                aria-label="مسح النص"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button 
            type="submit" 
            className="mobile-search-submit-btn"
          >
            بحث
          </button>
        </form>

        {/* Popular Searches & Quick Tags */}
        <div className="mobile-search-body">
          <div className="mobile-search-section-title">
            <TrendingUp size={16} color="var(--primary)" />
            <span>الموضوعات الأكثر بحثاً وتأثيراً:</span>
          </div>

          <div className="mobile-search-tags-cloud">
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                className="mobile-search-tag"
                onClick={() => handleQuickTagClick(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="mobile-search-hint">
            <Sparkles size={16} color="var(--secondary)" />
            <span>نصيحة: يمكنك البحث باسم المجال، الكلمة المفتاحية، أو حتى المشكلة التي تواجهك.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
