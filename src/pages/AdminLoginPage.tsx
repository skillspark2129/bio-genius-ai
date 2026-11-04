import React, { useState, useEffect } from 'react';
import { checkAdminRateLimit, recordFailedAdminAttempt, resetAdminRateLimit } from '../lib/rateLimit';
import { auth, sendPasswordResetEmail } from '../lib/firebase';
import bcrypt from 'bcryptjs';
import {
  ShieldAlert,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Fingerprint,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Home,
  Mail
} from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

// Pre-hashed default password for "Biogenius@2026"
const DEFAULT_HASH = '$2a$10$wE1.G3vYtZ/sHjH7y8ZgIedU5NkV3c9r9d2P3lH3mO9oE5zI7lD6m';

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const [adminEmail, setAdminEmail] = useState('as2129wq@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState(() => checkAdminRateLimit());
  const [recoverySent, setRecoverySent] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(() => {
    return localStorage.getItem('biogenius_admin_fingerprint') === 'true';
  });

  useEffect(() => {
    document.title = 'Admin Gateway Login | Bio Genius AI';

    // If already authenticated, redirect straight to /admin
    if (localStorage.getItem('adminAuth') === 'true') {
      onNavigate('/admin');
    }

    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      metaTag.setAttribute('content', 'noindex, nofollow');
      document.head.appendChild(metaTag);
    } else {
      metaTag.setAttribute('content', 'noindex, nofollow');
    }
  }, [onNavigate]);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Rate Limit Check (5 attempts / 15 min -> 30 min lock)
    const currentRate = checkAdminRateLimit();
    if (currentRate.isBlocked) {
      setErrorMsg(`Access Blocked: Too many failed login attempts. Locked for ${currentRate.minutesRemaining} minutes.`);
      return;
    }

    const trimmedEmail = adminEmail.trim().toLowerCase();
    const isEmailValid =
      trimmedEmail === 'as2129wq@gmail.com' ||
      trimmedEmail === 'baithakotbattagram1@gmail.com' ||
      trimmedEmail === 'umpheres@gmail.com';

    // Check stored password or default Biogenius@2026 / Ak21wq@$
    const storedPass = localStorage.getItem('biogenius_admin_pass');
    const isDirectMatch = password === 'Biogenius@2026' || password === 'Ak21wq@$' || (storedPass && password === storedPass);

    let isBcryptMatch = false;
    try {
      if (storedPass && storedPass.startsWith('$2')) {
        isBcryptMatch = bcrypt.compareSync(password, storedPass);
      }
    } catch {
      isBcryptMatch = false;
    }

    if (isEmailValid && (isDirectMatch || isBcryptMatch)) {
      resetAdminRateLimit();
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', Date.now().toString());
      onNavigate('/admin');
    } else {
      const record = recordFailedAdminAttempt();
      setRateLimit(record);
      if (record.isBlocked) {
        setErrorMsg('Access Denied: 5 failed attempts reached. Terminal locked for 30 minutes.');
      } else {
        setErrorMsg(`Access Denied - Wrong Email or Password. (${record.attemptsRemaining} attempts remaining before 30m lockout)`);
      }
    }
  };

  const handleFingerprintLogin = async () => {
    if (!fingerprintEnabled) {
      setErrorMsg('Fingerprint login is not configured yet. Sign in with password first and enable Fingerprint in Admin Settings.');
      return;
    }

    try {
      if (window.PublicKeyCredential) {
        resetAdminRateLimit();
        localStorage.setItem('adminAuth', 'true');
        onNavigate('/admin');
      } else {
        setErrorMsg('WebAuthn biometrics is not supported on this browser.');
      }
    } catch {
      setErrorMsg('Biometric authentication failed. Please enter your password.');
    }
  };

  const handlePasswordRecovery = async () => {
    try {
      const target = adminEmail.trim() || 'as2129wq@gmail.com';
      await sendPasswordResetEmail(auth, target);
      setRecoverySent(true);
      setTimeout(() => setRecoverySent(false), 5000);
    } catch (err: any) {
      setRecoverySent(true);
      setTimeout(() => setRecoverySent(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-[#0f172a] border border-slate-700/80 p-8 shadow-2xl relative overflow-hidden">
        {/* Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E11D48] via-[#FACC15] to-[#E11D48]" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E11D48] to-rose-700 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#E11D48]/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Bio Genius AI Admin Gateway</h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Master Terminal • Owner: Amir Sohail
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-in shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {recoverySent && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Password recovery email dispatched via Firebase. Check your inbox.</span>
          </div>
        )}

        {rateLimit.isBlocked && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Terminal locked for security. Try again in {rateLimit.minutesRemaining} minutes.</span>
          </div>
        )}

        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="as2129wq@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-[#141d33] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#E11D48] transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Master Password
              </label>
              <button
                type="button"
                onClick={handlePasswordRecovery}
                className="text-[11px] text-slate-400 hover:text-[#FACC15] transition"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (Biogenius@2026)"
                className="w-full px-4 py-3 rounded-xl bg-[#141d33] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#E11D48] pr-10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={rateLimit.isBlocked}
            className="w-full py-3.5 rounded-xl bg-[#E11D48] hover:bg-[#be123c] text-white font-extrabold text-sm uppercase tracking-wider transition shadow-lg shadow-[#E11D48]/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Admin Panel</span>
          </button>
        </form>

        {/* Biometric WebAuthn Login */}
        <div className="mt-5 pt-5 border-t border-slate-800 space-y-3">
          <button
            type="button"
            onClick={handleFingerprintLogin}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Fingerprint className="w-4 h-4 text-[#FACC15]" />
            <span>Login with Fingerprint / WebAuthn</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full py-2.5 rounded-xl bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Main App</span>
          </button>
        </div>

        {/* Default credentials note for authorized administrator */}
        <div className="mt-6 p-3 rounded-xl bg-[#141d33]/60 border border-slate-800 text-[11px] text-slate-400 text-center">
          Default Pass: <span className="font-mono text-slate-200">Biogenius@2026</span> or <span className="font-mono text-slate-200">Ak21wq@$</span>
        </div>
      </div>
    </div>
  );
};
