# Coy Discover

**Coy Discover: a swipe-based discovery experience where nothing is revealed unless it is mutual.**

## Assignment Context

This project is the take-home for the Coy SDE Intern role.

- **Part A:** propose and build a connected follow-up journey after a mutual match.
- **Part B:** build a mobile-first swipe-based Discover tab with a blank Home tab.

The implementation uses React and Express with a fixed `user_demo` account. SQLite persists swipes, matches, quiz answers and activity responses locally.

## Assignment Requirements

| Requirement | Status | Where to look |
|---|---|---|
| Blank Home tab and Discover tab with bottom navigation | Implemented | `src/pages/Home.jsx`, `src/pages/Discover.jsx`, `src/components/BottomNavigation.jsx`, `src/App.jsx` |
| 30+ seeded profiles | Implemented, 32 profiles | `server/database/seed.js` |
| Some seeded profiles already like the demo user | Implemented | `hasPreLiked: true` entries in `server/database/seed.js` |
| Swipe left/right with drag gestures | Implemented | `src/components/SwipeCard.jsx` |
| Like, pass and super-like buttons | Implemented | `src/components/SwipeControls.jsx`, `src/hooks/useSwipe.js` |
| Swiped profiles do not reappear after refresh | Implemented | `swipes` table and feed exclusion in `server/routes/feed.js` |
| Empty state when no profiles remain | Implemented | `src/components/EmptyState.jsx` |
| Match only on mutual likes | Implemented | `server/routes/swipe.js` |
| “It’s a match!” screen | Implemented | `src/components/MatchModal.jsx` |
| Matches view | Implemented | `src/pages/Matches.jsx`, `server/routes/matches.js` |
| Incoming likes remain private until mutual | Implemented | `server/routes/swipe.js`, `server/routes/matches.js` |
| `GET /feed` | Implemented | `server/routes/feed.js` |
| `POST /swipe` | Implemented | `server/routes/swipe.js` |
| `GET /matches` | Implemented | `server/routes/matches.js` |
| State persists across reloads | Implemented | `server/database/db.js`, SQLite tables |

## Match → Quiz → Plan

```text
Mutual Match
     |
     v
Mutual-Reveal Quiz
     |
     v
Do-It-Together Activity Cards
```

The Match Hub is available at `/matches/:matchId` and contains Profile, Quiz and Activities sections.

### Feature 1: Mutual-Reveal Quiz

After a match, both people answer the same five questions privately. Answers remain hidden until both are complete. The reveal shows the agreement count, agreements and differences side by side.

- Blind until both users finish.
- A skip stores a silent `skipped` response and is not disclosed to the other person.
- A quiz expires three days after creation.
- Answers are immutable: the API rejects duplicate submissions.
- There are no percentages or labels; the reveal shows only an agreement count.
- Questions rotate deterministically per match.
- Interest-linked questions are prioritized, then general questions fill the set.

This extends Coy’s mutual-reveal promise beyond the swipe. If a generic question bank is tiring, interest-linked questions and deterministic rotation provide more relevant choices.

Implementation: `server/data/quizQuestions.js`, `server/services/quizSimulator.js`, `server/routes/matches.js`, `src/components/QuizCard.jsx`, `src/components/QuizWaiting.jsx`, `src/components/QuizReveal.jsx`.

### Feature 2: Do-It-Together Activity Cards

After a match, the app suggests up to three low-pressure public activities based on shared interests and, when complete, shared quiz answers.

- “I’d do this” and “Not now” are private until mutual.
- Only shared interest is returned as mutual.
- “Withdraw” removes the demo user’s own response.
- General fallback cards cover sparse interest overlap.
- The selected cards remain stable for each match.

This gives a match an immediate, low-pressure next step. Hand-written activities by interest reduce the risk of generic recommendations.

Implementation: `server/data/activities.js`, `server/services/activitySuggester.js`, `server/services/activitySimulator.js`, `server/routes/matches.js`, `src/components/ActivityCard.jsx`, `src/components/ActivityUnlock.jsx`.

