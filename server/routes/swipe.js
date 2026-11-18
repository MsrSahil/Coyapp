import { Router } from 'express';
import db from '../database/db.js';
import { DEMO_USER_ID } from '../database/seed.js';
import { formatProfile } from './feed.js';

const router = Router();

router.post('/', (req, res, next) => {
  try {
    const { targetUserId, action } = req.body;

    if (!targetUserId || !['like', 'pass', 'superlike'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: targetUserId and action ("like" | "pass" | "superlike") required'
      });
    }

    if (targetUserId === DEMO_USER_ID) {
      return res.status(400).json({
        success: false,
        error: 'Cannot swipe on demo user profile'
      });
    }

    const targetRow = db.prepare('SELECT * FROM users WHERE id = ?').get(targetUserId);
    if (!targetRow) {
      return res.status(404).json({ success: false, error: 'Target profile not found' });
    }

    const demoUserRow = db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER_ID);

    // Super Like Quota check (max 3 per day)
    if (action === 'superlike') {
      const today = new Date().toISOString().slice(0, 10);
      const usedToday = db.prepare(`
        SELECT COUNT(*) as count FROM swipes
        WHERE swiper_id = ? AND action = 'superlike' AND date(created_at) = ?
      `).get(DEMO_USER_ID, today);

      if (usedToday.count >= 3) {
        return res.status(400).json({
          success: false,
          error: 'Daily Super Like limit reached (3 per day). Resets tomorrow!'
        });
      }
    }

    let isMatch = false;
    let matchDetails = null;

    // Execute atomic SQLite transaction
    const executeSwipe = db.transaction(() => {
      // 1. Record user's swipe
      db.prepare(`
        INSERT OR REPLACE INTO swipes (swiper_id, target_id, action, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).run(DEMO_USER_ID, targetUserId, action);

      // 2. Check for mutual like
      if (action === 'like' || action === 'superlike') {
        const incomingSwipe = db.prepare(`
          SELECT * FROM swipes
          WHERE swiper_id = ? AND target_id = ? AND action IN ('like', 'superlike')
        `).get(targetUserId, DEMO_USER_ID);

        if (incomingSwipe) {
          isMatch = true;
          const u1 = DEMO_USER_ID < targetUserId ? DEMO_USER_ID : targetUserId;
          const u2 = DEMO_USER_ID < targetUserId ? targetUserId : DEMO_USER_ID;

          db.prepare(`
            INSERT OR IGNORE INTO matches (user_one_id, user_two_id, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
          `).run(u1, u2);

          matchDetails = formatProfile(targetRow, demoUserRow);
        }
      }
    });

    executeSwipe();

    // 3. Find next profile in feed
    const nextRow = db.prepare(`
      SELECT u.* FROM users u
      LEFT JOIN swipes s ON s.target_id = u.id AND s.swiper_id = ?
      WHERE u.id != ? AND s.id IS NULL
      LIMIT 1
    `).get(DEMO_USER_ID, DEMO_USER_ID);

    const nextProfile = nextRow ? formatProfile(nextRow, demoUserRow) : null;

    res.json({
      success: true,
      action,
      isMatch,
      match: matchDetails,
      nextProfile
    });
  } catch (error) {
    next(error);
  }
});

export default router;
