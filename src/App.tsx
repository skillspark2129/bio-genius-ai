import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProgrammaticBioSlugPage } from './pages/ProgrammaticBioSlugPage';
import { TrendingPage } from './pages/TrendingPage';
import { PremiumPage } from './pages/PremiumPage';
import { MyBiosPage } from './pages/MyBiosPage';
import { LoginPage } from './pages/LoginPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('bio_genius_theme');
    return saved ? saved === 'dark' : true;
  });

  const isOnline = useOnlineStatus();

  // Listen for browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('bio_genius_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('bio_genius_theme', 'light');
    }
  }, [isDark]);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Resolve Route
  const renderPage = () => {
    // Dynamic Programmatic Slug: /bio/:slug
    if (currentPath.startsWith('/bio/')) {
      const slug = currentPath.replace('/bio/', '').trim();
      return <ProgrammaticBioSlugPage slug={slug || 'best-instagram-bio-for-boys'} onNavigate={navigate} />;
    }

    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/explore':
        return <ExplorePage onNavigate={navigate} />;
      case '/trending':
        return <TrendingPage onNavigate={navigate} />;
      case '/premium':
        return <PremiumPage onNavigate={navigate} />;
      case '/my-bios':
        return <MyBiosPage onNavigate={navigate} />;
      case '/login':
        return <LoginPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      case '/contact':
        return <ContactPage />;
      case '/admin':
        return <AdminPage onNavigate={navigate} />;
      case '/admin-login':
        return <AdminLoginPage onNavigate={navigate} />;
      default:
        // Default to Home if unrecognized
        return <HomePage onNavigate={navigate} />;
    }
  };

  const isAdminRoute = currentPath === '/admin' || currentPath === '/admin-login';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#0a0f1e] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Offline Connectivity Notification Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Offline Mode Active: Service Worker serving cached bios. Full generator features resume when reconnected.</span>
        </div>
      )}

      {/* Navigation Bar (Hidden on Admin Routes) */}
      {!isAdminRoute && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigate}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Main Page Body */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer (Hidden on Admin Routes) */}
      {!isAdminRoute && <Footer onNavigate={navigate} />}
    </div>
  );
}
