import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Plus, Bookmark, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav({ onOpenCategories }) {
  const { user } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isSaved = location.pathname === '/saved';
  const isProfile = user && location.pathname === `/u/${user.username}`;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="mobile-bottom-nav" aria-label="شريط التنقل السفلي للهاتف">
      <div className="mobile-bottom-nav-inner">
        {/* 1. Home Tab */}
        <NavLink 
          to="/" 
          className={({ isActive }) => `mobile-nav-item ${isActive && !location.search.includes('category=') ? 'active' : ''}`}
          aria-label="الرئيسية"
        >
          <div className="mobile-nav-icon-wrap">
            <Home size={21} />
          </div>
          <span className="mobile-nav-label">الرئيسية</span>
        </NavLink>

        {/* 2. Explore / Categories Tab */}
        <button 
          type="button" 
          onClick={onOpenCategories}
          className={`mobile-nav-item ${location.search.includes('category=') ? 'active' : ''}`}
          aria-label="المجالات والتصنيفات"
        >
          <div className="mobile-nav-icon-wrap">
            <Compass size={21} />
          </div>
          <span className="mobile-nav-label">المجالات</span>
        </button>

        {/* 3. Center Elevated Action: New Advice */}
        <NavLink 
          to="/new" 
          className="mobile-nav-action-center"
          aria-label="أضف نصيحة جديدة"
        >
          <div className="action-center-bubble">
            <Plus size={26} strokeWidth={2.5} />
          </div>
          <span className="mobile-nav-label" style={{ fontWeight: 700 }}>انشر</span>
        </NavLink>

        {/* 4. Bookmarks Tab */}
        <NavLink 
          to="/saved" 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          aria-label="المحفوظات"
        >
          <div className="mobile-nav-icon-wrap">
            <Bookmark size={21} />
          </div>
          <span className="mobile-nav-label">المحفوظة</span>
        </NavLink>

        {/* 5. Profile or Login Tab */}
        <NavLink 
          to={user ? `/u/${user.username}` : '/login'} 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          aria-label={user ? 'الملف الشخصي' : 'تسجيل الدخول'}
        >
          <div className="mobile-nav-icon-wrap">
            {user ? (
              <div 
                className="mobile-nav-avatar"
                style={{ backgroundColor: user.avatar_color || 'var(--primary)' }}
              >
                {user.name.charAt(0)}
              </div>
            ) : (
              <User size={21} />
            )}
          </div>
          <span className="mobile-nav-label">
            {user ? 'حسابي' : 'دخول'}
          </span>
        </NavLink>
      </div>
    </nav>
  );
}
