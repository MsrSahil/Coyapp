import { Router } from 'express';
import db from '../database/db.js';
import { DEMO_USER_ID } from '../database/seed.js';
import { formatProfile } from './feed.js';
import { quizQuestions } from '../data/quizQuestions.js';
import { activities } from '../data/activities.js';
import { selectQuizQuestions, simulateQuizAnswers } from '../services/quizSimulator.js';
import { suggestActivities } from '../services/activitySuggester.js';
import { simulateActivityResponse } from '../services/activitySimulator.js';

const router = Router();

function findOwnedMatch(matchId) {
  return db.prepare(`
    SELECT m.*, u.id as partner_id, u.name as partner_name, u.interests as partner_interests,
           du.interests as demo_interests
    FROM matches m
    JOIN users u ON u.id = CASE WHEN m.user_one_id = ? THEN m.user_two_id ELSE m.user_one_id END
    JOIN users du ON du.id = ?
    WHERE m.id = ? AND (m.user_one_id = ? OR m.user_two_id = ?)
  `).get(DEMO_USER_ID, DEMO_USER_ID, matchId, DEMO_USER_ID, DEMO_USER_ID);
}

function ensureMatchContent(match) {
  let quiz = db.prepare('SELECT * FROM match_quizzes WHERE match_id = ?').get(match.id);
  if (!quiz) {
    const demoInterests = JSON.parse(match.demo_interests || '[]');
    const partnerInterests = JSON.parse(match.partner_interests || '[]');
    const questionIds = selectQuizQuestions(match.id, demoInterests, partnerInterests);
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const result = db.prepare(`
      INSERT INTO match_quizzes (match_id, question_ids, expires_at)
      VALUES (?, ?, ?)
    `).run(match.id, JSON.stringify(questionIds), expiresAt);
    quiz = db.prepare('SELECT * FROM match_quizzes WHERE id = ?').get(result.lastInsertRowid);
  }

  const selectedCount = db.prepare('SELECT COUNT(*) count FROM match_activities WHERE match_id = ?').get(match.id).count;
  if (selectedCount === 0) {
    const demoInterests = JSON.parse(match.demo_interests || '[]');
    const partnerInterests = JSON.parse(match.partner_interests || '[]');
    const ids = suggestActivities(match.id, demoInterests, partnerInterests);
    const insert = db.prepare(`
      INSERT OR IGNORE INTO match_activities (match_id, activity_id, position)
      VALUES (?, ?, ?)
    `);
    ids.forEach((activityId, index) => insert.run(match.id, activityId, index));
  }
  return quiz;
}

