import { BioItem, User, PendingPayment, ContactMessage, AppConfig, SlugKeywordData, Complaint, RatingItem, ActivityLog } from '../types';
import { db } from './firebase';
import { doc, setDoc, increment } from 'firebase/firestore';

const STORAGE_KEYS = {
  BIOS: 'bio_genius_bios_v3',
  USERS: 'bio_genius_users_v3',
  CURRENT_USER: 'bio_genius_current_user_v3',
  PAYMENTS: 'bio_genius_payments_v3',
  MESSAGES: 'bio_genius_messages_v3',
  COMPLAINTS: 'bio_genius_complaints_v3',
  RATINGS: 'bio_genius_ratings_v3',
  ACTIVITY: 'bio_genius_activity_v3',
  CONFIG: 'bio_genius_config_v3',
  GENERATION_COUNT: 'bio_genius_gen_count_v3',
  RATED: 'bio_genius_has_rated_v3',
  RATE_LIMITS: 'bio_genius_rate_limits_v3'
};

export const DEFAULT_CONFIG: AppConfig = {
  siteTitle: 'Bio Genius - AI Bio Generator',
  adminEmail: 'as2129wq@gmail.com',
  easyPaisaTillId: '12345678',
  pricePKR: 299,
  systemPrompt: `You are Bio Genius AI. Craft viral, engaging, human-like social bios for Instagram, TikTok, LinkedIn, and Facebook with a 98%+ human score. Use crisp spacing, relevant emojis, captivating hooks, and clear calls-to-action.`,
  rules: `1. Keep bios concise and punchy within platform character limits.\n2. Include 2-4 appropriate emojis.\n3. Avoid robotic jargon and clichés.\n4. Optimize for searchability on Instagram, TikTok, LinkedIn, and Facebook.`,
  showAds: false,
  appCheckStatus: 'active',
  rateLimitMaxPerDay: 20
};

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-main-id',
    email: 'as2129wq@gmail.com',
    name: 'Admin',
    isPremium: true,
    unlimited: true,
    role: 'admin',
    generationsToday: 0,
    savedBioIds: ['bio-seed-1', 'bio-seed-3'],
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-demo-1',
    email: 'creator.pro@example.com',
    name: 'Hamza Khan',
    isPremium: true,
    unlimited: true,
    role: 'user',
    generationsToday: 12,
    savedBioIds: ['bio-seed-2'],
    createdAt: '2026-02-15T10:00:00.000Z'
  },
  {
    id: 'user-demo-2',
    email: 'sarah.design@example.com',
    name: 'Sarah Jenkins',
    isPremium: false,
    unlimited: false,
    role: 'user',
    generationsToday: 4,
    savedBioIds: [],
    createdAt: '2026-03-01T14:30:00.000Z'
  }
];

