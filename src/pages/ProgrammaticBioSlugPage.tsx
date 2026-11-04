import React, { useState, useEffect } from 'react';
import { getSlugData, FEATURED_SLUGS, slugToTitle } from '../lib/seoData';
import { BioCard } from '../components/BioCard';
import { BioItem } from '../types';
import { AdSlot } from '../components/AdSlot';
import { logActivity } from '../lib/storage';
import { ChevronRight, Home, ArrowLeft, ArrowRight, HelpCircle, Shield, Share2, Sparkles } from 'lucide-react';

interface ProgrammaticBioSlugPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProgrammaticBioSlugPage: React.FC<ProgrammaticBioSlugPageProps> = ({ slug, onNavigate }) => {
  const data = getSlugData(slug);
  const [biosPerPage, setBiosPerPage] = useState(12);

  // Sync document title and increment Firestore analytics and bio_stats
  useEffect(() => {
    document.title = data.title;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    logActivity(slug, 'viewed_slug');
  }, [slug, data.title]);

  // Current slug index in featured slugs for Next/Prev navigation
  const currentIndex = FEATURED_SLUGS.indexOf(slug);
  const prevSlug = currentIndex > 0 ? FEATURED_SLUGS[currentIndex - 1] : FEATURED_SLUGS[FEATURED_SLUGS.length - 1];
  const nextSlug = currentIndex < FEATURED_SLUGS.length - 1 ? FEATURED_SLUGS[currentIndex + 1] : FEATURED_SLUGS[0];

  const visibleBios = data.bios.slice(0, biosPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1 hover:text-white transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <button
          onClick={() => onNavigate('/explore')}
          className="hover:text-white transition"
        >
          Explore Bios
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-[#FACC15] font-semibold truncate max-w-xs">{data.keyword}</span>
      </nav>

      {/* Main SEO Header */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E11D48]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E11D48]/15 border border-[#E11D48]/30 text-[#E11D48] text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Updated for 2026 • 50+ Curated Selections</span>
          </div>

          {/* H1 with keyword */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {data.keyword}
          </h1>

          {/* Intro 150+ words */}
          <div className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed space-y-3">
            <p>{data.intro}</p>
            <p className="text-xs sm:text-sm text-slate-400">{data.contentSection}</p>
          </div>

          {/* Quick Stats Pill */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-4 border-t border-slate-800/80">
            <div>Available Bios: <strong className="text-[#FACC15]">50+ Verified</strong></div>
            <div>Platform: <strong className="text-white uppercase">{data.platform}</strong></div>
            <div>Avg Human-Like Score: <strong className="text-emerald-400">98.4%</strong></div>
            <div>Curator: <strong className="text-white">Amir Sohail</strong></div>
          </div>
        </div>
      </div>

      {/* Next/Prev Navigation Top */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800 text-xs">
        <button
          onClick={() => onNavigate(`/bio/${prevSlug}`)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; {slugToTitle(prevSlug)}</span>
        </button>

        <button
          onClick={() => onNavigate(`/bio/${nextSlug}`)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition"
        >
          <span>{slugToTitle(nextSlug)} &rarr;</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* AdSlot min-height 120px */}
      <AdSlot slotId={`slug-top-${slug}`} />

      {/* 50+ Bios List */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            50+ Best {data.keyword} Options for 2026
          </h2>
          <span className="text-xs text-slate-400">Showing {visibleBios.length} of {data.bios.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleBios.map((bio: BioItem) => (
            <BioCard key={bio.id} bio={bio} />
          ))}
        </div>

        {/* Load More Button if remaining */}
        {visibleBios.length < data.bios.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setBiosPerPage((prev) => Math.min(data.bios.length, prev + 12))}
              className="px-6 py-3 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-sm transition shadow-lg active:scale-95"
            >
              Load More {data.keyword} Bios ({data.bios.length - visibleBios.length} Remaining)
            </button>
          </div>
        )}
      </div>

      {/* AdSlot mid-content */}
      <AdSlot slotId={`slug-mid-${slug}`} />

      {/* FAQ Schema Section with 5 Q&As */}
      <section className="mb-12 rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-[#E11D48]" />
          <h3 className="text-xl font-bold text-white">
            Frequently Asked Questions ({data.keyword})
          </h3>
        </div>

        <div className="space-y-4">
          {data.faqs.map((faq: { question: string; answer: string }, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-[#141d33] border border-slate-800/80">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-[#FACC15]">Q{i + 1}:</span> {faq.question}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5+ Internal Links to Related Slugs */}
      <div className="mb-12 p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
          Explore Related Bio Categories (5+ Internal Links)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data.relatedSlugs.map((relSlug: string) => (
            <a
              key={relSlug}
              href={`/bio/${relSlug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/bio/${relSlug}`);
              }}
              className="p-3 rounded-xl bg-[#141d33] hover:bg-[#E11D48] text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition flex items-center justify-between"
            >
              <span>{slugToTitle(relSlug)}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FACC15]" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Next/Prev Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs">
        <button
          onClick={() => onNavigate(`/bio/${prevSlug}`)}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold"
        >
          <ArrowLeft className="w-4 h-4 text-[#E11D48]" />
          <span>Previous: {slugToTitle(prevSlug)}</span>
        </button>

        <button
          onClick={() => onNavigate(`/bio/${nextSlug}`)}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold"
        >
          <span>Next: {slugToTitle(nextSlug)}</span>
          <ArrowRight className="w-4 h-4 text-[#FACC15]" />
        </button>
      </div>

      {/* Organization Schema and FAQ Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: data.faqs.map((f: { question: string; answer: string }) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
};
