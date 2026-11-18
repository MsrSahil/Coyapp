import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, ArrowRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MatchModal({ match, onClose, onViewMatches }) {
  useEffect(() => {
    if (match) {
      // Trigger festive celebratory confetti
      const count = 180;
      const defaults = { origin: { y: 0.65 }, zIndex: 9999 };

      confetti({
        ...defaults,
        particleCount: 60,
        spread: 35,
        startVelocity: 50,
        colors: ['#FF4458', '#FF85A1', '#FEF08A']
      });

      confetti({
        ...defaults,
        particleCount: 50,
        spread: 70,
        colors: ['#059669', '#10B981', '#34D399']
      });

      confetti({
        ...defaults,
        particleCount: 70,
        spread: 110,
        decay: 0.92,
        scalar: 0.9
      });
    }
  }, [match]);

  if (!match) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative w-full max-w-sm rounded-[36px] p-6 bg-gradient-to-b from-[#1C1817] via-[#151312] to-[#0E0C0C] border border-white/15 shadow-2xl text-center overflow-hidden text-white"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ambient Warm Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-36 bg-coy-coral/30 blur-3xl rounded-full pointer-events-none" />

          {/* Title Header */}
          <div className="flex flex-col items-center mb-6 pt-2">
            <span className="text-[11px] uppercase font-black tracking-widest text-coy-coral mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Mutual Connection Found
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow font-sans">
              IT'S A MATCH!
            </h1>
            <p className="text-xs text-stone-300 mt-1 max-w-[260px] leading-relaxed">
              You and <span className="text-white font-bold">{match.name}</span> secretly liked each other.
            </p>
          </div>

          {/* Overlapping Avatar Rings */}
          <div className="flex items-center justify-center gap-3 my-6 relative">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-rose-400 p-0.5 shadow-xl overflow-hidden bg-stone-800">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
                  alt="You"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-stone-900 border border-white/20 text-stone-200">
                You
              </span>
            </div>

            {/* Glowing Heart Junction */}
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-coy-coral to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/50 z-10"
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </motion.div>

            {/* Partner Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-rose-400 p-0.5 shadow-xl overflow-hidden bg-stone-800">
                <img
                  src={match.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={match.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-stone-900 border border-white/20 text-rose-300 truncate max-w-[70px]">
                {match.name.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Compatibility Synergy Recap */}
          {match.compatibility && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-6 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  ⚡ Synergy
                </span>
                <span className="text-xs font-black text-white">
                  {match.compatibility}% Match
                </span>
              </div>
              <p className="text-xs text-stone-300 font-medium line-clamp-1">
                {match.compatibilityReasons?.[0] || 'Shared chemistry & creative vibe'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onViewMatches}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-coy-coral to-rose-500 hover:from-coy-coralHover hover:to-rose-600 text-white font-extrabold text-sm shadow-button flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <User className="w-4 h-4" />
              <span>View in Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-stone-300 font-medium text-xs transition-colors"
            >
              Continue Discovering
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
