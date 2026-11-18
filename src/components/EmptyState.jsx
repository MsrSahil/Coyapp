import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, RotateCcw, Filter, Compass } from 'lucide-react';

export default function EmptyState({ onResetDeck, onOpenFilters, matchesCount = 0, onViewMatches }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none text-coy-charcoal">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-20 h-20 rounded-3xl bg-coy-subtle border border-stone-200 flex items-center justify-center mb-5 shadow-sm relative"
      >
        <Compass className="w-10 h-10 text-coy-coral" />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px] font-black shadow-sm">
          ✓
        </span>
      </motion.div>

      <h2 className="text-2xl font-black tracking-tight text-stone-900 mb-2">
        You've Seen Everyone For Now
      </h2>
      <p className="text-xs text-stone-500 max-w-xs leading-relaxed mb-6 font-normal">
        All profiles matching your preferences have been discovered. Swiped profiles never appear again. Check back later or adjust your discovery filters!
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {matchesCount > 0 && (
          <button
            onClick={onViewMatches}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-coy-coral to-rose-500 hover:from-coy-coralHover text-white font-extrabold text-xs shadow-button flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>View Mutual Matches ({matchesCount})</span>
          </button>
        )}

        <button
          onClick={onOpenFilters}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <Filter className="w-4 h-4 text-stone-500" />
          <span>Adjust Discovery Filters</span>
        </button>

        <button
          onClick={onResetDeck}
          className="w-full py-2.5 px-4 rounded-2xl text-stone-500 hover:text-stone-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Deck (32 Profiles)</span>
        </button>
      </div>
    </div>
  );
}
