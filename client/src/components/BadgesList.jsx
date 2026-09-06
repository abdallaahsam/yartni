import React from 'react';
import { Award } from 'lucide-react';

export default function BadgesList({ badges = [] }) {
  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--text-main)' }}>
        <Award size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '1.15rem' }}>الأوسمة والشارات المكتسبة</h3>
      </div>
      <div className="badges-grid">
        {badges.map((badge) => (
          <div key={badge.id} className="badge-card" style={{ borderRight: `4px solid ${badge.color}` }}>
            <div className="badge-icon">{badge.icon}</div>
            <div>
              <div className="badge-title">{badge.name}</div>
              <div className="badge-desc">{badge.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
