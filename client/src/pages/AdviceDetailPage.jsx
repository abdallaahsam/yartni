import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AdviceCard from '../components/AdviceCard';
import { ArrowRight, MessageCircle, Send, User } from 'lucide-react';

export default function AdviceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [advice, setAdvice] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getAdvice(id),
      api.getComments(id)
    ])
      .then(([adviceRes, commentsRes]) => {
        setAdvice(adviceRes.advice);
        setComments(commentsRes.comments);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    setCommentError('');

    try {
      const res = await api.addComment(id, newComment.trim());
      setComments(prev => [...prev, res.comment]);
      setNewComment('');
      // Update comments count on advice
      setAdvice(prev => ({
        ...prev,
        comments_count: (prev.comments_count || 0) + 1
      }));
    } catch (err) {
      setCommentError(err.message || 'فشل إضافة التعليق');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ maxWidth: '840px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '18px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
            <ArrowRight size={18} />
            <span>العودة إلى جميع النصائح</span>
          </Link>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : advice ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Advice Full View */}
            <AdviceCard advice={advice} onUpdate={(u) => setAdvice(u)} />

            {/* Comments & Discussions Section */}
            <section style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
                <MessageCircle size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem' }}>
                  المناقشات والتجارب المكملة ({comments.length})
                </h3>
              </div>

              {/* Add Comment Form */}
              {user ? (
                <form onSubmit={handleAddComment} style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="شارك تجربتك أو رأيك حول هذه النصيحة..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                  {commentError && (
                    <p style={{ color: 'var(--accent-rose)', fontSize: '0.88rem' }}>{commentError}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submittingComment}
                    >
                      <Send size={16} />
                      <span>{submittingComment ? 'جارٍ الإرسال...' : 'إضافة تعليق'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    سجّل دخولك للمشاركة في النقاش وإضافة تجربتك.
                  </span>
                  <Link to="/login" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>
                    تسجيل الدخول
                  </Link>
                </div>
              )}

              {/* Comments List */}
              {comments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      style={{
                        padding: '16px',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color-light)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div 
                            className="author-avatar" 
                            style={{ width: '30px', height: '30px', fontSize: '0.85rem', backgroundColor: comment.user_avatar_color || 'var(--primary)' }}
                          >
                            {comment.user_name ? comment.user_name.charAt(0) : '؟'}
                          </div>
                          <div>
                            <Link to={`/u/${comment.user_username}`} style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                              {comment.user_name}
                            </Link>
                            {comment.user_current_age && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginInlineStart: '6px' }}>
                                ({comment.user_current_age} سنة)
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                          {new Date(comment.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.96rem', lineHeight: '1.6', marginInlineStart: '38px' }}>
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  لا توجد تعليقات بعد. كن أول من يضيف تعقيباً أو تجربة مكملة!
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>النصيحة غير موجودة</h3>
            <p style={{ color: 'var(--text-muted)' }}>قد يكون تم حذفها أو أن الرابط غير صحيح.</p>
          </div>
        )}
      </main>
    </div>
  );
}
