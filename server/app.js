import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import feedRouter from './routes/feed.js';
import swipeRouter from './routes/swipe.js';
import matchesRouter from './routes/matches.js';
import profilesRouter from './routes/profiles.js';
import discoverRouter from './routes/discover.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Coy Discover API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Coy Discover API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Primary Required Routes
app.use('/feed', feedRouter);
app.use('/api/feed', feedRouter);

app.use('/swipe', swipeRouter);
app.use('/api/swipe', swipeRouter);

app.use('/matches', matchesRouter);
app.use('/api/matches', matchesRouter);

app.use('/profiles', profilesRouter);
app.use('/api/profiles', profilesRouter);

app.use('/discover', discoverRouter);
app.use('/api/discover', discoverRouter);

// Convenient root undo and reset aliases
app.post('/undo', (req, res, next) => discoverRouter.handle(req, res, next));
app.post('/api/undo', (req, res, next) => discoverRouter.handle(req, res, next));

app.post('/reset', (req, res, next) => discoverRouter.handle(req, res, next));
app.post('/api/reset', (req, res, next) => discoverRouter.handle(req, res, next));

// Serve production client build if exists
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to index.html for React Router
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/feed' || req.path === '/swipe' || req.path === '/matches') {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
