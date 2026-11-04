import React, { useState, useMemo, useEffect } from 'react';
import { BioCard } from '../components/BioCard';
import { AdSlot } from '../components/AdSlot';
import { getAllBios, saveBio, CREATOR_CASE_STUDIES } from '../lib/storage';
import { FEATURED_SLUGS, slugToTitle } from '../lib/seoData';
import { BioItem, Platform, Tone } from '../types';
import { Search, Filter, Sparkles, Flame, ArrowRight, TrendingUp, Star, Award, CheckCircle } from 'lucide-react';

interface ExplorePageProps {
  onNavigate: (path: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate }) => {
  const [bios, setBios] = useState<BioItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [toneFilter, setToneFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    document.title = 'Explore 1000+ Trending Bios | Bio Genius AI';
    setBios(getAllBios());
  }, []);

  const filteredBios = useMemo(() => {
    return bios.filter((bio) => {
      const matchSearch =
        searchTerm === '' ||
        bio.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bio.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchPlatform = platformFilter === 'all' || bio.platform === platformFilter;
      const matchTone = toneFilter === 'all' || bio.tone === toneFilter;
      return matchSearch && matchPlatform && matchTone;
    });
  }, [bios, searchTerm, platformFilter, toneFilter]);

  const totalPages = Math.ceil(filteredBios.length / itemsPerPage) || 1;
  const paginatedBios = filteredBios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Title & 300+ Word Intro */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E11D48]/15 border border-[#E11D48]/30 text-[#E11D48] text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Creator Vault • Updated Daily</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore 1000+ Trending Bios | Bio Genius AI
        </h1>
        <div className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed text-left bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
          <p>
            Welcome to the comprehensive, real-time repository of over 1000+ viral, aesthetic, and industry-specific bios curated by Amir Sohail and the Bio Genius AI engineering team in Thakot, Battagram. Whether you are stepping onto Instagram as a fitness authority, cultivating an authentic voice on TikTok, commanding attention on LinkedIn as an executive leader, or optimizing your YouTube channel header, finding the exact combination of character limits and conversational charisma is crucial.
          </p>
          <p>
            Every single bio presented in our explore vault undergoes rigorous algorithmic validation: we evaluate natural sentence variation, authentic emoji harmony, readability metrics, and adherence to social search engine indexing criteria. You will notice clear character count benchmarks, instant one-click copying mechanisms, and direct internal routing to our dedicated programmatic guides. Explore our deep database below, apply your desired platform and tone filters, or jump straight into our high-converting topic hubs.
          </p>
        </div>
      </div>

      {/* Internal Linking to Programmatic SEO Slugs (/bio/[slug]) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#E11D48]" />
            <span>Featured Bio Collections (Programmatic SEO Hubs)</span>
          </h2>
          <span className="text-xs text-slate-400">1000+ Auto-Generated Pages</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FEATURED_SLUGS.map((slug) => (
            <a
              key={slug}
              href={`/bio/${slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/bio/${slug}`);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#141d33] hover:bg-[#E11D48] text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition shadow-xs flex items-center gap-1.5"
            >
              <span>{slugToTitle(slug)}</span>
              <ArrowRight className="w-3 h-3 text-[#FACC15]" />
            </a>
          ))}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 sm:p-5 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by keywords, aesthetics (e.g. minimalist, founder, gym, sarcastic)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141d33] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48] transition"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl bg-[#141d33] border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:border-[#E11D48]"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube (Legacy)</option>
          </select>

          {/* Tone Filter */}
          <select
            value={toneFilter}
            onChange={(e) => {
              setToneFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl bg-[#141d33] border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:border-[#E11D48]"
          >
            <option value="all">All Tones</option>
            <option value="basic">Basic</option>
            <option value="inspirational">Inspirational</option>
            <option value="business">Business</option>
            <option value="luxury">Luxury</option>
            <option value="sarcastic">Sarcastic</option>
            <option value="funny">Funny</option>
          </select>
        </div>
      </div>

      {/* AdSlot */}
      <AdSlot slotId="explore-ad-slot" />

      {/* Bios Grid */}
      {paginatedBios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {paginatedBios.map((bio) => (
            <BioCard
              key={bio.id}
              bio={bio}
              onUpdate={(updated) => {
                setBios((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
                saveBio(updated);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0f172a] rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">No bios found matching your filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setPlatformFilter('all');
              setToneFilter('all');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#be123c] transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3.5 py-2 rounded-lg bg-[#0f172a] border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-40 transition"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400 font-semibold px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3.5 py-2 rounded-lg bg-[#0f172a] border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* INSPIRATIONAL GALLERY: FEATURED CREATORS SUCCESS STORIES */}
      <section className="mt-16 pt-12 border-t border-slate-800">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#FACC15] uppercase tracking-wider px-3 py-1 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20">
            Real Proof &amp; Verified Case Studies
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            Featured Creators Success Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2">
            See how changing a generic bio into a Bio Genius AI high-cadence bio boosted profile clicks, followers, and deal flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREATOR_CASE_STUDIES.map((study) => (
            <div key={study.id} className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 flex flex-col justify-between shadow-xl hover:border-[#E11D48]/40 transition">
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <img src={study.avatar} alt={study.name} className="w-12 h-12 rounded-2xl object-cover border border-[#E11D48]" />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1">
                      <span>{study.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                    </h3>
                    <div className="text-xs text-slate-400">{study.handle} • {study.category}</div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-2xl bg-[#141d33] border border-slate-800/80 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Follower Growth</div>
                    <div className="text-xs font-black text-emerald-400 mt-0.5">{study.followerGrowth}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Clicks &amp; Deals</div>
                    <div className="text-xs font-black text-[#FACC15] mt-0.5">{study.engagementGrowth}</div>
                  </div>
                </div>

                {/* Before vs After */}
                <div className="space-y-3 mb-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">Before:</span>
                    <p className="italic">"{study.oldBio}"</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141d33] border border-emerald-500/30 text-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">With Bio Genius AI:</span>
                    <p className="whitespace-pre-wrap font-medium">{study.newBio}</p>
                  </div>
                </div>
              </div>

              {/* Testimonial Quote */}
              <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 italic">
                "{study.testimonial}"
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
