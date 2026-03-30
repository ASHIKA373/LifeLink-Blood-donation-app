import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, logoutUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🩸</span>
        <span className="brand-name">LifeLink</span>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard"      className={isActive('/dashboard')}>Dashboard</Link>
        <Link to="/register-donor" className={isActive('/register-donor')}>Register Donor</Link>
        <Link to="/request"        className={isActive('/request')}>Emergency Request</Link>
        <Link to="/profile"        className={isActive('/profile')}>Profile</Link>
      </div>
      <div className="navbar-user">
        <span className="user-role">{currentUser?.role}</span>
        <span className="user-name">{currentUser?.name}</span>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
