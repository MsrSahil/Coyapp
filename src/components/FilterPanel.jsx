import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

export default function FilterPanel({ isOpen, onClose, filters, onApplyFilters, onResetFilters }) {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  if (!isOpen) return null;

  const cities = ['All', 'San Francisco', 'Berkeley', 'New York', 'Austin', 'Seattle', 'Los Angeles'];
  const colleges = ['All', 'Stanford University', 'UC Berkeley', 'Columbia University', 'NYU Tisch', 'UT Austin'];
  const interests = ['All', 'Photography', 'Design', 'Coffee', 'Matcha', 'Bouldering', 'Indie Rock', 'Jazz', 'Architecture'];

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaults = {
      minAge: 18,
      maxAge: 35,
      city: 'All',
      college: 'All',
      interest: 'All',
      minCompatibility: 0,
      sortBy: 'compatibility'
    };
    setLocalFilters(defaults);
    onResetFilters(defaults);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-md h-[85vh] sm:h-auto rounded-t-[36px] sm:rounded-[36px] bg-white border border-stone-200 shadow-2xl flex flex-col overflow-hidden text-coy-charcoal"
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-coy-coral" />
              <h2 className="text-base font-extrabold text-stone-900">
                Discovery Filters
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-5 space-y-5 overflow-y-auto max-h-[60vh] no-scrollbar">
            {/* Age Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Age Range
                </label>
                <span className="text-xs font-extrabold text-coy-coral">
                  {localFilters.minAge} — {localFilters.maxAge} yrs
                </span>
              </div>
              <div className="flex gap-3">
                <input
                  type="range"
                  min="18"
                  max="35"
                  value={localFilters.minAge}
                  onChange={(e) => setLocalFilters({ ...localFilters, minAge: parseInt(e.target.value) })}
                  className="w-full accent-coy-coral cursor-pointer"
                />
                <input
                  type="range"
                  min="18"
                  max="35"
                  value={localFilters.maxAge}
                  onChange={(e) => setLocalFilters({ ...localFilters, maxAge: parseInt(e.target.value) })}
                  className="w-full accent-coy-coral cursor-pointer"
                />
              </div>
            </div>

            {/* Minimum Smart Compatibility */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Min Estimated Compatibility
                </label>
                <span className="text-xs font-extrabold text-amber-700">
                  {localFilters.minCompatibility > 0 ? `${localFilters.minCompatibility}%+` : 'Any'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 70, 80, 90].map((threshold) => (
                  <button
                    key={threshold}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, minCompatibility: threshold })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      localFilters.minCompatibility === threshold
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {threshold === 0 ? 'All' : `${threshold}%+`}
                  </button>
                ))}
              </div>
            </div>

            {/* City Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                City / Location
              </label>
              <div className="flex flex-wrap gap-1.5">
                {cities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, city: c })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      localFilters.city === c
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* College / University */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                College / University
              </label>
              <div className="flex flex-wrap gap-1.5">
                {colleges.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, college: col })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      localFilters.college === col
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Passions & Interests
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, interest: i })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      localFilters.interest === i
                        ? 'bg-coy-coral text-white border-coy-coral shadow-sm'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-3 px-5 rounded-2xl bg-coy-charcoal hover:bg-black text-white font-extrabold text-xs shadow-md transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