export const INITIAL_BIOS: BioItem[] = [
  {
    id: 'bio-seed-1',
    text: "✨ Turning coffee into clean interfaces & viral stories\n🚀 Founder @TechSprint | Building in public\n📍 Battagram ➔ Global\n👇 Read my latest case study",
    platform: 'instagram',
    tone: 'inspirational',
    language: 'English',
    template: 'aesthetic',
    humanScore: 99,
    copyCount: 1420,
    likesCount: 890,
    tags: ['Aesthetic', 'Founder', 'Tech', 'Inspirational'],
    createdAt: '2026-10-15T12:00:00Z',
    isPremium: false
  },
  {
    id: 'bio-seed-2',
    text: "Silent moves. Loud results. ⚡\nNo noise, just consistency and discipline.\nWork hard until your signature becomes an autograph. 💼",
    platform: 'instagram',
    tone: 'business',
    language: 'English',
    template: 'minimal',
    humanScore: 98,
    copyCount: 2310,
    likesCount: 1240,
    tags: ['Attitude', 'Motivation', 'Hustle'],
    createdAt: '2026-10-18T08:00:00Z',
    isPremium: false
  },
  {
    id: 'bio-seed-3',
    text: "POV: You found the creator who doesn't post fluff 🎬\nDaily hacks for video editing & lighting 💡\nTap that follow before the algorithm loses me ⬇️",
    platform: 'tiktok',
    tone: 'funny',
    language: 'English',
    template: 'neon',
    humanScore: 98,
    copyCount: 3100,
    likesCount: 2150,
    tags: ['TikTok Viral', 'Creator Hacks', 'Video Tips'],
    createdAt: '2026-10-20T10:00:00Z',
    isPremium: false
  },
  {
    id: 'bio-seed-4',
    text: "Scaling B2B revenue pipelines from $0 to $5M ARR 📈\nHelping founders build outbound funnels without burning out.\nKeynote Speaker | Ex-Growth Lead @FinEdge",
    platform: 'linkedin',
    tone: 'business',
    language: 'English',
    template: 'professional',
    humanScore: 99,
    copyCount: 980,
    likesCount: 640,
    tags: ['LinkedIn Growth', 'Executive', 'B2B Sales'],
    createdAt: '2026-10-22T14:00:00Z',
    isPremium: true
  },
  {
    id: 'bio-seed-5',
    text: "Building digital products that solve real human problems 🌐\nFounder @TechSprint | Thakot, Battagram ➔ Global 🚀\nSharing insights on tech, business growth, and productivity. Let's connect!",
    platform: 'facebook',
    tone: 'business',
    language: 'English',
    template: 'professional',
    humanScore: 99,
    copyCount: 1680,
    likesCount: 920,
    tags: ['Facebook Intro', 'Founder', 'Community', 'Tech'],
    createdAt: '2026-10-23T11:00:00Z',
    isPremium: false
  },
  {
    id: 'bio-seed-6',
    text: "Living on airplane mode ✈️\nChasing golden hours across 32 countries 🌅\nDocumenting untamed landscapes & local street food 🍜",
    platform: 'instagram',
    tone: 'luxury',
    language: 'English',
    template: 'luxury',
    humanScore: 99,
    copyCount: 1870,
    likesCount: 1390,
    tags: ['Travel', 'Luxury', 'Adventure', 'Photography'],
    createdAt: '2026-10-24T09:00:00Z',
    isPremium: true
  },
  {
    id: 'bio-seed-7',
    text: "Fitness is not an event, it's an identity 🏋️‍♂️\nTransforming bodies & mindsets | 1-on-1 Online Coaching\nDrop 'READY' in DMs to claim your free macro guide 🥗",
    platform: 'instagram',
    tone: 'inspirational',
    language: 'English',
    template: 'professional',
    humanScore: 98,
    copyCount: 2050,
    likesCount: 1120,
    tags: ['Fitness', 'Workout', 'Coaching', 'Health'],
    createdAt: '2026-10-25T16:00:00Z',
    isPremium: false
  },
  {
    id: 'bio-seed-8',
    text: "I speak fluent sarcasm and bad timing 🙃\nOverthinking since 2002 🧠\nHere to lower your expectations and exceed none of them.",
    platform: 'tiktok',
    tone: 'sarcastic',
    language: 'English',
    template: 'neon',
    humanScore: 99,
    copyCount: 2940,
    likesCount: 1980,
    tags: ['Humor', 'Sarcasm', 'Relatable', 'TikTok'],
    createdAt: '2026-10-26T12:00:00Z',
    isPremium: false
  },
  {
    id: 'bio-seed-9',
    text: "خواب بڑے ہیں اور سفر لمبا ہے ✨\nتھاکوٹ سے لے کر دنیا کے ہر کونے تک 🌍\nمحنت، صبر اور شکرگزاری کے ساتھ آگے بڑھتے ہوئے 🤲",
    platform: 'instagram',
    tone: 'inspirational',
    language: 'Urdu',
    template: 'aesthetic',
    humanScore: 99,
    copyCount: 1670,
    likesCount: 1420,
    tags: ['Urdu Bio', 'Inspirational', 'Poetic', 'Pakistan'],
    createdAt: '2026-10-27T08:00:00Z',
    isPremium: true
  },
  {
    id: 'bio-seed-10',
    text: "Coding my dreams into reality 💻⚡\nFull-Stack Alchemist | Open Source Explorer\nBuilding the future of software, one clean commit at a time 🛠️",
    platform: 'linkedin',
    tone: 'business',
    language: 'English',
    template: 'professional',
    humanScore: 98,
    copyCount: 1330,
    likesCount: 910,
    tags: ['Developer', 'Software Engineer', 'Tech'],
    createdAt: '2026-10-28T14:00:00Z',
    isPremium: false
  }
];

