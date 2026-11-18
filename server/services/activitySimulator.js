export function simulateActivityResponse(profile, activity, sharedInterests) {
  const hashInput = `${profile.id}:${activity.id}`;
  let hash = 0;
  for (const char of hashInput) hash = ((hash * 31) + char.charCodeAt(0)) >>> 0;
  const overlap = activity.interestTags.filter(tag => sharedInterests.includes(tag)).length;
  return overlap > 0 ? (hash % 3 !== 0 ? 'interested' : 'not_now') : (hash % 4 === 0 ? 'interested' : 'not_now');
}
