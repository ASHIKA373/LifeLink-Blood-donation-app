import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getUsers, saveUsers,
  getDonors, saveDonors,
  getRequests, saveRequests,
  getResponses, saveResponses,
  getCurrentUser, saveCurrentUser,
} from '../storage';

const AppContext = createContext(null);

// Simple UUID generator using crypto.randomUUID with fallback
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [users, setUsers] = useState(() => getUsers());
  const [donors, setDonors] = useState(() => getDonors());
  const [requests, setRequests] = useState(() => getRequests());
  const [responses, setResponses] = useState(() => getResponses());

  // Hydrate all collections from localStorage on mount
  useEffect(() => {
    setUsers(getUsers());
    setDonors(getDonors());
    setRequests(getRequests());
    setResponses(getResponses());
    setCurrentUser(getCurrentUser());
  }, []);

  // --- Auth actions ---

  const registerUser = useCallback((data) => {
    const { name, bloodGroup, phone, city, role } = data;
    if (!name || !bloodGroup || !phone || !city || !role) {
      throw new Error('All fields are required');
    }
    const existing = getUsers();
    if (existing.find((u) => u.phone === phone)) {
      throw new Error('Phone number already registered');
    }
    const newUser = {
      id: generateId(),
      name,
      bloodGroup,
      phone,
      city,
      role,
      createdAt: new Date().toISOString(),
    };
    const updated = [...existing, newUser];
    saveUsers(updated);
    saveCurrentUser(newUser);
    setUsers(updated);
    setCurrentUser(newUser);
    return newUser;
  }, []);

  const loginUser = useCallback((name, phone) => {
    const allUsers = getUsers();
    const user = allUsers.find(
      (u) =>
        u.name.toLowerCase() === name.trim().toLowerCase() &&
        u.phone === phone.trim()
    );
    if (!user) return null;
    saveCurrentUser(user);
    setCurrentUser(user);
    return user;
  }, []);

  const logoutUser = useCallback(() => {
    saveCurrentUser(null);
    setCurrentUser(null);
  }, []);

  const updateUser = useCallback((id, data) => {
    const allUsers = getUsers();
    const updated = allUsers.map((u) => (u.id === id ? { ...u, ...data } : u));
    saveUsers(updated);
    setUsers(updated);
    const cur = getCurrentUser();
    if (cur && cur.id === id) {
      const updatedUser = { ...cur, ...data };
      saveCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
    }
  }, []);

  // --- Donor actions ---

  const registerDonor = useCallback((data) => {
    const allDonors = getDonors();
    const user = getCurrentUser();
    const userId = data.userId || (user && user.id);
    const sourceUser = getUsers().find((u) => u.id === userId) || user;

    const donorData = {
      id: userId,
      userId,
      bloodGroup: data.bloodGroup,
      lastDonationDate: data.lastDonationDate || null,
      available: data.available !== undefined ? data.available : true,
      city: sourceUser ? sourceUser.city : (data.city || ''),
      name: sourceUser ? sourceUser.name : (data.name || ''),
      phone: sourceUser ? sourceUser.phone : (data.phone || ''),
      createdAt: data.createdAt || new Date().toISOString(),
    };

    const existingIdx = allDonors.findIndex((d) => d.id === userId);
    let updated;
    if (existingIdx >= 0) {
      updated = allDonors.map((d) => (d.id === userId ? { ...d, ...donorData } : d));
    } else {
      updated = [...allDonors, donorData];
    }
    saveDonors(updated);
    setDonors(updated);
    return donorData;
  }, []);

  const updateDonor = useCallback((id, data) => {
    const allDonors = getDonors();
    const updated = allDonors.map((d) => (d.id === id ? { ...d, ...data } : d));
    saveDonors(updated);
    setDonors(updated);
  }, []);

  const deleteDonor = useCallback((id) => {
    const allDonors = getDonors();
    const updated = allDonors.filter((d) => d.id !== id);
    saveDonors(updated);
    setDonors(updated);
  }, []);

  const getMatchedDonors = useCallback((requestId) => {
    const allRequests = getRequests();
    const request = allRequests.find((r) => r.id === requestId);
    if (!request) return [];
    const allDonors = getDonors();
    const matched = allDonors.filter(
      (d) =>
        d.bloodGroup === request.bloodGroup &&
        d.city.toLowerCase() === request.city.toLowerCase() &&
        d.available === true
    );
    return matched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, []);

  // --- Request actions ---

  const createRequest = useCallback((data) => {
    const user = getCurrentUser();
    const newRequest = {
      id: generateId(),
      patientName: data.patientName,
      bloodGroup: data.bloodGroup,
      units: data.units,
      city: data.city,
      urgency: data.urgency,
      status: 'open',
      requestedBy: data.requestedBy || (user && user.id),
      createdAt: new Date().toISOString(),
    };
    const allRequests = getRequests();
    const updated = [...allRequests, newRequest];
    saveRequests(updated);
    setRequests(updated);
    return newRequest;
  }, []);

  const deleteRequest = useCallback((id) => {
    const allRequests = getRequests();
    const updated = allRequests.filter((r) => r.id !== id);
    saveRequests(updated);
    setRequests(updated);
  }, []);

  const fulfillRequest = useCallback((id) => {
    const allRequests = getRequests();
    const updated = allRequests.map((r) =>
      r.id === id ? { ...r, status: 'fulfilled' } : r
    );
    saveRequests(updated);
    setRequests(updated);
  }, []);

  // --- Response actions ---

  const respondToRequest = useCallback((requestId, donorId, action) => {
    const allResponses = getResponses();
    // Duplicate-response guard
    const alreadyResponded = allResponses.find(
      (r) => r.requestId === requestId && r.donorId === donorId
    );
    if (alreadyResponded) return;

    const allDonors = getDonors();
    const donor = allDonors.find((d) => d.id === donorId);

    const newResponse = {
      id: generateId(),
      requestId,
      donorId,
      donorName: donor ? donor.name : '',
      action,
      respondedAt: new Date().toISOString(),
    };

    const updatedResponses = [...allResponses, newResponse];
    saveResponses(updatedResponses);
    setResponses(updatedResponses);

    if (action === 'accepted') {
      const allRequests = getRequests();
      const updatedRequests = allRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'in-progress' } : r
      );
      saveRequests(updatedRequests);
      setRequests(updatedRequests);
    }
  }, []);

  const value = {
    currentUser,
    users,
    donors,
    requests,
    responses,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    registerDonor,
    updateDonor,
    deleteDonor,
    getMatchedDonors,
    createRequest,
    deleteRequest,
    fulfillRequest,
    respondToRequest,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