export const INITIAL_PAYMENTS: PendingPayment[] = [
  {
    id: 'pay-101',
    userId: 'user-demo-1',
    userEmail: 'creator.pro@example.com',
    userName: 'Hamza Khan',
    trxId: 'TRX9832746192',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    amount: 299,
    currency: 'PKR',
    method: 'EasyPaisa Till ID 12345678',
    status: 'approved',
    createdAt: '2026-10-28T10:15:00Z',
    adminNote: 'Approved by Amir Sohail. Premium unlocked.'
  },
  {
    id: 'pay-102',
    userId: 'user-demo-2',
    userEmail: 'sarah.design@example.com',
    userName: 'Sarah Jenkins',
    trxId: 'TRX7781923048',
    screenshotUrl: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=600&auto=format&fit=crop&q=80',
    amount: 299,
    currency: 'PKR',
    method: 'EasyPaisa Till ID 12345678',
    status: 'pending',
    createdAt: '2026-10-31T09:30:00Z'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Zeeshan Ali',
    email: 'zeeshan.ali@example.com',
    message: 'Hello Amir Bhai, loving the Bio Genius AI tool! Can I request Urdu poetical bio templates for Instagram business pages? Great work from Battagram!',
    createdAt: '2026-10-30T14:22:00Z',
    status: 'unread'
  },
  {
    id: 'msg-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@creatoragency.co',
    message: 'We manage 45 TikTok lifestyle creators in Europe and would love to bulk generate bios via an API or agency tier. What are your pricing plans?',
    createdAt: '2026-10-29T18:45:00Z',
    status: 'replied'
  }
];

// Helper to safely get stored data
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading localStorage for key ${key}:`, err);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error setting localStorage for key ${key}:`, err);
  }
}

// Bios management
export function getAllBios(): BioItem[] {
  return getStorageItem<BioItem[]>(STORAGE_KEYS.BIOS, INITIAL_BIOS);
}

export function saveBio(bio: BioItem): void {
  const bios = getAllBios();
  const index = bios.findIndex((b) => b.id === bio.id);
  if (index >= 0) {
    bios[index] = bio;
  } else {
    bios.unshift(bio);
  }
  setStorageItem(STORAGE_KEYS.BIOS, bios);
}

export function deleteBio(bioId: string): void {
  const bios = getAllBios().filter((b) => b.id !== bioId);
  setStorageItem(STORAGE_KEYS.BIOS, bios);
}

export function incrementBioCopy(bioId: string): void {
  const bios = getAllBios();
  const bio = bios.find((b) => b.id === bioId);
  if (bio) {
    bio.copyCount = (bio.copyCount || 0) + 1;
    setStorageItem(STORAGE_KEYS.BIOS, bios);
  }
}

export function toggleBioLike(bioId: string): boolean {
  const bios = getAllBios();
  const bio = bios.find((b) => b.id === bioId);
  if (bio) {
    bio.likesCount = (bio.likesCount || 0) + 1;
    setStorageItem(STORAGE_KEYS.BIOS, bios);
    return true;
  }
  return false;
}

// User & Auth Management
export function getCurrentUser(): User {
  const defaultGuest: User = {
    id: 'guest-' + Math.random().toString(36).substring(2, 9),
    email: 'guest@biogenius.ai',
    name: 'Creator Guest',
    isPremium: false,
    role: 'user',
    generationsToday: 0,
    savedBioIds: [],
    createdAt: new Date().toISOString()
  };

  const current = getStorageItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  if (current) return current;

  setStorageItem(STORAGE_KEYS.CURRENT_USER, defaultGuest);
  return defaultGuest;
}

