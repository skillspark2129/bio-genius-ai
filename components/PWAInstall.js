'use client';

import React, { useState, useEffect } from 'react';

/**
 * PWAInstall Component (components/PWAInstall.js)
 * Shows Install button only when beforeinstallprompt is available,
 * otherwise shows "How to Install: Click 3 dots > Add to Home Screen".
 */
export default function PWAInstall({ className = '' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
      }

      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        // Also attach to window for global access (e.g. from APK modal)
        window.__bioGeniusInstallPrompt = e;
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
        window.__bioGeniusInstallPrompt = null;
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Check if already captured on window
      if (window.__bioGeniusInstallPrompt) {
        setDeferredPrompt(window.__bioGeniusInstallPrompt);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    if (typeof window !== 'undefined') {
      window.__bioGeniusInstallPrompt = null;
    }
  };

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold ${className}`}>
        <span>✓</span>
        <span>App Installed</span>
      </div>
    );
  }

  // Show Install button only when beforeinstallprompt is available
  if (deferredPrompt) {
    return (
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-yellow-500/20 active:scale-95 transition cursor-pointer ${className}`}
        aria-label="Install Bio Genius AI App"
      >
        <span>📲</span>
        <span>Install App</span>
      </button>
    );
  }

  // Otherwise show "How to Install: Click 3 dots > Add to Home Screen"
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs ${className}`}
      title="How to install on Chrome, Edge, or Android browsers"
    >
      <span className="text-[#FACC15]">💡</span>
      <span>How to Install: Click 3 dots &gt; Add to Home Screen</span>
    </div>
  );
}
