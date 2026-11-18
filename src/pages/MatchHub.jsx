import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, User, HelpCircle, CalendarDays } from 'lucide-react';
import { api } from '../services/api';
import { useQuiz } from '../hooks/useQuiz';
import { useActivities } from '../hooks/useActivities';
import QuizCard from '../components/QuizCard';
import QuizWaiting from '../components/QuizWaiting';
import QuizReveal from '../components/QuizReveal';
import ActivityCard from '../components/ActivityCard';

export default function MatchHub({ onToast }) {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [section, setSection] = useState(searchParams.get('section') || 'profile');
  const [profile, setProfile] = useState(null);
  const [reveal, setReveal] = useState(null);
  const { data: quiz, loading: quizLoading, reload: reloadQuiz } = useQuiz(matchId);
  const { cards, loading: activitiesLoading, reload: reloadActivities } = useActivities(matchId);

  useEffect(() => {
    api.getMatches().then(result => {
      setProfile((result.matches || []).find(match => String(match.matchId) === String(matchId)) || null);
    }).catch(() => setProfile(null));
  }, [matchId]);

  const openReveal = async () => {
    try {
      setReveal(await api.getQuizReveal(matchId));
    } catch (error) {
      onToast(error.message, 'error');
    }
  };

  const respondActivity = async (activityId, response) => {
    try {
      await api.respondToActivity(matchId, activityId, response);
      await reloadActivities();
      onToast(response === 'withdraw' ? 'Response withdrawn' : 'Saved privately', 'success');
    } catch (error) {
      onToast(error.message, 'error');
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      onToast('Opener copied', 'success');
    } catch {
      onToast('Could not copy opener', 'error');
    }
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24">
      <div className="sticky top-0 z-10 px-4 py-3 bg-white/90 backdrop-blur border-b border-stone-200 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/matches')} className="p-2 rounded-full bg-stone-100" aria-label="Back to matches">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-extrabold text-stone-900">Match Hub</h1>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {[
          ['profile', 'Profile', User],
          ['quiz', 'Quiz', HelpCircle],
          ['activities', 'Activities', CalendarDays]
        ].map(([key, label, Icon]) => (
          <button key={key} type="button" onClick={() => setSection(key)} className={`py-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 ${section === key ? 'bg-coy-coral text-white' : 'bg-stone-100 text-stone-600'}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {section === 'profile' && (
        <div className="p-4">
          {profile ? (
            <div className="rounded-3xl overflow-hidden bg-stone-900 text-white">
              <img src={profile.photos?.[0]} alt={profile.name} className="w-full h-64 object-cover" />
              <div className="p-4"><h2 className="text-xl font-black">{profile.name}, {profile.age}</h2><p className="text-xs text-stone-300 mt-1">{profile.bio}</p></div>
            </div>
          ) : <p className="text-sm text-stone-500 p-4">Loading profile...</p>}
        </div>
      )}

      {section === 'quiz' && (
        <div className="mx-3 rounded-3xl bg-white border border-stone-200 overflow-hidden">
          {quizLoading ? <p className="p-6 text-sm text-stone-500">Loading quiz...</p> : quiz.status === 'reveal' ? (
            reveal ? <QuizReveal reveal={reveal} onToast={onToast} /> : <button type="button" onClick={openReveal} className="m-4 w-[calc(100%-32px)] py-3 rounded-2xl bg-coy-coral text-white text-sm font-extrabold">Reveal our answers</button>
          ) : quiz.status === 'available' ? (
            <QuizCard matchId={matchId} questions={quiz.questions} onComplete={reloadQuiz} onSkip={async () => { await api.skipQuiz(matchId); reloadQuiz(); }} onError={message => onToast(message, 'error')} />
          ) : <QuizWaiting expired={quiz.status === 'expired'} />}
        </div>
      )}

      {section === 'activities' && (
        <div className="p-3 space-y-3">
          {activitiesLoading ? <p className="text-sm text-stone-500 p-3">Loading ideas...</p> : cards.map(card => (
            <ActivityCard
              key={card.id}
              card={card}
              onRespond={async (activityId, response) => {
                if (card.mutual && response === 'interested') {
                  await copyText(`Want to make “${card.title}” happen?`);
                  return;
                }
                await respondActivity(activityId, response);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