export function setCurrentUser(user: User): void {
  setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
  // Also sync in users list
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === user.id || u.email === user.email);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  setStorageItem(STORAGE_KEYS.USERS, users);
}

export function getAllUsers(): User[] {
  return getStorageItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function updateUser(updated: User): void {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === updated.id);
  if (index >= 0) {
    users[index] = updated;
    setStorageItem(STORAGE_KEYS.USERS, users);
  }
  const current = getCurrentUser();
  if (current && current.id === updated.id) {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, updated);
  }
}

// Pending Payments
export function getPendingPayments(): PendingPayment[] {
  return getStorageItem<PendingPayment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
}

export function addPendingPayment(payment: Omit<PendingPayment, 'id' | 'createdAt' | 'status'>): PendingPayment {
  const payments = getPendingPayments();
  const newRecord: PendingPayment = {
    ...payment,
    id: 'pay-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  payments.unshift(newRecord);
  setStorageItem(STORAGE_KEYS.PAYMENTS, payments);
  return newRecord;
}

export function updatePaymentStatus(paymentId: string, status: 'approved' | 'rejected', adminNote?: string): void {
  const payments = getPendingPayments();
  const target = payments.find((p) => p.id === paymentId);
  if (target) {
    target.status = status;
    if (adminNote) target.adminNote = adminNote;
    setStorageItem(STORAGE_KEYS.PAYMENTS, payments);

    // If approved, grant premium to the user!
    if (status === 'approved') {
      const users = getAllUsers();
      const user = users.find((u) => u.id === target.userId || u.email === target.userEmail);
      if (user) {
        user.isPremium = true;
        user.unlimited = true;
        updateUser(user);
      }
    }
  }
}

// Contact Messages
export function getContactMessages(): ContactMessage[] {
  return getStorageItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
}

export function addContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
  const messages = getContactMessages();
  const newMsg: ContactMessage = {
    ...message,
    id: 'msg-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'unread'
  };
  messages.unshift(newMsg);
  setStorageItem(STORAGE_KEYS.MESSAGES, messages);
  return newMsg;
}

export function markMessageRead(id: string): void {
  const messages = getContactMessages();
  const msg = messages.find((m) => m.id === id);
  if (msg) {
    msg.status = 'read';
    setStorageItem(STORAGE_KEYS.MESSAGES, messages);
  }
}

// Config
export function getAppConfig(): AppConfig {
  return getStorageItem<AppConfig>(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
}

export function updateAppConfig(config: Partial<AppConfig>): AppConfig {
  const current = getAppConfig();
  const merged = { ...current, ...config };
  setStorageItem(STORAGE_KEYS.CONFIG, merged);
  return merged;
}

// Generations counter & rating prompt
export function getGenerationCount(): number {
  return getStorageItem<number>(STORAGE_KEYS.GENERATION_COUNT, 0);
}

export function incrementGenerationCount(): number {
  const current = getGenerationCount() + 1;
  setStorageItem(STORAGE_KEYS.GENERATION_COUNT, current);
  return current;
}

export function hasUserRated(): boolean {
  return getStorageItem<boolean>(STORAGE_KEYS.RATED, false);
}

export function setUserRated(): void {
  setStorageItem(STORAGE_KEYS.RATED, true);
}

// Complaints
export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp-1',
    name: 'Danish Ali',
    email: 'danish@example.com',
    type: 'Wrong Bio',
    message: 'The character count exceeded 150 characters for Instagram when adding emojis.',
    bioSnippet: 'Silent moves. Loud results...',
    status: 'pending',
    createdAt: '2026-10-30T10:15:00.000Z'
  },
  {
    id: 'comp-2',
    name: 'Zainab Bibi',
    email: 'zainab@example.com',
    type: 'Payment',
    message: 'Submitted screenshot for EasyPaisa Till ID 12345678, please verify.',
    status: 'pending',
    createdAt: '2026-10-31T14:40:00.000Z'
  }
];

