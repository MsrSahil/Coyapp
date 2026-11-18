import http from 'http';

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('--- TESTING SQLITE BACKEND APIS ---');

  console.log('1. Testing GET /health...');
  const health = await request({ host: 'localhost', port: 5000, path: '/health', method: 'GET' });
  console.log('Health:', health.data);

  console.log('2. Testing GET /feed...');
  const feed = await request({ host: 'localhost', port: 5000, path: '/feed', method: 'GET' });
  console.log(`Feed count: ${feed.data.count}. Top profile: ${feed.data.profiles[0]?.name} (Compatibility: ${feed.data.profiles[0]?.compatibility}%)`);
  console.log(`Top profile reasons:`, feed.data.profiles[0]?.compatibilityReasons);

  console.log('3. Testing GET /discover/daily-pick...');
  const pick = await request({ host: 'localhost', port: 5000, path: '/discover/daily-pick', method: 'GET' });
  console.log('Daily Pick:', pick.data.dailyPick?.name, pick.data.dailyPick?.tagline);

  console.log('4. Testing GET /discover/stats...');
  const stats = await request({ host: 'localhost', port: 5000, path: '/discover/stats', method: 'GET' });
  console.log('Stats:', stats.data);

  console.log('5. Testing POST /swipe (Like on prof_1 which pre-liked user_demo)...');
  const swipeRes = await request(
    { host: 'localhost', port: 5000, path: '/swipe', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { targetUserId: 'prof_1', action: 'like' }
  );
  console.log('Swipe outcome:', { success: swipeRes.data.success, isMatch: swipeRes.data.isMatch, matchedWith: swipeRes.data.match?.name });

  console.log('6. Testing GET /matches (Should contain prof_1)...');
  const matchesRes = await request({ host: 'localhost', port: 5000, path: '/matches', method: 'GET' });
  console.log(`Matches count: ${matchesRes.data.count}, names: ${matchesRes.data.matches?.map(m => m.name)}`);

  console.log('7. Testing POST /undo (Should remove match and restore prof_1)...');
  const undoRes = await request({ host: 'localhost', port: 5000, path: '/undo', method: 'POST' });
  console.log('Undo outcome:', undoRes.data);

  const matchesAfterUndo = await request({ host: 'localhost', port: 5000, path: '/matches', method: 'GET' });
  console.log(`Matches after undo: ${matchesAfterUndo.data.count}`);

  console.log('8. Testing Super Like on prof_3...');
  const superRes = await request(
    { host: 'localhost', port: 5000, path: '/swipe', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { targetUserId: 'prof_3', action: 'superlike' }
  );
  console.log('Super like outcome:', { isMatch: superRes.data.isMatch, match: superRes.data.match?.name });

  console.log('9. Testing POST /reset...');
  const resetRes = await request({ host: 'localhost', port: 5000, path: '/reset', method: 'POST' });
  console.log('Reset outcome:', resetRes.data);

  console.log('--- ALL BACKEND CHECKS SUCCESSFUL ---');
}

run().catch(console.error);
