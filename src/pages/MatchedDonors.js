import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import './MatchedDonors.css';

const URGENCY_BADGE = { critical: 'badge-red', high: 'badge-orange', medium: 'badge-yellow', low: 'badge-green' };

export default function MatchedDonors() {
  const { requestId } = useParams();
  const { currentUser, requests, responses, donors, respondToRequest, fulfillRequest, deleteRequest } = useApp();

  const request = requests.find(r => r.id === requestId);
  const matchedDonors = request
    ? donors.filter(
        d =>
          d.bloodGroup === request.bloodGroup &&
          d.city.toLowerCase() === request.city.toLowerCase() &&
          d.available === true
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  if (!request) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Request not found.</div>
        <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
      </div>
    );
  }

  const myDonorProfile = donors.find(d => d.id === currentUser?.id);
  const myResponse = myDonorProfile
    ? responses.find(r => r.requestId === requestId && r.donorId === myDonorProfile.id)
    : null;

  const isOwner = request.requestedBy === currentUser?.id;

  const handleRespond = (action) => {
    if (!myDonorProfile) return;
    respondToRequest(requestId, myDonorProfile.id, action);
  };

  const handleFulfill = () => {
    fulfillRequest(requestId);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      deleteRequest(requestId);
    }
  };

  return (
    <div className="page-container">
      <div className="matched-header">
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Matched Donors</h1>
      </div>

      {/* Request summary */}
      <div className="request-summary card">
        <div className="summary-top">
          <span className="blood-group-badge lg">{request.bloodGroup}</span>
          <div className="summary-info">
            <h2>{request.patientName}</h2>
            <p>📍 {request.city} · {request.units} unit(s) needed</p>
          </div>
          <div className="summary-badges">
            <span className={`badge ${URGENCY_BADGE[request.urgency] || 'badge-gray'}`}>{request.urgency}</span>
            <span className="badge badge-blue">{request.status}</span>
          </div>
        </div>
        <p className="summary-time">
          Created {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
        </p>

        {/* Owner actions */}
        {isOwner && request.status !== 'fulfilled' && (
          <div className="donor-response-section">
            <button className="btn btn-success" onClick={handleFulfill}>✅ Mark Fulfilled</button>
            <button className="btn btn-secondary" onClick={handleDelete} style={{ marginLeft: 8 }}>🗑 Delete Request</button>
          </div>
        )}

        {/* Donor response buttons */}
        {myDonorProfile && matchedDonors.some(d => d.id === myDonorProfile.id) && (
          <div className="donor-response-section">
            <p className="response-prompt">Are you available to donate?</p>
            {myResponse ? (
              <div className={`response-status ${myResponse.action}`}>
                {myResponse.action === 'accepted' ? '✅ You accepted this request' : '❌ You declined this request'}
              </div>
            ) : (
              <div className="response-buttons">
                <button className="btn btn-success" onClick={() => handleRespond('accepted')}>
                  ✅ Accept Request
                </button>
                <button className="btn btn-secondary" onClick={() => handleRespond('declined')}>
                  ❌ Decline
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Matched donors list */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 className="section-title">
          🩸 {matchedDonors.length} Compatible Donor{matchedDonors.length !== 1 ? 's' : ''} Found
        </h2>

        {matchedDonors.length === 0 ? (
          <div className="no-donors">
            <p>No available donors found for <strong>{request.bloodGroup}</strong> in <strong>{request.city}</strong>.</p>
          </div>
        ) : (
          <div className="donors-grid">
            {matchedDonors.map(donor => {
              const donorResponse = responses.find(r => r.requestId === requestId && r.donorId === donor.id);
              return (
                <div key={donor.id} className={`donor-card ${donorResponse?.action === 'accepted' ? 'accepted' : donorResponse?.action === 'declined' ? 'declined' : ''}`}>
                  <div className="donor-card-top">
                    <span className="blood-group-badge">{donor.bloodGroup}</span>
                    {donorResponse?.action === 'accepted' && <span className="badge badge-green">✅ Accepted</span>}
                    {donorResponse?.action === 'declined' && <span className="badge badge-gray">❌ Declined</span>}
                    {!donorResponse && <span className="badge badge-blue">Pending</span>}
                  </div>
                  <h3 className="donor-name">{donor.name}</h3>
                  <div className="donor-details">
                    <span>📍 {donor.city || 'Location not set'}</span>
                    <span>📞 {donor.phone || 'N/A'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
