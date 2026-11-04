import React, { useState, useEffect } from 'react';
import { InstallPWA } from '../components/InstallPWA';
import { BioCard } from '../components/BioCard';
import { StarRatingModal } from '../components/StarRatingModal';
import { DailyLimitModal } from '../components/DailyLimitModal';
import { AdSlot } from '../components/AdSlot';
import { BioItem, Platform, Tone, BioTemplate } from '../types';
import { generateBio, SUPPORTED_LANGUAGES, checkGenerationQuota } from '../lib/ai';
import { getCurrentUser, getAllBios, saveBio, getGenerationCount, incrementGenerationCount, hasUserRated, getAverageRating, addGamificationPoints } from '../lib/storage';
import { Sparkles, Zap, Lock, Share2, Copy, Check, Users, ArrowRight, ShieldCheck, Flame, Award, LogIn, Star, Sliders, Wand2, X, ChevronRight, Info, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

import { useAuth } from '../context/AuthContext';
import { PLATFORMS_20 } from '../lib/platforms';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { appUser: user, firebaseUser, signInWithGoogle } = useAuth();
  const isGuest = user.email === 'guest@biogenius.ai' || !firebaseUser;

  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [tone, setTone] = useState<Tone>('inspirational');
  const [language, setLanguage] = useState<string>('English');
  const [template, setTemplate] = useState<BioTemplate>('aesthetic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BioItem[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI Persona & Tone Playground
  const [showToneSliders, setShowToneSliders] = useState(false);
  const [formality, setFormality] = useState(40);
  const [humor, setHumor] = useState(60);
  const [enthusiasm, setEnthusiasm] = useState(75);
  const [creativity, setCreativity] = useState(85);
  const [selectedPersona, setSelectedPersona] = useState<'Witty AI' | 'Professional AI' | 'Aesthetic Visionary' | 'High-Status / Executive'>('Aesthetic Visionary');

  // Step-by-Step Bio Builder Wizard
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardName, setWizardName] = useState('');
  const [wizardNiche, setWizardNiche] = useState('');
  const [wizardVibe, setWizardVibe] = useState('Attitude & Bold');
  const [wizardCta, setWizardCta] = useState('Link below');

  // User Onboarding Walkthrough Modal (First visit)
  const [showOnboardingModal, setShowOnboardingModal] = useState(() => {
    return localStorage.getItem('biogenius_onboarded') !== 'true';
  });
  const [onboardingStep, setOnboardingStep] = useState(1);

  const quota = checkGenerationQuota(user);

  // Load initial results from featured bios if none generated yet
  useEffect(() => {
    document.title = 'Bio Genius AI - #1 AI Bio Generator 2026 | Instagram, TikTok, LinkedIn & YouTube';
    const all = getAllBios();
    setResults(all.slice(0, 4));
  }, []);

  const handleGoogleSignInDirect = async () => {
    try {
      setErrorMsg(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in could not be completed.';
      setErrorMsg(msg);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Rule 1: Google Login required to use app
    if (isGuest) {
      try {
        await signInWithGoogle();
      } catch {
        setErrorMsg('Google login is required to generate bios. Please continue with Google.');
        return;
      }
    }

    // Rule 2 & 3: Check 20 free daily bios limit
    if (!quota.allowed && !user.unlimited && !user.isPremium && user.role !== 'admin') {
      setShowDailyLimitModal(true);
      return;
    }

    if (!prompt.trim()) {
      setErrorMsg('Please describe your name, niche, passion, or target audience.');
      return;
    }

    setLoading(true);
    try {
      const generated = await generateBio(
        prompt,
        tone,
        language,
        platform,
        user.isPremium || user.unlimited || user.role === 'admin',
        template
      );

      setResults(generated);
      // Save them in library
      generated.forEach((b) => saveBio(b));

      // Trigger celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }

      // Check if user has now exhausted their 20 free generations
      const updatedQuota = checkGenerationQuota(user);
      if (!updatedQuota.allowed && !user.isPremium && !user.unlimited && user.role !== 'admin') {
        setTimeout(() => {
          setShowDailyLimitModal(true);
        }, 1200);
      }

      // Check generation count for star rating modal (after 3 generations)
      const count = incrementGenerationCount();
      if (count >= 3 && !hasUserRated()) {
        setTimeout(() => {
          setShowRatingModal(true);
        }, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('Daily limit') || err.message.includes('limit reached')) {
          setShowDailyLimitModal(true);
        } else {
          setErrorMsg(err.message);
        }
      } else {
        setErrorMsg('An error occurred during bio generation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInviteFriends = async () => {
    const inviteUrl = window.location.origin;
    const inviteText = `Check out Bio Genius AI! Generate 500+ human-like, SEO-optimized bios in 2 seconds for Instagram, TikTok, and LinkedIn: ${inviteUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bio Genius AI - #1 AI Bio Generator 2026',
          text: inviteText,
          url: inviteUrl
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(inviteText);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2500);
    }
  };

  // Tone lists with lock indicators for free vs pro
  const tones: { id: Tone; name: string; isPro?: boolean }[] = [
    { id: 'basic', name: 'Basic (Free)' },
    { id: 'inspirational', name: 'Inspirational ⭐ Pro', isPro: true },
    { id: 'business', name: 'Business ⭐ Pro', isPro: true },
    { id: 'luxury', name: 'Luxury ⭐ Pro', isPro: true },
    { id: 'sarcastic', name: 'Sarcastic ⭐ Pro', isPro: true },
    { id: 'funny', name: 'Funny ⭐ Pro', isPro: true },
  ];

  // Templates
  const templates: { id: BioTemplate; name: string; isPro?: boolean }[] = [
    { id: 'default', name: 'Default' },
    { id: 'minimal', name: 'Minimal ⭐ Pro', isPro: true },
    { id: 'neon', name: 'Neon ⭐ Pro', isPro: true },
    { id: 'aesthetic', name: 'Aesthetic ⭐ Pro', isPro: true },
    { id: 'professional', name: 'Professional ⭐ Pro', isPro: true },
    { id: 'luxury', name: 'Luxury ⭐ Pro', isPro: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E11D48]/15 border border-[#E11D48]/30 text-[#E11D48] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>#1 AI Bio Generator 2026 • 98% Human-Like Guaranteed</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200">
            <div className="flex items-center text-[#FACC15]">
              <Star className="w-3.5 h-3.5 fill-[#FACC15]" />
              <Star className="w-3.5 h-3.5 fill-[#FACC15]" />
              <Star className="w-3.5 h-3.5 fill-[#FACC15]" />
              <Star className="w-3.5 h-3.5 fill-[#FACC15]" />
              <Star className="w-3.5 h-3.5 fill-[#FACC15]" />
            </div>
            <span className="font-extrabold text-[#FACC15]">{getAverageRating().average} / 5.0</span>
            <span className="text-slate-400">({getAverageRating().count.toLocaleString()}+ Reviews)</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          Bio Genius AI - <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] via-rose-400 to-[#FACC15]">#1 AI Bio Generator 2026</span>
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-300 font-medium">
          Generate 500+ Professional Bios in 2 Seconds
        </p>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Calibrated specifically for Instagram, TikTok, YouTube, and LinkedIn in 17 languages. Bypasses AI detectors with natural cadence and viral hooks.
        </p>

        {/* Action button row: Invite Friends & Premium Quick Link */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleInviteFriends}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition active:scale-95 shadow-sm"
          >
            {inviteCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Users className="w-3.5 h-3.5 text-[#FACC15]" />}
            <span>{inviteCopied ? 'Referral Link Copied!' : 'Invite Friends (Get Free Perks)'}</span>
          </button>

          {!user.isPremium && (
            <button
              onClick={() => onNavigate('/premium')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E11D48]/20 hover:bg-[#E11D48]/30 text-[#E11D48] text-xs font-bold border border-[#E11D48]/40 transition"
            >
              <Zap className="w-3.5 h-3.5 fill-[#E11D48]" />
              <span>Get Unlimited Generations (Rs. 299)</span>
            </button>
          )}
        </div>
      </div>

      {/* MANDATORY: InstallPWA Banner above generator */}
      <InstallPWA variant="banner" className="mb-8" />

      {/* Generator Main Box */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle accent border top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E11D48] via-[#FACC15] to-[#E11D48]" />

        {/* Feature 1: Google Login Required Card if not signed in */}
        {isGuest && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141d33] via-[#16203a] to-[#1c2744] border border-[#FACC15]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Google Login Required to Use App</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FACC15] text-black">
                    20 FREE / Day
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Sign in with your Google account to unlock 20 free bio generations every day.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignInDirect}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer active:scale-95 transition"
            >
              <LogIn className="w-4 h-4 text-slate-900" />
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Platform Selector with Dropdown and Icons (20 Platforms) */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Choose Social Platform (20 Available Categories)
              </label>
              <button
                type="button"
                onClick={() => onNavigate(`/bio/${platform}-bio`)}
                className="text-[11px] font-bold text-[#FACC15] hover:underline flex items-center gap-1"
              >
                <span>View {PLATFORMS_20.find(p => p.id === platform)?.name || 'Platform'} SEO Guide &rarr;</span>
              </button>
            </div>

            {/* Platform Dropdown with Icons */}
            <div className="mb-3">
              <div className="relative">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  aria-label="Select Platform"
                  className="w-full text-sm font-bold rounded-2xl bg-[#141d33] border border-slate-700 px-4 py-3.5 text-white focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] appearance-none cursor-pointer pr-10 shadow-lg"
                >
                  {PLATFORMS_20.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0f172a] text-white py-2">
                      {p.icon} {p.name} — ({p.charLimit})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90 text-[#FACC15]" />
                </div>
              </div>
            </div>

            {/* Top Quick Platform Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLATFORMS_20.slice(0, 8).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    platform === p.id
                      ? 'bg-gradient-to-br from-[#141d33] to-[#1a233d] border-[#E11D48] text-white shadow-lg ring-2 ring-[#E11D48]/30'
                      : 'bg-[#141d33]/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.icon}</span>
                    <div className="truncate">
                      <div className="font-bold text-xs text-white truncate">{p.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{p.charLimit}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Enter Name, Interests, Vibe, or What You Do
                </label>
                <button
                  type="button"
                  onClick={() => setShowWizardModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-950 to-amber-950 border border-[#FACC15]/40 text-[#FACC15] text-[11px] font-bold hover:bg-slate-800 transition"
                >
                  <Wand2 className="w-3 h-3 text-[#FACC15]" />
                  <span>Step-by-Step Wizard</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>Free Quota:</span>
                <strong className="text-[#FACC15]">
                  {user.unlimited || user.isPremium ? 'Unlimited (Lifetime)' : `${quota.remaining} / ${quota.max} left today`}
                </strong>
                {!user.unlimited && !user.isPremium && quota.remaining === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowDailyLimitModal(true)}
                    className="ml-1 text-[10px] font-bold text-[#E11D48] hover:underline"
                  >
                    Upgrade (Rs. 299)
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Amir Sohail, Tech Founder from Thakot Battagram, building AI tools, loves mountain hiking and dark roast coffee..."
              rows={3}
              className="w-full text-sm rounded-2xl bg-[#141d33] border border-slate-700 p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] transition resize-none"
            />
          </div>

          {/* Configuration Grid: Tone, Language, Template */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => {
                  const val = e.target.value as Tone;
                  if (val !== 'basic' && !user.isPremium && user.role !== 'admin') {
                    if (confirm('This premium tone is available with Lifetime Premium for only Rs. 299. Would you like to view the upgrade?')) {
                      onNavigate('/premium');
                      return;
                    }
                  }
                  setTone(val);
                }}
                className="w-full text-xs rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-3 text-white focus:outline-none focus:border-[#E11D48]"
              >
                {tones.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#0f172a]">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Language (17 Supported)
              </label>
              <select
                value={language}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== 'English' && !user.isPremium && user.role !== 'admin') {
                    if (confirm('Multi-language bios in 17 languages require Lifetime Premium (Rs. 299). View upgrade details?')) {
                      onNavigate('/premium');
                      return;
                    }
                  }
                  setLanguage(val);
                }}
                className="w-full text-xs rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-3 text-white focus:outline-none focus:border-[#E11D48]"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-[#0f172a]">
                    {lang} {lang !== 'English' ? '⭐ Pro' : '(Free)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Template Aesthetic
              </label>
              <select
                value={template}
                onChange={(e) => {
                  const val = e.target.value as BioTemplate;
                  if (val !== 'default' && !user.isPremium && user.role !== 'admin') {
                    if (confirm('Aesthetic & Luxury templates are part of Lifetime Premium (Rs. 299). View upgrade?')) {
                      onNavigate('/premium');
                      return;
                    }
                  }
                  setTemplate(val);
                }}
                className="w-full text-xs rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-3 text-white focus:outline-none focus:border-[#E11D48]"
              >
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id} className="bg-[#0f172a]">
                    {tpl.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Persona Customization & Tone Playground (Accordion) */}
          <div className="rounded-2xl bg-[#141d33]/70 border border-slate-800 p-4">
            <button
              type="button"
              onClick={() => setShowToneSliders(!showToneSliders)}
              className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-200 hover:text-white transition"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FACC15]" />
                <span>AI Persona Customization &amp; Tone Playground ({selectedPersona})</span>
              </span>
              <span className="text-[11px] text-[#FACC15] font-semibold">{showToneSliders ? 'Hide Sliders ▲' : 'Open 4 Sliders ▼'}</span>
            </button>

            {showToneSliders && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Select AI Persona Model
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Witty AI', 'Professional AI', 'Aesthetic Visionary', 'High-Status / Executive'] as const).map((persona) => (
                      <button
                        key={persona}
                        type="button"
                        onClick={() => setSelectedPersona(persona)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition ${
                          selectedPersona === persona
                            ? 'bg-[#E11D48]/20 border-[#E11D48] text-white'
                            : 'bg-[#0f172a] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {persona}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Formality:</span>
                      <span className="font-bold text-[#FACC15]">{formality}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={formality}
                      onChange={(e) => setFormality(parseInt(e.target.value))}
                      className="w-full accent-[#E11D48] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Humor &amp; Wit:</span>
                      <span className="font-bold text-[#FACC15]">{humor}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={humor}
                      onChange={(e) => setHumor(parseInt(e.target.value))}
                      className="w-full accent-[#E11D48] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Enthusiasm &amp; Energy:</span>
                      <span className="font-bold text-[#FACC15]">{enthusiasm}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={enthusiasm}
                      onChange={(e) => setEnthusiasm(parseInt(e.target.value))}
                      className="w-full accent-[#E11D48] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Creativity / Uniqueness:</span>
                      <span className="font-bold text-[#FACC15]">{creativity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={creativity}
                      onChange={(e) => setCreativity(parseInt(e.target.value))}
                      className="w-full accent-[#E11D48] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/40 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* MANDATORY: Generate Button Yellow #FACC15, Black text, loading state */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-base sm:text-lg transition-all shadow-xl shadow-[#FACC15]/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Generating 500+ Combinations in 2 Seconds...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-black" />
                <span>Generate Viral Bios Now</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* AdSlot with min-height 120px */}
      <AdSlot slotId="home-feed-ad" />

      {/* Generated Results Section */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-[#E11D48]" />
              <span>Generated High-Impact Bios</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Click "Copy Bio" for 1-click clipboard copy with formatting and emojis intact.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Want to explore all categories?</span>
            <button
              onClick={() => onNavigate('/explore')}
              className="text-xs font-bold text-[#FACC15] hover:underline"
            >
              Browse 1000+ Bios &rarr;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.map((bio) => (
            <BioCard
              key={bio.id}
              bio={bio}
              onUpdate={(updated) => {
                setResults((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
                saveBio(updated);
              }}
            />
          ))}
        </div>

        {/* Creator Safety & Review Disclaimer */}
        <div className="mt-6 p-4 rounded-2xl bg-[#141d33]/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">Creator Review &amp; Quality Notice: </span>
            Every bio from Bio Genius AI is generated with a 98%+ natural human cadence score without 7 Zahar (keyword stuffing, duplicate or black-hat content). Always review and personalize your bio with your links before publishing on social platforms.
          </div>
        </div>
      </div>

      {/* SEO ARTICLE: 300+ Words Below Generator */}
      <section className="mt-16 rounded-3xl bg-[#0f172a]/70 border border-slate-800 p-8 sm:p-10 text-slate-300 text-sm leading-relaxed">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-[#E11D48] uppercase tracking-wider">
              Comprehensive 2026 Guide
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              How to Craft Viral, SEO-Optimized Social Media Bios in 2026
            </h3>
          </div>

          <p>
            In the rapidly shifting landscape of modern social networks, your profile biography serves as your virtual storefront, digital business card, and personal mission statement. Algorithms on Instagram, TikTok, LinkedIn, and YouTube no longer treat bios as static text—they now parse keyword entities, account associations, and semantic topics to recommend your profile within the platform’s native search engine. A bio crafted with <strong>Bio Genius AI</strong> guarantees that your profile ranks at the pinnacle of discoverability while capturing human emotion in less than three seconds.
          </p>

          <h4 className="text-lg font-bold text-white pt-2">
            The Three Critical Pillars of High-Converting Bios
          </h4>
          <p>
            1. <strong>The Hook (First 40 Characters):</strong> On mobile devices, viewers make snap judgments. Your initial line must immediately articulate either your value proposition or an intriguing, unforgettable curiosity hook.
            <br />
            2. <strong>Social Proof &amp; Authenticity:</strong> State what makes your perspective distinct. Mention your milestone accomplishments, your location (from Battagram, Pakistan to international capitals), or your professional philosophy.
            <br />
            3. <strong>Calculated Call-to-Action (CTA):</strong> Never leave your audience guessing. Direct visitors towards your primary link, link-in-bio, YouTube channel, or direct message funnel using clean directional icons.
          </p>

          <h4 className="text-lg font-bold text-white pt-2">
            Why 98% Human-Like Score Matters in 2026
          </h4>
          <p>
            With the rise of automated AI copy tools, audiences have developed acute radar for robotic phrases, repetitive clichés, and unnatural word salads. Bio Genius AI was architected from the ground up by Amir Sohail to maintain human warmth, relatable humor, natural colloquial cadence, and culturally precise expressions in up to 17 global languages. Whether you run a luxury lifestyle brand or an educational tech channel, your bio will always read like it was written by an elite copywriter.
          </p>
        </div>
      </section>

      {/* STEP-BY-STEP BIO BUILDER WIZARD MODAL */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700 p-6 sm:p-8 shadow-2xl text-white">
            <button
              onClick={() => setShowWizardModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-[#E11D48] text-white text-xs font-black flex items-center justify-center">
                {wizardStep}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step {wizardStep} of 4</span>
            </div>

            <h3 className="text-lg font-black text-white mb-4">
              {wizardStep === 1 && '1. What is your Name or Creator Handle?'}
              {wizardStep === 2 && '2. What are your key interests or profession?'}
              {wizardStep === 3 && '3. What vibe do you want visitors to feel?'}
              {wizardStep === 4 && '4. What is your primary Call-to-Action?'}
            </h3>

            {wizardStep === 1 && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={wizardName}
                  onChange={(e) => setWizardName(e.target.value)}
                  placeholder="e.g., Amir Sohail / @amirsohail"
                  className="w-full px-4 py-3 rounded-xl bg-[#141d33] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#E11D48]"
                />
                <p className="text-xs text-slate-400">Used as the headline identity of your bio.</p>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={wizardNiche}
                  onChange={(e) => setWizardNiche(e.target.value)}
                  placeholder="e.g., Tech Founder, mountain hiking, coffee, scaling SaaS"
                  className="w-full px-4 py-3 rounded-xl bg-[#141d33] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#E11D48]"
                />
                <p className="text-xs text-slate-400">2 to 4 keywords that describe your unique expertise or passions.</p>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-3">
                {['Attitude & Bold', 'Aesthetic & Dreamy', 'Executive & High Status', 'Humorous & Sarcastic', 'Inspirational & Deep'].map((vibe) => (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => setWizardVibe(vibe)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                      wizardVibe === vibe
                        ? 'bg-[#E11D48]/20 border-[#E11D48] text-white'
                        : 'bg-[#141d33] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{vibe}</span>
                    {wizardVibe === vibe && <Check className="w-4 h-4 text-[#FACC15]" />}
                  </button>
                ))}
              </div>
            )}

            {wizardStep === 4 && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={wizardCta}
                  onChange={(e) => setWizardCta(e.target.value)}
                  placeholder="e.g., Tap the link below to read my case studies"
                  className="w-full px-4 py-3 rounded-xl bg-[#141d33] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#E11D48]"
                />
                <p className="text-xs text-slate-400">Tells visitors where to click next.</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Back
                </button>
              ) : <div />}

              {wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#be123c] text-white text-xs font-extrabold flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const combined = `${wizardName || 'Creator'}, specializing in ${wizardNiche || 'digital growth'}. Vibe: ${wizardVibe}. CTA: ${wizardCta}.`;
                    setPrompt(combined);
                    setShowWizardModal(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black text-xs font-black flex items-center gap-1.5 shadow-lg"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Assemble Prompt &amp; Close</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* USER ONBOARDING WALKTHROUGH MODAL (FIRST VISIT) */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700 p-6 sm:p-8 shadow-2xl text-white text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#FACC15] text-black flex items-center justify-center mx-auto mb-4 font-black text-xl shadow-lg shadow-[#E11D48]/20">
              BG
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FACC15] px-2.5 py-1 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20">
              Step {onboardingStep} of 3 Quick Walkthrough
            </span>

            {onboardingStep === 1 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-xl font-black text-white">Welcome to Bio Genius AI!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every user receives <strong>20 FREE bio generations per day</strong> with Google login. Generate 500+ high-CTR bio combinations in 2 seconds.
                </p>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-xl font-black text-white">17 Languages &amp; 98% Human Score</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fine-tune formality, humor, and creativity with our <strong>AI Persona Sliders</strong> or translate your bio instantly into Urdu, Spanish, Arabic, Hindi, and 13 other languages.
                </p>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-xl font-black text-white">Lifetime Pro for Rs. 299</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlock unlimited generations, premium luxury templates, and priority access forever via EasyPaisa Till ID, Payoneer, or Elevate Pay.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('biogenius_onboarded', 'true');
                  setShowOnboardingModal(false);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Skip Tour
              </button>

              {onboardingStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setOnboardingStep((prev) => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-[#E11D48] hover:bg-[#be123c] text-white text-xs font-extrabold flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('biogenius_onboarded', 'true');
                    setShowOnboardingModal(false);
                  }}
                  className="px-6 py-2 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black text-xs font-black shadow-lg"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Star Rating Modal */}
      <StarRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />

      {/* Feature 3 & 4: Daily Limit Reached Modal (Rs. 299 Unlimited) */}
      <DailyLimitModal
        isOpen={showDailyLimitModal}
        onClose={() => setShowDailyLimitModal(false)}
      />
    </div>
  );
};
