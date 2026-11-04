import React, { useState, useEffect } from 'react';
import { InstallPWA } from '../components/InstallPWA';
import { getCurrentUser, addPendingPayment, getPendingPayments, getAppConfig } from '../lib/storage';
import { Check, Zap, Sparkles, Upload, Clock, ShieldCheck, ArrowRight, AlertCircle, Copy, CheckCircle2, QrCode, CreditCard, DollarSign, Smartphone, Download } from 'lucide-react';
import { ApkDownloadModal } from '../components/ApkDownloadModal';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

interface PremiumPageProps {
  onNavigate: (path: string) => void;
}

type PaymentTab = 'easypaisa' | 'payoneer' | 'elevate';

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  const { appUser: user } = useAuth();
  const config = getAppConfig();
  const tillId = config.easyPaisaTillId || '12345678';
  const payoneerEmail = config.payoneerEmail || 'baithakotbattagram1@gmail.com';
  const elevateDetails = config.elevatePayDetails || 'Account Name: Amir Sohail | IBAN: PK82MEZN00010928392102 | Elevate USD Wire: EV82910482';

  const [activeTab, setActiveTab] = useState<PaymentTab>('easypaisa');
  const [trxId, setTrxId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [apkModalOpen, setApkModalOpen] = useState(false);
  const [userPayments, setUserPayments] = useState(() => {
    return getPendingPayments().filter((p) => p.userId === user.id || p.userEmail === user.email);
  });

  useEffect(() => {
    document.title = 'Unlock Premium Rs.299 Lifetime | Bio Genius AI';
  }, []);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      alert('Please enter your Transaction or Reference ID.');
      return;
    }
    if (!screenshotUrl) {
      alert('Please upload a screenshot of your payment receipt.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const methodName =
        activeTab === 'easypaisa'
          ? `EasyPaisa Till ID: ${tillId}`
          : activeTab === 'payoneer'
          ? `Payoneer (${payoneerEmail})`
          : 'Elevate Pay';

      const newPay = addPendingPayment({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        trxId: trxId.trim(),
        screenshotUrl,
        amount: 299,
        currency: 'PKR',
        method: methodName,
      });

      setUserPayments((prev) => [newPay, ...prev]);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setTrxId('');

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Hero Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/30 text-xs font-bold mb-4">
          <Zap className="w-4 h-4 fill-[#FACC15]" />
          <span>One-Time Investment • Lifetime Unlimited Access</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Unlock Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-[#FACC15]">Rs. 299 Lifetime</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          Everything you need to build viral, human-like creator bios without limits. No recurring subscriptions.
        </p>

        {/* APK & PWA Download Button in /premium */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setApkModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white font-extrabold text-xs shadow-lg shadow-[#E11D48]/30 transition active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-[#FACC15]" />
            <span>Download APK (Android)</span>
          </button>
        </div>

        {user.isPremium && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>You currently have Lifetime Premium Active on your account!</span>
          </div>
        )}
      </div>

      {/* Pricing Card & Comparison Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-start">
        {/* Main Lifetime Offer Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#141d33] via-[#0f172a] to-[#0a0f1e] border-2 border-[#E11D48] p-6 sm:p-8 shadow-2xl relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E11D48] text-white font-extrabold text-xs tracking-wider uppercase shadow-md">
            Most Popular
          </div>

          <div className="text-center pb-6 border-b border-slate-800">
            <h3 className="text-xl font-extrabold text-white">Lifetime Pro Creator</h3>
            <p className="text-xs text-slate-400 mt-1">Pay once, create forever</p>
            <div className="mt-4 flex items-baseline justify-center gap-1">
              <span className="text-sm font-semibold text-slate-400">Rs.</span>
              <span className="text-5xl font-black text-white tracking-tight">299</span>
              <span className="text-xs text-slate-400 font-medium">/ lifetime</span>
            </div>
            <div className="mt-2 text-[11px] text-[#FACC15] font-semibold">
              Save 90% compared to monthly subscriptions
            </div>
          </div>

          {/* Feature List */}
          <ul className="py-6 space-y-3.5 text-xs text-slate-200">
            {[
              'Unlimited Bio Generations (No daily limits)',
              'GPT-4 & Gemini Argon Elite AI Engine',
              'All 17 Global Languages Unlocked',
              'Instagram Bio Aesthetic Scanner',
              'Premium Templates (Minimal, Neon, Luxury, Aesthetic)',
              'Zero Advertisements & Clean Interface',
              '1-Tap Humanizer Engine (99% Human Score)',
              'Installable PWA for Mobile & Desktop',
              'Priority 24h Support from Amir Sohail',
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href="#payment-section"
            className="w-full py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-sm transition-all shadow-xl shadow-[#FACC15]/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Proceed to Payment (Rs. 299)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Comparison Table Free vs Premium */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Detailed Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Feature</th>
                  <th className="py-3 px-2 text-center">Free Tier</th>
                  <th className="py-3 px-2 text-center text-[#FACC15] font-bold">Lifetime Premium (Rs. 299)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3.5 px-2 font-medium">Daily Generations Limit</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">20 bios / day</td>
                  <td className="py-3.5 px-2 text-center font-bold text-emerald-400">Unlimited Lifetime</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 font-medium">Underlying AI Model</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">Standard Turbo</td>
                  <td className="py-3.5 px-2 text-center font-bold text-[#FACC15]">GPT-4 &amp; Gemini Argon</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 font-medium">Supported Languages</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">English Only</td>
                  <td className="py-3.5 px-2 text-center font-bold text-emerald-400">All 17 Languages</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 font-medium">Instagram Bio Scanner</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">Locked</td>
                  <td className="py-3.5 px-2 text-center font-bold text-emerald-400">Full Access</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 font-medium">Templates Access</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">Default Only</td>
                  <td className="py-3.5 px-2 text-center font-bold text-emerald-400">Minimal, Neon, Luxury, Aesthetic</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 font-medium">Ads Experience</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">Standard Ads</td>
                  <td className="py-3.5 px-2 text-center font-bold text-emerald-400">100% Ad-Free</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 font-medium">Human-Score Calibration</td>
                  <td className="py-3.5 px-2 text-center text-slate-400">95%</td>
                  <td className="py-3.5 px-2 text-center font-bold text-[#FACC15]">99% Bypasses All AI Detectors</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <InstallPWA variant="card" />
          </div>
        </div>
      </div>

      {/* 3 PAYMENT TABS SECTION */}
      <div id="payment-section" className="rounded-3xl bg-[#0f172a] border border-[#E11D48]/40 p-6 sm:p-10 shadow-2xl relative mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#E11D48] uppercase tracking-wider">
              Official Payment Methods
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Select Your Payment Method
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Choose EasyPaisa Till, Payoneer, or Elevate Pay. Submit your receipt for rapid approval.
            </p>
          </div>

          {/* 3 Tabs Header */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#141d33] border border-slate-800 mb-8">
            <button
              onClick={() => setActiveTab('easypaisa')}
              className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
                activeTab === 'easypaisa'
                  ? 'bg-[#E11D48] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>EasyPaisa Till</span>
            </button>

            <button
              onClick={() => setActiveTab('payoneer')}
              className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
                activeTab === 'payoneer'
                  ? 'bg-[#E11D48] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Payoneer</span>
            </button>

            <button
              onClick={() => setActiveTab('elevate')}
              className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
                activeTab === 'elevate'
                  ? 'bg-[#E11D48] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Elevate Pay</span>
            </button>
          </div>

          {/* TAB 1: EasyPaisa Till ID + QR */}
          {activeTab === 'easypaisa' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141d33] to-[#1e293b] border border-[#FACC15]/40 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[11px] font-bold text-[#FACC15] uppercase tracking-wider">
                    Authorized EasyPaisa Till
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    Till ID: <span className="font-mono text-[#FACC15]">{tillId}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Merchant Name: <strong>Bio Genius AI / Amir Sohail</strong> • Fee: <strong>Rs. 299 PKR</strong>
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleCopy(tillId, 'till')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-bold text-xs transition shadow-md active:scale-95"
                    >
                      {copiedKey === 'till' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedKey === 'till' ? 'Till ID Copied!' : `Copy Till ID (${tillId})`}</span>
                    </button>
                  </div>
                </div>

                {/* QR Code Card */}
                <div className="shrink-0 p-3 rounded-2xl bg-white text-black text-center shadow-xl">
                  <div className="w-32 h-32 flex items-center justify-center bg-slate-100 rounded-xl border border-slate-300 relative">
                    {/* SVG EasyPaisa QR illustration */}
                    <svg viewBox="0 0 100 100" className="w-28 h-28">
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Corners */}
                      <rect x="10" y="10" width="24" height="24" fill="#000000" />
                      <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                      <rect x="18" y="18" width="8" height="8" fill="#000000" />

                      <rect x="66" y="10" width="24" height="24" fill="#000000" />
                      <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                      <rect x="74" y="18" width="8" height="8" fill="#000000" />

                      <rect x="10" y="66" width="24" height="24" fill="#000000" />
                      <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                      <rect x="18" y="74" width="8" height="8" fill="#000000" />

                      {/* Random Matrix Dots */}
                      <rect x="42" y="12" width="6" height="6" fill="#000000" />
                      <rect x="52" y="18" width="6" height="6" fill="#000000" />
                      <rect x="44" y="28" width="6" height="6" fill="#000000" />
                      <rect x="12" y="44" width="6" height="6" fill="#000000" />
                      <rect x="22" y="52" width="6" height="6" fill="#000000" />
                      <rect x="44" y="44" width="12" height="12" fill="#E11D48" />
                      <rect x="62" y="44" width="6" height="6" fill="#000000" />
                      <rect x="74" y="52" width="6" height="6" fill="#000000" />
                      <rect x="82" y="42" width="6" height="6" fill="#000000" />
                      <rect x="42" y="66" width="6" height="6" fill="#000000" />
                      <rect x="54" y="74" width="6" height="6" fill="#000000" />
                      <rect x="66" y="80" width="6" height="6" fill="#000000" />
                      <rect x="80" y="72" width="6" height="6" fill="#000000" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-black text-slate-800 mt-1 uppercase">Scan EasyPaisa QR</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-[#141d33] border border-slate-800">
                  <span className="font-bold text-white">Step 1: Open EasyPaisa</span>
                  <p className="text-[11px] text-slate-400 mt-1">Tap 'Till Payment' or scan QR code above.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#141d33] border border-slate-800">
                  <span className="font-bold text-white">Step 2: Enter Till ID</span>
                  <p className="text-[11px] text-slate-400 mt-1">Input {tillId} and pay exactly Rs. 299.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#141d33] border border-slate-800">
                  <span className="font-bold text-white">Step 3: Save Screenshot</span>
                  <p className="text-[11px] text-slate-400 mt-1">Capture confirmation with TRX ID.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Payoneer */}
          {activeTab === 'payoneer' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141d33] to-[#1e293b] border border-sky-500/40 space-y-4">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  International Payoneer Gateway
                </span>
                <div className="text-xl sm:text-2xl font-black text-white">
                  Payoneer Email: <span className="font-mono text-sky-300">{payoneerEmail}</span>
                </div>
                <p className="text-xs text-slate-300">
                  Amount equivalent: <strong>$1.10 USD (Rs. 299 PKR Lifetime)</strong>. Send via Payoneer "Make a Payment" feature without transfer fees.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleCopy(payoneerEmail, 'payoneer')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition shadow-md active:scale-95"
                  >
                    {copiedKey === 'payoneer' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'payoneer' ? 'Email Copied!' : 'Copy Payoneer Email'}</span>
                  </button>

                  <a
                    href={`https://myaccount.payoneer.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-xs transition shadow-md active:scale-95"
                  >
                    <span>Pay on Payoneer Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-white">Payoneer Note:</span> Select "Make a Payment" &rarr; "To a recipient's Payoneer account" &rarr; enter <strong>{payoneerEmail}</strong> &rarr; enter $1.10 USD. Take a screenshot of the confirmation page and upload below.
              </div>
            </div>
          )}

          {/* TAB 3: Elevate Pay */}
          {activeTab === 'elevate' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141d33] to-[#1e293b] border border-emerald-500/40 space-y-4">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Elevate Pay / Bank Wire
                </span>
                <div className="text-lg sm:text-xl font-bold text-white">
                  Beneficiary: <span className="text-emerald-300 font-extrabold">Amir Sohail</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-200 break-all space-y-1">
                  <div><strong>Account Title:</strong> Amir Sohail</div>
                  <div><strong>IBAN / Routing:</strong> PK82MEZN00010928392102 (Meezan Bank / Elevate Partner)</div>
                  <div><strong>Amount:</strong> Rs. 299 PKR or $1.10 USD Lifetime</div>
                </div>

                <button
                  onClick={() => handleCopy('PK82MEZN00010928392102', 'elevate')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md active:scale-95"
                >
                  {copiedKey === 'elevate' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'elevate' ? 'IBAN Copied!' : 'Copy IBAN Details'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#141d33] border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-white">Elevate Pay Note:</span> Compatible with digital banking apps, Raast ID transfers, and global freelance wallets. Submit proof below.
              </div>
            </div>
          )}

          {/* COMMON VERIFICATION SECTION */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">
              Verify Your Payment (All Gateways)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter your Transaction ID / Reference ID and upload a clear screenshot of your receipt.
            </p>

            <form onSubmit={handleSubmitPayment} className="space-y-5 bg-[#141d33] p-6 sm:p-8 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Transaction ID / Reference Number *
                </label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. 2948102948 or TRX1948291034"
                  className="w-full text-xs sm:text-sm rounded-xl bg-[#0f172a] border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Upload Payment Screenshot *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="flex-1 w-full border-2 border-dashed border-slate-700 hover:border-[#E11D48] rounded-2xl p-4 text-center cursor-pointer transition">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-slate-300">Click to upload screenshot receipt</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>

                  {screenshotUrl && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                      <img src={screenshotUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FACC15] shrink-0" />
                <span>Direct ID Payment = Coming Soon (Instant automated webhook gateway currently in deployment).</span>
              </div>

              {/* Verify Button Yellow #FACC15 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-sm transition shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying Receipt...' : 'Verify Payment & Request Lifetime Access'}
              </button>
            </form>

            {submissionSuccess && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs text-center space-y-1 animate-in fade-in">
                <div className="font-bold text-sm text-emerald-300">🎉 Payment Submitted Successfully!</div>
                <p>Your payment record has been transmitted to Amir Sohail for review. Your account will be upgraded to Lifetime Premium within 24 hours.</p>
              </div>
            )}

            {/* Payment history */}
            {userPayments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Your Payment Submission History
                </h4>
                <div className="space-y-2">
                  {userPayments.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-[#141d33] border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono text-white">{p.trxId}</div>
                        <div className="text-[10px] text-slate-400">
                          {p.method || 'EasyPaisa'} • Rs. {p.amount} • {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : p.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-[#FACC15]'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* APK Download Modal */}
      <ApkDownloadModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />
    </div>
  );
};
