import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import './Dashboard.css';

const URGENCY_BADGE = { critical: 'badge-red', high: 'badge-orange', medium: 'badge-yellow', low: 'badge-green' };
const STATUS_BADGE  = { open: 'badge-blue', 'in-progress': 'badge-orange', fulfilled: 'badge-gray' };

export default function Dashboard() {
  const { currentUser, donors, requests, responses } = useApp();

  const activeRequests = requests.filter(r => r.status !== 'fulfilled');
  const availableDonors = donors.filter(d => d.available === true);
  const totalDonors = donors.length;

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentActivity = responses.filter(r => new Date(r.respondedAt) >= oneDayAgo).length;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Welcome, {currentUser?.name} 👋</h1>
        </div>
        <div className="dashboard-actions">
          <Link to="/request" className="btn btn-primary">+ Emergency Request</Link>
          <Link to="/register-donor" className="btn btn-outline">Register as Donor</Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card card">
          <span className="stat-icon">🩸</span>
          <div>
            <div className="stat-value">{totalDonors}</div>
            <div className="stat-label">Total Donors</div>
          </div>
        </div>
        <div className="stat-card card">
          <span className="stat-icon">🚨</span>
          <div>
            <div className="stat-value">{activeRequests.length}</div>
            <div className="stat-label">Active Requests</div>
          </div>
        </div>
        <div className="stat-card card">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-value">{availableDonors.length}</div>
            <div className="stat-label">Available Donors</div>
          </div>
        </div>
        <div className="stat-card card">
          <span className="stat-icon">🔔</span>
          <div>
            <div className="stat-value">{recentActivity}</div>
            <div className="stat-label">Recent Activity</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Active Requests */}
        <div className="card">
          <h2 className="section-title">🚨 Active Blood Requests</h2>
          {activeRequests.length === 0
            ? <p className="empty-msg">No active requests right now.</p>
            : activeRequests.map(req => (
              <div key={req.id} className="request-item">
                <div className="request-top">
                  <span className="blood-group-badge">{req.bloodGroup}</span>
                  <span className={`badge ${URGENCY_BADGE[req.urgency] || 'badge-gray'}`}>{req.urgency}</span>
                  <span className={`badge ${STATUS_BADGE[req.status] || 'badge-gray'}`}>{req.status}</span>
                </div>
                <div className="request-info">
                  <strong>{req.patientName}</strong> · {req.units} unit(s)
                </div>
                <div className="request-meta">
                  📍 {req.city}
                </div>
                <div className="request-footer">
                  <span className="time-ago">{formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}</span>
                  <Link to={`/matched/${req.id}`} className="btn btn-secondary btn-xs">View Donors</Link>
                </div>
              </div>
            ))
          }
        </div>

        {/* Available Donors */}
        <div className="card">
          <h2 className="section-title">🩸 Available Donors</h2>
          {availableDonors.length === 0
            ? <p className="empty-msg">No donors registered yet.</p>
            : availableDonors.map(d => (
              <div key={d.id} className="donor-item">
                <span className="blood-group-badge">{d.bloodGroup}</span>
                <div className="donor-info">
                  <strong>{d.name}</strong>
                  <span className="donor-meta">📍 {d.city || 'Location not set'} · 📞 {d.phone || 'N/A'}</span>
                </div>
                <span className="badge badge-green">Available</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
