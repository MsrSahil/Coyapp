import React, { useState } from 'react';
import { CheckCircle2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuizReveal({ reveal, onToast }) {
  const [showDifferences, setShowDifferences] = useState(false);
  const copyOpener = async () => {
    try {
      await navigator.clipboard.writeText(reveal.opener);
      onToast('Opener copied', 'success');
    } catch {
      onToast('Could not copy opener', 'error');
    }
  };

  return (
    <div className="p-4">
      <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-black text-stone-900 text-center mb-4">
        You agreed on {reveal.agreedCount} of 5
      </motion.h2>
      {reveal.agreements.length > 0 && (
        <div className="space-y-2 mb-4">
          {reveal.agreements.map(item => (
            <div key={item.questionId} className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4" /> {item.you}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">{item.question}</p>
            </div>
          ))}
        </div>
      )}
      {reveal.differences.length > 0 && (
        <button type="button" onClick={() => setShowDifferences(true)} className="w-full py-2 text-xs font-bold text-coy-coral">
          See differences
        </button>
      )}
      {showDifferences && reveal.differences.map(item => (
        <div key={item.questionId} className="grid grid-cols-2 gap-2 rounded-2xl bg-stone-50 border border-stone-200 p-3 mb-2">
          <div><span className="text-[10px] text-stone-500">You</span><p className="text-sm font-bold">{item.you}</p></div>
          <div><span className="text-[10px] text-stone-500">Them</span><p className="text-sm font-bold">{item.them}</p></div>
        </div>
      ))}
      <button type="button" onClick={copyOpener} className="mt-3 w-full py-3 rounded-2xl bg-coy-coral text-white text-sm font-extrabold flex items-center justify-center gap-2">
        <Copy className="w-4 h-4" /> Copy an opener
      </button>
    </div>
  );
}
