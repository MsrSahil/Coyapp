import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function QuizWaiting({ expired = false }) {
  return (
    <div className="p-8 text-center">
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        className="w-14 h-14 mx-auto rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4"
      >
        <Sparkles className="w-6 h-6 text-coy-coral" />
      </motion.div>
      <h2 className="text-lg font-extrabold text-stone-900">
        {expired ? 'This quiz has ended' : 'Waiting for them to answer'}
      </h2>
    </div>
  );
}
