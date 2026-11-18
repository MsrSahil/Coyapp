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

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_target ON swipes(target_id);
CREATE INDEX IF NOT EXISTS idx_swipes_action ON swipes(action);
CREATE INDEX IF NOT EXISTS idx_matches_user_one ON matches(user_one_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_two ON matches(user_two_id);
CREATE INDEX IF NOT EXISTS idx_daily_picks_user_date ON daily_picks(user_id, pick_date);
