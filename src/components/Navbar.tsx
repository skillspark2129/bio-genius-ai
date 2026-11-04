import React, { useState, useEffect } from 'react';
import { InstallPWA } from './InstallPWA';
import { useAuth } from '../context/AuthContext';
import { UserProfileModal } from './UserProfileModal';
import { Menu, X, Sun, Moon, Sparkles, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, isDark, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { appUser, firebaseUser } = useAuth();

  const isGuest = appUser.email === 'guest@biogenius.ai';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    { name: 'Generator', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Trending', path: '/trending' },
    { name: 'Premium', path: '/premium', badge: 'Rs. 299' },
    { name: 'My Bios', path: '/my-bios' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0a0f1e]/90 border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="flex items-center gap-2.5 shrink-0 group py-1"
          >
            <img
              src="/bio-genius-ai-logo-wide.webp"
              alt="Bio Genius AI - Best Bio Generator Logo"
              width={200}
              height={60}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-102"
              loading="eager"
            />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.path);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-slate-800/80 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#FACC15] text-black">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5">
            {/* MANDATORY: In-App Install Button always visible in header */}
            <InstallPWA variant="header" />

            {/* Theme Toggle (Dark/Light) */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Dark/Light Mode"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FACC15]" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>

            {/* User Profile / Firebase Sign In */}
            {isGuest ? (
              <button
                onClick={() => onNavigate('/login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#be123c] text-xs font-bold text-white transition shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition border border-slate-700/60"
                title="View Profile & Account"
              >
                {firebaseUser?.photoURL ? (
                  <img
                    src={firebaseUser.photoURL}
                    alt={appUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#E11D48]"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#E11D48] text-white text-[10px] font-bold flex items-center justify-center">
                    {appUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[90px] truncate">
                  {appUser.name.split(' ')[0]}
                </span>
                {appUser.isPremium && (
                  <span className="w-2 h-2 rounded-full bg-[#FACC15]" title="Premium Active" />
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0f172a] border-b border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FACC15] text-black">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isGuest) {
                    onNavigate('/login');
                  } else {
                    setProfileModalOpen(true);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200"
              >
                <UserIcon className="w-4 h-4" />
                <span>{isGuest ? 'Sign In / Register' : `Profile (${appUser.name})`}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
