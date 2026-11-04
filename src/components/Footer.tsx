import React, { useState } from 'react';
import { Mail, MapPin, Sparkles, Shield, Heart, Star, Flag, Smartphone, Download } from 'lucide-react';
import { StarRatingModal } from './StarRatingModal';
import { ComplainModal } from './ComplainModal';
import { ApkDownloadModal } from './ApkDownloadModal';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [complainModalOpen, setComplainModalOpen] = useState(false);
  const [apkModalOpen, setApkModalOpen] = useState(false);
  return (
    <footer className="bg-[#070b16] border-t border-slate-800/80 text-slate-400 text-xs mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E11D48] flex items-center justify-center text-white font-bold text-sm">
                BG
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                Bio<span className="text-[#E11D48]">Genius</span> AI
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Empowering 10,000+ creators worldwide with human-like, SEO-optimized bios for Instagram, TikTok, YouTube, and LinkedIn in 17 languages.
            </p>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Thakot, Battagram, Pakistan</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-[#FACC15]" />
                <a href="mailto:baithakotbattagram1@gmail.com" className="hover:text-white underline">
                  baithakotbattagram1@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href="/app-release.apk"
                download="BioGeniusAI.apk"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white font-extrabold text-xs shadow-lg shadow-[#E11D48]/30 transition active:scale-95 cursor-pointer"
                title="Download BioGeniusAI.apk directly"
              >
                <Download className="w-4 h-4 text-[#FACC15]" />
                <span>Download APK</span>
              </a>
              <button
                type="button"
                onClick={() => setApkModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition cursor-pointer"
                title="PWA Install & Play Store Guide"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>App Info</span>
              </button>
            </div>
          </div>

          {/* Quick Product Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
                  className="hover:text-white transition"
                >
                  AI Bio Generator
                </a>
              </li>
              <li>
                <a
                  href="/explore"
                  onClick={(e) => { e.preventDefault(); onNavigate('/explore'); }}
                  className="hover:text-white transition"
                >
                  Explore 1000+ Bios
                </a>
              </li>
              <li>
                <a
                  href="/trending"
                  onClick={(e) => { e.preventDefault(); onNavigate('/trending'); }}
                  className="hover:text-white transition"
                >
                  Trending Bios Chart
                </a>
              </li>
              <li>
                <a
                  href="/premium"
                  onClick={(e) => { e.preventDefault(); onNavigate('/premium'); }}
                  className="hover:text-[#FACC15] transition font-semibold"
                >
                  Lifetime Premium (Rs. 299)
                </a>
              </li>
              <li>
                <a
                  href="/my-bios"
                  onClick={(e) => { e.preventDefault(); onNavigate('/my-bios'); }}
                  className="hover:text-white transition"
                >
                  My Saved Bios
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setApkModalOpen(true)}
                  className="hover:text-[#FACC15] transition flex items-center gap-1.5 text-slate-300 font-bold cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>Download APK (Android)</span>
                </button>
              </li>
              <li>
                <a
                  href="/app-release.apk"
                  download="BioGeniusAI.apk"
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>Direct Download .apk file</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Programmatic Guides */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Trending Slugs</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/bio/best-instagram-bio-for-boys"
                  onClick={(e) => { e.preventDefault(); onNavigate('/bio/best-instagram-bio-for-boys'); }}
                  className="hover:text-white transition"
                >
                  Best Instagram Bio for Boys
                </a>
              </li>
              <li>
                <a
                  href="/bio/attitude-bio-for-girls"
                  onClick={(e) => { e.preventDefault(); onNavigate('/bio/attitude-bio-for-girls'); }}
                  className="hover:text-white transition"
                >
                  Attitude Bio for Girls
                </a>
              </li>
              <li>
                <a
                  href="/bio/motivational-bio-for-linkedin"
                  onClick={(e) => { e.preventDefault(); onNavigate('/bio/motivational-bio-for-linkedin'); }}
                  className="hover:text-white transition"
                >
                  Motivational Bio for LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="/bio/gaming-bio-for-tiktok"
                  onClick={(e) => { e.preventDefault(); onNavigate('/bio/gaming-bio-for-tiktok'); }}
                  className="hover:text-white transition"
                >
                  Gaming Bio for TikTok
                </a>
              </li>
              <li>
                <a
                  href="/bio/tech-creator-bio-for-youtube"
                  onClick={(e) => { e.preventDefault(); onNavigate('/bio/tech-creator-bio-for-youtube'); }}
                  className="hover:text-white transition"
                >
                  Tech Creator Bio for YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Company &amp; Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  onClick={(e) => { e.preventDefault(); onNavigate('/about'); }}
                  className="hover:text-white transition"
                >
                  About Amir Sohail &amp; Mission
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}
                  className="hover:text-white transition"
                >
                  Contact &amp; 24h Support
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => { e.preventDefault(); onNavigate('/privacy'); }}
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => { e.preventDefault(); onNavigate('/terms'); }}
                  className="hover:text-white transition"
                >
                  Terms and Service
                </a>
              </li>
              <li>
                <button
                  onClick={() => setRateModalOpen(true)}
                  className="hover:text-[#FACC15] transition flex items-center gap-1 font-semibold text-slate-300"
                >
                  <Star className="w-3.5 h-3.5 fill-[#FACC15] text-[#FACC15]" />
                  <span>Rate Us (5-Star Review)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setComplainModalOpen(true)}
                  className="hover:text-rose-400 transition flex items-center gap-1 font-medium text-slate-400"
                >
                  <Flag className="w-3.5 h-3.5 text-rose-500" />
                  <span>Report an Issue / Complaint</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Security & Core Values Line */}
        <div className="py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>98% Human Cadence Calibration • EasyPaisa Till Verified • App Check Protected</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[#E11D48] fill-[#E11D48]" />
            <span>by Amir Sohail in Thakot, Battagram</span>
          </div>
        </div>

        {/* MANDATORY FOOTER LINE */}
        <div className="pt-4 border-t border-slate-800/60 text-center text-[11px] text-slate-400 font-medium">
          For any queries, contact: <a href="mailto:baithakotbattagram1@gmail.com" className="text-slate-300 hover:text-white underline">baithakotbattagram1@gmail.com</a> | Last updated: October 2026
        </div>
      </div>

      {/* 5-Star Rating Modal */}
      <StarRatingModal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
      />

      {/* Complain Modal */}
      <ComplainModal
        isOpen={complainModalOpen}
        onClose={() => setComplainModalOpen(false)}
        initialType="Other"
      />

      {/* APK Download Modal */}
      <ApkDownloadModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />
    </footer>
  );
};
