import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

export default function QuizCard({ matchId, questions, onComplete, onSkip, onError }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const question = questions[index];

  const choose = async (option) => {
    const next = { ...answers, [question.id]: option };
    setAnswers(next);
    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    setSubmitting(true);
    try {
      await api.submitQuizAnswers(matchId, next);
      onComplete();
    } catch (error) {
      onError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!question) return null;
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-bold text-stone-500">Question {index + 1} of {questions.length}</span>
        <button type="button" onClick={onSkip} className="text-xs text-stone-500 underline underline-offset-4">
          Skip for now
        </button>
      </div>
      <div className="flex justify-center gap-1.5 mb-6" aria-label={`Question ${index + 1} of ${questions.length}`}>
        {questions.map((_, dot) => (
          <span key={dot} className={`h-1.5 rounded-full transition-all ${dot === index ? 'w-6 bg-coy-coral' : 'w-1.5 bg-stone-300'}`} />
        ))}
      </div>
      <motion.div key={question.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}>
        <h2 className="text-lg font-extrabold text-stone-900 text-center mb-5">{question.text}</h2>
        <div className="grid grid-cols-2 gap-3">
          {question.options.map(option => (
            <button
              key={option}
              type="button"
              disabled={submitting}
              onClick={() => choose(option)}
              className="min-h-24 rounded-3xl border border-stone-200 bg-white px-3 py-4 text-sm font-extrabold text-stone-800 shadow-card hover:border-coy-coral hover:text-coy-coral focus:outline-none focus:ring-2 focus:ring-coy-coral"
            >
              {option}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
