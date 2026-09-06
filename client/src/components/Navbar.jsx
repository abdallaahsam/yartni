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
  Sun 
} from 'lucide-react';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('yareetni_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yareetni_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>
          <span>ياريتني</span>
        </Link>

        {/* Global Search Bar */}
        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <Search size={18} className="nav-search-icon" />
          <input
            type="text"
            placeholder="ابحث في نصائح وحكمة الحياة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Navigation Actions */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="icon-btn" 
            title={theme === 'light' ? 'الوضع الداكن' : 'الوضع المضيء'}
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          {/* New Advice Button */}
          <Link to="/new" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>أضف نصيحة</span>
          </Link>

          {/* User Menu or Auth Links */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
      </div>
    </header>
  );
}
