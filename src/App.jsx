import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import MatchHub from './pages/MatchHub';
import BottomNavigation from './components/BottomNavigation';
import MatchModal from './components/MatchModal';
import Toast from './components/Toast';
import { api } from './services/api';

function MainLayout() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMatches = async () => {
    try {
      const data = await api.getMatches();
      if (data?.success) {
        setMatches(data.matches || []);
      }
    } catch (e) {
      console.error('Failed to load matches:', e);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleResetDemo = async () => {
    try {
      await api.resetDemo();
      await loadMatches();
      showToast('Demo reset! 32 profiles re-seeded.', 'success');
      navigate('/discover');
    } catch (e) {
      showToast('Reset failed', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F3F0EB] flex flex-col items-center justify-center p-0 md:p-6 overflow-hidden font-sans">
      {/* App Shell Container */}
      <div className="w-full max-w-[430px] h-[100dvh] md:h-[860px] md:max-h-[94vh] md:rounded-[44px] md:border md:border-stone-200/90 md:shadow-card bg-coy-bg flex flex-col overflow-hidden relative">
        {/* Top App Header */}
        <header className="px-5 py-3 border-b border-stone-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-coy-coral to-rose-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-base tracking-tighter">C</span>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-stone-900 font-sans">
                coy
              </span>
              <span className="ml-1.5 text-[10px] font-extrabold uppercase tracking-wider text-coy-coral bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Discover
              </span>
            </div>
          </div>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all active:scale-95 border border-stone-200"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-coy-coral" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 relative overflow-hidden bg-coy-bg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/discover"
              element={
                <Discover
                  onMatchCreated={(matchedProfile) => {
                    setCurrentMatch(matchedProfile);
                    loadMatches();
                  }}
                  onToast={showToast}
                  onRefreshMatches={loadMatches}
                  matchesCount={matches.length}
                />
              }
            />
            <Route
              path="/matches"
              element={<Matches matches={matches} onToast={showToast} />}
            />
            <Route
              path="/matches/:matchId"
              element={<MatchHub onToast={showToast} />}
            />
            <Route path="*" element={<Navigate to="/discover" replace />} />
          </Routes>
        </main>

        {/* Bottom Tab Navigation */}
        <BottomNavigation matchesCount={matches.length} />
      </div>

      {/* Global Celebratory Match Modal */}
      {currentMatch && (
        <MatchModal
          match={currentMatch}
          onClose={() => setCurrentMatch(null)}
          onViewMatches={() => {
            setCurrentMatch(null);
            navigate('/matches');
          }}
          onTakeQuiz={() => {
            const matchId = currentMatch.matchId;
            setCurrentMatch(null);
            if (matchId) navigate(`/matches/${matchId}?section=quiz`);
          }}
          onSeeIdeas={() => {
            const matchId = currentMatch.matchId;
            setCurrentMatch(null);
            if (matchId) navigate(`/matches/${matchId}?section=activities`);
          }}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
