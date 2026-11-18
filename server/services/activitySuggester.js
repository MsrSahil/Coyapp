import { activities } from '../data/activities.js';

function hash(input) {
  let value = 0;
  for (const char of String(input)) value = ((value * 31) + char.charCodeAt(0)) >>> 0;
  return value;
}

export function suggestActivities(matchId, demoInterests, partnerInterests, quizAnswers = {}) {
  const demoSet = new Set(demoInterests);
  const partnerSet = new Set(partnerInterests);
  const shared = [...demoSet].filter(item => partnerSet.has(item));
  const quizText = Object.values(quizAnswers).join(' ').toLowerCase();

  const scored = activities.map((activity, index) => {
    let score = activity.interestTags.filter(tag => shared.includes(tag)).length * 10;
    if (activity.interestTags.length === 0) score += 2;
    const activityText = `${activity.title} ${activity.description}`.toLowerCase();
    if (quizText && activityText.split(/\W+/).some(word => word && quizText.includes(word))) score += 4;
    score -= index * 0.01;
    return { activity, score };
  }).sort((a, b) => b.score - a.score || hash(`${matchId}:${a.activity.id}`) - hash(`${matchId}:${b.activity.id}`));

  const selected = [];
  for (const item of scored) {
    if (selected.length >= 3) break;
    if (item.activity.interestTags.length === 0 || item.activity.interestTags.some(tag => shared.includes(tag))) {
      selected.push(item.activity);
    }
  }
  for (const item of scored) {
    if (selected.length >= 3) break;
    if (!selected.includes(item.activity)) selected.push(item.activity);
  }
  return selected.slice(0, 3).map(a => a.id);
}