## Additional Features

- Smart Discovery compatibility ranking and reasons.
- Today’s Pick.
- Super Like with a 3-per-day quota.
- Age, city, college, interest and compatibility filters.
- Profile detail view and photo gallery.
- Persistent undo for the latest swipe.
- Match, quiz and activity cleanup when a swipe is undone.
- Loading, error and reset states.
- A demo reset that re-seeds users and journey state.

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| UI | React 18 with JSX and Vite | Fast component development and local startup |
| Styling | Tailwind CSS | Utility-based responsive styling |
| Animation | Framer Motion | Card gestures and reveal transitions |
| Icons | Lucide React | Consistent icon set |
| Routing | React Router | Discover, Matches and Match Hub routes |
| API | Express | Small modular REST API |
| Database | SQLite through `better-sqlite3` | Persistent local data with no external database |
| Language | JavaScript ES modules | Matches the existing Vite and Node setup |

The default setup needs only Node.js and npm.

## Architecture

```text
CoyAssignment/
  server/
    app.js / server.js             # Express app and HTTP entry point
    test-api.js                    # Manual backend checks
    data/                          # Quiz questions and activities
    database/                      # db, schema and demo seed
    routes/                        # Feed, swipe, matches, discover, profiles
    services/                      # Quiz and activity selection/simulation
  src/
    App.jsx / pages/ / components/
    hooks/                         # Feed, swipe, quiz and activity state
    services/api.js                # Central API client
  index.html / vite.config.js / package.json
  README.md
```

Request flow:

```text
React component
  -> src/services/api.js
  -> Express route in server/routes/
  -> SQLite transaction where a write occurs
  -> JSON response
```

The backend is the single source of truth. Matching is decided by server-side swipe records, the demo user is fixed in `server/database/seed.js`, and write operations use SQLite transactions.

## Database Schema

Every foreign-key relationship uses `ON DELETE CASCADE` where supported.

| Table | Columns | Constraints |
|---|---|---|
| `users` | `id`, `name`, `age`, `bio`, `city`, `college`, `interests`, `photos`, `gender`, `profession`, `is_verified`, `prompts`, `preferences`, `created_at` | `id` primary key |
| `swipes` | `id`, `swiper_id`, `target_id`, `action`, `created_at` | `action` only accepts `like`, `pass`, `superlike`; unique `(swiper_id, target_id)` |
| `matches` | `id`, `user_one_id`, `user_two_id`, `created_at` | Unique `(user_one_id, user_two_id)` |
| `daily_picks` | `id`, `user_id`, `profile_id`, `pick_date`, `created_at` | Unique `(user_id, pick_date)` |
| `match_quizzes` | `id`, `match_id`, `question_ids`, `created_at`, `expires_at` | Unique `match_id`; foreign key to `matches(id)` |
| `quiz_responses` | `id`, `quiz_id`, `user_id`, `answers`, `status`, `submitted_at` | `status` accepts `completed` or `skipped`; unique `(quiz_id, user_id)` |
| `match_activities` | `id`, `match_id`, `activity_id`, `position` | Unique `(match_id, activity_id)` |
| `activity_responses` | `id`, `match_id`, `activity_id`, `user_id`, `response`, `created_at` | `response` accepts `interested` or `not_now`; unique `(match_id, activity_id, user_id)` |

Indexes exist for swipe swipers/targets/actions, both match participant columns, daily pick date, match quizzes, quiz quiz IDs/user IDs, match activities and activity match/user IDs.

Entity overview:

```text
users 1---N swipes N---1 users
users 1---N matches N---1 users
matches 1---1 match_quizzes 1---N quiz_responses
matches 1---N match_activities
matches 1---N activity_responses
```

`UNIQUE(swiper_id, target_id)` prevents a second swipe for the same pair and makes refresh-safe feed exclusion possible. Undo removes the latest swipe, and if that swipe created a match, its match, quiz, quiz responses, activities and activity responses are removed in one transaction.

## Privacy Model

