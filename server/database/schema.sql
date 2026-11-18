-- Coy Discover SQLite Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  bio TEXT,
  city TEXT,
  college TEXT,
  interests TEXT, -- JSON array of strings
  photos TEXT, -- JSON array of photo URLs
  gender TEXT,
  profession TEXT,
  is_verified INTEGER DEFAULT 0,
  prompts TEXT, -- JSON array of { question, answer }
  preferences TEXT, -- JSON object of dating/vibe preferences
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS swipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  swiper_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('like', 'pass', 'superlike')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(swiper_id, target_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_one_id TEXT NOT NULL,
  user_two_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_one_id, user_two_id)
);

CREATE TABLE IF NOT EXISTS daily_picks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  pick_date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, pick_date)
);

CREATE TABLE IF NOT EXISTS match_quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id INTEGER NOT NULL UNIQUE,
  question_ids TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  answers TEXT,
  status TEXT NOT NULL CHECK(status IN ('completed', 'skipped')),
  submitted_at DATETIME,
  UNIQUE(quiz_id, user_id),
  FOREIGN KEY (quiz_id) REFERENCES match_quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS match_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id INTEGER NOT NULL,
  activity_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE(match_id, activity_id),
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id INTEGER NOT NULL,
  activity_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  response TEXT NOT NULL CHECK(response IN ('interested', 'not_now')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(match_id, activity_id, user_id),
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_target ON swipes(target_id);
CREATE INDEX IF NOT EXISTS idx_swipes_action ON swipes(action);
CREATE INDEX IF NOT EXISTS idx_matches_user_one ON matches(user_one_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_two ON matches(user_two_id);
CREATE INDEX IF NOT EXISTS idx_daily_picks_user_date ON daily_picks(user_id, pick_date);
CREATE INDEX IF NOT EXISTS idx_match_quizzes_match ON match_quizzes(match_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_quiz ON quiz_responses(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_match_activities_match ON match_activities(match_id);
CREATE INDEX IF NOT EXISTS idx_activity_responses_match ON activity_responses(match_id);
CREATE INDEX IF NOT EXISTS idx_activity_responses_user ON activity_responses(user_id);
