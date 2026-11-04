import React from 'react';
import { getAppConfig } from '../lib/storage';
import { Sparkles } from 'lucide-react';

interface AdSlotProps {
  slotId?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotId = 'default-slot', className = '' }) => {
  const config = getAppConfig();

  if (!config.showAds) {
    return null;
  }

  return (
    <div
      className={`w-full min-h-[120px] rounded-xl bg-gradient-to-r from-[#10172d] via-[#141f3d] to-[#0d1428] border border-dashed border-[#E11D48]/30 p-4 flex flex-col items-center justify-center text-center my-6 relative overflow-hidden group ${className}`}
      data-ad-slot={slotId}
    >
      <div className="absolute top-2 right-3 text-[10px] tracking-wider uppercase text-slate-500 font-semibold">
        Sponsor / Ad Space
      </div>

      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
        <span className="text-xs font-bold text-[#FACC15] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Boost Your Social Growth
        </span>
      </div>

      <p className="text-xs text-slate-300 max-w-md">
        Unlock high-converting hooks, viral caption packs, and 100K+ reach strategies with Bio Genius AI Premium.
      </p>

      <a
        href="/premium"
        onClick={(e) => {
          e.preventDefault();
          window.history.pushState({}, '', '/premium');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
        className="mt-2.5 inline-flex items-center gap-1 px-3.5 py-1 rounded-lg bg-[#E11D48] hover:bg-[#be123c] text-white text-xs font-semibold transition-all shadow-sm"
      >
        Upgrade to Lifetime Premium — Rs. 299 Only
      </a>
    </div>
  );
};
