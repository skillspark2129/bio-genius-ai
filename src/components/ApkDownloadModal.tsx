import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Sparkles, X, Smartphone, ExternalLink, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://biogenius.ai';
  const pwaBuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(appUrl)}`;

  const handlePwaInstall = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    } else if (isIOS) {
      alert("iOS Safari Installation: Tap the Share button in Safari, then select 'Add to Home Screen'.");
    } else {
      alert("Browser installation prompt: Click the 3 dots (⋮) in your browser toolbar, then tap 'Install app' or 'Add to Home Screen'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E11D48] via-rose-500 to-[#FACC15]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E11D48] to-rose-700 flex items-center justify-center text-white shadow-lg shadow-[#E11D48]/30">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">Download Bio Genius AI for Android</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                v3.0 APK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Select your preferred installation method for mobile &amp; tablet.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* OPTION 1: Install PWA (Recommended) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#141d33] to-[#1a233d] border-2 border-[#FACC15]/60 relative overflow-hidden shadow-xl">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FACC15] text-slate-950 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Install PWA Web App</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FACC15]/20 text-[#FACC15] text-[10px] font-extrabold uppercase">
                    Recommended
                  </span>
                </h4>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Fastest setup. Installs directly from browser with zero APK warning, full offline mode, and automatic background updates.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mb-4">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Size &lt; 2 MB
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Offline Cached
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> No Google Play needed
              </span>
            </div>

            {isInstalled ? (
              <div className="w-full py-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Bio Genius AI is Already Installed on this Device</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePwaInstall}
                className="w-full py-3 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-yellow-500/20 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Install PWA (1-Click)</span>
              </button>
            )}

            {!isInstallable && !isInstalled && (
              <p className="text-[11px] text-slate-400 text-center mt-2">
                💡 If prompt doesn't open: tap browser menu <strong>(⋮) &gt; &quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>
              </p>
            )}
          </div>

          {/* OPTION 2: Download APK File */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141d33]/70 border border-slate-700/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-slate-700 text-white font-black text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-black text-white">Download Android APK File</h4>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                Standard .apk
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Direct sideloadable Android package. Download the APK file directly or inspect the PWABuilder report card.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Direct APK Link */}
              <a
                href="/app-release.apk"
                download="BioGeniusAI.apk"
                className="py-2.5 px-3 rounded-xl bg-[#E11D48] hover:bg-[#be123c] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition shadow-md shadow-[#E11D48]/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Direct Download (.apk)</span>
              </a>

              {/* PWABuilder Report Card */}
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
              >
                <span>PWABuilder Tool</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#FACC15]" />
              </a>
            </div>
          </div>

          {/* OPTION 3: Google Play Store Instructions */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FACC15]">
              <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>How to Generate Signed Google Play Store APK/AAB:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
              <li>Open <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="text-white underline font-semibold">https://www.pwabuilder.com</a> in your browser.</li>
              <li>Enter app URL: <code className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-300 font-mono text-[10px]">https://bio-genius-ai.web.app</code> and click <strong>Start</strong>.</li>
              <li>Click <strong>Package for Stores &gt; Android (TWA)</strong> to download the complete signed Google Play APK &amp; AAB package!</li>
            </ol>
          </div>
        </div>

        {/* Footer reassurance note */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Virus &amp; Malware Free</span>
          </div>
          <span>Signed by Amir Sohail</span>
        </div>
      </div>
    </div>
  );
};
