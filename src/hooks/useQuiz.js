import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function useQuiz(matchId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await api.getQuiz(matchId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (matchId) reload();
  }, [matchId]);

  return { data, loading, error, reload };
}