router.get('/', (req, res, next) => {
  try {
    const demoUserRow = db.prepare('SELECT * FROM users WHERE id = ?').get(DEMO_USER_ID);
    if (!demoUserRow) {
      return res.status(404).json({ success: false, error: 'Demo user not found' });
    }

    // Query mutual matches exclusively
    const matchRows = db.prepare(`
      SELECT m.id as match_id, m.created_at as match_date, u.*
      FROM matches m
      JOIN users u ON (u.id = CASE WHEN m.user_one_id = ? THEN m.user_two_id ELSE m.user_one_id END)
      WHERE m.user_one_id = ? OR m.user_two_id = ?
      ORDER BY m.created_at DESC
    `).all(DEMO_USER_ID, DEMO_USER_ID, DEMO_USER_ID);

    const matches = matchRows.map(r => {
      const matchId = r.match_id;
      const quiz = db.prepare('SELECT * FROM match_quizzes WHERE match_id = ?').get(matchId);
      let quizReady = true;
      let revealReady = false;
      if (quiz) {
        const partnerId = r.id;
        const own = db.prepare('SELECT status FROM quiz_responses WHERE quiz_id = ? AND user_id = ?')
          .get(quiz.id, DEMO_USER_ID);
        const partner = db.prepare('SELECT status FROM quiz_responses WHERE quiz_id = ? AND user_id = ?')
          .get(quiz.id, partnerId);
        revealReady = own?.status === 'completed' && partner?.status === 'completed';
      }
      const planReady = db.prepare(`
        SELECT EXISTS (
          SELECT 1
          FROM activity_responses own
          JOIN activity_responses other
            ON other.match_id = own.match_id
           AND other.activity_id = own.activity_id
           AND other.user_id != own.user_id
          WHERE own.match_id = ? AND own.user_id = ? 
            AND own.response = 'interested' AND other.response = 'interested'
        ) count
      `).get(matchId, DEMO_USER_ID).count === 1;

      return {
        ...formatProfile(r, demoUserRow),
        matchId,
        matchDate: r.match_date,
        quizReady,
        revealReady,
        planReady
      };
    });

    res.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:matchId/quiz', (req, res, next) => {
  try {
    const match = findOwnedMatch(req.params.matchId);
    if (!match) return res.status(404).json({ success: false, error: 'Match not found' });

    const quiz = ensureMatchContent(match);
    const questionIds = JSON.parse(quiz.question_ids);
    const own = db.prepare('SELECT * FROM quiz_responses WHERE quiz_id = ? AND user_id = ?')
      .get(quiz.id, DEMO_USER_ID);
    const partner = db.prepare('SELECT * FROM quiz_responses WHERE quiz_id = ? AND user_id = ?')
      .get(quiz.id, match.partner_id);
    const expired = new Date(quiz.expires_at).getTime() <= Date.now();
    const bothComplete = own?.status === 'completed' && partner?.status === 'completed';
    const response = {
      success: true,
      status: expired && !bothComplete ? 'expired' : (bothComplete ? 'reveal' : own ? 'waiting' : 'available'),
      expiry: quiz.expires_at
    };
    if (own?.status === 'completed') response.answers = JSON.parse(own.answers || '{}');
    if (own?.status === 'skipped') response.answers = null;
    response.questions = questionIds.map(id => {
      const question = quizQuestions.find(q => q.id === id);
      return { id: question.id, text: question.text, options: question.options };
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/:matchId/quiz/answers', (req, res, next) => {
  try {
    const match = findOwnedMatch(req.params.matchId);
    if (!match) return res.status(404).json({ success: false, error: 'Match not found' });
    const quiz = ensureMatchContent(match);
    if (new Date(quiz.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({ success: false, error: 'Quiz has expired' });
    }
    const existing = db.prepare('SELECT * FROM quiz_responses WHERE quiz_id = ? AND user_id = ?').get(quiz.id, DEMO_USER_ID);
    if (existing) return res.status(409).json({ success: false, error: 'Quiz response has already been submitted' });

    const answers = req.body?.answers;
    const questionIds = JSON.parse(quiz.question_ids);
    if (!answers || typeof answers !== 'object' ||
        questionIds.some(id => !Object.prototype.hasOwnProperty.call(answers, id))) {
      return res.status(400).json({ success: false, error: 'All five answers are required' });
    }
    for (const questionId of questionIds) {
      const question = quizQuestions.find(q => q.id === questionId);
      if (!question.options.includes(answers[questionId])) {
        return res.status(400).json({ success: false, error: 'Invalid answer' });
      }
    }

    const submit = db.transaction(() => {
      db.prepare(`
        INSERT INTO quiz_responses (quiz_id, user_id, answers, status, submitted_at)
        VALUES (?, ?, ?, 'completed', CURRENT_TIMESTAMP)
      `).run(quiz.id, DEMO_USER_ID, JSON.stringify(answers));

      const partner = db.prepare('SELECT * FROM quiz_responses WHERE quiz_id = ? AND user_id = ?')
        .get(quiz.id, match.partner_id);
      if (!partner) {
        const partnerRow = db.prepare('SELECT * FROM users WHERE id = ?').get(match.partner_id);
        const partnerAnswers = simulateQuizAnswers(partnerRow, questionIds);
        db.prepare(`
          INSERT INTO quiz_responses (quiz_id, user_id, answers, status, submitted_at)
          VALUES (?, ?, ?, 'completed', CURRENT_TIMESTAMP)
        `).run(quiz.id, match.partner_id, JSON.stringify(partnerAnswers));
      }
    });
    submit();

    res.json({ success: true, status: 'reveal' });
  } catch (error) {
    next(error);
  }
});

router.post('/:matchId/quiz/skip', (req, res, next) => {
  try {
    const match = findOwnedMatch(req.params.matchId);
    if (!match) return res.status(404).json({ success: false, error: 'Match not found' });
    const quiz = ensureMatchContent(match);
    if (new Date(quiz.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({ success: false, error: 'Quiz has expired' });
    }
    const existing = db.prepare('SELECT * FROM quiz_responses WHERE quiz_id = ? AND user_id = ?').get(quiz.id, DEMO_USER_ID);
    if (existing) return res.status(409).json({ success: false, error: 'Quiz response has already been submitted' });
    db.prepare(`
      INSERT INTO quiz_responses (quiz_id, user_id, answers, status, submitted_at)
      VALUES (?, ?, NULL, 'skipped', CURRENT_TIMESTAMP)
    `).run(quiz.id, DEMO_USER_ID);
    res.json({ success: true, status: 'waiting' });
  } catch (error) {
    next(error);
  }
});

router.get('/:matchId/quiz/reveal', (req, res, next) => {
  try {
    const match = findOwnedMatch(req.params.matchId);
    if (!match) return res.status(404).json({ success: false, error: 'Match not found' });
    const quiz = ensureMatchContent(match);
    const own = db.prepare('SELECT * FROM quiz_responses WHERE quiz_id = ? AND user_id = ?').get(quiz.id, DEMO_USER_ID);
    const partner = db.prepare('SELECT * FROM quiz_responses WHERE quiz_id = ? AND user_id = ?').get(quiz.id, match.partner_id);
    if (own?.status !== 'completed' || partner?.status !== 'completed') {
      return res.status(403).json({ success: false, error: 'Quiz reveal is not available' });
    }

    const ownAnswers = JSON.parse(own.answers);
    const partnerAnswers = JSON.parse(partner.answers);
    const questionIds = JSON.parse(quiz.question_ids);
    const agreements = [];
    const differences = [];
    for (const id of questionIds) {
      const question = quizQuestions.find(q => q.id === id);
      const item = { questionId: id, question: question.text, you: ownAnswers[id], them: partnerAnswers[id] };
      if (ownAnswers[id] === partnerAnswers[id]) agreements.push(item);
      else differences.push(item);
    }
    res.json({
      success: true,
      agreedCount: agreements.length,
      agreements,
      differences,
      opener: differences.length
        ? `We chose different answers—want to swap stories about ${differences[0].question.toLowerCase()}?`
        : 'We agreed on a few things—want to pick one and make a plan?'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:matchId/activities', (req, res, next) => {
  try {
    const match = findOwnedMatch(req.params.matchId);
    if (!match) return res.status(404).json({ success: false, error: 'Match not found' });
    ensureMatchContent(match);
    const rows = db.prepare(`
      SELECT * FROM match_activities WHERE match_id = ? ORDER BY position
    `).all(match.id);
    const cards = rows.map(row => {
      const activity = activities.find(a => a.id === row.activity_id);
      const own = db.prepare(`
        SELECT response FROM activity_responses
        WHERE match_id = ? AND activity_id = ? AND user_id = ?
      `).get(match.id, row.activity_id, DEMO_USER_ID);
      const partner = db.prepare(`
        SELECT response FROM activity_responses
        WHERE match_id = ? AND activity_id = ? AND user_id = ?
      `).get(match.id, row.activity_id, match.partner_id);
      const mutual = own?.response === 'interested' && partner?.response === 'interested';
      return {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        icon: activity.icon,
        interestTags: activity.interestTags,
        ownResponse: own?.response === 'interested' ? 'interested' : own?.response === 'not_now' ? 'not_now' : null,
        mutual
      };
    });
    res.json({ success: true, cards });
  } catch (error) {
    next(error);
  }
});

router.post('/:matchId/activities/:activityId/respond', (req, res, next) => {
  try {
    const match = findOwnedMatch(req.params.matchId);
    if (!match) return res.status(404).json({ success: false, error: 'Match not found' });
    ensureMatchContent(match);
    const activity = activities.find(a => a.id === req.params.activityId);
    const selected = db.prepare('SELECT * FROM match_activities WHERE match_id = ? AND activity_id = ?')
      .get(match.id, req.params.activityId);
    if (!activity || !selected) return res.status(404).json({ success: false, error: 'Activity not found' });
    const response = req.body?.response;
    if (!['interested', 'not_now', 'withdraw'].includes(response)) {
      return res.status(400).json({ success: false, error: 'Invalid response' });
    }

    const update = db.transaction(() => {
      if (response === 'withdraw') {
        db.prepare('DELETE FROM activity_responses WHERE match_id = ? AND activity_id = ? AND user_id = ?')
          .run(match.id, activity.id, DEMO_USER_ID);
      } else {
        db.prepare(`
          INSERT INTO activity_responses (match_id, activity_id, user_id, response)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(match_id, activity_id, user_id)
          DO UPDATE SET response = excluded.response, created_at = CURRENT_TIMESTAMP
        `).run(match.id, activity.id, DEMO_USER_ID, response);
      }

      let partner = db.prepare(`
        SELECT * FROM activity_responses
        WHERE match_id = ? AND activity_id = ? AND user_id = ?
      `).get(match.id, activity.id, match.partner_id);

      if (!partner && response === 'interested') {
        const partnerRow = db.prepare('SELECT * FROM users WHERE id = ?').get(match.partner_id);
        const demoInterests = JSON.parse(match.demo_interests || '[]');
        const partnerInterests = JSON.parse(match.partner_interests || '[]');
        const partnerResponse = simulateActivityResponse(partnerRow, activity, [...new Set([...demoInterests, ...partnerInterests])]);
        db.prepare(`
          INSERT OR IGNORE INTO activity_responses (match_id, activity_id, user_id, response)
          VALUES (?, ?, ?, ?)
        `).run(match.id, activity.id, match.partner_id, partnerResponse);
        partner = { response: partnerResponse };
      }
      const own = response === 'withdraw' ? null : db.prepare(`
        SELECT response FROM activity_responses
        WHERE match_id = ? AND activity_id = ? AND user_id = ?
      `).get(match.id, activity.id, DEMO_USER_ID);
      return { mutual: own?.response === 'interested' && partner?.response === 'interested' };
    });
    const result = update();
    res.json({ success: true, mutual: result.mutual });
  } catch (error) {
    next(error);
  }
});

export default router;
