// Storage keys
const KEYS = {
  USERS: 'll_users',
  DONORS: 'll_donors',
  REQUESTS: 'll_requests',
  RESPONSES: 'll_responses',
  CURRENT_USER: 'll_currentUser',
};

// --- Users ---

export function getUsers() {
  try {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch {
    // localStorage unavailable; data won't persist
  }
}

// --- Donors ---

export function getDonors() {
  try {
    const data = localStorage.getItem(KEYS.DONORS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDonors(donors) {
  try {
    localStorage.setItem(KEYS.DONORS, JSON.stringify(donors));
  } catch {
    // localStorage unavailable; data won't persist
  }
}

// --- Requests ---

export function getRequests() {
  try {
    const data = localStorage.getItem(KEYS.REQUESTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRequests(requests) {
  try {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
  } catch {
    // localStorage unavailable; data won't persist
  }
}

// --- Responses ---

export function getResponses() {
  try {
    const data = localStorage.getItem(KEYS.RESPONSES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveResponses(responses) {
  try {
    localStorage.setItem(KEYS.RESPONSES, JSON.stringify(responses));
  } catch {
    // localStorage unavailable; data won't persist
  }
}

// --- Current User ---

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user) {
  try {
    if (user === null) {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch {
    // localStorage unavailable; data won't persist
  }
}
