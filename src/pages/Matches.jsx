import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, MapPin, Calendar, User, GraduationCap } from 'lucide-react';
import ProfileDetail from '../components/ProfileDetail';

export default function Matches({ matches = [], loading = false }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-coy-bg text-coy-charcoal">
      {/* Top Header */}
      <div className="p-4 px-6 border-b border-stone-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
            <span>Matches</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-100 text-coy-coral">
              {matches.length}
            </span>
          </h1>
          <p className="text-xs text-stone-500 font-normal mt-0.5">
            Strictly mutual. Nobody knows until you both agree.
          </p>
        </div>
      </div>

      {/* Matches Grid Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar pb-24">
        {matches.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-stone-400">
            <div className="w-16 h-16 rounded-3xl bg-coy-subtle border border-stone-200 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-coy-coral/60" />
            </div>
            <h3 className="text-base font-extrabold text-stone-800 mb-1">
              No Matches Yet
            </h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed mb-4">
              When someone you like also likes you back, they will appear here instantly. Your private interactions are never revealed.
            </p>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Double-Blind Mutual Matching</span>
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/matches/${match.matchId}`)}
                className="group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer bg-stone-900 shadow-card border border-stone-200/60"
              >
                <img
                  src={match.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={match.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                {/* Mutual Badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-coy-coral/90 backdrop-blur-md text-[10px] font-black text-white flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" /> Mutual
                </div>

                {/* Details Footer */}
                <div className="absolute bottom-0 inset-x-0 p-3 text-white">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-extrabold truncate">
                      {match.name}
                    </span>
                    <span className="text-xs text-rose-200 font-semibold">
                      {match.age}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-300 truncate">
                    {match.city || match.college}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-rose-200 font-medium pt-1.5 border-t border-white/10">
                    <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedMatch(match); }} className="flex items-center gap-1 hover:text-white transition-colors">
                      <User className="w-3 h-3 text-rose-300" /> View Profile
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); navigate(`/matches/${match.matchId}`); }} className="text-[10px] font-extrabold text-white bg-white/10 px-2 py-1 rounded-full">
                      {match.revealReady ? 'Reveal ready' : match.quizReady ? 'Quiz ready' : 'Quiz ready'}
                    </button>
                  </div>
                  {match.planReady && (
                    <button type="button" onClick={(event) => { event.stopPropagation(); navigate(`/matches/${match.matchId}?section=activities`); }} className="mt-1.5 text-[10px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-1 rounded-full">
                      Plan ready
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Full Profile Detail Modal */}
      {selectedMatch && (
        <ProfileDetail
          profile={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
