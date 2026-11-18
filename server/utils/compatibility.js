// Coy Smart Discovery Compatibility Algorithm

export function calculateCompatibility(user, profile) {
  let score = 50; // Base baseline score
  const reasons = [];

  const userInterests = Array.isArray(user.interests) ? user.interests : JSON.parse(user.interests || '[]');
  const profileInterests = Array.isArray(profile.interests) ? profile.interests : JSON.parse(profile.interests || '[]');

  // 1. Shared Interests (+8 pts each, up to 32 pts)
  const shared = userInterests.filter(i => profileInterests.includes(i));
  if (shared.length > 0) {
    const points = Math.min(32, shared.length * 8);
    score += points;
    if (shared.length === 1) {
      reasons.push(`You both love ${shared[0]}`);
    } else {
      reasons.push(`Shared interests in ${shared.slice(0, 2).join(' & ')}`);
    }
  }

  // 2. Location & College Compatibility
  if (user.city && profile.city && user.city.toLowerCase() === profile.city.toLowerCase()) {
    score += 12;
    reasons.push(`Both based in ${profile.city}`);
  }

  if (user.college && profile.college && user.college.toLowerCase() === profile.college.toLowerCase()) {
    score += 10;
    reasons.push(`Both connected to ${profile.college}`);
  }

  // 3. Age proximity
  const ageDiff = Math.abs(user.age - profile.age);
  if (ageDiff <= 1) {
    score += 8;
  } else if (ageDiff <= 3) {
    score += 5;
  }

  // 4. Intent & Preference Match
  try {
    const userPref = typeof user.preferences === 'string' ? JSON.parse(user.preferences || '{}') : (user.preferences || {});
    const profPref = typeof profile.preferences === 'string' ? JSON.parse(profile.preferences || '{}') : (profile.preferences || {});
    if (userPref.lookingFor && profPref.lookingFor && userPref.lookingFor === profPref.lookingFor) {
      score += 6;
      reasons.push(`Both looking for ${userPref.lookingFor.toLowerCase()}`);
    }
  } catch (e) {
    // ignore
  }

  // Cap between 62% and 98% for realistic dating compatibility
  const finalScore = Math.min(98, Math.max(62, score));

  // Fallback reason if less than 2
  if (reasons.length < 2) {
    reasons.push('Curated through Coy’s vibe resonance model');
  }

  return {
    score: finalScore,
    reasons: reasons.slice(0, 3)
  };
}
