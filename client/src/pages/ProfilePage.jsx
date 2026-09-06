import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AdviceCard from '../components/AdviceCard';
import BadgesList from '../components/BadgesList';
import { User, Calendar, Heart, Award, Edit3, Bookmark, Check, X } from 'lucide-react';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const isOwnProfile = currentUser && profileData && currentUser.username === profileData.user.username;

  useEffect(() => {
    setLoading(true);
    api.getUserProfile(username)
      .then(res => {
        setProfileData(res);
        setName(res.user.name);
        setBio(res.user.bio || '');
        setAge(res.user.current_age);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditError('');

    try {
      const res = await api.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        current_age: parseInt(age)
      });
      setProfileData(prev => ({
        ...prev,
        user: { ...prev.user, ...res.user }
      }));
      updateUser(res.user);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'فشل تحديث البيانات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ maxWidth: '920px' }}>
        {loading ? (
          <div className="spinner" />
        ) : profileData ? (
          <div>
            {/* Profile Header Card */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 32px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div 
                    className="author-avatar" 
                    style={{ 
                      width: '74px', 
                      height: '74px', 
                      fontSize: '2rem', 
                      backgroundColor: profileData.user.avatar_color || 'var(--primary)',
                      boxShadow: '0 4px 16px var(--primary-glow)'
                    }}
                  >
                    {profileData.user.name.charAt(0)}
                  </div>
                  <div>
                    <h1 style={{ fontSize: '1.65rem', marginBottom: '4px' }}>
                      {profileData.user.name}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      <span>@{profileData.user.username}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={15} />
                        العمر: {profileData.user.current_age} سنة
                      </span>
                    </div>
                  </div>
                </div>

                {isOwnProfile && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(true)} 
                      className="btn btn-secondary"
                    >
                      <Edit3 size={16} />
                      <span>تعديل الملف</span>
                    </button>
                    <Link to="/saved" className="btn btn-secondary">
                      <Bookmark size={16} />
                      <span>محفوظاتي</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Bio */}
              {profileData.user.bio && (
                <p style={{ marginTop: '20px', color: 'var(--text-main)', fontSize: '1.02rem', lineHeight: '1.6' }}>
                  {profileData.user.bio}
                </p>
              )}

              {/* Stats Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '16px',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-color-light)'
              }}>
                <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>نصائح منشورة</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {profileData.stats.advices_count}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>مرات "أثرت فيّ"</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                    {profileData.stats.total_impacts}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>الأوسمة المكتسبة</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    {profileData.badges.length}
                  </div>
                </div>
              </div>

              {/* Gamification Badges */}
              <BadgesList badges={profileData.badges} />
            </div>

            {/* Published Advices Feed */}
            <div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '18px' }}>
                النصائح المنشورة ({profileData.advices.length})
              </h2>
              {profileData.advices.length > 0 ? (
                <div className="advices-feed">
                  {profileData.advices.map((advice) => (
                    <AdviceCard 
                      key={advice.id} 
                      advice={advice} 
                      onUpdate={(u) => {
                        setProfileData(prev => ({
                          ...prev,
                          advices: prev.advices.map(a => a.id === u.id ? u : a)
                        }));
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">✍️</div>
                  <p style={{ color: 'var(--text-muted)' }}>لم يقم بنشر نصائح عامة بعد.</p>
                </div>
              )}
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
              <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3 style={{ fontSize: '1.25rem' }}>تعديل الملف الشخصي</h3>
                    <button type="button" onClick={() => setIsEditing(false)} className="icon-btn">
                      <X size={18} />
                    </button>
                  </div>

                  {editError && (
                    <div style={{ color: 'var(--accent-rose)', fontSize: '0.9rem' }}>{editError}</div>
                  )}

                  <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">الاسم المعروض:</label>
                      <input
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">العمر الحالي:</label>
                      <input
                        type="number"
                        min="12"
                        max="100"
                        className="form-input"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">نبذة عنك وخبرتك:</label>
                      <textarea
                        className="form-textarea"
                        rows="3"
                        placeholder="اكتب نبذة مختصرة عن مجالك وخبراتك..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                        إلغاء
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>المستخدم غير موجود</h3>
            <p style={{ color: 'var(--text-muted)' }}>تأكد من صحة الرابط أو اسم المستخدم.</p>
          </div>
        )}
      </main>
    </div>
  );
}
