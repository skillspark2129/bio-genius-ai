import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Send, ShieldAlert } from 'lucide-react';
import { addComplaint } from '../lib/storage';
import { getCurrentUser } from '../lib/storage';

interface ComplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBioSnippet?: string;
  initialType?: 'Wrong Bio' | 'Bug' | 'Payment' | 'Other';
}

export const ComplainModal: React.FC<ComplainModalProps> = ({
  isOpen,
  onClose,
  initialBioSnippet,
  initialType = 'Wrong Bio',
}) => {
  const currentUser = getCurrentUser();
  const [name, setName] = useState(currentUser.name === 'Guest Creator' ? '' : currentUser.name);
  const [email, setEmail] = useState(currentUser.email === 'guest@biogenius.ai' ? '' : currentUser.email);
  const [type, setType] = useState<'Wrong Bio' | 'Bug' | 'Payment' | 'Other'>(initialType);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      addComplaint({
        name: name.trim(),
        email: email.trim(),
        type,
        message: message.trim(),
        bioSnippet: initialBioSnippet,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage('');
        onClose();
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-[#E11D48]/20 text-[#E11D48]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Report / File a Complaint</h3>
            <p className="text-xs text-slate-400">Directly reviewed by Bio Genius AI founder Amir Sohail</p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-10 text-center animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Complaint Submitted Successfully</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your feedback has been logged to the admin dashboard. We investigate every report within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {initialBioSnippet && (
              <div className="p-3 rounded-xl bg-[#141d33] border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-[#FACC15]">Referenced Bio:</span>
                <p className="italic mt-1 text-slate-400 line-clamp-2">{initialBioSnippet}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amir Sohail"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d33] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d33] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Issue Category *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d33] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#E11D48]"
              >
                <option value="Wrong Bio">Wrong Bio / Hallucinated or Inaccurate</option>
                <option value="Bug">Technical Bug / App Glitch</option>
                <option value="Payment">Payment / Screenshot Issue (EasyPaisa/Payoneer)</option>
                <option value="Other">Other Suggestion or Grievance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Describe the Complaint in Detail *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain what went wrong or how we can improve..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d33] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#be123c] text-white text-xs font-extrabold transition flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
