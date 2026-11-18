import { Router } from 'express';
import db from '../database/db.js';
import { DEMO_USER_ID } from '../database/seed.js';
import { formatProfile } from './feed.js';

const router = Router();

router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const profileRow = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!profileRow) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const demoUserRow = db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER_ID);
    const profile = formatProfile(profileRow, demoUserRow);

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    next(error);
  }
});

export default router;
