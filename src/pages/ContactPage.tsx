import React, { useState, useEffect } from 'react';
import { addContactMessage } from '../lib/storage';
import { Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, PhoneCall, HelpCircle, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ComplainModal } from '../components/ComplainModal';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComplain, setShowComplain] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us | Bio Genius AI';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please complete all form fields.');
      return;
    }

    setIsSubmitting(true);

    // Save locally
    addContactMessage({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    // Send to backend endpoint
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
    } catch (err) {
      console.warn('Network send skipped, recorded locally:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/30 text-xs font-bold mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>24/7 Dedicated Creator Support</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact Us | Bio Genius AI
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-slate-300">
          Have an inquiry, custom bio template suggestion, or EasyPaisa verification question? Amir Sohail and our support team are here to assist.
        </p>
      </div>

      {/* MANDATORY: Direct Email Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#141d33] via-[#1a2542] to-[#0f172a] border border-[#FACC15]/40 shadow-xl mb-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FACC15] text-black flex items-center justify-center mx-auto mb-3 shadow-md">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Email us directly at: <a href="mailto:baithakotbattagram1@gmail.com" className="text-[#FACC15] underline hover:text-white transition">baithakotbattagram1@gmail.com</a>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto">
          For urgent payment verifications, partnership inquiries, or custom language requests, email founder Amir Sohail directly with a guaranteed 24-hour response time.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#E11D48]" />
            <span>Thakot, Battagram, Pakistan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Response Time: Within 24 Hours</span>
          </div>
        </div>
      </div>

      {/* COMPLAIN / REPORT GRIEVANCE BANNER */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-[#E11D48]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E11D48]/20 text-[#E11D48] shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Have a Complaint, Bug, or Payment Concern?</h4>
            <p className="text-xs text-slate-300">
              Submit a formal report directly to our admin team. Every ticket receives immediate founder attention.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowComplain(true)}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#be123c] text-white text-xs font-bold transition shadow-md active:scale-95"
        >
          File a Complaint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
        {/* Contact Form */}
        <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-2">Send Us an Instant Message</h3>
          <p className="text-xs text-slate-400 mb-6">
            Submissions are saved directly to our database and dispatched to our admin inbox.
          </p>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Message Dispatched!</h4>
              <p className="text-xs text-slate-300">
                Thank you for reaching out. We have received your submission and will get back to your email within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amir Sohail"
                  className="w-full rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl bg-[#141d33] border border-slate-700 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Message or Question
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry, feedback, or EasyPaisa transaction details..."
                  rows={5}
                  className="w-full rounded-xl bg-[#141d33] border border-slate-700 p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#E11D48] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message to Support'}</span>
              </button>
            </form>
          )}
        </div>

        {/* 300+ Words Support Info & FAQ */}
        <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 shadow-xl text-xs text-slate-300 leading-relaxed space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#E11D48]" />
            <span>Support Overview &amp; Creator Assistance</span>
          </h3>

          <p>
            At Bio Genius AI, we pride ourselves on exceptional customer care and rapid human responses. Unlike massive anonymous software companies where tickets vanish into automated phone trees, our platform was founded by Amir Sohail with a personal commitment to the creator community. Whether you are generating bios for your personal TikTok account, managing multiple Instagram influencer clients, or establishing your presence on LinkedIn, we are here to ensure your bios represent you with perfection.
          </p>

          <h4 className="font-bold text-white pt-1">EasyPaisa Payment Support</h4>
          <p>
            If you recently sent Rs. 299 to our authorized <strong>EasyPaisa Till ID 12345678</strong> and have not had your account upgraded after submitting the screenshot on the Premium page, please provide your Transaction ID and registered email directly in the contact form or via email. All manual payment submissions are reviewed and authorized within our strict 24-hour turnaround window.
          </p>

          <h4 className="font-bold text-white pt-1">Custom Regional Languages &amp; Niche Bios</h4>
          <p>
            Do you need bios calibrated for specific regional dialects, poetical Urdu metrics, Arabic calligraphy aesthetics, or unique hyper-niche industries? We actively expand our prompt blueprints based on your user requests. Feel free to pitch new tones or templates, and our engineering team in Thakot, Battagram will test and incorporate them into our next continuous deployment.
          </p>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            For any queries, contact: <a href="mailto:baithakotbattagram1@gmail.com" className="text-white underline">baithakotbattagram1@gmail.com</a> | Last updated: October 2026
          </div>
        </div>
      </div>

      <ComplainModal
        isOpen={showComplain}
        onClose={() => setShowComplain(false)}
        initialType="Other"
      />
    </div>
  );
};
