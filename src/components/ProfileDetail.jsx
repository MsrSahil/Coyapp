import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, GraduationCap, Briefcase, CheckCircle2, Heart, Star, Compass, Sparkles } from 'lucide-react';
import CompatibilityBadge from './CompatibilityBadge';

export default function ProfileDetail({ profile, onClose, onLike, onPass, onSuperLike }) {
  if (!profile) return null;

  const photos = profile.photos && profile.photos.length > 0
    ? profile.photos
    : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-hidden"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg h-[92vh] sm:h-[85vh] rounded-t-[36px] sm:rounded-[36px] bg-white border border-stone-200 shadow-2xl flex flex-col overflow-hidden text-coy-charcoal"
        >
          {/* Header Close Bar */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all active:scale-95 shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Profile Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            {/* Primary Hero Photo */}
            <div className="relative w-full h-96 sm:h-[440px]">
              <img
                src={photos[0]}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-5 inset-x-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-extrabold tracking-tight">
                    {profile.name}, {profile.age}
                  </h1>
                  {profile.isVerified && (
                    <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-200">
                  {profile.profession && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {profile.profession}
                    </span>
                  )}
                  {profile.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {profile.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content Details */}
            <div className="p-6 space-y-6">
              {/* Compatibility Highlights */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Smart Discovery Synergy
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-white">
                    {profile.compatibility}% Match
                  </span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1">
                  {profile.compatibilityReasons?.map((reason, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bio Section */}
              {profile.bio && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    About Me
                  </h3>
                  <p className="text-sm text-stone-800 leading-relaxed font-normal">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Interests Tags */}
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Interests & Passions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hinge-style Prompts */}
              {profile.prompts && profile.prompts.length > 0 && (
                <div className="space-y-4">
                  {profile.prompts.map((prompt, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-3xl bg-coy-subtle border border-stone-200 text-left"
                    >
                      <span className="text-xs font-extrabold uppercase tracking-wider text-coy-coral block mb-1.5">
                        {prompt.question}
                      </span>
                      <p className="text-sm font-semibold text-stone-900 leading-relaxed font-serif italic text-base">
                        "{prompt.answer}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Second Photo if available */}
              {photos[1] && (
                <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-sm">
                  <img
                    src={photos[1]}
                    alt={`${profile.name} secondary`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Relationship Intent / Preferences */}
              {profile.preferences?.lookingFor && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-coy-coral">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Looking For
                    </span>
                    <span className="text-xs font-bold text-stone-800">
                      {profile.preferences.lookingFor}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Floating Action Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 border-t border-stone-100 bg-white/95 backdrop-blur-md flex items-center justify-center gap-6 z-30">
            <button
              onClick={() => {
                onClose();
                onPass?.(profile);
              }}
              className="w-13 h-13 rounded-full bg-stone-100 hover:bg-rose-50 text-rose-500 border border-stone-200 flex items-center justify-center transition-transform active:scale-90"
              title="Pass"
            >
              <X className="w-6 h-6 stroke-[2.6]" />
            </button>

            <button
              onClick={() => {
                onClose();
                onSuperLike?.(profile);
              }}
              className="w-12 h-12 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-500 border border-amber-200 flex items-center justify-center transition-transform active:scale-90"
              title="Super Like"
            >
              <Star className="w-5 h-5 fill-amber-400" />
            </button>

            <button
              onClick={() => {
                onClose();
                onLike?.(profile);
              }}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-coy-coral to-rose-500 text-white flex items-center justify-center transition-transform active:scale-90 shadow-button"
              title="Like"
            >
              <Heart className="w-6 h-6 fill-white" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
