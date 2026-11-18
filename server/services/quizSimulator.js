import { quizQuestions } from '../data/quizQuestions.js';

function hash(input) {
  let value = 0;
  for (const char of String(input)) value = ((value * 31) + char.charCodeAt(0)) >>> 0;
  return value;
}

export function simulateQuizAnswers(profile, questionIds) {
  const interests = profile?.interests ? JSON.parse(profile.interests) : [];
  const answers = {};

  for (const questionId of questionIds) {
    const question = quizQuestions.find(q => q.id === questionId);
    if (!question) continue;
    const linked = question.interestTags.some(tag => interests.includes(tag));
    const seed = hash(`${profile.id}:${questionId}:${linked ? 'interest' : 'general'}`);
    answers[questionId] = question.options[seed % question.options.length];
  }
  return answers;
}

export function selectQuizQuestions(matchId, demoInterests = [], partnerInterests = []) {
  const shared = [...demoInterests, ...partnerInterests]
    .filter((value, index, list) => list.indexOf(value) === index);
  const linked = quizQuestions.filter(q => q.interestTags.some(tag => shared.includes(tag)));
  const general = quizQuestions.filter(q => !q.interestTags.length);
  const pool = [...linked, ...general];
  const uniquePool = pool.filter((q, index, list) => list.findIndex(item => item.id === q.id) === index);
  const offset = hash(String(matchId)) % quizQuestions.length;
  const ordered = [];

  for (let i = 0; i < quizQuestions.length && ordered.length < 5; i++) {
    const candidate = quizQuestions[(offset + i) % quizQuestions.length];
    if (uniquePool.some(q => q.id === candidate.id)) ordered.push(candidate);
  }

  for (const candidate of uniquePool) {
    if (ordered.length === 5) break;
    if (!ordered.some(q => q.id === candidate.id)) ordered.push(candidate);
  }

  return ordered.slice(0, 5).map(q => q.id);
}