1. `GET /feed` returns profiles but never incoming-like records.
2. `POST /swipe` creates a match only after finding a server-side reciprocal like.
3. Quiz responses are private until both sides have `completed`. Skips are silent, and waiting and expired states do not expose skip or partial state.
4. Activity endpoints return `mutual: true` only when both rows contain `interested`; one-sided responses are omitted.
5. `findOwnedMatch()` verifies that the match contains `user_demo` before quiz or activity data is returned.
6. API failures use the existing Express `errorHandler.js` or explicit status responses. The reveal is 403 until complete.

## Smart Discovery

The estimated compatibility algorithm in `server/utils/compatibility.js` starts at `50` raw points:

| Factor | Points |
|---|---:|
| Each shared interest | 8, capped at 32 |
| Same city | 12 |
| Same college | 10 |
| Age difference 0–1 | 8 |
| Age difference 2–3 | 5 |
| Matching `lookingFor` value | 6 |

The raw result is capped to a displayed range of `62` through `98`. It is not a normalized percentage and is not a validated relationship prediction. The UI labels it as an estimated compatibility score.

## API Documentation

The server also exposes `/api/*` aliases for the feed, swipe, matches, profiles and discover routes.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health`, `/api/health` | Server status |
| `GET` | `/feed` | Ranked and filtered unswiped profiles |
| `POST` | `/swipe` | Record a swipe and detect a match |
| `GET` | `/matches` | Mutual matches and small journey indicators |
| `GET` | `/matches/:matchId/quiz` | Quiz questions, expiry and demo-only progress state |
| `POST` | `/matches/:matchId/quiz/answers` | Submit immutable quiz answers |
| `POST` | `/matches/:matchId/quiz/skip` | Store a silent skip |
| `GET` | `/matches/:matchId/quiz/reveal` | Reveal only after both complete |
| `GET` | `/matches/:matchId/activities` | Cards and demo user’s own responses |
| `POST` | `/matches/:matchId/activities/:activityId/respond` | Interested, not now or withdraw |
| `GET` | `/profiles/:id` | Full profile details |
| `GET` | `/discover/stats` | Remaining profiles and journey counts |
| `GET` | `/discover/daily-pick` | Today’s featured profile |
| `POST` | `/undo` | Remove latest swipe and reconcile a match |
| `POST` | `/reset` | Re-seed all demo state |

### Feed

```bash
curl http://localhost:5000/feed
```

```json
{
  "success": true,
  "count": 32,
  "profiles": [
    {
      "id": "prof_1",
      "name": "Aarav Sharma",
      "compatibility": 98,
      "compatibilityReasons": ["Shared interests in Photography & Coffee"]
    }
  ]
}
```

### Swipe

```bash
curl -X POST http://localhost:5000/swipe \
  -H "Content-Type: application/json" \
  -d "{\"targetUserId\":\"prof_1\",\"action\":\"like\"}"
```

```json
{
  "success": true,
  "action": "like",
  "isMatch": true,
  "match": { "id": "prof_1", "name": "Aarav Sharma", "matchId": 1 },
  "nextProfile": { "id": "prof_2", "name": "Maya Chen" }
}
```

### Quiz

```bash
curl http://localhost:5000/matches/1/quiz
```

```json
{
  "success": true,
  "status": "available",
  "expiry": "2026-11-21T18:50:27.300Z",
  "questions": [
    { "id": "q1", "text": "Choose the setting", "options": ["Mountains", "Beaches"] }
  ]
}
```

After submission:

```json
{ "success": true, "status": "reveal" }
```

`GET /matches/:matchId/quiz/reveal` returns `agreedCount`, `agreements`, `differences` and an `opener`. It returns 403 until both completed.

### Activities

```bash
curl -X POST http://localhost:5000/matches/1/activities/a-coffee-walk/respond \
  -H "Content-Type: application/json" \
  -d "{\"response\":\"interested\"}"
