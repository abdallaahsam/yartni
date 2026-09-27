import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Search, 
  PlusCircle, 
  Bookmark, 
  User, 
  LogOut, 
  Moon,
  Sun,
  ShieldAlert
} from 'lucide-react';
import MobileSearchModal from './MobileSearchModal';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState(
    localStorage.getItem('yareetny_mode') || localStorage.getItem('yareetni_mode') || 'light'
  );
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'meta');
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('yareetny_mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleMobileSearch = (query) => {
    setSearchTerm(query);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand Logo - Yareetny & ياريتني */}
          <Link to="/" className="brand-logo" aria-label="Yareetny - ياريتني">
            <div className="brand-icon">
              <Sparkles size={22} />
            </div>
            <div className="brand-text-wrap">
              <span className="brand-name">Yareetny</span>
              <span className="brand-sub">ياريتني</span>
            </div>
          </Link>

          {/* Desktop Global Search Bar */}
          <form className="nav-search desktop-only" onSubmit={handleSearchSubmit}>
            <Search size={18} className="nav-search-icon" />
            <input
              type="text"
              placeholder="ابحث في نصائح وحكمة Yareetny..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* Navigation Actions */}
          <div className="nav-actions">
            {/* Mobile Search Trigger Icon Button */}
            <button 
              type="button" 
              onClick={() => setIsSearchModalOpen(true)} 
              className="icon-btn mobile-only" 
              title="بحث"
              aria-label="فتح شاشة البحث"
            >
              <Search size={19} />
            </button>

            {/* Theme Toggle Button (Desktop & Mobile) */}
            <button 
              type="button" 
              onClick={toggleMode} 
              className="icon-btn" 
              title={mode === 'light' ? 'الوضع الداكن' : 'الوضع المضيء'}
              aria-label="تبديل مظهر الموقع"
            >
              {mode === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            </button>

            {/* New Advice Button (Desktop only, mobile has bottom bar center button) */}
            <Link to="/new" className="btn btn-primary desktop-only">
              <PlusCircle size={18} />
              <span>أضف نصيحة</span>
            </Link>

            {/* Desktop User Menu or Auth Links */}
            <div className="desktop-only">
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {user.is_admin && (
                    <Link to="/admin" className="icon-btn" title="مراجعة البلاغات" aria-label="مراجعة البلاغات">
                      <ShieldAlert size={18} />
                    </Link>
                  )}
                  <Link to="/saved" className="icon-btn" title="النصائح المحفوظة">
                    <Bookmark size={18} />
                  </Link>
                  <Link 
                    to={`/u/${user.username}`} 
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', gap: '8px' }}
                    title="الملف الشخصي"
                  >
                    <div 
                      className="author-avatar" 
                      style={{ width: '26px', height: '26px', fontSize: '0.8rem', backgroundColor: user.avatar_color || 'var(--primary)' }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <button onClick={logout} className="icon-btn" title="تسجيل الخروج">
                    <LogOut size={17} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link to="/login" className="btn btn-secondary">
                    دخول
                  </Link>
                  <Link to="/register" className="btn btn-primary" style={{ background: 'var(--primary)' }}>
                    حساب جديد
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile User Profile Avatar quick access */}
            <div className="mobile-only">
              {user ? (
                <Link 
                  to={`/u/${user.username}`} 
                  className="mobile-header-avatar"
                  title="ملفك الشخصي"
                >
                  <div 
                    className="author-avatar" 
                    style={{ width: '34px', height: '34px', fontSize: '0.9rem', backgroundColor: user.avatar_color || 'var(--primary)' }}
                  >
                    {user.name.charAt(0)}
                  </div>
                </Link>
              ) : (
                <Link to="/login" className="icon-btn" title="تسجيل الدخول">
                  <User size={19} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Interactive Search Modal */}
      <MobileSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleMobileSearch}
        initialValue={searchTerm}
      />
    </>
  );
}
