import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { api } from './services/api';
import HomePage from './pages/HomePage';
import AdviceDetailPage from './pages/AdviceDetailPage';
import NewAdvicePage from './pages/NewAdvicePage';
import ProfilePage from './pages/ProfilePage';
import SavedAdvicesPage from './pages/SavedAdvicesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminReportsPage from './pages/AdminReportsPage';
import MobileBottomNav from './components/MobileBottomNav';
import MobileCategoriesDrawer from './components/MobileCategoriesDrawer';
import Footer from './components/Footer';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [isCategoriesDrawerOpen, setIsCategoriesDrawerOpen] = useState(false);

  useEffect(() => {
    api.getCategories()
      .then(res => setCategories(res.categories || []))
      .catch(console.error);
  }, []);

  const handleSelectCategory = (slug) => {
    const searchParams = new URLSearchParams(location.search);
    if (slug && slug !== 'all') {
      searchParams.set('category', slug);
    } else {
      searchParams.delete('category');
    }
    navigate(`/?${searchParams.toString()}`);
    setIsCategoriesDrawerOpen(false);
  };

  const currentCategory = new URLSearchParams(location.search).get('category') || 'all';

  return (
    <AuthProvider>
      <div className="site-wrapper">
        <Routes>
          <Route path="/" element={<HomePage onOpenCategories={() => setIsCategoriesDrawerOpen(true)} />} />
          <Route path="/advice/:id/:slug" element={<AdviceDetailPage />} />
          <Route path="/advice/:id" element={<AdviceDetailPage />} />
          <Route path="/new" element={<NewAdvicePage />} />
          <Route path="/u/:username" element={<ProfilePage />} />
          <Route path="/saved" element={<SavedAdvicesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminReportsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Footer */}
        <Footer />

        {/* Mobile Bottom Navigation Bar (Fixed at bottom on phones) */}
        <MobileBottomNav onOpenCategories={() => setIsCategoriesDrawerOpen(true)} />

        {/* Mobile Categories Bottom-Sheet Drawer */}
        <MobileCategoriesDrawer
          isOpen={isCategoriesDrawerOpen}
          onClose={() => setIsCategoriesDrawerOpen(false)}
          categories={categories}
          selectedCategory={currentCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>
    </AuthProvider>
  );
}
