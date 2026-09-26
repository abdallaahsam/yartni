import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import SidebarFilters from '../components/SidebarFilters';
import AdviceCard from '../components/AdviceCard';
import { Sparkles, Flame, Clock, ThumbsUp, Calendar, Compass, ChevronLeft, X } from 'lucide-react';

const COMMON_AGES = ['all', '18', '20', '22', '25', '30', '35', '40+'];

export default function HomePage({ onOpenCategories }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [advices, setAdvices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const currentAge = searchParams.get('age') || 'all';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'trending';
  const currentQuery = searchParams.get('q') || '';

  // Fetch categories once
  useEffect(() => {
    api.getCategories()
      .then(res => setCategories(res.categories || []))
      .catch(console.error);
  }, []);

  // Fetch advices on filters change
  useEffect(() => {
    setLoading(true);
    api.getAdvices({
      target_age: currentAge,
      category_slug: currentCategory,
      sort: currentSort,
      q: currentQuery,
      page: 1,
      limit: 12
    })
      .then(res => {
        setAdvices(res.advices || []);
        setPagination(res.pagination || { total: 0, page: 1, totalPages: 1 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentAge, currentCategory, currentSort, currentQuery]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleAgeSelect = (age) => {
    updateParam('age', age);
  };

  const handleCategorySelect = (slug) => {
    updateParam('category', slug);
  };

  const handleSortSelect = (sort) => {
    updateParam('sort', sort);
  };

  const handleSearch = (q) => {
    updateParam('q', q);
  };

  const selectedCategoryObj = categories.find(c => c.slug === currentCategory);

  return (
    <div className="app-container">
      <Navbar onSearch={handleSearch} />

      <main className="main-content">
        {/* Motivational Hero Banner - Yareetny Maadi Aesthetic */}
        <section className="hero-banner">
          <div className="hero-content">
            <div className="hero-kicker">
              <span className="kicker-seal">🌿</span>
              <span>واحة الحكمة الحياتية · منصة Yareetny لتبادل تجارب الأجيال</span>
            </div>
            <h1 className="hero-title">
              لو رجع بيك الزمن.. كنت هتعمل إيه؟
            </h1>
            <p className="hero-desc">
              منصة لنقل وخلاصة الحكمة الحياتية الحقيقية بين الأجيال. اختر مرحلتك العمرية لتستكشف تجارب وقصص واقعية من أشخاص عاشوا نفس اللحظة وتمنوا لو كانوا يعلمونها.
            </p>
            <div className="hero-stats-strip">
              <div className="hero-stat-item">
                <strong>١٦+</strong>
                <span>تجربة موثقة</span>
              </div>
              <span className="hero-stat-divider">✦</span>
              <div className="hero-stat-item">
                <strong>٧</strong>
                <span>مجالات حياتية</span>
              </div>
              <span className="hero-stat-divider">✦</span>
              <div className="hero-stat-item">
                <strong>حكمة</strong>
                <span>عابرة للأجيال</span>
              </div>
            </div>
          </div>
        </section>

        {/* Age Selector Ribbon (Interactive Touch Carousel) */}
        <section className="age-ribbon-container">
          <div className="age-ribbon-header">
            <div className="age-ribbon-title">
              <Calendar size={18} color="var(--primary)" />
              <span>اختر عمرك لتصفح ما يفيدك الآن:</span>
            </div>
            {currentAge !== 'all' && (
              <button 
                type="button" 
                onClick={() => handleAgeSelect('all')}
                className="reset-filter-btn"
              >
                <span>إظهار جميع الأعمار</span>
                <X size={14} />
              </button>
            )}
          </div>
          <div className="age-pills-row">
            {COMMON_AGES.map((age) => (
              <button
                key={age}
                type="button"
                className={`age-pill ${currentAge === age ? 'active' : ''}`}
                onClick={() => handleAgeSelect(age)}
              >
                {age === 'all' ? 'جميع الأعمار' : `سن ${age} سنة`}
              </button>
            ))}
          </div>
        </section>

        {/* Mobile-Only Horizontal Category Chips Carousel */}
        <section className="mobile-category-strip mobile-only">
          <div className="mobile-category-header">
            <div className="mobile-category-title">
              <Compass size={17} color="var(--primary)" />
              <span>مجالات الحياة:</span>
            </div>
            {onOpenCategories && (
              <button 
                type="button" 
                className="mobile-all-categories-btn"
                onClick={onOpenCategories}
              >
                <span>جميع المجالات</span>
                <ChevronLeft size={16} />
              </button>
            )}
          </div>

          <div className="mobile-category-pills">
            <button
              type="button"
              className={`mobile-cat-pill ${currentCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('all')}
            >
              <span>🌐</span>
              <span>الكل</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`mobile-cat-pill ${currentCategory === cat.slug ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat.slug)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {cat.advice_count > 0 && (
                  <span className="mobile-cat-count">{cat.advice_count}</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Content Layout: Desktop Sidebar + Feed */}
        <div className="content-grid">
          {/* Desktop-Only Sidebar Filters */}
          <div className="desktop-only">
            <SidebarFilters
              categories={categories}
              selectedCategory={currentCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>

          {/* Feed Column */}
          <div className="feed-column">
            {/* Feed Header & Sort Tabs */}
            <div className="feed-header">
              <div className="feed-title-wrap">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2>
                    {currentAge !== 'all' ? `نصائح لسن ${currentAge} سنة` : 'أبرز النصائح والتجارب'}
                  </h2>
                  {selectedCategoryObj && (
                    <button 
                      type="button"
                      className="category-active-tag"
                      onClick={() => handleCategorySelect('all')}
                      title="إلغاء تصفية المجال"
                    >
                      <span>{selectedCategoryObj.icon}</span>
                      <span>{selectedCategoryObj.name}</span>
                      <X size={14} />
                    </button>
                  )}
                </div>
                {currentQuery && (
                  <p className="search-query-indicator">
                    نتائج البحث عن: "<strong>{currentQuery}</strong>"
                    <button 
                      type="button" 
                      onClick={() => updateParam('q', '')}
                      className="clear-search-btn"
                    >
                      إلغاء البحث
                    </button>
                  </p>
                )}
              </div>

              {/* Sorting Tabs (Touch-friendly Segmented Control) */}
              <div className="sort-tabs">
                <button
                  type="button"
                  className={`sort-tab ${currentSort === 'trending' ? 'active' : ''}`}
                  onClick={() => handleSortSelect('trending')}
                  aria-label="فرز حسب الأكثر تفاعلاً"
                >
                  <Flame size={16} />
                  <span>الصاعدة 🔥</span>
                </button>
                <button
                  type="button"
                  className={`sort-tab ${currentSort === 'top' ? 'active' : ''}`}
                  onClick={() => handleSortSelect('top')}
                  aria-label="فرز حسب الأكثر تأثيراً"
                >
                  <ThumbsUp size={16} />
                  <span>الأكثر تأثيراً</span>
                </button>
                <button
                  type="button"
                  className={`sort-tab ${currentSort === 'latest' ? 'active' : ''}`}
                  onClick={() => handleSortSelect('latest')}
                  aria-label="فرز حسب الأحدث"
                >
                  <Clock size={16} />
                  <span>الأحدث</span>
                </button>
              </div>
            </div>

            {/* Advices Feed */}
            {loading ? (
              <div className="spinner" />
            ) : advices.length > 0 ? (
              <div className="advices-feed">
                {advices.map((advice) => (
                  <AdviceCard 
                    key={advice.id} 
                    advice={advice} 
                    onUpdate={(updated) => {
                      setAdvices(prev => prev.map(a => a.id === updated.id ? updated : a));
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🍃</div>
                <h3>لا توجد نصائح مطابقة حالياً</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  كن أول من يشارك نصيحة أو تجربة ملهمة لهذا السن أو التصنيف!
                </p>
                <button 
                  type="button" 
                  onClick={() => {
                    handleAgeSelect('all');
                    handleCategorySelect('all');
                    updateParam('q', '');
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: '8px' }}
                >
                  إعادة ضبط جميع الفلاتر
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
