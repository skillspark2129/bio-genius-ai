import React, { useState } from 'react';
import { Star, X, Check, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { setUserRated, addRating, getCurrentUser } from '../lib/storage';

interface StarRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StarRatingModal: React.FC<StarRatingModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRated();

    const cur = getCurrentUser();
    addRating({
      userName: cur.name || 'Creator',
      userEmail: cur.email || 'creator@biogenius.ai',
      rating,
      comment: feedback.trim() || '5 Star human-like bio results!',
    });

    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onClose();
    }, 2200);
  };

  const handleDismiss = () => {
    setUserRated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-[#E11D48]/40 p-6 shadow-2xl text-white">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Thank You for Your Rating!</h3>
            <p className="text-sm text-slate-300 mt-2">
              Your feedback fuels our mission to empower 10,000+ creators worldwide from Thakot, Battagram.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-center">
            <div className="inline-flex p-3 rounded-2xl bg-[#E11D48]/20 text-[#E11D48] mb-3">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold">Enjoying Bio Genius AI?</h3>
            <p className="text-xs text-slate-300 mt-1 mb-5">
              You've generated 3+ bios! How would you rate the human-like quality of your results?
            </p>

            {/* 5 Stars */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoveredRating || rating) >= star
                        ? 'fill-[#FACC15] text-[#FACC15]'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-[#FACC15] mb-4">
              {rating === 5 && '⭐⭐⭐⭐⭐ 100% Human-Like & Viral!'}
              {rating === 4 && '⭐⭐⭐⭐ Very Good Quality'}
              {rating === 3 && '⭐⭐⭐ Good, with room to improve'}
              {rating <= 2 && 'Needs refinement'}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Any specific vibe, language, or feature you'd like Amir Sohail to add? (Optional)"
              rows={3}
              className="w-full text-xs rounded-xl bg-[#141d33] border border-slate-700 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48] transition resize-none mb-4"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Maybe Later
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-bold text-xs transition shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-black" />
                <span>Submit Rating</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
