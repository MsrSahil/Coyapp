import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Sparkles, RefreshCw, Star } from 'lucide-react';
import { useFeed } from '../hooks/useFeed';
import { useSwipe } from '../hooks/useSwipe';
import { api } from '../services/api';
import SwipeCard from '../components/SwipeCard';
import SwipeControls from '../components/SwipeControls';
import ProfileDetail from '../components/ProfileDetail';
import FilterPanel from '../components/FilterPanel';
import DailyPickModal from '../components/DailyPickModal';
import EmptyState from '../components/EmptyState';

export default function Discover({ onMatchCreated, onToast, onRefreshMatches, matchesCount }) {
  const navigate = useNavigate();
  const { profiles, loading, error, filters, setFilters, reloadFeed, removeTopProfile, restoreProfile } = useFeed();
  const { isSwiping, executeSwipe, executeUndo } = useSwipe(onMatchCreated, onToast);

  const [detailProfile, setDetailProfile] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDailyPickOpen, setIsDailyPickOpen] = useState(false);
  const [dailyPick, setDailyPick] = useState(null);
  const [stats, setStats] = useState({ remainingProfiles: 0, totalSwipes: 0, superLikesRemaining: 3 });

  // Persistent undo availability based on whether swipes exist in SQLite database
  const canUndo = stats.totalSwipes > 0;

  // Load stats and daily pick
  const loadStatsAndDailyPick = async () => {
    try {
      const [statsRes, dailyRes] = await Promise.all([
        api.getStats().catch(() => null),
        api.getDailyPick().catch(() => null)
      ]);
      if (statsRes?.success) setStats(statsRes);
      if (dailyRes?.success) setDailyPick(dailyRes.dailyPick);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStatsAndDailyPick();
  }, [profiles.length]);

  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  const handleAction = async (action, profile = currentProfile) => {
    if (!profile || isSwiping) return;

    // Optimistically remove top card
    removeTopProfile(profile.id);

    try {
      await executeSwipe(profile, action);
      onRefreshMatches?.();
      loadStatsAndDailyPick();
    } catch (err) {
      // Restore card on error
      restoreProfile(profile);
    }
  };

  const handleUndo = async () => {
    try {
      const res = await executeUndo();
      if (res?.success) {
        reloadFeed();
        onRefreshMatches?.();
        loadStatsAndDailyPick();
      }
    } catch (err) {
      // handled in hook
    }
  };

  const handleResetDeck = async () => {
    try {
      await api.resetDemo();
      reloadFeed();
      onRefreshMatches?.();
      loadStatsAndDailyPick();
      onToast?.('Demo reset! 32 profiles restored.', 'success');
    } catch (err) {
      onToast?.('Failed to reset demo', 'error');
    }
  };

  if (loading && profiles.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-coy-charcoal">
        <div className="w-12 h-12 rounded-full border-3 border-coy-coral border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-bold text-stone-600">Curating Smart Discovery feed...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden select-none bg-coy-bg text-coy-charcoal">
      {/* Top Discover Bar: Daily Pick Shortcut & Filter Trigger */}
      <div className="px-5 py-2.5 flex items-center justify-between z-20 border-b border-stone-200/50 bg-white/60 backdrop-blur-md">
        {/* Daily Pick Pill */}
        {dailyPick ? (
          <button
            onClick={() => setIsDailyPickOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-extrabold border border-amber-200 shadow-sm transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Today's Pick</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
            <Sparkles className="w-3.5 h-3.5 text-coy-coral" />
            <span>Discover</span>
          </div>
        )}

        {/* Right side: Filter & Counter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
            {profiles.length} left
          </span>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="p-1.5 rounded-full bg-white hover:bg-stone-100 border border-stone-200 shadow-sm text-stone-700 transition-colors"
            title="Discovery Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Deck Area or Empty State */}
      <div className="relative flex-1 w-full max-w-md mx-auto px-4 pt-2 pb-1 flex items-center justify-center">
        {currentProfile ? (
          <div className="relative w-full h-full max-h-[580px]">
            {/* Background Card in Stack */}
            {nextProfile && (
              <SwipeCard
                key={nextProfile.id}
                profile={nextProfile}
                isFront={false}
                onSwipe={() => {}}
                onOpenDetail={() => {}}
              />
            )}

            {/* Foreground Draggable Card */}
            <SwipeCard
              key={currentProfile.id}
              profile={currentProfile}
              isFront={true}
              onSwipe={(action, profile) => handleAction(action, profile)}
              onOpenDetail={(profile) => setDetailProfile(profile)}
              disabled={isSwiping}
            />
          </div>
        ) : (
          <EmptyState
            onResetDeck={handleResetDeck}
            onOpenFilters={() => setIsFilterOpen(true)}
            matchesCount={matchesCount}
            onViewMatches={() => navigate('/matches')}
          />
        )}
      </div>

      {/* Desktop & Mobile Action Buttons */}
      {currentProfile && (
        <SwipeControls
          onPass={() => handleAction('pass')}
          onLike={() => handleAction('like')}
          onSuperLike={() => handleAction('superlike')}
          onUndo={handleUndo}
          onOpenDetail={() => setDetailProfile(currentProfile)}
          canUndo={canUndo}
          superLikesRemaining={stats.superLikesRemaining}
          disabled={isSwiping}
        />
      )}

      {/* Full Profile Detail Modal */}
      {detailProfile && (
        <ProfileDetail
          profile={detailProfile}
          onClose={() => setDetailProfile(null)}
          onLike={(p) => handleAction('like', p)}
          onPass={(p) => handleAction('pass', p)}
          onSuperLike={(p) => handleAction('superlike', p)}
        />
      )}

      {/* Filter Panel Modal */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        onResetFilters={(defaults) => setFilters(defaults)}
      />

      {/* Daily Pick Modal */}
      {dailyPick && (
        <DailyPickModal
          dailyPick={dailyPick}
          isOpen={isDailyPickOpen}
          onClose={() => setIsDailyPickOpen(false)}
          onLike={(p) => handleAction('like', p)}
          onSuperLike={(p) => handleAction('superlike', p)}
        />
      )}
    </div>
  );
}
