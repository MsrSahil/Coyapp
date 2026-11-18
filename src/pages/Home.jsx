import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-coy-charcoal">
      <div className="w-16 h-16 rounded-3xl bg-coy-subtle border border-stone-200 flex items-center justify-center mb-5 shadow-sm">
        <Sparkles className="w-8 h-8 text-coy-coral/80" />
      </div>

      <span className="text-[11px] font-black uppercase tracking-widest text-stone-400 mb-1">
        Coy Main Experience
      </span>
      <h1 className="text-3xl font-extrabold text-stone-900 mb-2">
        Home
      </h1>
      <p className="text-xs text-stone-500 max-w-xs leading-relaxed mb-6 font-normal">
        This is the placeholder Home tab alongside Coy's existing experience. All discovery and swipe functionality lives in the Discover tab.
      </p>

      <button
        onClick={() => navigate('/discover')}
        className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-coy-coral to-rose-500 hover:from-coy-coralHover hover:to-rose-600 text-white font-extrabold text-xs shadow-button flex items-center gap-2 transition-transform active:scale-95"
      >
        <Compass className="w-4 h-4" />
        <span>Open Discover Tab</span>
      </button>
    </div>
  );
}
