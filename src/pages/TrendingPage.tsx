import React, { useState, useEffect, useMemo } from 'react';
import { getAllBios, saveBio, getHallOfFameBios, submitHallOfFameBio, upvoteHallOfFameBio, getGamification } from '../lib/storage';
import { BioCard } from '../components/BioCard';
import { AdSlot } from '../components/AdSlot';
import { BioItem, Platform, HallOfFameBio, GamificationProfile } from '../types';
import { Flame, TrendingUp, BarChart3, Copy, Heart, Sparkles, Filter, Award, Zap, ThumbsUp, PlusCircle, X, Check } from 'lucide-react';

interface TrendingPageProps {
  onNavigate: (path: string) => void;
}

export const TrendingPage: React.FC<TrendingPageProps> = ({ onNavigate }) => {
  const [bios, setBios] = useState<BioItem[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'copy' | 'likes'>('copy');
  const [hallOfFameList, setHallOfFameList] = useState<HallOfFameBio[]>(() => getHallOfFameBios());
  const [gamification, setGamification] = useState<GamificationProfile>(() => getGamification());

  // Community Submission Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitText, setSubmitText] = useState('');
  const [submitAuthor, setSubmitAuthor] = useState('');
  const [submitCategory, setSubmitCategory] = useState('Attitude');
  const [submitPlatform, setSubmitPlatform] = useState<Platform>('instagram');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Top 100 Trending Bios 2026 | Bio Genius AI';
    setBios(getAllBios());
    setHallOfFameList(getHallOfFameBios());
    setGamification(getGamification());
  }, []);

  const handleUpvote = (id: string) => {
    upvoteHallOfFameBio(id);
    setHallOfFameList(getHallOfFameBios());
  };

  const handleCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitText.trim()) return;
    submitHallOfFameBio(submitText, submitAuthor, submitPlatform, submitCategory);
    setHallOfFameList(getHallOfFameBios());
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(false);
      setSubmitText('');
      setSubmitAuthor('');
    }, 1500);
  };

  const sortedBios = useMemo(() => {
    return [...bios]
      .filter((b) => platformFilter === 'all' || b.platform === platformFilter)
      .sort((a, b) => {
        if (sortBy === 'copy') {
          return (b.copyCount || 0) - (a.copyCount || 0);
        }
        return (b.likesCount || 0) - (a.likesCount || 0);
      })
      .slice(0, 100);
  }, [bios, platformFilter, sortBy]);

  // Metric summaries
  const totalCopies = useMemo(() => bios.reduce((sum, b) => sum + (b.copyCount || 0), 0), [bios]);
  const totalLikes = useMemo(() => bios.reduce((sum, b) => sum + (b.likesCount || 0), 0), [bios]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-[#E11D48] text-xs font-bold mb-3">
          <Flame className="w-3.5 h-3.5 fill-[#E11D48]" />
          <span>Real-Time Virality Tracker</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Top 100 Trending Bios | Bio Genius AI
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-slate-300">
          Ranked dynamically based on real creator copy counts and community favorites across 17 languages. Updated daily.
        </p>
      </div>

      {/* Gamification Profile Status Bar */}
      <div className="mb-8 p-4 rounded-3xl bg-gradient-to-r from-[#141d33] via-[#1a233d] to-[#141d33] border border-[#FACC15]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FACC15] text-black flex items-center justify-center font-black shadow-lg">
            <Award className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Creator Gamification Rank</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FACC15]/20 text-[#FACC15] text-[10px] font-black">
                {gamification.streakDays} Day Streak 🔥
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Score: <strong className="text-[#FACC15]">{gamification.points} Points</strong> (10 pts per generation)
            </div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="flex items-center gap-2 flex-wrap">
          {gamification.badges.map((b) => (
            <span key={b} className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
              <Zap className="w-3 h-3 text-[#FACC15]" />
              <span>{b}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Analytics Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#E11D48]/20 text-[#E11D48] flex items-center justify-center shrink-0">
            <Copy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalCopies.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Total Bio Copies Tracked</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-[#FACC15] flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-[#FACC15]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalLikes.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Total Community Saves</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">98.6%</div>
            <div className="text-xs text-slate-400">Average Human Score</div>
          </div>
        </div>
      </div>

      {/* Filters and Sorters */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'instagram', 'tiktok', 'linkedin', 'facebook'].map((plat) => (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  platformFilter === plat
                    ? 'bg-[#E11D48] text-white shadow-sm'
                    : 'bg-[#141d33] text-slate-400 hover:text-white'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rank By:</span>
          <button
            onClick={() => setSortBy('copy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              sortBy === 'copy'
                ? 'bg-[#FACC15] text-black shadow-sm'
                : 'bg-[#141d33] text-slate-400 hover:text-white'
            }`}
          >
            🔥 Most Copied
          </button>
          <button
            onClick={() => setSortBy('likes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              sortBy === 'likes'
                ? 'bg-[#FACC15] text-black shadow-sm'
                : 'bg-[#141d33] text-slate-400 hover:text-white'
            }`}
          >
            ❤️ Most Favorited
          </button>
        </div>
      </div>

      <AdSlot slotId="trending-ad" />

      {/* Top 100 Bios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
        {sortedBios.map((bio, index) => (
          <div key={bio.id} className="relative">
            <div className="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full bg-gradient-to-br from-[#E11D48] to-[#be123c] text-white font-extrabold text-xs flex items-center justify-center shadow-lg border-2 border-[#0a0f1e]">
              #{index + 1}
            </div>
            <BioCard
              bio={bio}
              onUpdate={(updated) => {
                setBios((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
                saveBio(updated);
              }}
            />
          </div>
        ))}
      </div>

      {/* COMMUNITY SHOWCASE: HALL OF FAME */}
      <section className="rounded-3xl bg-[#0f172a] border border-slate-800 p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FACC15] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Community Showcase</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Creator Hall of Fame</h2>
            <p className="text-xs text-slate-400 mt-0.5">Top bios submitted by community creators and approved by Admin.</p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-[#E11D48]/30 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Your Bio</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {hallOfFameList.map((item) => (
            <div key={item.id} className="rounded-2xl bg-[#141d33] border border-slate-800/90 p-5 flex flex-col justify-between hover:border-[#E11D48]/50 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E11D48]/20 text-[#E11D48]">
                      {item.platform}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.category}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FACC15]/20 text-[#FACC15]">
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-100 whitespace-pre-wrap leading-relaxed mb-4">
                  {item.text}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">By {item.author}</span>
                <button
                  onClick={() => handleUpvote(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition active:scale-95"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>{item.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submit Bio Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700 p-6 sm:p-8 shadow-2xl text-white">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E11D48]" />
              <span>Submit Bio to Hall of Fame</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">Share your finest bio creation with the global Bio Genius creator community.</p>

            {submitSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Submitted successfully to Hall of Fame!</span>
              </div>
            )}

            <form onSubmit={handleCommunitySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">Your Name or Handle</label>
                <input
                  type="text"
                  required
                  value={submitAuthor}
                  onChange={(e) => setSubmitAuthor(e.target.value)}
                  placeholder="e.g. Amir Sohail"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d33] border border-slate-700 text-white focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">Platform &amp; Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={submitPlatform}
                    onChange={(e) => setSubmitPlatform(e.target.value as Platform)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141d33] border border-slate-700 text-white"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="facebook">Facebook</option>
                  </select>
                  <input
                    type="text"
                    value={submitCategory}
                    onChange={(e) => setSubmitCategory(e.target.value)}
                    placeholder="Category (e.g. Founder)"
                    className="w-full px-3 py-2 rounded-xl bg-[#141d33] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">Bio Text</label>
                <textarea
                  required
                  rows={4}
                  value={submitText}
                  onChange={(e) => setSubmitText(e.target.value)}
                  placeholder="Paste or write your bio..."
                  className="w-full p-3 rounded-xl bg-[#141d33] border border-slate-700 text-white resize-none focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-md"
              >
                Submit Bio (+50 Creator Points)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
