import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ActivityUnlock({ title, onCopy }) {
  return (
    <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-emerald-700" />
        <span className="text-xs font-black text-emerald-800">You both want this!</span>
      </div>
      <p className="text-sm font-extrabold text-stone-900 mb-3">{title}</p>
      <button type="button" onClick={onCopy} className="w-full py-2.5 rounded-2xl bg-emerald-700 text-white text-xs font-extrabold">
        Want to make this happen?
      </button>
    </motion.div>
  );
}
