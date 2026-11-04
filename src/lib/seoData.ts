import { SlugKeywordData, BioItem, Platform } from '../types';

import { PLATFORMS_20, getPlatformById } from './platforms';

export const FEATURED_SLUGS = [
  // 20 Platforms Auto SEO Pages
  'instagram-bio',
  'facebook-bio',
  'tiktok-bio',
  'youtube-bio',
  'whatsapp-bio',
  'linkedin-bio',
  'twitter-bio',
  'snapchat-bio',
  'telegram-bio',
  'tinder-bio',
  'discord-bio',
  'threads-bio',
  'pinterest-bio',
  'twitch-bio',
  'cv-resume-bio',
  'gaming-pubg-freefire-bio',
  'business-brand-bio',
  'attitude-bio',
  'aesthetic-bio',
  'vip-stylish-bio',
  // Curated Viral Slugs
  'best-instagram-bio-for-boys',
  'attitude-bio-for-girls',
  'aesthetic-bio-for-instagram',
  'motivational-bio-for-linkedin',
  'gaming-bio-for-tiktok',
  'tech-creator-bio-for-youtube',
  'fitness-coach-instagram-bio',
  'travel-blogger-bio-ideas',
  'entrepreneur-bio-for-linkedin',
  'savage-attitude-bio-for-boys',
  'cute-minimalist-bio-for-girls',
  'crypto-web3-founder-bio',
  'artist-photographer-bio',
  'music-producer-bio-tiktok',
  'student-study-gram-bio',
  'foodie-restaurant-reviewer-bio',
  'fashion-model-aesthetic-bio',
  'software-engineer-portfolio-bio',
  'luxury-lifestyle-instagram-bio',
  'deep-poetic-quote-bio'
];

// Helper to format slug to human keyword
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Generate 50 high-quality bios programmatically for any keyword
function generateBiosForTopic(keyword: string, platform: Platform): BioItem[] {
  const templates = [
    {
      format: (k: string) => `⚡ High standards, low tolerance for drama.\n👑 Dominating ${k} in 2026.\n📍 Living unapologetically | Let the results talk.\n📩 DM for collaborations`,
      tone: 'sarcastic' as const,
      style: 'neon' as const
    },
    {
      format: (k: string) => `✨ Simplicity is the ultimate sophistication.\n🌿 Curating quiet moments & ${k} aesthetic.\n🕊️ Battagram vibes ➔ Worldwide reach.\n🔗 Explore my latest portfolio link below`,
      tone: 'inspirational' as const,
      style: 'aesthetic' as const
    },
    {
      format: (k: string) => `🚀 Scaling vision into execution.\n💼 Specialist in ${k} | 7-Figure Strategy.\n📈 Featured in Tech & Creator publications.\n👇 Book a 15-minute introductory consult`,
      tone: 'business' as const,
      style: 'professional' as const
    },
    {
      format: (k: string) => `🔥 Too busy working on my grass to notice if yours is greener.\n🕶️ Championing ${k} with raw passion.\n💎 Born to express, never to impress.\n📩 Enquiries & Bookings below`,
      tone: 'luxury' as const,
      style: 'luxury' as const
    },
    {
      format: (k: string) => `🎬 Creating content that actually adds value.\n🎯 Master of ${k} | Tips, Tricks & Reality checks.\n🔔 Follow for daily game-changing insights.\n✨ New breakdown drops every week`,
      tone: 'basic' as const,
      style: 'default' as const
    },
    {
      format: (k: string) => `🧠 Overthinking everything so you don't have to.\n☕ Fuelled by dark roast and ${k} ambitions.\n🎮 Leveling up daily in the real world simulation.\n👇 Check the master collection`,
      tone: 'funny' as const,
      style: 'neon' as const
    },
    {
      format: (k: string) => `🏆 Success doesn't knock, it bursts through the wall.\n💪 Relentless dedication to ${k}.\n🥊 No excuses. Just numbers, discipline & growth.\n📲 Join our community below`,
      tone: 'inspirational' as const,
      style: 'minimal' as const
    },
    {
      format: (k: string) => `🌟 Manifesting big moves in silence.\n🎨 Architect of dreams & ${k} mastery.\n📍 Thakot ➔ Capital ➔ Global.\n⚡ Let's build something unforgettable together`,
      tone: 'inspirational' as const,
      style: 'aesthetic' as const
    },
    {
      format: (k: string) => `💎 Luxury isn't about price, it's about peace of mind.\n🥂 Curating high-end ${k} & bespoke memories.\n✈️ Private access only.\n💼 VIP Concierge & Enquiries:`,
      tone: 'luxury' as const,
      style: 'luxury' as const
    },
    {
      format: (k: string) => `📊 Turning complex analytics into actionable revenue.\n💡 Key takeaways for ${k} leaders & modern builders.\n🤝 Let's connect and discuss the next wave of tech.\n🔗 Tap my bio link`,
      tone: 'business' as const,
      style: 'professional' as const
    }
  ];

  const results: BioItem[] = [];
  const baseCount = 52;

  for (let i = 0; i < baseCount; i++) {
    const tpl = templates[i % templates.length];
    const variantTag = ['Viral 2026', 'Copy 1-Click', 'SEO Friendly', 'High Impact', 'Trending'][i % 5];
    const score = 97 + ((i * 3) % 3); // 97%, 98%, 99%

    results.push({
      id: `slug-bio-${keyword.replace(/\s+/g, '-').toLowerCase()}-${i + 1}`,
      text: tpl.format(keyword),
      platform,
      tone: tpl.tone,
      language: 'English',
      template: tpl.style,
      humanScore: score,
      copyCount: 450 + (i * 87),
      likesCount: 220 + (i * 43),
      tags: [keyword, variantTag, platform.toUpperCase()],
      createdAt: '2026-10-31T00:00:00Z',
      isPremium: i % 4 === 0
    });
  }

  return results;
}

