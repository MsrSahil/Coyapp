// Centralized Coy Discover API client

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok || data.success === false) {
    const errorMsg = data.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // GET /feed with optional query filters
  getFeed: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.minAge) params.append('minAge', filters.minAge);
    if (filters.maxAge) params.append('maxAge', filters.maxAge);
    if (filters.city && filters.city !== 'All') params.append('city', filters.city);
    if (filters.college && filters.college !== 'All') params.append('college', filters.college);
    if (filters.interest && filters.interest !== 'All') params.append('interest', filters.interest);
    if (filters.minCompatibility) params.append('minCompatibility', filters.minCompatibility);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/feed${query}`);
  },

  // POST /swipe
  swipe: (targetUserId, action) => {
    return request('/swipe', {
      method: 'POST',
      body: JSON.stringify({ targetUserId, action })
    });
  },

  // GET /matches
  getMatches: () => {
    return request('/matches');
  },

  // GET /profiles/:id
  getProfile: (id) => {
    return request(`/profiles/${id}`);
  },

  // GET /discover/stats
  getStats: () => {
    return request('/discover/stats');
  },

  // GET /discover/daily-pick
  getDailyPick: () => {
    return request('/discover/daily-pick');
  },

  // POST /undo
  undoSwipe: () => {
    return request('/undo', {
      method: 'POST'
    });
  },

  // POST /reset
  resetDemo: () => {
    return request('/reset', {
      method: 'POST'
    });
  },

  // GET /health
  getHealth: () => {
    return request('/health');
  }
};
