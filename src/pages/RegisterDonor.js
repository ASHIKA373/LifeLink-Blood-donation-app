import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';
import './Forms.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterDonor() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { available: true }
  });
  const navigate = useNavigate();
  const { currentUser, donors, registerDonor } = useApp();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const existing = donors.find(d => d.id === currentUser?.id);
  const available = watch('available');

  useEffect(() => {
    if (existing) {
      setValue('bloodGroup', existing.bloodGroup);
      setValue('lastDonationDate', existing.lastDonationDate || '');
      setValue('available', existing.available);
    }
  }, [existing, setValue]);

  const onSubmit = (data) => {
    setError(''); setSuccess('');
    setLoading(true);
    try {
      registerDonor({
        userId: currentUser.id,
        bloodGroup: data.bloodGroup,
        lastDonationDate: data.lastDonationDate || null,
        available: data.available,
      });
      setSuccess(existing ? 'Donor profile updated successfully!' : 'Donor registered successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to save donor profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🩸 {existing ? 'Update Donor Profile' : 'Register as Donor'}</h1>

      <div className="form-card card">
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid-2">
            <div className="form-group">
              <label>Blood Group *</label>
              <select {...register('bloodGroup', { required: 'Blood group is required' })}>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.bloodGroup && <span className="error">{errors.bloodGroup.message}</span>}
            </div>

            <div className="form-group">
              <label>Last Donation Date</label>
              <input type="date" {...register('lastDonationDate')} max={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div className="toggle-section">
            <div className="toggle-row">
              <label className="toggle">
                <input type="checkbox" {...register('available')} />
                <span className="toggle-slider" />
              </label>
              <div>
                <span className="toggle-label">Available to Donate</span>
                <span className="toggle-desc">{available ? 'You are currently available' : 'You are not available'}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : (existing ? 'Update Profile' : 'Register Donor')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
