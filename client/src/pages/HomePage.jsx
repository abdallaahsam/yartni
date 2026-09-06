import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import SidebarFilters from '../components/SidebarFilters';
import AdviceCard from '../components/AdviceCard';
import { Sparkles, Flame, Clock, ThumbsUp, Calendar } from 'lucide-react';

const COMMON_AGES = ['all', '18', '20', '22', '25', '30', '35', '40+'];

export default function HomePage() {
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
      .then(res => setCategories(res.categories))
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
        setAdvices(res.advices);
        setPagination(res.pagination);
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

  return (
    <div className="app-container">
      <Navbar onSearch={handleSearch} />

      <main className="main-content">
        {/* Motivational Hero Banner */}
        <section className="hero-banner">
          <div className="hero-content">
            <h1 className="hero-title">
              لو رجع بيك الزمن.. كنت هتعمل إيه؟
            </h1>
            <p className="hero-desc">
              منصة لمشاركة ونقل الحكمة الحياتية الحقيقية بين الأجيال. اختر عمرك لترى نصائح وتجارب واقعية من أشخاص عاشوا نفس مرحلتك وتمنوا لو كانوا يعلمونها.
            </p>
          </div>
        </section>

        {/* Age Selector Ribbon */}
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
                style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: '600' }}
              >
                إظهار جميع الأعمار
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

        {/* Content Layout: Sidebar + Feed */}
        <div className="content-grid">
          {/* Sidebar Filters */}
          <SidebarFilters
            categories={categories}
            selectedCategory={currentCategory}
            onSelectCategory={handleCategorySelect}
          />

          {/* Feed Column */}
          <div className="feed-column">
            {/* Feed Header & Sort Tabs */}
            <div className="feed-header">
              <div className="feed-title-wrap">
                <h2>
                  {currentAge !== 'all' ? `نصائح لسن ${currentAge} سنة` : 'أبرز النصائح والتجارب'}
                  {currentCategory !== 'all' && (
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500, marginInlineStart: '8px' }}>
                      ({categories.find(c => c.slug === currentCategory)?.name || currentCategory})
                    </span>
                  )}
                </h2>
                {currentQuery && (
                  <p>نتائج البحث عن: "{currentQuery}"</p>
                )}
              </div>

              {/* Sorting Tabs */}
              <div className="sort-tabs">
                <button
                  type="button"
                  className={`sort-tab ${currentSort === 'trending' ? 'active' : ''}`}
                  onClick={() => handleSortSelect('trending')}
                >
                  <Flame size={16} />
                  <span>الصاعدة 🔥</span>
                </button>
                <button
                  type="button"
                  className={`sort-tab ${currentSort === 'top' ? 'active' : ''}`}
                  onClick={() => handleSortSelect('top')}
                >
                  <ThumbsUp size={16} />
                  <span>الأكثر تأثيراً</span>
                </button>
                <button
                  type="button"
                  className={`sort-tab ${currentSort === 'latest' ? 'active' : ''}`}
                  onClick={() => handleSortSelect('latest')}
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
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
