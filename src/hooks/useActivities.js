import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function useActivities(matchId) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getActivities(matchId);
      setCards(result.cards || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (matchId) reload();
  }, [matchId]);

  return { cards, loading, error, reload };
}
