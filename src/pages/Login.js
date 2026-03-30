import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';
import './Auth.css';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loginUser } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setError('');
    setLoading(true);
    const user = loginUser(data.name, data.phone);
    setLoading(false);
    if (!user) {
      setError('No account found with these details');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <span className="auth-icon">🩸</span>
          <h1>LifeLink</h1>
          <p>Smart Emergency Blood Network</p>
        </div>

        <h2 className="auth-title">Welcome back</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your registered name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="Your registered phone number"
              {...register('phone', { required: 'Phone number is required' })}
            />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
