import React, { useState } from 'react';
import { BioItem } from '../types';
import {
  Copy,
  Check,
  Heart,
  Share2,
  Sparkles,
  Globe,
  ShieldCheck,
  Flame,
  MoreVertical,
  Flag,
  Download,
  ExternalLink,
  X,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { incrementBioCopy, toggleBioLike, getCurrentUser, updateUser } from '../lib/storage';
import { humanizeBio, translateBio, SUPPORTED_LANGUAGES } from '../lib/ai';
import { ComplainModal } from './ComplainModal';

interface BioCardProps {
  bio: BioItem;
  onUpdate?: (updatedBio: BioItem) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export const BioCard: React.FC<BioCardProps> = ({ bio, onUpdate, onDelete, showDelete = false }) => {
  const [currentText, setCurrentText] = useState(bio.text);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(() => {
    const user = getCurrentUser();
    return user.savedBioIds?.includes(bio.id) || false;
  });
  const [likeCount, setLikeCount] = useState(bio.likesCount || 0);
  const [copyCount, setCopyCount] = useState(bio.copyCount || 0);
  const [humanScore, setHumanScore] = useState(bio.humanScore || 98);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [selectedLang, setSelectedLang] = useState(bio.language || 'English');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showComplainModal, setShowComplainModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const charLimit =
    bio.platform === 'tiktok'
      ? 80
      : bio.platform === 'instagram'
      ? 150
      : bio.platform === 'linkedin'
      ? 220
      : bio.platform === 'facebook'
      ? 255
      : 1000;
  const currentChars = currentText.length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentText);
      setCopied(true);
      setCopyCount((prev) => prev + 1);
      incrementBioCopy(bio.id);

      try {
        confetti({
          particleCount: 35,
          spread: 45,
          origin: { y: 0.8 },
        });
      } catch {}

      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copied bio to clipboard!');
    }
  };

  const handleLike = () => {
    const user = getCurrentUser();
    const isCurrentlySaved = user.savedBioIds?.includes(bio.id);

    if (isCurrentlySaved) {
      user.savedBioIds = user.savedBioIds.filter((id) => id !== bio.id);
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      user.savedBioIds = [...(user.savedBioIds || []), bio.id];
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      toggleBioLike(bio.id);
    }
    updateUser(user);
  };

  const handleHumanize = async () => {
    setIsHumanizing(true);
    try {
      const res = await humanizeBio(currentText);
      setCurrentText(res.text);
      setHumanScore(res.humanScore);
      if (onUpdate) {
        onUpdate({ ...bio, text: res.text, humanScore: res.humanScore });
      }
      showToast('Bio humanized! AI score 99%');
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleTranslate = async (lang: string) => {
    setSelectedLang(lang);
    setShowTranslateMenu(false);
    setIsTranslating(true);
    try {
      const translated = await translateBio(currentText, lang);
      setCurrentText(translated);
      if (onUpdate) {
        onUpdate({ ...bio, text: translated, language: lang });
      }
      showToast(`Translated to ${lang}!`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Download Bio as high-res PNG image
  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 500);
    grad.addColorStop(0, '#0a0f1e');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);

    // Accent border
    ctx.strokeStyle = '#E11D48';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 760, 460);

    // Header BG Badge
    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.roundRect(50, 45, 50, 50, 10);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BG', 75, 78);

    // Title
    ctx.textAlign = 'left';
    ctx.font = 'bold 22px Poppins, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Bio Genius AI', 115, 70);

    ctx.font = '12px Poppins, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`${bio.platform.toUpperCase()} • 98% HUMAN CADENCE`, 115, 88);

    // Human score pill
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('✓ 98.6% Human-Score', 730, 75);

    // Bio Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'left';

    const lines = currentText.split('\n');
    let y = 160;
    lines.forEach((line) => {
      // Wrap long lines if needed
      if (line.length > 55) {
        ctx.fillText(line.substring(0, 55), 50, y);
        y += 32;
        ctx.fillText(line.substring(55), 50, y);
      } else {
        ctx.fillText(line, 50, y);
      }
      y += 32;
    });

    // Footer signature
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 430);
    ctx.lineTo(750, 430);
    ctx.stroke();

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Crafted with Bio Genius AI • Founder Amir Sohail, Thakot Battagram', 50, 455);
    ctx.fillStyle = '#FACC15';
    ctx.textAlign = 'right';
    ctx.fillText('biogenius.ai', 750, 455);

    // Trigger download
    const link = document.createElement('a');
    link.download = `bio-genius-${bio.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Downloaded bio card as PNG image!');
  };

  // WhatsApp share
  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(currentText + '\n\n— Generated via Bio Genius AI (by Amir Sohail): ' + window.location.origin)}`;
    window.open(url, '_blank');
  };

  // Facebook share
  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(currentText)}`;
    window.open(url, '_blank');
  };

  // Twitter/X share
  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentText + '\n\nCrafted with @BioGeniusAI')}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank');
  };

  // Instagram copy
  const shareInstagramCopy = async () => {
    await navigator.clipboard.writeText(currentText);
    showToast('Copied! Now open Instagram and paste into your Bio.');
  };

  // Copy Link
  const copyDirectLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/explore#${bio.id}`);
    showToast('Direct bio link copied to clipboard!');
  };

  // Native share fallback
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bio Genius AI Generated Bio',
          text: currentText,
          url: window.location.origin,
        });
      } catch {}
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <div className="group relative rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-[#E11D48]/50 p-5 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#E11D48]/5 flex flex-col justify-between">
      {/* Toast popup */}
      {toastMessage && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-xl bg-[#E11D48] text-white text-xs font-bold shadow-lg animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/20">
              {bio.platform}
            </span>
            <span className="text-[11px] font-medium capitalize px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {bio.tone}
            </span>
            {bio.isPremium && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FACC15]/20 text-[#FACC15] flex items-center gap-1">
                ⭐ Pro
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* AI Human-Like Detector Badge */}
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold"
              title="Bypasses AI detectors with natural cadence"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{humanScore}% Human-Like</span>
            </div>

            {/* 3-Dot Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                aria-label="More bio options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-[#141d33] border border-slate-700 p-1.5 shadow-2xl z-40">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowComplainModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-[#E11D48]/20 hover:text-white transition text-left"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report / Complain</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDownloadImage();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Image</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowShareModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Options</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio Content Area */}
        <div className="relative my-3 p-3.5 rounded-xl bg-[#141d33] border border-slate-800/80">
          <pre className="font-sans text-sm sm:text-base leading-relaxed text-slate-100 whitespace-pre-wrap break-words select-all">
            {currentText}
          </pre>

          {/* Character counter & counters */}
          <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Length: <strong className={currentChars > charLimit ? 'text-rose-400' : 'text-slate-300'}>{currentChars}</strong> / {charLimit}
            </span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1" title="Copies">
                <Copy className="w-3 h-3 text-slate-500" /> {copyCount}
              </span>
              <span className="flex items-center gap-1" title="Favorites">
                <Flame className="w-3 h-3 text-rose-500" /> {likeCount}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        {/* Humanize & Translate */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={handleHumanize}
            disabled={isHumanizing}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition"
            title="Refine natural flow to 99% human score"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#FACC15] ${isHumanizing ? 'animate-spin' : ''}`} />
            <span>{isHumanizing ? 'Polishing...' : 'Humanize'}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowTranslateMenu(!showTranslateMenu)}
              disabled={isTranslating}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition"
              title="Translate into 17 languages"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>{isTranslating ? 'Translating...' : selectedLang}</span>
            </button>

            {showTranslateMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 max-h-56 overflow-y-auto rounded-xl bg-[#141d33] border border-slate-700 p-1.5 shadow-2xl z-30">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Select Language</div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleTranslate(lang)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-[#E11D48] hover:text-white transition flex items-center justify-between"
                  >
                    <span>{lang}</span>
                    {selectedLang === lang && <Check className="w-3 h-3 text-[#FACC15]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Primary interactions: Favorite, Share, Copy */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={handleLike}
            className={`p-2 rounded-lg transition ${
              liked ? 'bg-rose-500/20 text-[#E11D48]' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
            title={liked ? 'Saved in My Bios' : 'Add to My Bios'}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-[#E11D48]' : ''}`} />
          </button>

          {/* Share Button (Opens Multi-Channel Share Row Modal) */}
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Multi-channel Bio Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {showDelete && onDelete && (
            <button
              onClick={() => onDelete(bio.id)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 text-xs font-semibold transition"
            >
              Delete
            </button>
          )}

          {/* Copy CTA */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              copied ? 'bg-emerald-500 text-white' : 'bg-[#FACC15] hover:bg-[#eab308] text-black'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Bio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SHARE MODAL - Multi-Channel Share Row */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700 p-6 shadow-2xl text-white">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#E11D48]" />
              <span>Share Bio Across Channels</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">Select a social destination or download high-res graphic</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {/* WhatsApp */}
              <button
                onClick={shareWhatsApp}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-800/60 text-emerald-300 hover:text-white border border-emerald-700/50 text-xs font-bold transition"
              >
                <span className="text-base">💬</span>
                <span>WhatsApp</span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={shareTwitter}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-sky-950/50 hover:bg-sky-800/60 text-sky-300 hover:text-white border border-sky-700/50 text-xs font-bold transition"
              >
                <span className="text-base">𝕏</span>
                <span>Twitter / X</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareFacebook}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-950/50 hover:bg-blue-800/60 text-blue-300 hover:text-white border border-blue-700/50 text-xs font-bold transition"
              >
                <span className="text-base">👥</span>
                <span>Facebook</span>
              </button>

              {/* Instagram Copy */}
              <button
                onClick={shareInstagramCopy}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-pink-950/50 hover:bg-pink-800/60 text-pink-300 hover:text-white border border-pink-700/50 text-xs font-bold transition"
              >
                <span className="text-base">📸</span>
                <span>Instagram Copy</span>
              </button>

              {/* Download as Image */}
              <button
                onClick={handleDownloadImage}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-950/50 hover:bg-amber-800/60 text-amber-300 hover:text-white border border-amber-700/50 text-xs font-bold transition"
              >
                <Download className="w-4 h-4 text-[#FACC15]" />
                <span>Save Image (PNG)</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={copyDirectLink}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Bio Link</span>
              </button>
            </div>

            {/* Native share button if supported */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition mb-2"
              >
                Open Native Share Menu
              </button>
            )}
          </div>
        </div>
      )}

      {/* Complain Modal */}
      <ComplainModal
        isOpen={showComplainModal}
        onClose={() => setShowComplainModal(false)}
        initialBioSnippet={currentText}
        initialType="Wrong Bio"
      />
    </div>
  );
};
