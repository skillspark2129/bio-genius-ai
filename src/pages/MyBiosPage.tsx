import React, { useState, useEffect } from 'react';
import { getCurrentUser, getAllBios, updateUser, deleteBio } from '../lib/storage';
import { BioCard } from '../components/BioCard';
import { BioItem } from '../types';
import { Heart, Trash2, Download, Search, Sparkles, User as UserIcon } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

interface MyBiosPageProps {
  onNavigate: (path: string) => void;
}

export const MyBiosPage: React.FC<MyBiosPageProps> = ({ onNavigate }) => {
  const { appUser } = useAuth();
  const [savedBios, setSavedBios] = useState<BioItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'My Saved Bios | Bio Genius AI';

    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      metaTag.setAttribute('content', 'noindex, nofollow');
      document.head.appendChild(metaTag);
    } else {
      metaTag.setAttribute('content', 'noindex, nofollow');
    }

    const all = getAllBios();
    const saved = all.filter((b) => appUser.savedBioIds?.includes(b.id));
    setSavedBios(saved);

    return () => {
      if (metaTag) {
        metaTag.setAttribute('content', 'index, follow');
      }
    };
  }, [appUser.savedBioIds]);

  const handleDeleteSaved = (bioId: string) => {
    const updated = {
      ...appUser,
      savedBioIds: appUser.savedBioIds.filter((id) => id !== bioId)
    };
    updateUser(updated);
    setSavedBios((prev) => prev.filter((b) => b.id !== bioId));
  };

  const handleExportTxt = () => {
    if (savedBios.length === 0) return;
    const content = savedBios
      .map((b, i) => `--- Bio #${i + 1} (${b.platform.toUpperCase()} - ${b.tone}) ---\n${b.text}\n`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-saved-bios-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filtered = savedBios.filter(
    (b) =>
      searchTerm === '' ||
      b.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              My Saved Bios
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {savedBios.length} Saved
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Personal vault for your favorite bios, ready to copy and use across your social accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedBios.length > 0 && (
            <button
              onClick={handleExportTxt}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All (.txt)</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-bold text-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>Generate New Bio</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {savedBios.length > 0 && (
        <div className="mb-6 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved bios..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141d33] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
          />
        </div>
      )}

      {/* Grid of Saved Bios */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((bio) => (
            <BioCard
              key={bio.id}
              bio={bio}
              showDelete={true}
              onDelete={handleDeleteSaved}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-[#0f172a] border border-slate-800 p-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-[#E11D48] flex items-center justify-center mx-auto mb-4 border border-[#E11D48]/20">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Bios Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Whenever you generate or browse bios, click the heart icon on any card to store it in your personal dashboard.
          </p>
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#be123c] text-white text-xs font-bold transition shadow-lg"
          >
            Go to Generator &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