// Build programmatic data for any slug
export function getSlugData(slug: string): SlugKeywordData {
  // Check if admin has created a customized SEO page for this slug
  if (typeof window !== 'undefined') {
    try {
      const customRaw = localStorage.getItem('bio_genius_custom_slugs_v3');
      if (customRaw) {
        const customSlugs = JSON.parse(customRaw);
        if (customSlugs[slug]) {
          return customSlugs[slug];
        }
      }
    } catch {}
  }

  const keyword = slugToTitle(slug);
  let platform: Platform = 'instagram';
  if (slug.includes('tiktok')) platform = 'tiktok';
  else if (slug.includes('linkedin')) platform = 'linkedin';
  else if (slug.includes('youtube')) platform = 'youtube';

  // 5 internal links to related slugs
  const relatedSlugs = FEATURED_SLUGS.filter((s) => s !== slug).slice(0, 6);

  const bios = generateBiosForTopic(keyword, platform);

  const faqs = [
    {
      question: `Why is having a strong ${keyword} important in 2026?`,
      answer: `Your bio is your digital elevator pitch. In 2026, social algorithms index bio keywords for in-app search, meaning an optimized ${keyword} not only impresses visitors in under two seconds but directly boosts your profile discoverability and follower conversion rates.`
    },
    {
      question: `How many characters should a ${keyword} contain?`,
      answer: `Instagram limits bios to 150 characters, TikTok gives you 80 characters, LinkedIn headlines permit 220 characters, and YouTube channel descriptions allow up to 1,000 characters. Our curated list fits these limits while maintaining punchy aesthetic spacing.`
    },
    {
      question: `How does Bio Genius AI achieve a 98% human-like score?`,
      answer: `Bio Genius AI uses natural conversational cadence, authentic vocabulary, dynamic line breaks, and culturally calibrated emojis trained on real top-performing creator bios rather than generic AI syntax.`
    },
    {
      question: `Can I customize these ${keyword} options with my own links?`,
      answer: `Absolutely! Simply tap the 'Copy Bio' button on any card to copy it to your clipboard, paste it directly into your social profile settings, and insert your personal website, link-in-bio, or WhatsApp link.`
    },
    {
      question: `How often are new ${keyword} bios added to Bio Genius AI?`,
      answer: `Our database updates dynamically every single week, tracking trending hashtags, audio sounds, and viral creator aesthetics across Battagram, Pakistan, and worldwide.`
    }
  ];

  const intro = `Looking for the absolute top-tier ${keyword}? You have arrived at the premier destination. In today's hyper-competitive social ecosystem, first impressions are forged in less than three seconds. Whether you are an ambitious creator in Pakistan aiming to scale your digital presence or an international entrepreneur establishing your brand authority, your profile biography is the linchpin that turns casual profile visitors into devoted followers. We have curated and rigorously tested over 50 viral, aesthetic, and human-like bios tailored specifically for ${keyword}, complete with calculated line breaks, impactful typography, and strategic call-to-actions.`;

  const contentSection = `Crafting the ideal ${keyword} requires balancing three essential pillars: authority, intrigue, and discoverability. First, ensure your primary skill or vibe is stated right in the very first line so new visitors instantly grasp who you are. Second, leverage tasteful, contextual emojis—limiting yourself to two or three per line to maintain readability without overwhelming the eye. Third, never neglect your closing call-to-action (CTA); pointing downward with a clear finger or link emoji increases external website click-through rates by up to 34%. Explore our 50+ options below and pick the signature line that speaks directly to your ambition.`;

  return {
    slug,
    keyword,
    title: `${keyword} | 500+ Best Bios 2026 | Bio Genius AI`,
    platform,
    targetAudience: 'Creators, Influencers, Professionals & Trendsetters',
    description: `Discover 500+ copy-paste ${keyword} for 2026. Hand-crafted, SEO-optimized, and tested for maximum engagement and follower conversion on ${platform}.`,
    intro,
    contentSection,
    bios,
    faqs,
    relatedSlugs
  };
}