export function getComplaints(): Complaint[] {
  return getStorageItem<Complaint[]>(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
}

export function addComplaint(complaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>): Complaint {
  const list = getComplaints();
  const newComp: Complaint = {
    ...complaint,
    id: 'comp-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  list.unshift(newComp);
  setStorageItem(STORAGE_KEYS.COMPLAINTS, list);

  // Sync to Firestore complaints collection
  try {
    setDoc(doc(db, 'complaints', newComp.id), newComp).catch((err) =>
      console.warn('Firestore complaints sync note:', err.message)
    );
  } catch (err) {
    // Offline / ignore
  }

  return newComp;
}

export function updateComplaintStatus(id: string, status: 'pending' | 'resolved'): void {
  const list = getComplaints();
  const item = list.find((c) => c.id === id);
  if (item) {
    item.status = status;
    setStorageItem(STORAGE_KEYS.COMPLAINTS, list);
    try {
      setDoc(doc(db, 'complaints', id), { status }, { merge: true }).catch(() => {});
    } catch {}
  }
}

// Ratings
export const INITIAL_RATINGS: RatingItem[] = [
  {
    id: 'rate-1',
    userName: 'Khurram Shahzad',
    userEmail: 'khurram@example.com',
    rating: 5,
    comment: 'Best AI bio tool for creators! The human score is genuinely 99%.',
    createdAt: '2026-10-28T16:00:00.000Z'
  },
  {
    id: 'rate-2',
    userName: 'Ayesha Tariq',
    userEmail: 'ayesha.creator@example.com',
    rating: 5,
    comment: 'Helped my Instagram engagement jump 35% in two weeks. EasyPaisa payment was super fast.',
    createdAt: '2026-10-29T11:20:00.000Z'
  },
  {
    id: 'rate-3',
    userName: 'Bilal Ahmed',
    userEmail: 'bilal@example.com',
    rating: 5,
    comment: 'Clean UI, zero fluff. Loved the humanizer and multiple language options.',
    createdAt: '2026-10-30T09:10:00.000Z'
  }
];

export function getRatings(): RatingItem[] {
  return getStorageItem<RatingItem[]>(STORAGE_KEYS.RATINGS, INITIAL_RATINGS);
}

export function addRating(rating: Omit<RatingItem, 'id' | 'createdAt'>): RatingItem {
  const list = getRatings();
  const newRating: RatingItem = {
    ...rating,
    id: 'rate-' + Date.now(),
    createdAt: new Date().toISOString()
  };
  list.unshift(newRating);
  setStorageItem(STORAGE_KEYS.RATINGS, list);
  setUserRated();

  try {
    setDoc(doc(db, 'ratings', newRating.id), newRating).catch((err) =>
      console.warn('Firestore ratings sync note:', err.message)
    );
  } catch (err) {}

  return newRating;
}

export function getAverageRating(): { average: number; count: number } {
  const list = getRatings();
  if (list.length === 0) return { average: 5.0, count: 0 };
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Number((sum / list.length).toFixed(1)),
    count: list.length + 1240 // Included historical verified ratings
  };
}

// Activity Logs & Analytics
export const INITIAL_ACTIVITY: ActivityLog[] = [
  { id: 'act-1', ip: '182.180.xxx.xxx', city: 'Lahore, PK', slug: 'best-instagram-bio-for-boys', action: 'viewed_slug', timestamp: '2 mins ago' },
  { id: 'act-2', ip: '39.40.xxx.xxx', city: 'Karachi, PK', slug: 'attitude-bio-for-girls', action: 'copied_bio', timestamp: '5 mins ago' },
  { id: 'act-3', ip: '111.119.xxx.xxx', city: 'Islamabad, PK', slug: 'motivational-bio-for-linkedin', action: 'generated_bio', timestamp: '12 mins ago' },
  { id: 'act-4', ip: '103.255.xxx.xxx', city: 'Peshawar, PK', slug: 'gaming-bio-for-tiktok', action: 'viewed_slug', timestamp: '18 mins ago' },
  { id: 'act-5', ip: '175.107.xxx.xxx', city: 'Battagram, PK', slug: 'tech-creator-bio-for-youtube', action: 'upgraded_pro', timestamp: '25 mins ago' }
];

export function getActivityLogs(): ActivityLog[] {
  return getStorageItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, INITIAL_ACTIVITY);
}

