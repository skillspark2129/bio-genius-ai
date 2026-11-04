import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Sparkles, X, Share2, PlusSquare } from 'lucide-react';

interface InstallPWAProps {
  variant?: 'header' | 'banner' | 'card';
  className?: string;
}

export const InstallPWA: React.FC<InstallPWAProps> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // If already installed, hide prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback instructions for unsupported or desktop browsers
      alert("To install Bio Genius AI on your device, click the install/download icon in your browser's address bar or menu (Add to Home screen).");
    }
  };

  // Header compact button
  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          aria-label="Install Bio Genius AI App"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FACC15] hover:bg-[#eab308] text-black font-semibold text-xs transition-all shadow-md active:scale-95 ${className}`}
        >
          <span className="text-sm">📲</span>
          <span>Install App</span>
        </button>

        {showIOSModal && (
          <IOSInstallModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  // Home Page Banner above generator
  if (variant === 'banner') {
    if (bannerDismissed) return null;

    return (
      <>
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#141d33] via-[#1a233d] to-[#0f172a] border border-[#E11D48]/40 p-4 sm:p-5 shadow-xl ${className}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E11D48] flex items-center justify-center shrink-0 shadow-lg text-xl">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] bg-[#FACC15]/10 px-2 py-0.5 rounded">
                    Offline Ready PWA
                  </span>
                  <span className="text-xs text-slate-400">v3.0 Release</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                  Install Bio Genius AI on your Home Screen
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Instant launch, zero load times, and offline access to 500+ trending bios anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleInstallClick}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-bold text-sm transition-all shadow-lg active:scale-95"
              >
                <span>📲</span>
                <span>Install App</span>
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {showIOSModal && (
          <IOSInstallModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  // Card variant (e.g. in Premium page)
  return (
    <>
      <div className={`rounded-xl bg-[#0f172a] border border-[#E11D48]/30 p-5 text-center ${className}`}>
        <div className="inline-flex p-3 rounded-full bg-[#E11D48]/20 text-[#E11D48] mb-3">
          <Download className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-white text-base">Progressive Web App Included</h4>
        <p className="text-xs text-slate-300 mt-1 mb-4">
          Install on iOS, Android, macOS, or Windows. Works offline with 1-tap bio copy.
        </p>
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-bold text-sm transition-all shadow-md active:scale-95"
        >
          <span>📲</span>
          <span>Install App</span>
        </button>
      </div>

      {showIOSModal && (
        <IOSInstallModal onClose={() => setShowIOSModal(false)} />
      )}
    </>
  );
};

function IOSInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0f172a] border border-[#E11D48]/40 p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#E11D48]/20 text-[#E11D48] flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-center">Install on iPhone / iPad</h3>
        <p className="text-xs text-slate-300 text-center mt-1 mb-5">
          Follow these two simple steps in Safari to add Bio Genius AI to your home screen:
        </p>

        <div className="space-y-3 text-xs bg-[#141d33] p-4 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#E11D48] flex items-center justify-center shrink-0 font-bold">1</div>
            <div>
              Tap the <span className="font-bold text-[#FACC15] inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</span> icon at the bottom of Safari.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#E11D48] flex items-center justify-center shrink-0 font-bold">2</div>
            <div>
              Scroll down and tap <span className="font-bold text-[#FACC15] inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</span>.
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-[#FACC15] text-black font-bold text-sm hover:bg-[#eab308] transition"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
