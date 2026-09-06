import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Check, 
  Flag, 
  Clock, 
  Eye, 
  UserX,
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReportModal from './ReportModal';
import confetti from 'canvas-confetti';

export default function AdviceCard({ advice, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hasImpacted, setHasImpacted] = useState(advice.has_impacted);
  const [impactCount, setImpactCount] = useState(advice.impact_count || 0);
  const [hasBookmarked, setHasBookmarked] = useState(advice.has_bookmarked);
  const [copied, setCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [animatingImpact, setAnimatingImpact] = useState(false);

  const adviceUrl = `/advice/${advice.id}/${advice.slug || 'advice'}`;

  // Handle "أثرت فيّ" toggle
  const handleImpact = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.toggleImpact(advice.id);
      setHasImpacted(res.has_impacted);
      setImpactCount(res.impact_count);

      if (res.has_impacted) {
        setAnimatingImpact(true);
        setTimeout(() => setAnimatingImpact(false), 600);
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 }
        });
      }

      if (onUpdate) onUpdate({ ...advice, has_impacted: res.has_impacted, impact_count: res.impact_count });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle bookmark toggle
  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.toggleBookmark(advice.id);
      setHasBookmarked(res.has_bookmarked);
      if (onUpdate) onUpdate({ ...advice, has_bookmarked: res.has_bookmarked });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Share link copy
  const handleShare = (e) => {
    e.preventDefault();
    const fullUrl = `${window.location.origin}${adviceUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <article className="advice-card">
        {/* Experience Delta & Category Header */}
        <div className="card-header-row">
          <div className="age-delta-bar">
            <Lightbulb size={16} />
            <span>
              نصيحة لسن <strong>{advice.target_age} سنة</strong>
              {advice.author_age_at_post && (
                <span style={{ opacity: 0.85, fontWeight: 500 }}>
                  {' '}(من كاتب عمره {advice.author_age_at_post} سنة)
                </span>
              )}
            </span>
          </div>

          <div 
            className="card-category-pill" 
            style={{ 
              backgroundColor: `${advice.category_color}18`, 
              color: advice.category_color 
            }}
          >
            <span>{advice.category_icon}</span>
            <span>{advice.category_name}</span>
          </div>
        </div>

        {/* Author Meta */}
        <div className="author-meta">
          <div 
            className="author-avatar" 
            style={{ backgroundColor: advice.author_avatar_color || '#64748B' }}
          >
            {advice.is_anonymous ? <UserX size={18} /> : (advice.author_name ? advice.author_name.charAt(0) : '؟')}
          </div>
          <div>
            {advice.is_anonymous || !advice.author_username ? (
              <span className="author-name" style={{ color: 'var(--text-muted)' }}>
                {advice.author_name || 'مشارك مجهول'}
              </span>
            ) : (
              <Link to={`/u/${advice.author_username}`} className="author-name" style={{ display: 'inline-block' }}>
                {advice.author_name}
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              <span>{new Date(advice.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Eye size={12} />
                {advice.view_count || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h3 className="advice-headline">
          <Link to={adviceUrl}>
            {advice.headline}
          </Link>
        </h3>

        {/* Story Context */}
        <p className="advice-story-preview">
          {advice.story}
        </p>

        {/* Practical Lesson Box */}
        {advice.lesson && (
          <div className="advice-lesson-box">
            <div className="lesson-label">
              <span>💡</span>
              <span>لو رجع بيا الزمن هعمل:</span>
            </div>
            <p className="lesson-text">
              {advice.lesson}
            </p>
          </div>
        )}

        {/* Interaction Actions */}
        <div className="card-footer-actions">
          <div className="actions-left">
            {/* Impact / Upvote */}
            <button 
              type="button" 
              onClick={handleImpact} 
              className={`action-btn ${hasImpacted ? 'impacted' : ''} ${animatingImpact ? 'pop-anim' : ''}`}
              title="أثرت فيّ / ياريتني عرفت"
            >
              <Heart size={18} fill={hasImpacted ? 'currentColor' : 'none'} />
              <span>أثرت فيّ</span>
              <strong style={{ marginInlineStart: '2px' }}>{impactCount}</strong>
            </button>

            {/* Comments */}
            <Link to={adviceUrl} className="action-btn" title="المناقشات والتعليقات">
              <MessageCircle size={18} />
              <span>تعليق</span>
              {advice.comments_count > 0 && (
                <strong style={{ marginInlineStart: '2px' }}>{advice.comments_count}</strong>
              )}
            </Link>

            {/* Bookmark */}
            <button 
              type="button" 
              onClick={handleBookmark} 
              className={`action-btn ${hasBookmarked ? 'bookmarked' : ''}`}
              title="حفظ في المفضلة"
            >
              <Bookmark size={18} fill={hasBookmarked ? 'currentColor' : 'none'} />
              <span>{hasBookmarked ? 'محفوظة' : 'حفظ'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Share */}
            <button 
              type="button" 
              onClick={handleShare} 
              className="action-btn" 
              title="مشاركة الرابط"
            >
              {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Share2 size={16} />}
              <span>{copied ? 'تم النسخ!' : 'مشاركة'}</span>
            </button>

            {/* Report */}
            <button 
              type="button" 
              onClick={() => setShowReportModal(true)} 
              className="action-btn"
              style={{ padding: '7px 10px' }}
              title="إبلاغ عن محتوى"
            >
              <Flag size={15} />
            </button>
          </div>
        </div>
      </article>

      {/* Report Modal */}
      <ReportModal
        adviceId={advice.id}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </>
  );
}
