// Compatibility formatting and helper utilities

export function getCompatibilityColor(score) {
  if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (score >= 80) return 'text-amber-800 bg-amber-50 border-amber-200';
  return 'text-rose-700 bg-rose-50 border-rose-200';
}

export function getCompatibilityBadgeLabel(score) {
  if (score >= 92) return 'Exceptional Match';
  if (score >= 85) return 'Strong Affinity';
  if (score >= 75) return 'Shared Wavelength';
  return 'Emerging Vibe';
}
