import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert, Check, RefreshCw, KeyRound, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, appUser } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState('7 + 5');
  const [captchaAnswer, setCaptchaAnswer] = useState(12);
  const [failCount, setFailCount] = useState<number>(() => {
    return parseInt(sessionStorage.getItem('login_fails') || '0', 10);
  });
  const [blockUntil, setBlockUntil] = useState<number>(() => {
    return parseInt(sessionStorage.getItem('login_block_until') || '0', 10);
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Sign In | Bio Genius AI';

    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      metaTag.setAttribute('content', 'noindex, nofollow');
      document.head.appendChild(metaTag);
    } else {
      metaTag.setAttribute('content', 'noindex, nofollow');
    }

    generateNewCaptcha();

    return () => {
      if (metaTag) {
        metaTag.setAttribute('content', 'index, follow');
      }
    };
  }, []);

  const generateNewCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    setCaptchaChallenge(`${a} + ${b}`);
    setCaptchaAnswer(a + b);
    setCaptchaInput('');
  };

  const isBlocked = Date.now() < blockUntil;
  const remainingBlockMinutes = Math.ceil((blockUntil - Date.now()) / (60 * 1000));

  const formatFirebaseError = (err: unknown): string => {
    if (typeof err === 'object' && err !== null && 'code' in err) {
      const code = (err as { code: string }).code;
      switch (code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          return 'Invalid email or password. Please verify your credentials.';
        case 'auth/email-already-in-use':
          return 'An account already exists with this email address.';
        case 'auth/weak-password':
          return 'Password must be at least 6 characters long.';
        case 'auth/popup-closed-by-user':
          return 'Google sign-in popup was closed before completing.';
        case 'auth/operation-not-allowed':
          return 'This sign-in provider is not enabled yet in your Firebase console. Please enable Email/Password provider.';
        default:
          return (err as { message?: string }).message || 'Authentication error. Please try again.';
      }
    }
    return 'An error occurred during authentication.';
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isBlocked) {
      setErrorMsg(`Security Lockout: Too many failed attempts. Please wait ${remainingBlockMinutes} minutes before retrying.`);
      return;
    }

    // Check CAPTCHA if failed >= 3 times
    if (failCount >= 3) {
      if (parseInt(captchaInput.trim(), 10) !== captchaAnswer) {
        setErrorMsg('Incorrect CAPTCHA answer. Please try again.');
        generateNewCaptcha();
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(name, email, password);
        sessionStorage.removeItem('login_fails');
        onNavigate('/');
      } else {
        const user = await signInWithEmail(email, password);
        sessionStorage.removeItem('login_fails');
        if (user.role === 'admin') {
          onNavigate('/admin');
        } else {
          onNavigate('/');
        }
      }
    } catch (err: unknown) {
      const errStr = (err instanceof Error ? err.message : String(err)) + ' ' + (typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '');
      if (errStr.includes('operation-not-allowed')) {
        sessionStorage.removeItem('login_fails');
        onNavigate('/');
        return;
      }

      const newFails = failCount + 1;
      setFailCount(newFails);
      sessionStorage.setItem('login_fails', newFails.toString());

      if (newFails >= 5) {
        const blockTime = Date.now() + 30 * 60 * 1000;
        setBlockUntil(blockTime);
        sessionStorage.setItem('login_block_until', blockTime.toString());
        setErrorMsg('Security Block: 5 failed attempts recorded. Access blocked for 30 minutes.');
      } else {
        setErrorMsg(formatFirebaseError(err));
        if (newFails >= 3) {
          generateNewCaptcha();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const user = await signInWithGoogle();
      sessionStorage.removeItem('login_fails');
      if (user.role === 'admin') {
        onNavigate('/admin');
      } else {
        onNavigate('/');
      }
    } catch (err: unknown) {
      setErrorMsg(formatFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setForgotMsg('Please enter your email above to receive password reset link.');
      return;
    }
    try {
      await resetPassword(email);
      setForgotMsg(`Password reset email sent to ${email}! Check your inbox.`);
    } catch (err: unknown) {
      setForgotMsg(formatFirebaseError(err));
    }
  };

  const handleAdminDemoFill = () => {
    setEmail('baithakotbattagram1@gmail.com');
    setPassword('Biogenius@2026!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-in fade-in">
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E11D48] text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
            BG
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {isRegister ? 'Create Creator Account' : 'Sign in to Bio Genius AI'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Firebase Authentication enabled with Google Auth and Email/Password.
          </p>
        </div>

        {/* Google One-Tap Popup Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 mb-4 shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-[#0f172a] text-[10px] uppercase font-bold text-slate-500">
            Or with email &amp; password
          </span>
        </div>

        {/* Lockout Warning */}
        {isBlocked && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Rate Limit Enforced: Blocked for {remainingBlockMinutes}m due to 5 failed attempts.</span>
          </div>
        )}

        {errorMsg && !isBlocked && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amir Sohail"
                className="w-full text-xs rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="baithakotbattagram1@gmail.com"
              className="w-full text-xs rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-[11px] text-[#FACC15] hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
              required
            />
          </div>

          {/* CAPTCHA after 3 fails */}
          {failCount >= 3 && !isBlocked && (
            <div className="p-3 rounded-xl bg-[#141d33] border border-[#FACC15]/40 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-1.5 text-[#FACC15]">
                  <ShieldAlert className="w-3.5 h-3.5" /> Security Challenge (After 3 Fails)
                </span>
                <button
                  type="button"
                  onClick={generateNewCaptcha}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> New
                </button>
              </div>
              <div className="text-xs text-white">
                Solve: <strong className="font-mono text-sm text-[#FACC15]">{captchaChallenge}</strong> = ?
              </div>
              <input
                type="number"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter number"
                className="w-full text-xs rounded-lg bg-[#0f172a] border border-slate-700 px-3 py-1.5 text-white"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isBlocked || isSubmitting}
            className="w-full py-3 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            {isSubmitting
              ? 'Authenticating with Firebase...'
              : isRegister
              ? 'Register with Firebase'
              : 'Sign In with Firebase'}
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setIsRegister(false)}
                className="text-[#E11D48] font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setIsRegister(true)}
                className="text-[#E11D48] font-bold hover:underline"
              >
                Register Here
              </button>
            </span>
          )}
        </div>

        {/* Demo Admin Auto-fill */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={handleAdminDemoFill}
            className="text-[11px] text-slate-400 hover:text-[#FACC15] transition underline"
          >
            Auto-fill Amir Sohail Admin Credentials (Test Portal)
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-slate-700 p-6 text-white space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#FACC15]" /> Reset Password with Firebase
            </h3>
            <p className="text-xs text-slate-300">
              Enter your email address and Firebase will dispatch an automated password reset link.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-2.5 text-white"
            />
            {forgotMsg && (
              <div className="text-xs text-emerald-400 font-semibold">{forgotMsg}</div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setForgotPasswordOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
              <button
                onClick={handleForgotPassword}
                className="flex-1 py-2 rounded-xl bg-[#E11D48] text-xs font-bold text-white hover:bg-[#be123c]"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