```

```json
{ "success": true, "mutual": false }
```

Each card returned by `GET /matches/:matchId/activities` includes `id`, `title`, `description`, `icon`, `interestTags`, `ownResponse` and `mutual`. No unmutual partner response is returned.

## Setup and Running

Prerequisites:

- Node.js
- npm

`package.json` does not declare an `engines` version. This README was verified with Node.js 24.19.0 and npm.

No external database service is required.

```bash
cd CoyAssignment
npm install
npm run dev
```

Development ports:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

The Vite proxy in `vite.config.js` sends API paths to port `5000`.

Production build and run:

```bash
npm run build
npm start
```

Production serves the React build and API on `http://localhost:5000`.

Environment variables:

- `PORT`: Express port, default `5000`
- `DB_PATH`: SQLite file path
- `VITE_API_URL`: API base used by standalone Vite; see `.env.example`

Re-seed:

```bash
curl -X POST http://localhost:5000/reset
```

You can also use the Reset Demo button in the app.

## Demo Guide

1. Open `http://localhost:3000/discover`. Like **Aarav Sharma**. He is one of the seeded profiles with `hasPreLiked: true`, so it creates a match and Match Hub data.
2. Like **Maya Chen**. No seeded reciprocal swipe is present, so no match appears.
3. Open Aarav’s Match Hub and complete or reveal the quiz. Aarav’s counterpart response is already simulated for the seed state.
4. Open another seeded match and start a quiz there to show the waiting state.
5. Open Aarav’s Activities and choose the first activity he has already been seeded to prefer, so the mutual unlock appears.
6. Use undo in Discover, refresh the page and confirm the match, quiz and activity state is reconciled.

Reset with `POST /reset` if the demo state becomes difficult to demonstrate.

## Demo Simulation

The database contains only seeded profiles; there is no second real account. `quizSimulator.js` derives deterministic quiz answers from profile interests and IDs. `activitySimulator.js` derives deterministic activity responses from shared interests.

The reset seeds **Aarav Sharma** as a match with both counterpart journey states prepared for demonstration. These data stores are not random. In a real product, the counterparts would submit responses through the same API.

## Testing

Verified: `server/test-api.js`, production build, server startup and health, quiz hiding/reveal/skip/expiry, activity unlock/privacy, undo cleanup and unknown-match ownership. Mobile layout and keyboard-only interaction were not automated.

Run the existing backend script while the server is running:

```bash
npm start
node server/test-api.js
```

The script is a manual HTTP check. It does not replace automated test coverage.

## Known Limitations

- The app supports one fixed demo user and has no authentication.
- There is no real second user; counterpart quiz answers and activity taps are deterministic simulations.
- The quiz opener action copies text to the clipboard.
- SQLite is suitable for local demo use, not concurrent production scale.
- Activity and quiz content are curated, not learned from real user behavior.
- Some seeded database runtime files are created locally and are ignored by Git.

Potential production next steps: authentication and per-user sessions, server-authoritative notifications, production database migrations, engagement analytics, and consent-safe matching with reporting and moderation.

## Screenshots

Place images in `docs/screenshots/` and update these references after capture.

- [Discover deck](docs/screenshots/discover-deck.png) — TODO
- [Swipe stamps](docs/screenshots/swipe-stamps.png) — TODO
- [Match modal](docs/screenshots/match-modal.png) — TODO
- [Matches page](docs/screenshots/matches.png) — TODO
- [Quiz question](docs/screenshots/quiz-question.png) — TODO
- [Quiz waiting](docs/screenshots/quiz-waiting.png) — TODO
- [Quiz reveal](docs/screenshots/quiz-reveal.png) — TODO
- [Activity cards](docs/screenshots/activity-cards.png) — TODO
- [Mutual unlock](docs/screenshots/mutual-unlock.png) — TODO
- [Empty state](docs/screenshots/empty-state.png) — TODO
- [Filters](docs/screenshots/filters.png) — TODO

## Author

Built by **Sahil, Full Stack Developer (MERN)**.

- GitHub: [GitHub profile placeholder](https://github.com/)
- LinkedIn: [LinkedIn profile placeholder](https://www.linkedin.com/)
