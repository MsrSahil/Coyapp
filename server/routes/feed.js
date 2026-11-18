import { Router } from 'express';
import db from '../database/db.js';
import { DEMO_USER_ID } from '../database/seed.js';
import { calculateCompatibility } from '../utils/compatibility.js';

const router = Router();

// Helper to format user row into clean JSON object
export function formatProfile(row, demoUser) {
  const profile = {
    id: row.id,
    name: row.name,
    age: row.age,
    bio: row.bio,
    city: row.city,
    college: row.college,
    gender: row.gender,
    profession: row.profession,
    isVerified: Boolean(row.is_verified),
    interests: JSON.parse(row.interests || '[]'),
    photos: JSON.parse(row.photos || '[]'),
    prompts: JSON.parse(row.prompts || '[]'),
    preferences: JSON.parse(row.preferences || '{}'),
    createdAt: row.created_at
  };

  if (demoUser) {
    const comp = calculateCompatibility(demoUser, profile);
    profile.compatibility = comp.score;
    profile.compatibilityReasons = comp.reasons;
  }

  return profile;
}

router.get('/', (req, res, next) => {
  try {
    const demoUserRow = db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER_ID);
    if (!demoUserRow) {
      return res.status(404).json({ success: false, error: 'Demo user not found' });
    }

    const { minAge, maxAge, city, college, interest, minCompatibility, sortBy } = req.query;

    // Fetch all profiles the user hasn't swiped on yet (and not the demo user itself)
    let query = `
      SELECT u.* FROM users u
      LEFT JOIN swipes s ON s.target_id = u.id AND s.swiper_id = ?
      WHERE u.id != ? AND s.id IS NULL
    `;
    const params = [DEMO_USER_ID, DEMO_USER_ID];

    if (minAge) {
      query += ` AND u.age >= ?`;
      params.push(parseInt(minAge, 10));
    }
    if (maxAge) {
      query += ` AND u.age <= ?`;
      params.push(parseInt(maxAge, 10));
    }
    if (city && city.trim() !== 'All') {
      query += ` AND LOWER(u.city) LIKE ?`;
      params.push(`%${city.trim().toLowerCase()}%`);
    }
    if (college && college.trim() !== 'All') {
      query += ` AND LOWER(u.college) LIKE ?`;
      params.push(`%${college.trim().toLowerCase()}%`);
    }

    const rows = db.prepare(query).all(...params);

    // Format profiles & attach smart discovery compatibility scores
    let profiles = rows.map(r => formatProfile(r, demoUserRow));

    // Filter by interest if specified
    if (interest && interest.trim() !== 'All') {
      const targetInterest = interest.trim().toLowerCase();
      profiles = profiles.filter(p =>
        p.interests.some(i => i.toLowerCase().includes(targetInterest))
      );
    }

    // Filter by min compatibility
    if (minCompatibility) {
      const minComp = parseInt(minCompatibility, 10);
      profiles = profiles.filter(p => p.compatibility >= minComp);
    }

    // Prioritize feed by Smart Discovery compatibility scoring algorithm
    if (sortBy === 'age') {
      profiles.sort((a, b) => a.age - b.age);
    } else {
      // Default: Smart Discovery compatibility rank
      profiles.sort((a, b) => b.compatibility - a.compatibility);
    }

    res.json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (error) {
    next(error);
  }
});

export default router;
