import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, Trash2, Mail, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Last updated: October 2026 | Contact baithakotbattagram1@gmail.com';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR &amp; Global Privacy Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy | Last updated: October 2026 | Contact baithakotbattagram1@gmail.com
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Bio Genius AI, founded by Amir Sohail in Thakot, Battagram, Pakistan, values your digital privacy and data sovereignty.
          </p>
        </div>

        {/* 1. What We Collect */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E11D48]" />
            <span>1. Information We Collect</span>
          </h2>
          <p>
            When you interact with Bio Genius AI (accessible via web and our Progressive Web Application), we collect minimal, strictly necessary data required to deliver high-quality bio generation services. This information includes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Account Details:</strong> Your name, email address, hashed credentials, and account creation timestamps when you register.</li>
            <li><strong>Generated Bios &amp; Prompts:</strong> Text prompts you supply into the generator (such as your niche, hobbies, or brand vibe), selected language options, and customized saved bios.</li>
            <li><strong>Payment &amp; Verification Evidence:</strong> EasyPaisa Transaction IDs (TRX ID), uploaded receipt screenshots, and verification timestamps submitted for Lifetime Premium approvals.</li>
            <li><strong>Technical &amp; Telemetry Data:</strong> IP addresses (anonymized for rate-limiting), browser user-agent tokens, session timestamps, and device platform details.</li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#FACC15]" />
            <span>2. How We Utilize Your Data</span>
          </h2>
          <p>
            We process collected information under legitimate interest and explicit user consent for the following bounded objectives:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>To synthesize, humanize, and format social media bios across Instagram, TikTok, LinkedIn, and YouTube in 17 supported languages.</li>
            <li>To enforce strict security and abuse mitigation, including our 20 bios/day free quota and 20 requests/minute per-IP rate-limiting thresholds.</li>
            <li>To verify manual EasyPaisa Till transactions and activate lifetime premium privileges.</li>
            <li>To continuously calibrate our 98% human-like natural language models to ensure output authenticity.</li>
          </ul>
        </section>

        {/* 3. Security, Hashing, & App Check */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>3. Firebase Security, Hashing, &amp; App Check Defense</span>
          </h2>
          <p>
            We implement bank-grade encryption protocols and zero-trust backend architectures. All authentication credentials are encrypted using industry-standard bcryptjs key-derivation algorithms with salt rounds; plain text passwords are never logged or stored. Our endpoints are shielded by Firebase App Check and reCAPTCHA v3 to defend against botnet flooding, credential stuffing, and scraping attacks. All network transit is enforced via HTTPS TLS 1.3 encryption.
          </p>
        </section>

        {/* 4. Cookies & AdSense AdSlot Specifications */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>4. Cookies, Local Storage, &amp; Advertising Disclosures</span>
          </h2>
          <p>
            Bio Genius AI employs lightweight browser localStorage cookies to maintain your active login session, remember your dark/light theme preference, and save your favorite bios offline. For free-tier users, non-intrusive sponsor slots (conforming to our strict minimum container height of 120px) may display third-party advertisements via Google AdSense or verified creator networks. These partners may utilize standard tracking cookies subject to their independent privacy standards. Lifetime Premium accounts enjoy an entirely ad-free experience.
          </p>
        </section>

        {/* 5. User Rights & Data Deletion */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>5. Your Data Rights &amp; Erasure Requests</span>
          </h2>
          <p>
            Under international privacy frameworks including GDPR and CCPA, you retain unconditional rights to inspect, export, or permanently erase all personal data associated with your identity. If you wish to delete your account, saved bios, or payment logs from our records, simply send an email directly from your registered address to <a href="mailto:baithakotbattagram1@gmail.com" className="text-[#FACC15] underline">baithakotbattagram1@gmail.com</a> with the subject line <em>"Data Erasure Request"</em>. Our team will process and confirm complete deletion within 48 business hours.
          </p>
        </section>

        {/* 6. Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">
            6. Children Under 13 Not Allowed
          </h2>
          <p>
            Bio Genius AI is strictly designed for creators, professionals, and individuals aged 13 and above. We do not knowingly solicit or collect personally identifiable information from minors under the age of 13. If you become aware that a child under 13 has registered without parental consent, please alert us immediately at <a href="mailto:baithakotbattagram1@gmail.com" className="text-[#FACC15] underline">baithakotbattagram1@gmail.com</a> so we may purge their records.
          </p>
        </section>

        {/* Contact info box */}
        <div className="p-4 rounded-2xl bg-[#141d33] border border-slate-700/80 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="font-bold text-white">Have questions about this Privacy Policy?</div>
            <div className="text-xs text-slate-400">Direct contact: Amir Sohail, Thakot, Battagram, Pakistan.</div>
          </div>
          <a
            href="mailto:baithakotbattagram1@gmail.com"
            className="px-4 py-2 rounded-xl bg-[#E11D48] text-white font-bold text-xs hover:bg-[#be123c] transition shadow-md"
          >
            Email baithakotbattagram1@gmail.com
          </a>
        </div>

        {/* Mandatory Footer Line */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
          For any queries, contact: <a href="mailto:baithakotbattagram1@gmail.com" className="text-slate-200 underline">baithakotbattagram1@gmail.com</a> | Last updated: October 2026
        </div>
      </div>
    </div>
  );
};
