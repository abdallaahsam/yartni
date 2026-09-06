import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function ReportModal({ adviceId, isOpen, onClose }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('يرجى كتابة سبب الإبلاغ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.reportAdvice(adviceId, reason);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setReason('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'فشل إرسال البلاغ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.2rem' }}>إبلاغ عن محتوى غير لائق</h3>
          </div>
          <button type="button" onClick={onClose} className="icon-btn">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--accent-emerald)' }}>
            <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>تم استلام بلاغك بنجاح</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>شكراً لحرصك على أمان ومصداقية المجتمع.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">سبب الإبلاغ:</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="وضح المشكلة (معلومات مضللة، محتوى مسيء، ترويج تجاري...)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ color: 'var(--accent-rose)', fontSize: '0.9rem' }}>{error}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                إلغاء
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ background: 'var(--accent-rose)' }}
                disabled={loading}
              >
                {loading ? 'جارٍ الإرسال...' : 'إرسال البلاغ'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
