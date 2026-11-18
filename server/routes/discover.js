import { Router } from 'express';
import db from '../database/db.js';
import { DEMO_USER_ID, seedDatabase } from '../database/seed.js';
import { formatProfile } from './feed.js';

const router = Router();

// GET /discover/stats
router.get('/stats', (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const remaining = db.prepare(`
      SELECT COUNT(*) as count FROM users u
      LEFT JOIN swipes s ON s.target_id = u.id AND s.swiper_id = ?
      WHERE u.id != ? AND s.id IS NULL
    `).get(DEMO_USER_ID, DEMO_USER_ID).count;

    const totalSwipes = db.prepare(`
      SELECT COUNT(*) as count FROM swipes WHERE swiper_id = ?
    `).get(DEMO_USER_ID).count;

    const totalMatches = db.prepare(`
      SELECT COUNT(*) as count FROM matches
      WHERE user_one_id = ? OR user_two_id = ?
    `).get(DEMO_USER_ID, DEMO_USER_ID).count;

    const usedSuperLikesToday = db.prepare(`
      SELECT COUNT(*) as count FROM swipes
      WHERE swiper_id = ? AND action = 'superlike' AND date(created_at) = ?
    `).get(DEMO_USER_ID, today).count;

    const superLikesRemaining = Math.max(0, 3 - usedSuperLikesToday);

    const quizzesToReveal = db.prepare(`
      SELECT COUNT(*) count
      FROM match_quizzes mq
      JOIN matches m ON m.id = mq.match_id
      JOIN quiz_responses demo_q ON demo_q.quiz_id = mq.id AND demo_q.user_id = ? AND demo_q.status = 'completed'
      JOIN users partner ON partner.id = CASE WHEN m.user_one_id = ? THEN m.user_two_id ELSE m.user_one_id END
      JOIN quiz_responses partner_q ON partner_q.quiz_id = mq.id AND partner_q.user_id = partner.id AND partner_q.status = 'completed'
      WHERE m.user_one_id = ? OR m.user_two_id = ?
    `).get(DEMO_USER_ID, DEMO_USER_ID, DEMO_USER_ID, DEMO_USER_ID).count;

    const mutualPlans = db.prepare(`
      SELECT COUNT(DISTINCT ar.match_id) count
      FROM activity_responses ar
      JOIN matches m ON m.id = ar.match_id
      WHERE (m.user_one_id = ? OR m.user_two_id = ?)
        AND ar.response = 'interested'
        AND EXISTS (
          SELECT 1 FROM activity_responses ar2
          WHERE ar2.match_id = ar.match_id
            AND ar2.activity_id = ar.activity_id
            AND ar2.user_id != ar.user_id
            AND ar2.response = 'interested'
        )
    `).get(DEMO_USER_ID, DEMO_USER_ID).count;

    res.json({
      success: true,
      remainingProfiles: remaining,
      totalSwipes,
      totalMatches,
      superLikesRemaining,
      dailySuperLikeLimit: 3,
      quizzesToReveal,
      mutualPlans
    });
  } catch (error) {
    next(error);
  }
});

// GET /discover/daily-pick
router.get('/daily-pick', (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const demoUserRow = db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER_ID);

    let pickRow = db.prepare(`
      SELECT dp.*, u.* FROM daily_picks dp
      JOIN users u ON u.id = dp.profile_id
      WHERE dp.user_id = ? AND dp.pick_date = ?
    `).get(DEMO_USER_ID, today);

    if (!pickRow) {
      // Pick the highest compatibility unswiped profile, or any unswiped profile
      const candidate = db.prepare(`
        SELECT u.* FROM users u
        LEFT JOIN swipes s ON s.target_id = u.id AND s.swiper_id = ?
        WHERE u.id != ? AND s.id IS NULL
        LIMIT 1
      `).get(DEMO_USER_ID, DEMO_USER_ID);

      if (candidate) {
        db.prepare(`
          INSERT OR REPLACE INTO daily_picks (user_id, profile_id, pick_date)
          VALUES (?, ?, ?)
        `).run(DEMO_USER_ID, candidate.id, today);

        pickRow = candidate;
      }
    }

    if (!pickRow) {
      return res.json({ success: true, dailyPick: null, message: 'No daily pick available' });
    }

    const profile = formatProfile(pickRow, demoUserRow);

    res.json({
      success: true,
      dailyPick: {
        ...profile,
        featuredDate: today,
        tagline: 'Curated by Coy’s vibe resonance model for high connection potential'
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /undo (or /discover/undo)
router.post('/undo', (req, res, next) => {
  try {
    const latestSwipe = db.prepare(`
      SELECT * FROM swipes
      WHERE swiper_id = ?
      ORDER BY id DESC LIMIT 1
    `).get(DEMO_USER_ID);

    if (!latestSwipe) {
      return res.status(400).json({ success: false, error: 'No recent swipes to undo' });
    }

    const targetId = latestSwipe.target_id;

    const undoTransaction = db.transaction(() => {
      // Delete swipe record
      db.prepare('DELETE FROM swipes WHERE id = ?').run(latestSwipe.id);

      // Reconcile matches table: remove match if it existed
      const u1 = DEMO_USER_ID < targetId ? DEMO_USER_ID : targetId;
      const u2 = DEMO_USER_ID < targetId ? targetId : DEMO_USER_ID;

      const matchRow = db.prepare(`
        SELECT id FROM matches WHERE user_one_id = ? AND user_two_id = ?
      `).get(u1, u2);
      if (matchRow) {
        const quizzes = db.prepare('SELECT id FROM match_quizzes WHERE match_id = ?').all(matchRow.id);
        for (const quiz of quizzes) {
          db.prepare('DELETE FROM quiz_responses WHERE quiz_id = ?').run(quiz.id);
        }
        db.prepare('DELETE FROM match_quizzes WHERE match_id = ?').run(matchRow.id);
        db.prepare('DELETE FROM activity_responses WHERE match_id = ?').run(matchRow.id);
        db.prepare('DELETE FROM match_activities WHERE match_id = ?').run(matchRow.id);
        db.prepare('DELETE FROM matches WHERE id = ?').run(matchRow.id);
      }
    });

    undoTransaction();

    res.json({
      success: true,
      message: 'Last swipe reverted successfully',
      restoredProfileId: targetId
    });
  } catch (error) {
    next(error);
  }
});

// POST /reset - Full demo reset
router.post('/reset', (req, res, next) => {
  try {
    seedDatabase(true);
    res.json({
      success: true,
      message: 'Demo state successfully reset to initial seed (32 profiles ready)!'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
