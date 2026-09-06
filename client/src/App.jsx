import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AdviceDetailPage from './pages/AdviceDetailPage';
import NewAdvicePage from './pages/NewAdvicePage';
import ProfilePage from './pages/ProfilePage';
import SavedAdvicesPage from './pages/SavedAdvicesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/advice/:id/:slug" element={<AdviceDetailPage />} />
        <Route path="/advice/:id" element={<AdviceDetailPage />} />
        <Route path="/new" element={<NewAdvicePage />} />
        <Route path="/u/:username" element={<ProfilePage />} />
        <Route path="/saved" element={<SavedAdvicesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
