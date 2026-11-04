export type Platform =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'whatsapp'
  | 'linkedin'
  | 'twitter'
  | 'snapchat'
  | 'telegram'
  | 'tinder'
  | 'discord'
  | 'threads'
  | 'pinterest'
  | 'twitch'
  | 'cv-resume'
  | 'gaming-pubg-freefire'
  | 'business-brand'
  | 'attitude'
  | 'aesthetic'
  | 'vip-stylish'
  | string;

export type Tone = 'basic' | 'inspirational' | 'sarcastic' | 'business' | 'luxury' | 'funny';

export type BioTemplate = 'default' | 'minimal' | 'neon' | 'aesthetic' | 'professional' | 'luxury';

export interface BioItem {
  id: string;
  text: string;
  platform: Platform;
  tone: Tone;
  language: string;
  template: BioTemplate;
  humanScore: number;
  copyCount: number;
  likesCount: number;
  tags: string[];
  createdAt: string;
  isPremium?: boolean;
  author?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  unlimited?: boolean;
  role: 'admin' | 'user';
  banned?: boolean;
  generationsToday: number;
  lastGeneratedDate?: string;
  savedBioIds: string[];
  createdAt: string;
}

export interface PendingPayment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  trxId: string;
  screenshotUrl: string;
  amount: number;
  currency: string;
  method?: string; // 'easypaisa' | 'payoneer' | 'elevate'
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminNote?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface Complaint {
  id: string;
  name: string;
  email: string;
  type: 'Wrong Bio' | 'Bug' | 'Payment' | 'Other';
  message: string;
  bioSnippet?: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export interface RatingItem {
  id: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  ip: string;
  city: string;
  slug: string;
  action: string;
  timestamp: string;
}

export interface SlugKeywordData {
  slug: string;
  keyword: string;
  category?: Platform;
  platform: Platform;
  title: string;
  targetAudience?: string;
  description?: string;
  intro: string;
  contentSection?: string;
  bios: BioItem[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export interface AppConfig {
  siteTitle: string;
  adminEmail: string;
  easyPaisaTillId: string;
  payoneerEmail?: string;
  elevatePayDetails?: string;
  adminPassword?: string;
  pricePKR: number;
  systemPrompt: string;
  rules: string;
  showAds: boolean;
  appCheckStatus: 'active' | 'enforcing' | 'monitoring';
  rateLimitMaxPerDay: number;
}

export interface SEOKeyword {
  id: string;
  keyword: string;
  slug: string;
  searchVolume: string;
  competition: 'Low' | 'Medium' | 'High';
  date: string;
  status: 'pending' | 'created';
  category: string;
}

export interface HallOfFameBio {
  id: string;
  text: string;
  author: string;
  platform: Platform;
  likes: number;
  status: 'approved' | 'pending';
  category: string;
  submittedAt: string;
  badge?: string;
}

export interface CreatorCaseStudy {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  category: string;
  oldBio: string;
  newBio: string;
  followerGrowth: string;
  engagementGrowth: string;
  testimonial: string;
  avatar: string;
}

export interface GamificationProfile {
  points: number;
  badges: string[];
  streakDays: number;
  lastActiveDate: string;
  generationsCount: number;
}
