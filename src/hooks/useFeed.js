import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useFeed() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minAge: 20,
    maxAge: 30,
    city: 'All',
    college: 'All',
    interest: 'All',
    minCompatibility: 0,
    sortBy: 'compatibility'
  });

  const loadFeed = useCallback(async (activeFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getFeed(activeFilters);
      setProfiles(data.profiles || []);
    } catch (err) {
      console.error('Failed to load feed:', err);
      setError(err.message || 'Unable to load profiles');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadFeed(filters);
  }, [filters, loadFeed]);

  const removeTopProfile = useCallback((profileId) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  }, []);

  const restoreProfile = useCallback((profile) => {
    if (!profile) return;
    setProfiles(prev => [profile, ...prev.filter(p => p.id !== profile.id)]);
  }, []);

  return {
    profiles,
    loading,
    error,
    filters,
    setFilters,
    reloadFeed: loadFeed,
    removeTopProfile,
    restoreProfile
  };
}
