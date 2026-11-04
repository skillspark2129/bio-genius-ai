import React, { useEffect } from 'react';
import { Mail, MapPin, Clock, Award, ShieldCheck, Heart, Sparkles, ExternalLink, Linkedin, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'About Bio Genius AI - Trusted Bio Generator by Amir Sohail';
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E11D48]/15 border border-[#E11D48]/30 text-[#E11D48] text-xs font-bold mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>E-E-A-T Verified • Founder Story &amp; Vision</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About Bio Genius AI - Trusted Bio Generator by Amir Sohail
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-slate-300">
          The engineering, craft, and regional heart behind the world's most human-like social bio creator.
        </p>
      </div>

      {/* Founder Profile Showcase Card */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-10 shadow-2xl mb-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Founder Photo */}
          <div className="shrink-0 text-center">
            <div className="w-44 h-44 rounded-2xl overflow-hidden border-2 border-[#E11D48] shadow-2xl mx-auto relative group">
              <img
                src="/images/amir-sohail.jpg"
                alt="Amir Sohail - Founder & CEO of Bio Genius AI"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-3">
              <h3 className="font-extrabold text-base text-white">Amir Sohail</h3>
              <p className="text-xs text-[#E11D48] font-bold">Founder &amp; CEO</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <a
                  href="https://linkedin.com/in/amir-sohail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-950/60 border border-sky-600/40 text-sky-400 hover:text-white text-xs font-semibold transition"
                >
                  <Linkedin className="w-3 h-3" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Founder Quote & Vision (E-E-A-T 500+ words) */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#141d33] to-[#1a2542] border-l-4 border-[#E11D48]">
              <blockquote className="italic text-slate-100 font-medium">
                "Hi, I'm Amir Sohail, Founder &amp; CEO of Bio Genius AI, based in Thakot, Battagram, Khyber Pakhtunkhwa, Pakistan. I founded Bio Genius AI with a vision to empower over 10,000 creators worldwide by simplifying the generation of professional, SEO-optimized, and human-like bios for Instagram, TikTok, YouTube, and LinkedIn. Our mission is to make the complex task of crafting the perfect bio effortless and accessible in up to 17 languages. We are dedicated to providing creators with tools that truly represent them and help them connect with their audience."
              </blockquote>
            </div>

            <p>
              Growing up in Thakot, Battagram, nestled in the ruggedly beautiful valleys of northern Pakistan, I observed how digital connectivity can bridge local talent with international opportunities. Over the last decade, creators and small business owners from remote cities to global metropolitan centers have faced the identical challenge: translating their passion, work ethic, and individual identity into a tiny 150-character social profile bio that actually converts visitors into engaged followers.
            </p>

            <p>
              Traditional copy generation engines routinely churn out stale, repetitive clichés loaded with robotic buzzwords like "delving into synergies" and "unleashing potential." Social platform algorithms and real human readers immediately dismiss this kind of automated spam. With <strong>Bio Genius AI</strong>, our engineering methodology centers on calibrating natural rhythm, contextual emojis, and organic sentence variation that consistently scores 98%+ on rigorous AI detection benchmarks.
            </p>

            <p>
              We purposefully priced our <strong>Lifetime Premium at Rs. 299</strong> to remove financial barriers for emerging creators, students, and independent freelancers across Pakistan and globally. By pairing cutting-edge AI models with local payment accessibility through EasyPaisa, we ensure that every creator has world-class tools at their fingertips without recurring monthly debt.
            </p>
          </div>
        </div>
      </div>

      {/* MANDATORY Contact Box */}
      <div className="rounded-3xl bg-[#141d33] border border-slate-700/80 p-6 sm:p-8 shadow-xl mb-12">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#FACC15]" />
          <span>Founder Contact Box &amp; Direct Channel</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800">
            <div className="text-slate-400 font-bold uppercase text-[10px] mb-1">Direct Founder Email</div>
            <a
              href="mailto:baithakotbattagram1@gmail.com"
              className="text-white hover:text-[#FACC15] font-semibold text-xs break-all underline"
            >
              baithakotbattagram1@gmail.com
            </a>
          </div>

          <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800">
            <div className="text-slate-400 font-bold uppercase text-[10px] mb-1">Physical Location</div>
            <div className="text-white font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>Thakot, Battagram, Pakistan</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800">
            <div className="text-slate-400 font-bold uppercase text-[10px] mb-1">Response Time SLA</div>
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Within 24 Hours Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principles & Anti-Slop Discipline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-[#E11D48]/20 text-[#E11D48] flex items-center justify-center font-bold mb-3">
            01
          </div>
          <h4 className="font-bold text-white text-sm mb-2">Zero Robotic Clichés</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every output is cleansed of unnatural AI idioms. We prioritize authentic voice, dynamic line breaks, and cultural slang.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#FACC15] flex items-center justify-center font-bold mb-3">
            02
          </div>
          <h4 className="font-bold text-white text-sm mb-2">17 Global Languages</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            From Urdu poetry and Arabic elegance to Spanish charisma and Japanese brevity, reach your target audience natively.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3">
            03
          </div>
          <h4 className="font-bold text-white text-sm mb-2">Community First</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Continuous enhancements directed by feedback from actual creators across YouTube, TikTok, LinkedIn, and Instagram.
          </p>
        </div>
      </div>

      {/* JSON-LD Schemas: Person & Organization for Logo SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: 'Bio Genius AI',
                url: typeof window !== 'undefined' ? window.location.origin : 'https://biogenius.ai',
                logo: typeof window !== 'undefined' ? `${window.location.origin}/bio-genius-ai-logo-wide.webp` : 'https://biogenius.ai/bio-genius-ai-logo-wide.webp',
                founder: 'Amir Sohail',
                email: 'baithakotbattagram1@gmail.com',
                address: 'Thakot, Battagram, Pakistan',
                sameAs: ['https://linkedin.com/in/amir-sohail'],
              },
              {
                '@type': 'Person',
                name: 'Amir Sohail',
                email: 'baithakotbattagram1@gmail.com',
                address: 'Thakot, Battagram, Pakistan',
                jobTitle: 'Founder & CEO of Bio Genius AI',
              },
            ],
          }),
        }}
      />
    </div>
  );
};
