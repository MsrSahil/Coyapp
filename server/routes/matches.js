import { Router } from 'express';
import db from '../database/db.js';
import { DEMO_USER_ID } from '../database/seed.js';
import { formatProfile } from './feed.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const demoUserRow = db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER_ID);
    if (!demoUserRow) {
      return res.status(404).json({ success: false, error: 'Demo user not found' });
    }

    // Query mutual matches exclusively
    const matchRows = db.prepare(`
      SELECT m.created_at as match_date, u.*
      FROM matches m
      JOIN users u ON (u.id = CASE WHEN m.user_one_id = ? THEN m.user_two_id ELSE m.user_one_id END)
      WHERE m.user_one_id = ? OR m.user_two_id = ?
      ORDER BY m.created_at DESC
    `).all(DEMO_USER_ID, DEMO_USER_ID, DEMO_USER_ID);

    const matches = matchRows.map(r => ({
      ...formatProfile(r, demoUserRow),
      matchDate: r.match_date
    }));

    res.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    next(error);
  }
});

export default router;
