import app from './app.js';
import './database/seed.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✨ Coy Discover Server running on http://localhost:${PORT}`);
  console.log(`📡 GET  /feed          - Discover feed with Smart Discovery`);
  console.log(`👉 POST /swipe         - Record like / pass / superlike`);
  console.log(`💖 GET  /matches       - Mutual matches list`);
  console.log(`🌟 GET  /discover/daily-pick - Featured Daily Discovery`);
  console.log(`📊 GET  /discover/stats      - Discovery statistics`);
  console.log(`↺ POST /undo          - Revert latest swipe & reconcile`);
  console.log(`🔄 POST /reset         - Re-seed database for fresh demo`);
});
