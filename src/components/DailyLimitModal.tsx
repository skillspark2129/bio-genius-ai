import React, { useState } from 'react';
import { getAppConfig, addPendingPayment } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { X, Copy, Check, Upload, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyLimitModal: React.FC<DailyLimitModalProps> = ({ isOpen, onClose }) => {
  const { appUser } = useAuth();
  const config = getAppConfig();

  const [showUploadStep, setShowUploadStep] = useState(false);
  const [trxId, setTrxId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedTill, setCopiedTill] = useState(false);

  if (!isOpen) return null;

  const handleCopyTill = async () => {
    await navigator.clipboard.writeText(config.easyPaisaTillId);
    setCopiedTill(true);
    setTimeout(() => setCopiedTill(false), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      alert('Please enter your Transaction ID (TRX ID).');
      return;
    }
    if (!screenshotUrl) {
      alert('Please upload your payment screenshot.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addPendingPayment({
        userId: appUser.id,
        userEmail: appUser.email,
        userName: appUser.name,
        trxId: trxId.trim(),
        screenshotUrl,
        amount: 299,
        currency: 'PKR',
      });

      setIsSubmitting(false);
      setSubmitted(true);

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-[#E11D48] p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Payment Screenshot Received!</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              Your Easypaisa payment verification for <strong>Rs. 299</strong> has been submitted. The admin will verify and activate your <strong>Unlimited Lifetime</strong> access shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-xs transition shadow-md"
            >
              Done
            </button>
          </div>
        ) : !showUploadStep ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E11D48]/20 text-[#E11D48] flex items-center justify-center mx-auto mb-4 border border-[#E11D48]/30">
              <Sparkles className="w-7 h-7" />
            </div>

            {/* Exact Required Title */}
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Daily limit reached - Upgrade to Unlimited for Rs. 299
            </h3>

            <p className="text-xs text-slate-300 mt-2 mb-6">
              You have completed your 20 free bio generations for today. Upgrade to Unlimited Lifetime to generate infinite viral bios with zero restrictions.
            </p>

            {/* Easypaisa Till ID box */}
            <div className="p-4 rounded-2xl bg-[#141d33] border border-[#FACC15]/40 mb-6 text-left">
              <div className="text-[10px] uppercase font-bold text-[#FACC15] tracking-wider mb-1">
                Easypaisa Till ID (Rs. 299 Lifetime)
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-lg font-extrabold text-white tracking-wider">
                  {config.easyPaisaTillId || '12345678'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTill}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FACC15] text-black font-bold text-xs hover:bg-[#eab308] transition shadow-xs active:scale-95"
                >
                  {copiedTill ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTill ? 'Copied' : 'Copy Till'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Send Rs. 299 to the Till ID above, take a screenshot of your receipt, and upload it below.
              </p>
            </div>

            {/* Exact Required Button */}
            <button
              onClick={() => setShowUploadStep(true)}
              className="w-full py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-sm transition shadow-xl shadow-[#FACC15]/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>I have paid - Upload Screenshot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-5">
              <h3 className="text-lg font-black text-white">Upload Easypaisa Screenshot</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Fee: Rs. 299 Lifetime Unlimited Access
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Easypaisa Transaction ID (TRX ID)
                </label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. TRX9823482104"
                  className="w-full rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Upload Payment Screenshot
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 border-2 border-dashed border-slate-700 hover:border-[#E11D48] rounded-2xl p-4 text-center cursor-pointer transition">
                    <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold text-slate-300">
                      {screenshotUrl ? 'Change image' : 'Click to select screenshot'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                      required={!screenshotUrl}
                    />
                  </label>

                  {screenshotUrl && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                      <img src={screenshotUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadStep(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Screenshot'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
