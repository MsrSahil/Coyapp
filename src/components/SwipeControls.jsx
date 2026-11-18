import React from 'react';
import { X, Heart, Star, RotateCcw, Info } from 'lucide-react';

export default function SwipeControls({
  onPass,
  onLike,
  onSuperLike,
  onUndo,
  onOpenDetail,
  canUndo = false,
  superLikesRemaining = 3,
  disabled = false
}) {
  return (
    <div className="flex items-center justify-center gap-3.5 sm:gap-5 py-3 px-4 z-20">
      {/* Undo Button */}
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo || disabled}
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
          canUndo && !disabled
            ? 'bg-coy-surface hover:bg-stone-50 text-amber-600 border border-amber-200 shadow-sm active:scale-95'
            : 'bg-stone-100 text-stone-300 border border-stone-200/50 cursor-not-allowed opacity-50'
        }`}
        title="Undo last swipe"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      {/* Pass / Reject Button */}
      <button
        type="button"
        onClick={onPass}
        disabled={disabled}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white hover:bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center transition-all shadow-card hover:shadow-card-hover active:scale-90 disabled:opacity-50"
        title="Pass (Swipe Left)"
      >
        <X className="w-7 h-7 stroke-[2.6]" />
      </button>

      {/* Super Like Button (with quota badge) */}
      <button
        type="button"
        onClick={onSuperLike}
        disabled={disabled || superLikesRemaining <= 0}
        className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center transition-all shadow-card hover:shadow-card-hover active:scale-90 disabled:opacity-50"
        title={`Super Like (${superLikesRemaining} left today)`}
      >
        <Star className="w-6 h-6 fill-amber-400 stroke-amber-500" />
        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-extrabold text-[9px] shadow-sm">
          {superLikesRemaining}
        </span>
      </button>

      {/* Like Button */}
      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-coy-coral to-rose-500 hover:from-coy-coralHover hover:to-rose-600 text-white flex items-center justify-center transition-all shadow-button active:scale-90 disabled:opacity-50"
        title="Like (Swipe Right)"
      >
        <Heart className="w-7 h-7 fill-white stroke-white" />
      </button>

      {/* Info / Full Profile Detail Button */}
      <button
        type="button"
        onClick={onOpenDetail}
        disabled={disabled}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-coy-surface hover:bg-stone-50 text-coy-body border border-coy-border flex items-center justify-center transition-all shadow-sm active:scale-95 disabled:opacity-50"
        title="View Full Profile Details"
      >
        <Info className="w-5 h-5 text-stone-600" />
      </button>
    </div>
  );
}
