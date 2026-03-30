import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';
import './Forms.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = [
  { value: 'critical', label: '🔴 Critical', desc: 'Life-threatening, immediate need' },
  { value: 'high',     label: '🟠 High',     desc: 'Needed within hours' },
  { value: 'medium',   label: '🟡 Medium',   desc: 'Needed within a day' },
  { value: 'low',      label: '🟢 Low',      desc: 'Scheduled / non-urgent' },
];

export default function EmergencyRequest() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { createRequest } = useApp();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [urgency, setUrgency] = useState('');

  const onSubmit = (data) => {
    if (!urgency) { setError('Please select an urgency level'); return; }
    setError('');
    setLoading(true);
    try {
      const req = createRequest({
        patientName: data.patientName,
        bloodGroup: data.bloodGroup,
        units: parseInt(data.units, 10),
        city: data.city,
        urgency,
      });
      navigate(`/matched/${req.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🚨 Emergency Blood Request</h1>

      <div className="form-card card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid-2">
            <div className="form-group">
              <label>Patient Name *</label>
              <input placeholder="Full name of patient" {...register('patientName', { required: 'Patient name is required' })} />
              {errors.patientName && <span className="error">{errors.patientName.message}</span>}
            </div>

            <div className="form-group">
              <label>Blood Group Required *</label>
              <select {...register('bloodGroup', { required: 'Blood group is required' })}>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.bloodGroup && <span className="error">{errors.bloodGroup.message}</span>}
            </div>

            <div className="form-group">
              <label>Units Needed *</label>
              <input type="number" min="1" placeholder="e.g. 2" {...register('units', { required: 'Units needed is required', min: { value: 1, message: 'At least 1 unit' } })} />
              {errors.units && <span className="error">{errors.units.message}</span>}
            </div>

            <div className="form-group">
              <label>City *</label>
              <input placeholder="e.g. New York" {...register('city', { required: 'City is required' })} />
              {errors.city && <span className="error">{errors.city.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Urgency Level *</label>
            <div className="urgency-grid">
              {URGENCY_LEVELS.map(u => (
                <button
                  key={u.value}
                  type="button"
                  className={`urgency-card ${urgency === u.value ? 'selected' : ''} urgency-${u.value}`}
                  onClick={() => setUrgency(u.value)}
                >
                  <span className="urgency-label">{u.label}</span>
                  <span className="urgency-desc">{u.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Finding Donors...</> : '🚨 Submit Request & Find Donors'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