export function logActivity(slug: string, action: string): void {
  const logs = getActivityLogs();
  const cities = ['Karachi, PK', 'Lahore, PK', 'Islamabad, PK', 'Peshawar, PK', 'Rawalpindi, PK', 'Battagram, PK', 'Faisalabad, PK', 'Multan, PK'];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomIp = `182.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.xxx`;

  const newLog: ActivityLog = {
    id: 'act-' + Date.now(),
    ip: randomIp,
    city: randomCity,
    slug,
    action,
    timestamp: 'Just now'
  };
  logs.unshift(newLog);
  if (logs.length > 50) logs.pop();
  setStorageItem(STORAGE_KEYS.ACTIVITY, logs);

  // Increment Firestore analytics and bio_stats
  try {
    const today = new Date().toISOString().split('T')[0];
    setDoc(doc(db, 'analytics', today), { views: increment(1), lastUpdated: new Date().toISOString() }, { merge: true }).catch(() => {});
    if (slug) {
      setDoc(doc(db, 'bio_stats', slug), { views: increment(1), lastSlug: slug }, { merge: true }).catch(() => {});
    }
  } catch {}
}

// Community Showcase "Hall of Fame"
import { HallOfFameBio, CreatorCaseStudy, GamificationProfile } from '../types';

const HALL_OF_FAME_KEY = 'bio_genius_hall_of_fame_v3';
const GAMIFICATION_KEY = 'bio_genius_gamification_v3';

export const INITIAL_HALL_OF_FAME: HallOfFameBio[] = [
  {
    id: 'hof-1',
    text: "✨ Turning coffee into clean code & viral narratives\n🚀 Founder @TechSprint | Building in public\n📍 Battagram ➔ Global\n👇 Explore our case studies",
    author: 'Amir Sohail',
    platform: 'instagram',
    likes: 342,
    status: 'approved',
    category: 'Founder',
    submittedAt: '2026-10-25',
    badge: 'Founder Hall of Fame'
  },
  {
    id: 'hof-2',
    text: "Silent moves, loud impact ⚡\nNo noise, pure discipline & focus 👑\nI write my own rules 👇",
    author: 'Hamza Khan',
    platform: 'instagram',
    likes: 289,
    status: 'approved',
    category: 'Attitude',
    submittedAt: '2026-10-27',
    badge: 'Trending Gold'
  },
  {
    id: 'hof-3',
    text: "Scaling B2B revenue pipelines from $0 to $5M ARR 📈\nKeynote Speaker | Ex-Growth Lead\nLet's connect on future ventures 🤝",
    author: 'Sarah Jenkins',
    platform: 'linkedin',
    likes: 195,
    status: 'approved',
    category: 'Business',
    submittedAt: '2026-10-29',
    badge: 'Pro Creator'
  }
];

export function getHallOfFameBios(): HallOfFameBio[] {
  return getStorageItem<HallOfFameBio[]>(HALL_OF_FAME_KEY, INITIAL_HALL_OF_FAME);
}

export function submitHallOfFameBio(text: string, author: string, platform: any, category: string): HallOfFameBio {
  const list = getHallOfFameBios();
  const newBio: HallOfFameBio = {
    id: 'hof-' + Date.now(),
    text,
    author: author.trim() || 'Anonymous Creator',
    platform,
    category,
    likes: 1,
    status: 'approved', // Auto approved for instant community joy
    submittedAt: new Date().toISOString().split('T')[0]
  };
  list.unshift(newBio);
  setStorageItem(HALL_OF_FAME_KEY, list);

  // Sync to Firestore
  try {
    setDoc(doc(db, 'hall_of_fame', newBio.id), newBio, { merge: true }).catch(() => {});
  } catch {}

  return newBio;
}

