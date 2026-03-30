import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import './Notifications.css';

export default function Notifications() {
  const { responses } = useApp();

  // Show recent responses as notifications
  const notifications = [...responses].sort(
    (a, b) => new Date(b.respondedAt) - new Date(a.respondedAt)
  );

  return (
    <div className="page-container">
      <div className="notif-page-header">
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          🔔 Notifications
        </h1>
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div className="empty-notif">
            <span className="empty-icon">🔕</span>
            <p>No notifications yet.</p>
            <p>You'll be notified when donors respond to blood requests.</p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map(n => (
              <div key={n.id} className="notif-item">
                <div className="notif-content">
                  <p className="notif-message">
                    <strong>{n.donorName}</strong> {n.action === 'accepted' ? '✅ accepted' : '❌ declined'} a blood request.
                  </p>
                  <span className="notif-time">
                    {formatDistanceToNow(new Date(n.respondedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
