# Coy Discover — Standalone Swipe-Based Social Discovery

![Coy Discover Banner](https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80)

> A modern, production-quality social discovery application built with **React 18 (JSX)**, **Tailwind CSS**, **Framer Motion**, and **Node.js/Express** backed by a normalized **SQLite** database using `better-sqlite3`.

Designed around Coy’s core privacy principle: **100% Double-Blind Mutual Matching** — never reveal who liked a user unless the feeling is mutual.

---

## 📑 Table of Contents
- [1. Overview](#1-overview)
- [2. Tech Stack](#2-tech-stack)
- [3. Key Architectural Highlights](#3-key-architectural-highlights)
- [4. Core Features](#4-core-features)
  - [Swipe Experience & Gestures](#swipe-experience--gestures)
  - [Double-Blind Mutual Matching](#double-blind-mutual-matching)
  - [Feature #1: Smart Discovery & Compatibility Algorithm](#feature-1-smart-discovery--compatibility-algorithm)
  - [Feature #2: Daily Discovery ("Today's Pick") & Super Like](#feature-2-daily-discovery-todays-pick--super-like)
  - [Matches Page & In-App Messaging](#matches-page--in-app-messaging)
  - [Discovery Filters & Detail View](#discovery-filters--detail-view)
  - [Undo Swipe & Match Reconciliation](#undo-swipe--match-reconciliation)
- [5. Database Schema (SQLite)](#5-database-schema-sqlite)
- [6. Backend API Reference](#6-backend-api-reference)
- [7. Setup & Run Instructions](#7-setup--run-instructions)
- [8. Test Verification Scenarios](#8-test-verification-scenarios)

---

## 1. Overview

Coy Discover delivers a tactile, mobile-first social discovery experience inspired by the interaction quality of Bumble, Tinder, and Hinge, featuring a distinct visual identity:
- **Palette:** Warm cream/off-white background (`#FAF8F5`) with deep charcoal typography (`#191716`) and warm coral accents (`#FF4458`).
- **Cards:** Rounded cards (`rounded-[32px]`) with soft depth shadows, image tap carousels, verified badges, and Hinge-style prompt cards.
- **Privacy:** Unilateral incoming likes are never exposed in feed responses or client payloads.

---

## 2. Tech Stack

- **Frontend:** React 18 (`.jsx`), Vite, Tailwind CSS, Framer Motion, Lucide React, React Router (`react-router-dom`), Canvas-Confetti.
- **Backend:** Node.js, Express (`.js`).
- **Database:** SQLite with `better-sqlite3` (WAL mode enabled, foreign keys, transactions).
- **Architecture:** Clean separation of concerns with frontend in `src/` and backend in `server/`.

---

## 3. Key Architectural Highlights

```
coy-discover/
  server/
    database/
      db.js          # SQLite connection (WAL mode, transactions)
      schema.sql     # Normalized SQLite tables & indexes
      seed.js        # 32 seeded mock profiles + demo user
    routes/
      feed.js        # GET /feed (filtered & compatibility ranked)
      swipe.js       # POST /swipe (atomic like/pass/superlike & mutual match check)
      matches.js     # GET /matches (strictly mutual)
      profiles.js    # GET /profiles/:id
      discover.js    # GET /discover/stats, /daily-pick, POST /undo, /reset
    middleware/
      errorHandler.js
    app.js           # Express setup, middleware, routing, dist static serving
    server.js        # Server entry point on port 5000
  src/
    components/
      SwipeCard.jsx          # Touch/mouse drag physics, spring rotation, stamps
      ProfileCard.jsx        # Photo carousel, prompt preview, badges
      SwipeControls.jsx      # Pass, Undo, Super Like (quota), Like, Info buttons
      MatchModal.jsx         # Full-screen "IT'S A MATCH!" celebration
      ProfileDetail.jsx      # Full-page view with prompt answers & photo gallery
      FilterPanel.jsx        # Age, City, College, Interests & Compatibility filters
      CompatibilityBadge.jsx # Estimated match score & reason popover
      DailyPickModal.jsx     # Golden "Today's Pick" featured card
      EmptyState.jsx         # "You've seen everyone for now" with reset actions
      BottomNavigation.jsx   # Primary navigation (Home, Discover, Matches)
      Toast.jsx              # Floating notification toasts
    pages/
      Home.jsx               # Minimal placeholder tab
      Discover.jsx           # Main discovery application deck
      Matches.jsx            # Dedicated mutual matches view & conversation drawer
    hooks/
      useFeed.js             # Feed query, filtering, deck synchronization
      useSwipe.js            # Concurrency-safe swipe & undo management
    services/
      api.js                 # Centralized API service
    utils/
      compatibility.js       # Shared formatting helpers
    App.jsx                  # Router, global modal management, header
    main.jsx                 # Client entry point
    index.css                # Tailwind base & glassmorphism utilities
  README.md
  package.json
  .env.example
  .gitignore
```

---

## 4. Core Features

### Swipe Experience & Gestures
- **Framer Motion Gestures:** Touch drag on mobile, mouse drag on desktop.
- **Dynamic Stamps:**
  - Drag Right: Glowing emerald **LIKE** stamp fades in.
  - Drag Left: Crimson **PASS** stamp fades in.
  - Drag Up: Golden **SUPER LIKE** stamp.
- **Rotational Physics:** Card rotates proportional to horizontal drag (`-16deg` to `+16deg`).
- **Thresholds & Spring Physics:** Swipes beyond 110px or velocity > 400 trigger dismissal; lesser drags snap back smoothly.
- **Anti-Repeat Guarantee:** Once swiped, a profile is recorded in SQLite and **never shown again**.

### Double-Blind Mutual Matching
- A match is created **only** when both users like each other.
- When User A likes User B, the backend checks if User B has an incoming like for User A.
- Displays a celebratory full-screen modal:
  - Both avatar rings with pulsing mutual heart.
  - Multi-tier celebratory confetti blast.
  - Summary of shared synergy.
  - Direct buttons: "View in Matches" or "Continue Discovering".

### Feature #1: Smart Discovery & Compatibility Algorithm
Calculates real compatibility percentages between the demo user and every profile:
- **Shared Interests:** +8 points per shared interest (up to 32 points).
- **Same City:** +12 points ("Both based in San Francisco").
- **Same College:** +10 points ("Both connected to Stanford University").
- **Age Proximity:** +5 to +8 points.
- **Relationship Intent:** +6 points ("Both looking for long-term connection").
- **Explanatory Breakdown:** Tap any badge to see the 2–3 calculated reasons.

### Feature #2: Daily Discovery ("Today's Pick") & Super Like
- **Today's Pick:** Featured daily profile curated by the vibe resonance algorithm, saved in the `daily_picks` SQLite table.
- **Super Like Action:** Dedicated golden star button with distinct animation.
  - Counts as a like for mutual matching.
  - Has a daily quota (3 per day) tracked in SQLite.

### Matches Page & In-App Messaging
- Dedicated section listing all mutual matches with timestamps, location, and compatibility.
- Clicking any match opens an in-app conversation drawer with chat history and message input.

### Undo Swipe & Match Reconciliation
- Undoes the most recent swipe via `POST /undo`.
- Restores the profile back to the top of the feed.
- Atomically deletes any mutual match created exclusively by that swipe from the SQLite database.

---

## 5. Database Schema (SQLite)

```sql
-- Users (Seeded with 32 profiles + demo user)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  bio TEXT,
  city TEXT,
  college TEXT,
  interests TEXT,       -- JSON array
  photos TEXT,          -- JSON array of URLs
  gender TEXT,
  profession TEXT,
  is_verified INTEGER DEFAULT 0,
  prompts TEXT,         -- JSON array of { question, answer }
  preferences TEXT,     -- JSON object
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Swipes
CREATE TABLE swipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  swiper_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('like', 'pass', 'superlike')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(swiper_id, target_id)
);

-- Matches (Mutual connections only)
CREATE TABLE matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_one_id TEXT NOT NULL,
  user_two_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_one_id, user_two_id)
);

-- Daily Picks
CREATE TABLE daily_picks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  pick_date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, pick_date)
);
```

---

## 6. Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/feed` | Returns unswiped profiles ranked by compatibility |
| `POST` | `/swipe` | Records `{ targetUserId, action }` and returns match outcome |
| `GET` | `/matches` | Returns only mutual matches |
| `GET` | `/profiles/:id` | Returns complete profile details |
| `GET` | `/discover/stats` | Returns remaining cards, total swipes, matches, and superlike quota |
| `GET` | `/discover/daily-pick`| Returns today's featured profile |
| `POST` | `/undo` | Reverts the last swipe and reconciles match records |
| `POST` | `/reset` | Re-seeds all 32 profiles for fresh testing |
| `GET` | `/health` | Returns server health status and uptime |

---

## 7. Setup & Run Instructions

### Prerequisites
- Node.js 18+ or 20+ or 22+
- npm 9+

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd coy-discover
npm install
```

### 2. Run Options

#### Option A: Production / Unified Server (Express serves SQLite & built React frontend)
```bash
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

#### Option B: Concurrent Development Mode (Vite HMR + Express)
```bash
npm run dev
```
- Frontend: **http://localhost:3000** (with proxy to backend)
- Backend: **http://localhost:5000**

---

## 8. Test Verification Scenarios

You can verify all scenarios directly in the browser:

1. **Scenario 1 (Swipe & Disappear):** Like or pass a card. It disappears. Refresh the page; it remains gone.
2. **Scenario 2 (Mutual Match):** Like **Aarav Sharma** (pre-seeded incoming like). The celebratory "IT'S A MATCH!" modal immediately appears, and Aarav appears in the Matches tab.
3. **Scenario 3 (Pass Persistence):** Pass a card. It is removed and never appears again.
4. **Scenario 4 (Unilateral Like Privacy):** Like a profile that has not liked the user (e.g., Maya Chen). The card is recorded as liked, no match is created, and no incoming like data is ever exposed.
5. **Scenario 5 (Persistence):** Refresh the browser; all swipes and matches remain persisted in `server/database/coy.db`.
6. **Scenario 6 (Undo & Match Reconciliation):** Click Undo (`↺`). The last swipe is deleted, and if a match was created exclusively by that swipe, it is removed from the Matches list.
7. **Scenario 7 (Empty State & Reset):** Swipe through all cards or filter strictly. A friendly Empty State appears with a 1-click **Reset Demo Deck** button.

## 9. Match → Quiz → Plan Journey

Mutual matches open a **Match Hub** at `/matches/:matchId` with Profile, Quiz and Activities sections. The five-question quiz and activity suggestions remain private until their mutual reveal conditions are met.

### New database tables

- `match_quizzes`: selected question IDs, creation time and three-day expiry.
- `quiz_responses`: one immutable demo response or silent skip per quiz.
- `match_activities`: the stable set of up to three suggested cards.
- `activity_responses`: private interested/not-now responses.

### New API endpoints

- `GET /matches/:matchId/quiz`
- `POST /matches/:matchId/quiz/answers`
- `POST /matches/:matchId/quiz/skip`
- `GET /matches/:matchId/quiz/reveal`
- `GET /matches/:matchId/activities`
- `POST /matches/:matchId/activities/:activityId/respond`

### Demo simulation

Seeded profiles cannot log in. `server/services/quizSimulator.js` deterministically derives their quiz answers from profile interests and IDs. `server/services/activitySimulator.js` deterministically derives their activity responses from shared interests. This simulation is separate from real response storage and exists only to make the demo verifiable.

### Privacy guarantees

- Quiz answers, skips and partial progress are not returned before both quiz responses are complete.
- Expired skipped and waiting states are presented as waiting/ended states rather than skipped/answered facts.
- Activity responses are exposed only when both users chose `interested`.
- Every Match Hub route verifies that the match contains `user_demo`.
- Undo and reset remove or re-create match journey data consistently.
