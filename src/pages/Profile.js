import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';
import './Profile.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Profile() {
  const { currentUser, donors, updateUser, updateDonor, deleteDonor } = useApp();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const donorProfile = donors.find(d => d.id === currentUser?.id);
  const available = watch('available');

  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.name);
      setValue('phone', currentUser.phone || '');
      setValue('city', currentUser.city || '');
    }
    if (donorProfile) {
      setValue('bloodGroup', donorProfile.bloodGroup);
      setValue('lastDonationDate', donorProfile.lastDonationDate || '');
      setValue('available', donorProfile.available);
    }
  }, [currentUser, donorProfile, setValue]);

  const onSubmit = (data) => {
    setError(''); setSuccess('');
    setSaving(true);
    try {
      updateUser(currentUser.id, {
        name: data.name,
        phone: data.phone,
        city: data.city,
      });
      if (donorProfile) {
        updateDonor(donorProfile.id, {
          bloodGroup: data.bloodGroup,
          lastDonationDate: data.lastDonationDate || null,
          available: data.available,
          name: data.name,
          phone: data.phone,
          city: data.city,
        });
      }
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDonor = () => {
    if (window.confirm('Are you sure you want to delete your donor profile?')) {
      deleteDonor(currentUser.id);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">👤 My Profile</h1>

      <div className="profile-layout">
        {/* Info card */}
        <div className="profile-info card">
          <div className="profile-avatar">{currentUser?.name?.[0]?.toUpperCase()}</div>
          <h2 className="profile-name">{currentUser?.name}</h2>
          <span className="profile-role">{currentUser?.role}</span>
          {donorProfile && (
            <div className="profile-donor-badge">
              <span className="blood-group-badge">{donorProfile.bloodGroup}</span>
              <span className={`badge ${donorProfile.available ? 'badge-green' : 'badge-gray'}`}>
                {donorProfile.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          )}
        </div>

        {/* Edit form */}
        <div className="card" style={{ flex: 1 }}>
          <h2 className="section-title">Edit Profile</h2>

          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input {...register('name', { required: 'Name is required' })} />
                {errors.name && <span className="error">{errors.name.message}</span>}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input placeholder="+1 555 000 0000" {...register('phone')} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input placeholder="e.g. New York" {...register('city')} />
              </div>
            </div>

            {donorProfile && (
              <>
                <hr className="divider" />
                <h3 className="subsection-title">Donor Details</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select {...register('bloodGroup')}>
                      {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
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
                      <span className="toggle-desc">{available ? 'Currently available' : 'Not available'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={handleDeleteDonor}>
                    🗑 Delete Donor Profile
                  </button>
                </div>
              </>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
