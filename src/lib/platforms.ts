/**
 * 20 Platforms Definition for Bio Genius AI
 * Global Professional Bio Generator
 */

export interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  slug: string;
  charLimit: string;
  desc: string;
  category: string;
}

export const PLATFORMS_20: PlatformConfig[] = [
  { id: 'instagram', name: 'Instagram', icon: '📸', slug: 'instagram-bio', charLimit: '150 chars max', desc: 'Aesthetic spacing & viral hook', category: 'Social' },
  { id: 'facebook', name: 'Facebook', icon: '👥', slug: 'facebook-bio', charLimit: '255 chars bio', desc: 'Friendly, community-first', category: 'Social' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', slug: 'tiktok-bio', charLimit: '80 chars max', desc: 'Snappy, punchy Gen-Z lines', category: 'Video' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', slug: 'youtube-bio', charLimit: '1000 chars desc', desc: 'SEO keyword channel summaries', category: 'Video' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', slug: 'whatsapp-bio', charLimit: '139 chars status', desc: 'Clean about lines & quotes', category: 'Messaging' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', slug: 'linkedin-bio', charLimit: '220 chars headline', desc: 'Executive high-authority value pitch', category: 'Professional' },
  { id: 'twitter', name: 'Twitter X', icon: '✖️', slug: 'twitter-bio', charLimit: '160 chars bio', desc: 'Witty, thought-leader bullet lines', category: 'Social' },
  { id: 'snapchat', name: 'Snapchat', icon: '👻', slug: 'snapchat-bio', charLimit: 'Short aesthetic', desc: 'Vibe check & streak handles', category: 'Social' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', slug: 'telegram-bio', charLimit: '70 chars bio', desc: 'Direct, contact & crypto friendly', category: 'Messaging' },
  { id: 'tinder', name: 'Tinder', icon: '🔥', slug: 'tinder-bio', charLimit: '500 chars bio', desc: 'High conversion dating charisma', category: 'Dating' },
  { id: 'discord', name: 'Discord', icon: '👾', slug: 'discord-bio', charLimit: '190 chars bio', desc: 'Gamer tags, anime & community role', category: 'Gaming' },
  { id: 'threads', name: 'Threads', icon: '🧵', slug: 'threads-bio', charLimit: '150 chars bio', desc: 'Conversational & authentic voice', category: 'Social' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', slug: 'pinterest-bio', charLimit: '160 chars bio', desc: 'Moodboards, design & lifestyle', category: 'Lifestyle' },
  { id: 'twitch', name: 'Twitch', icon: '🎮', slug: 'twitch-bio', charLimit: '300 chars panel', desc: 'Stream schedule & gaming setup', category: 'Gaming' },
  { id: 'cv-resume', name: 'CV Resume', icon: '📄', slug: 'cv-resume-bio', charLimit: 'Professional summary', desc: 'ATS-friendly career elevator pitch', category: 'Professional' },
  { id: 'gaming-pubg-freefire', name: 'Gaming PUBG Free Fire', icon: '🔫', slug: 'gaming-pubg-freefire-bio', charLimit: 'KD & clan tag', desc: 'Esports clan status & sniper king', category: 'Gaming' },
  { id: 'business-brand', name: 'Business Brand', icon: '🏢', slug: 'business-brand-bio', charLimit: 'Clear value prop', desc: 'B2B/B2C trust badges & CTAs', category: 'Business' },
  { id: 'attitude', name: 'Attitude', icon: '⚡', slug: 'attitude-bio', charLimit: 'High Swagger', desc: 'Bold, king & royal aura lines', category: 'Trending' },
  { id: 'aesthetic', name: 'Aesthetic', icon: '✨', slug: 'aesthetic-bio', charLimit: 'Minimalist poetry', desc: 'Soft pastel vibes & quiet luxury', category: 'Trending' },
  { id: 'vip-stylish', name: 'VIP Stylish', icon: '👑', slug: 'vip-stylish-bio', charLimit: 'Royal status', desc: 'Luxury symbols & classy swagger', category: 'Trending' }
];

export function getPlatformById(id: string): PlatformConfig {
  const found = PLATFORMS_20.find((p) => p.id === id || p.slug === id || p.slug === `${id}-bio`);
  return found || PLATFORMS_20[0];
}
