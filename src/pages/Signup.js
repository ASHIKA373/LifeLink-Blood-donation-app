import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';
import './Auth.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ROLES = [
  { value: 'donor',     label: '🩸 Donor',     desc: 'I want to donate blood' },
  { value: 'patient',   label: '🏥 Patient',   desc: 'I need blood' },
  { value: 'volunteer', label: '🤝 Volunteer', desc: 'Supporting the network' },
];

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { registerUser } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const onSubmit = (data) => {
    if (!selectedRole) { setError('Please select a role'); return; }
    setError('');
    setLoading(true);
    try {
      registerUser({ ...data, role: selectedRole });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide card">
        <div className="auth-header">
          <span className="auth-icon">🩸</span>
          <h1>LifeLink</h1>
          <p>Create your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name *</label>
              <input placeholder="John Doe" {...register('name', { required: 'Name is required' })} />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input placeholder="+1 555 000 0000" {...register('phone', { required: 'Phone number is required' })} />
              {errors.phone && <span className="error">{errors.phone.message}</span>}
            </div>
            <div className="form-group">
              <label>Blood Group *</label>
              <select {...register('bloodGroup', { required: 'Blood group is required' })}>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.bloodGroup && <span className="error">{errors.bloodGroup.message}</span>}
            </div>
            <div className="form-group">
              <label>City *</label>
              <input placeholder="e.g. New York" {...register('city', { required: 'City is required' })} />
              {errors.city && <span className="error">{errors.city.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Select Your Role *</label>
            <div className="role-grid">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-card ${selectedRole === r.value ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(r.value)}
                >
                  <span className="role-label">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
