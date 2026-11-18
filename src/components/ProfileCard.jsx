import React, { useState } from 'react';
import { MapPin, GraduationCap, Briefcase, CheckCircle2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import CompatibilityBadge from './CompatibilityBadge';

export default function ProfileCard({ profile, onOpenDetail, compact = false }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = profile.photos && profile.photos.length > 0
    ? profile.photos
    : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'];

  const nextPhoto = (e) => {
    e.stopPropagation();
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(prev => prev + 1);
    } else {
      setPhotoIndex(0);
    }
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    if (photoIndex > 0) {
      setPhotoIndex(prev => prev - 1);
    }
  };

  const currentPrompt = profile.prompts && profile.prompts.length > 0 ? profile.prompts[0] : null;

  return (
    <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-coy-charcoal shadow-card select-none">
      {/* Background Image Carousel */}
      <div className="relative w-full h-full">
        <img
          src={photos[photoIndex]}
          alt={profile.name}
          className="w-full h-full object-cover object-center pointer-events-none transition-opacity duration-200"
          loading="eager"
        />

        {/* Story Progress Indicators for multiple photos */}
        {photos.length > 1 && (
          <div className="absolute top-3.5 inset-x-4 flex gap-1.5 z-20">
            {photos.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx === photoIndex ? 'bg-white shadow' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Tap zones for advancing photos */}
        <div
          onClick={prevPhoto}
          className="absolute top-12 left-0 w-1/3 h-2/3 z-10 cursor-pointer"
        />
        <div
          onClick={nextPhoto}
          className="absolute top-12 right-0 w-1/3 h-2/3 z-10 cursor-pointer"
        />

        {/* Cinematic Gradient Overlays (Cream/Charcoal lighting) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151312] via-[#151312]/40 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-7 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
          <CompatibilityBadge
            score={profile.compatibility}
            reasons={profile.compatibilityReasons}
          />

          {profile.isVerified && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md text-[11px] font-bold text-sky-700 shadow-sm border border-white/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 fill-sky-600/20" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Bottom Details Content */}
        <div className="absolute bottom-0 inset-x-0 p-5 pt-8 z-20 pointer-events-auto flex flex-col gap-2.5 text-white">
          {/* Header Name & Age */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm font-sans">
                {profile.name}
              </h2>
              <span className="text-xl sm:text-2xl font-semibold text-rose-200/90 font-sans">
                {profile.age}
              </span>
            </div>

            {onOpenDetail && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(profile);
                }}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-90 text-white"
                title="View Full Profile Details"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Meta Information (Profession, College, City) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-200 font-medium">
            {profile.profession && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-rose-300" />
                <span className="truncate max-w-[160px]">{profile.profession}</span>
              </span>
            )}
            {profile.college && (
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-rose-300" />
                <span className="truncate max-w-[150px]">{profile.college}</span>
              </span>
            )}
            {profile.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-300" />
                <span>{profile.city}</span>
              </span>
            )}
          </div>

          {/* Bio Preview */}
          {profile.bio && (
            <p className="text-xs sm:text-sm text-stone-200/95 leading-relaxed line-clamp-2 font-normal drop-shadow-sm">
              {profile.bio}
            </p>
          )}

          {/* Featured Profile Prompt (Hinge-style) */}
          {currentPrompt && (
            <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300 block mb-0.5">
                {currentPrompt.question}
              </span>
              <p className="text-xs text-white font-medium leading-snug">
                "{currentPrompt.answer}"
              </p>
            </div>
          )}

          {/* Interests Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {profile.interests?.slice(0, 4).map((interest, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/20 backdrop-blur-md text-white border border-white/10 shadow-sm"
              >
                {interest}
              </span>
            ))}
            {profile.interests?.length > 4 && (
              <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-white/10 backdrop-blur-md text-stone-300">
                +{profile.interests.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
