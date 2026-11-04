import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogOut, ShieldCheck, Sparkles, Heart, Zap, User as UserIcon, Flag } from 'lucide-react';
import { ComplainModal } from './ComplainModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { appUser, firebaseUser, logout } = useAuth();
  const [complainOpen, setComplainOpen] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
    onNavigate('/');
  };

  const isGuest = appUser.email === 'guest@biogenius.ai';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
        <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-3">
              {firebaseUser?.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt={appUser.name}
                  className="w-20 h-20 rounded-full border-2 border-[#E11D48] object-cover mx-auto shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E11D48] to-[#be123c] text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-lg">
                  {appUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              {appUser.isPremium && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#FACC15] text-black shadow-md" title="Lifetime Pro">
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-1.5">
              <span>{appUser.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{appUser.email}</p>
          </div>

          {/* Status Cards */}
          <div className="space-y-3 mb-6">
            {/* Membership Tier */}
            <div className="p-4 rounded-2xl bg-[#141d33] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  appUser.isPremium ? 'bg-[#FACC15]/20 text-[#FACC15]' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Membership Plan</div>
                  <div className="text-[11px] text-slate-400">
                    {appUser.isPremium ? 'Lifetime Pro (Unlimited Generations)' : 'Free Tier (20 bios / day)'}
                  </div>
                </div>
              </div>

              {!appUser.isPremium && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('/premium');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#FACC15] hover:bg-[#eab308] text-black font-bold text-xs transition"
                >
                  Upgrade (Rs. 299)
                </button>
              )}
            </div>

            {/* Saved Bios Vault */}
            <div className="p-4 rounded-2xl bg-[#141d33] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-[#E11D48] flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-[#E11D48]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Saved Bios</div>
                  <div className="text-[11px] text-slate-400">
                    {appUser.savedBioIds?.length || 0} bios stored in your vault
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('/my-bios');
                }}
                className="text-xs font-semibold text-slate-300 hover:text-white underline"
              >
                View Vault &rarr;
              </button>
            </div>

            {/* Support / Report Complain */}
            <div className="p-3.5 rounded-2xl bg-[#141d33] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Flag className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300 font-medium">Need help or spotted a bug?</span>
              </div>
              <button
                onClick={() => setComplainOpen(true)}
                className="text-xs font-bold text-rose-400 hover:text-white underline"
              >
                Report Issue
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isGuest ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigate('/login');
                }}
                className="w-full py-3 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-xs transition shadow-lg"
              >
                Sign In / Register
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <ComplainModal
        isOpen={complainOpen}
        onClose={() => setComplainOpen(false)}
        initialType="Other"
      />
    </>
  );
};
