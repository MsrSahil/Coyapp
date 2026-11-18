import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Heart } from 'lucide-react';

export default function BottomNavigation({ matchesCount = 0 }) {
  const tabs = [
    { path: '/', label: 'Home', icon: Home, end: true },
    { path: '/discover', label: 'Discover', icon: Compass },
    { path: '/matches', label: 'Matches', icon: Heart, badge: matchesCount },
  ];

  return (
    <nav className="border-t border-stone-200/80 bg-white/95 backdrop-blur-xl px-6 py-2 pb-6 sm:pb-3 flex items-center justify-around z-40 text-stone-600">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all ${
                isActive
                  ? 'text-coy-coral font-extrabold'
                  : 'text-stone-400 hover:text-stone-700 font-semibold'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-transform ${
                      isActive ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                    }`}
                  />
                  {tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-coy-coral text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] tracking-tight">
                  {tab.label}
                </span>

                {/* Active Indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-coy-coral mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