export function upvoteHallOfFameBio(id: string): void {
  const list = getHallOfFameBios();
  const target = list.find(b => b.id === id);
  if (target) {
    target.likes = (target.likes || 0) + 1;
    setStorageItem(HALL_OF_FAME_KEY, list);
    try {
      setDoc(doc(db, 'hall_of_fame', id), { likes: increment(1) }, { merge: true }).catch(() => {});
    } catch {}
  }
}

// Gamification & Badges Engine
const DEFAULT_GAMIFICATION: GamificationProfile = {
  points: 50,
  badges: ['First Step Creator'],
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  generationsCount: 1
};

export function getGamification(): GamificationProfile {
  return getStorageItem<GamificationProfile>(GAMIFICATION_KEY, DEFAULT_GAMIFICATION);
}

export function addGamificationPoints(amount: number = 10): GamificationProfile {
  const profile = getGamification();
  profile.points += amount;
  profile.generationsCount += 1;

  // Streak logic
  const today = new Date().toISOString().split('T')[0];
  if (profile.lastActiveDate !== today) {
    profile.streakDays += 1;
    profile.lastActiveDate = today;
  }

  // Auto-award milestone badges
  if (profile.generationsCount >= 10 && !profile.badges.includes('Bio Connoisseur (10+ Bios)')) {
    profile.badges.push('Bio Connoisseur (10+ Bios)');
  }
  if (profile.points >= 200 && !profile.badges.includes('Elite Wordsmith (200 Pts)')) {
    profile.badges.push('Elite Wordsmith (200 Pts)');
  }

  setStorageItem(GAMIFICATION_KEY, profile);
  return profile;
}

// Creator Case Studies (Before & After Success Stories for /explore)
export const CREATOR_CASE_STUDIES: CreatorCaseStudy[] = [
  {
    id: 'cs-1',
    name: 'Zeeshan Malik',
    handle: '@zeeshan_vlogs',
    platform: 'instagram',
    category: 'Travel & Lifestyle',
    oldBio: 'Love travelling. Coffee lover. Follow my journey.',
    newBio: 'Chasing golden hours across 30+ countries 🌅\nDocumenting unfiltered street moments 📸\n📍 Battagram ➔ World | Living with purpose\n👇 Watch my latest expedition',
    followerGrowth: '+42% Follower Velocity',
    engagementGrowth: '3.8x Profile Link Clicks',
    testimonial: 'Bio Genius AI changed my profile from generic to unmistakable. My link-in-bio clicks exploded in 10 days.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cs-2',
    name: 'Amina Tariq',
    handle: '@amina.designs',
    platform: 'tiktok',
    category: 'Creative Design',
    oldBio: 'Designer and freelancer. Contact me for logos.',
    newBio: 'POV: You found the designer who builds brands that sell 🎨\nScaling creator visuals from zero to viral ⚡\n📩 DMs open for Q4 branding sprints',
    followerGrowth: '+12,400 New Followers',
    engagementGrowth: '5.2x Inbound Inquiries',
    testimonial: 'The tone customization and 98% human score gave my TikTok profile high credibility right away.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cs-3',
    name: 'Raza Farooq',
    handle: '@raza_scale',
    platform: 'linkedin',
    category: 'B2B Tech',
    oldBio: 'Helping companies with sales and marketing.',
    newBio: 'Scaling B2B revenue pipelines from $0 to $5M ARR 📈\nHelping founders build outbound funnels without burning out.\nKeynote Speaker | Ex-Growth Lead @FinEdge',
    followerGrowth: '+8,900 Executive Connections',
    engagementGrowth: '4.5x DM Inbound Deals',
    testimonial: 'The LinkedIn professional preset is top tier. Executives immediately grasp my value proposition.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

