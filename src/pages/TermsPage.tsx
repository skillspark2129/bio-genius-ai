import React, { useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Scale, Ban, Sparkles } from 'lucide-react';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms and Service | Last updated: October 2026';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/30 text-xs font-bold mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Binding Agreement &amp; Operating Standards</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms and Service | Last updated: October 2026
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Governing your access and utilization of Bio Genius AI, founded by Amir Sohail in Thakot, Battagram, Pakistan.
          </p>
        </div>

        {/* 1. Acceptance */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing, browsing, registering an account on, or interacting with Bio Genius AI (including our web application, PWA installation, and programmatic SEO bio catalog), you confirm that you have read, comprehended, and unconditionally agree to be bound by these Terms and Service. If you do not accept these provisions in their entirety, you must immediately cease using the platform.
          </p>
        </section>

        {/* 2. Free vs Lifetime Premium & EasyPaisa Verification */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FACC15]" />
            <span>2. Free Tier, Lifetime Premium (Rs. 299), &amp; EasyPaisa Payments</span>
          </h2>
          <p>
            Bio Genius AI offers both a complimentary free tier and a Lifetime Premium plan:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Free Tier:</strong> Permits up to twenty (20) bio generations per calendar day using standard conversational models in English.</li>
            <li><strong>Lifetime Premium:</strong> Accessible for a one-time charge of exactly <strong>Rs. 299 PKR</strong>. Grants indefinite unlimited generations, GPT-4 and Gemini Argon level engines, all seventeen (17) languages, and an ad-free interface.</li>
            <li><strong>Payment &amp; Non-Refundability:</strong> Payments are conducted by sending Rs. 299 to our authorized <strong>EasyPaisa Till ID 12345678</strong>. Once an administrator validates your uploaded transaction receipt and toggles your account state to <code>isPremium: true</code>, this transaction is final, fully delivered, and non-refundable under all circumstances.</li>
            <li><strong>Fraud Ban:</strong> Any submission of falsified receipt screenshots, forged transaction IDs, chargeback exploits, or recycled receipts will result in immediate and permanent account termination and IP blacklisting.</li>
          </ul>
        </section>

        {/* 3. User Conduct & Rate Limits */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Ban className="w-4 h-4 text-[#E11D48]" />
            <span>3. User Conduct &amp; Strict Rate Limiting</span>
          </h2>
          <p>
            Users agree not to abuse or overwhelm our computational infrastructure. We enforce automated rate limits of maximum <strong>20 requests per minute per IP address</strong> and <strong>20 free bios per day per account</strong>. Any automated scraping, headless browser hammering, bot exploitation, or reverse engineering of <code>/api/generate</code> will trigger an automated HTTP 429 Too Many Requests response and temporary or permanent IP bans.
          </p>
        </section>

        {/* 4. Intellectual Property & Branding */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>4. Intellectual Property &amp; Brand Rights</span>
          </h2>
          <p>
            The Bio Genius AI brand, logos, proprietary user interface layouts, signature Dark Theme (<code>#0a0f1e</code>), Secondary Red accents (<code>#E11D48</code>), and Accent Yellow highlights (<code>#FACC15</code>) are the exclusive intellectual property of Amir Sohail. You are granted a personal, non-exclusive license to utilize generated bios for personal or commercial social media profiles without paying royalties to Bio Genius AI.
          </p>
        </section>

        {/* 5. The 7 Zahar (Poison) Protection Rules */}
        <section className="space-y-3 p-5 rounded-2xl bg-[#141d33] border border-amber-500/40">
          <h2 className="text-base sm:text-lg font-bold text-[#FACC15] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FACC15]" />
            <span>5. The 7 Zahar (Poison) Content &amp; Quality Protections</span>
          </h2>
          <p className="text-slate-300">
            To preserve search engine integrity, user trust, and world-class creator quality, Bio Genius AI strictly forbids and prevents the following seven toxic practices across all generations:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li><strong>No Keyword Stuffing:</strong> Bios must maintain organic conversational rhythm and never dump repetitive spam tags.</li>
            <li><strong>No Hidden Text:</strong> All content, links, and emojis must be visibly rendered for human readers.</li>
            <li><strong>No Cloaking:</strong> Providing different content to search engines than to human visitors is strictly forbidden.</li>
            <li><strong>No Duplicate Content:</strong> Every generated bio is syntactically diversified with distinct hooks and phrasing.</li>
            <li><strong>No Thin Content:</strong> Programmatic guides must contain comprehensive explanations, FAQs, and valuable context.</li>
            <li><strong>No AI Spam:</strong> All generations are audited to guarantee a 98%+ human cadence score free of robotic cliches.</li>
            <li><strong>No Deceptive Redirects:</strong> Internal navigation links must lead directly and transparently to legitimate resources.</li>
          </ol>
        </section>

        {/* 6. Disclaimer of Warranties */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white">
            6. "As-Is" Disclaimer &amp; Limitation of Liability
          </h2>
          <p>
            Bio Genius AI provides bio generation and SEO suggestions on an "as-is" and "as-available" basis. While our bios are engineered to maximize social engagement and follower conversion, we do not guarantee specific viral performance, platform algorithm favor, or follower growth. In no event shall Amir Sohail or Bio Genius AI be liable for any indirect, incidental, or consequential damages resulting from platform downtime or third-party social media policy changes.
          </p>
        </section>

        {/* Mandatory Footer Line */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
          For any queries, contact: <a href="mailto:baithakotbattagram1@gmail.com" className="text-slate-200 underline">baithakotbattagram1@gmail.com</a> | Last updated: October 2026
        </div>
      </div>
    </div>
  );
};
