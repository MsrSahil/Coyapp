import { useState, useCallback } from 'react';
import { api } from '../services/api';

export function useSwipe(onMatchCreated, onToast) {
  const [isSwiping, setIsSwiping] = useState(false);
  const [lastSwipedProfile, setLastSwipedProfile] = useState(null);

  const executeSwipe = useCallback(async (profile, action) => {
    if (!profile || isSwiping) return;

    setIsSwiping(true);
    setLastSwipedProfile(profile);

    try {
      const res = await api.swipe(profile.id, action);

      if (res.isMatch && res.match) {
        onMatchCreated(res.match);
      } else if (action === 'superlike') {
        onToast?.('Super Liked! Your spark was sent.', 'info');
      }

      return res;
    } catch (err) {
      console.error('Swipe error:', err);
      onToast?.(err.message || 'Swipe failed. Please try again.', 'error');
      throw err;
    } finally {
      setIsSwiping(false);
    }
  }, [isSwiping, onMatchCreated, onToast]);

  const executeUndo = useCallback(async () => {
    if (isSwiping) return;

    setIsSwiping(true);
    try {
      const res = await api.undoSwipe();
      onToast?.('Last swipe reverted!', 'success');
      return res;
    } catch (err) {
      console.error('Undo error:', err);
      onToast?.(err.message || 'Cannot undo swipe', 'error');
      throw err;
    } finally {
      setIsSwiping(false);
    }
  }, [isSwiping, onToast]);

  return {
    isSwiping,
    lastSwipedProfile,
    executeSwipe,
    executeUndo
  };
}
