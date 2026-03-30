import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RegisterDonor from './pages/RegisterDonor';
import EmergencyRequest from './pages/EmergencyRequest';
import MatchedDonors from './pages/MatchedDonors';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

function PrivateRoute({ children }) {
  const { currentUser } = useApp();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { currentUser } = useApp();
  return currentUser ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  const { currentUser } = useApp();
  return (
    <>
      {currentUser && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup"   element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/dashboard"        element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/register-donor"   element={<PrivateRoute><RegisterDonor /></PrivateRoute>} />
        <Route path="/request"          element={<PrivateRoute><EmergencyRequest /></PrivateRoute>} />
        <Route path="/matched/:requestId" element={<PrivateRoute><MatchedDonors /></PrivateRoute>} />
        <Route path="/profile"          element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/notifications"    element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
