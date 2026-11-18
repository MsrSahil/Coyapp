import React, { useState } from 'react';
import { Sparkles, Info, X } from 'lucide-react';
import { getCompatibilityColor, getCompatibilityBadgeLabel } from '../utils/compatibility';

export default function CompatibilityBadge({ score, reasons = [], compact = false }) {
  const [showReasons, setShowReasons] = useState(false);

  if (!score) return null;

  return (
    <div className="relative inline-block z-20">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowReasons(prev => !prev);
        }}
        className={`flex items-center gap-1.5 rounded-full font-bold transition-all border shadow-sm active:scale-95 ${
          compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        } ${getCompatibilityColor(score)}`}
      >
        <Sparkles className={compact ? 'w-3 h-3 text-amber-500' : 'w-3.5 h-3.5 text-amber-500'} />
        <span>{score}% Compatible</span>
        <Info className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Popover Breakdown of Calculated Reasons */}
      {showReasons && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full left-0 mb-2 w-64 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xl text-left z-50 text-stone-900 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-100">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-coy-coral flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Smart Discovery
            </span>
            <button
              onClick={() => setShowReasons(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="text-xs font-semibold text-stone-800 mb-1.5">
            {getCompatibilityBadgeLabel(score)} ({score}%)
          </div>

          <ul className="text-[11px] text-stone-600 space-y-1 mb-2">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-coy-coral font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          <div className="text-[9px] text-stone-400 italic pt-1 border-t border-stone-100">
            Estimated compatibility calculated from shared interests, city, and vibe overlap.
          </div>
        </div>
      )}
    </div>
  );
}
