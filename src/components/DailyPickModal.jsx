import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Star, MapPin, GraduationCap, ArrowRight } from 'lucide-react';

export default function DailyPickModal({ dailyPick, isOpen, onClose, onLike, onSuperLike }) {
  if (!isOpen || !dailyPick) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative w-full max-w-sm rounded-[36px] bg-white border-2 border-amber-300 shadow-2xl overflow-hidden text-coy-charcoal"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-95 z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Daily Pick Golden Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-white flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              Today's Curated Pick
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              Daily Special
            </span>
          </div>

          {/* Image & Main Info */}
          <div className="relative aspect-[4/4.5] w-full">
            <img
              src={dailyPick.photos?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'}
              alt={dailyPick.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 inset-x-4 text-white">
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-2xl font-extrabold">{dailyPick.name}</h3>
                <span className="text-xl font-semibold text-amber-200">{dailyPick.age}</span>
              </div>
              <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
                {dailyPick.bio}
              </p>
            </div>
          </div>

          {/* Rationale Section */}
          <div className="p-5 space-y-3 bg-amber-50/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-amber-900">
                Compatibility Index
              </span>
              <span className="font-black text-amber-600 text-sm">
                {dailyPick.compatibility}%
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-snug">
              {dailyPick.tagline || 'Selected as your top vibe match today based on mutual creative affinities and location.'}
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onSuperLike?.(dailyPick);
                }}
                className="flex-1 py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Super Like</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onLike?.(dailyPick);
                }}
                className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-tr from-coy-coral to-rose-500 hover:from-coy-coralHover text-white font-extrabold text-xs shadow-button flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Like Profile</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
