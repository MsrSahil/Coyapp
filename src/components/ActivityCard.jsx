import React from 'react';
import {
  Coffee, Sunrise, Puzzle, Utensils, Camera, Store, Mountain,
  Music, Mic2, ShoppingBasket, Trees, Landmark, Footprints
} from 'lucide-react';

const icons = { Coffee, Sunrise, Puzzle, Utensils, Camera, Store, Mountain, Music, Mic2, ShoppingBasket, Trees, Landmark, Footprints };

export default function ActivityCard({ card, onRespond }) {
  const Icon = icons[card.icon] || Coffee;
  if (card.mutual) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center"><Icon className="w-5 h-5 text-emerald-700" /></div>
          <div><p className="text-xs font-black text-emerald-700">You both want this!</p><h3 className="text-sm font-extrabold text-stone-900">{card.title}</h3></div>
        </div>
        <button type="button" onClick={() => onRespond(card.id, 'interested')} className="w-full mt-2 py-2.5 rounded-2xl bg-emerald-700 text-white text-xs font-extrabold">
          Want to make this happen?
        </button>
      </div>
    );
  }
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-coy-subtle flex items-center justify-center"><Icon className="w-5 h-5 text-coy-coral" /></div>
        <div><h3 className="text-sm font-extrabold text-stone-900">{card.title}</h3><p className="text-xs text-stone-500 leading-relaxed">{card.description}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => onRespond(card.id, 'interested')} className="py-2.5 rounded-2xl bg-coy-coral text-white text-xs font-extrabold focus:ring-2 focus:ring-coy-coral">
          I’d do this
        </button>
        <button type="button" onClick={() => onRespond(card.id, 'not_now')} className="py-2.5 rounded-2xl bg-stone-100 text-stone-600 text-xs font-bold focus:ring-2 focus:ring-stone-400">
          Not now
        </button>
      </div>
    </div>
  );
}
