/**
 * Bio Genius AI - Free Tools Suite
 * 100% Free Tools (No Paid APIs):
 * - Text Summarizer (>100 chars)
 * - Keyword Suggestion Engine (Datamuse API + Local Lexicon)
 * - Grammar & Punctuation Quality Inspector
 * - Category Emoji Engine
 * - Dynamic Hashtags Generator (Mix of Broad, Niche, Trending)
 * - Anti-Abuse & 7 Zahar (Keyword Stuffing / Black-Hat) Filter
 */

// Profanity & Disallowed Terms (Anti-Abuse + 7 Zahar black-hat checks)
const DISALLOWED_TERMS = [
  'scam', 'fraud', 'hack instagram', 'free followers bot', 'free robux',
  'casino hack', 'carding', 'bypass otp', 'phishing', 'adult content 18+'
];

export interface GrammarIssue {
  type: 'punctuation' | 'casing' | 'length' | 'spacing';
  message: string;
  suggestion?: string;
}

export interface GrammarCheckResult {
  isValid: boolean;
  score: number;
  issues: GrammarIssue[];
  fixedText: string;
}

/**
 * Text Summarizer: Condenses long descriptions down to crisp bio-ready punchlines
 */
export function summarizeText(text: string, maxChars: number = 140): string {
  if (!text || text.length <= maxChars) return text;

  // Split into sentences
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length === 1) {
    // Trim words gracefully
    const words = text.split(/\s+/);
    let result = '';
    for (const w of words) {
      if ((result + ' ' + w).trim().length <= maxChars - 3) {
        result = (result + ' ' + w).trim();
      } else {
        break;
      }
    }
    return result ? `${result}...` : text.slice(0, maxChars);
  }

  // Combine top key sentences
  let combined = '';
  for (const s of sentences) {
    if ((combined + ' ' + s).trim().length <= maxChars) {
      combined = (combined + ' ' + s).trim();
    } else {
      break;
    }
  }

  return combined || sentences[0].slice(0, maxChars);
}

/**
 * Keyword Suggestion: Queries Datamuse API (free, no auth required) or local fallback
 */
export async function suggestKeywords(topic: string): Promise<string[]> {
  const clean = encodeURIComponent(topic.trim().toLowerCase());
  if (!clean) return ['instagram bio', 'aesthetic profile', 'attitude status', 'business bio', 'creator'];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`https://api.datamuse.com/words?rel_trg=${clean}&max=15`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data: Array<{ word: string; score: number }> = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, 10).map(d => `${d.word} bio`);
      }
    }
  } catch (err) {
    console.info('Datamuse API timed out or offline, using fallback keyword dictionary:', err);
  }

  // High CTR Local Fallback Keywords
  const fallbackDict: Record<string, string[]> = {
    attitude: ['attitude bio for boys', 'royal attitude status', 'classy attitude quotes', 'killer bio for instagram'],
    business: ['entrepreneur bio', 'founder scaling b2b', 'ceo startup vision', 'ecommerce growth expert'],
    fitness: ['gym workout motivation', 'online fitness coach', 'shredded lifestyle', 'body transformation'],
    love: ['cute love quotes bio', 'romantic couple vibes', 'hopeless romantic', 'aesthetic love status'],
    gaming: ['esports pro gamer', 'fps stream highlights', 'level 99 grinding', 'gaming community captain'],
    aesthetic: ['minimalist soft aesthetics', 'golden hour vibes', 'analog photography mood', 'poetry & latte']
  };

  const key = Object.keys(fallbackDict).find(k => clean.includes(k));
  if (key) return fallbackDict[key];

  return [
    `${topic} bio 2026`,
    `best ${topic} bio for instagram`,
    `aesthetic ${topic} quotes`,
    `viral ${topic} captions`,
    `short ${topic} bio`
  ];
}

/**
 * Grammar, Spacing & Quality Check
 */
export function checkGrammarAndSpelling(text: string): GrammarCheckResult {
  const issues: GrammarIssue[] = [];
  let fixed = text;

  // 1. Multiple consecutive spaces
  if (/\s{2,}/.test(text)) {
    issues.push({
      type: 'spacing',
      message: 'Found multiple consecutive spaces.',
      suggestion: 'Remove redundant whitespace'
    });
    fixed = fixed.replace(/\s{2,}/g, ' ');
  }

  // 2. Space before punctuation
  if (/\s+([.,!?;:])/.test(fixed)) {
    issues.push({
      type: 'punctuation',
      message: 'Unwanted space before punctuation.',
      suggestion: 'Move punctuation flush against the preceding word.'
    });
    fixed = fixed.replace(/\s+([.,!?;:])/g, '$1');
  }

  // 3. Lowercase sentence starters
  const sentenceStarts = /(^|\.\s+|!\s+|\?\s+)([a-z])/g;
  if (sentenceStarts.test(fixed)) {
    issues.push({
      type: 'casing',
      message: 'Some lines or sentences begin with lowercase letters.',
      suggestion: 'Capitalize the first letter.'
    });
    fixed = fixed.replace(/(^|\.\s+|!\s+|\?\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
  }

  // 4. Bio character limits
  if (text.length > 150) {
    issues.push({
      type: 'length',
      message: `Current bio is ${text.length} characters (Instagram limit is 150 chars).`,
      suggestion: 'Trim to under 150 characters to prevent truncation on mobile.'
    });
  }

  const score = Math.max(70, 100 - (issues.length * 10));

  return {
    isValid: issues.length === 0,
    score,
    issues,
    fixedText: fixed
  };
}

/**
 * Category Emoji Suggester
 */
export function getCategoryEmojis(category: string): string[] {
  const map: Record<string, string[]> = {
    attitude: ['⚡', '👑', '🔥', '🦁', '🗡️', '🖤', '🎯'],
    business: ['📈', '💼', '🚀', '🤝', '💡', '📊', '🌐'],
    fitness: ['🏋️‍♂️', '💪', '🥗', '⚡', '🏆', '🏃‍♂️', '🔥'],
    love: ['❤️', '✨', '💍', '💌', '🌹', '🕊️', '💫'],
    gaming: ['🎮', '👾', '🕹️', '⚔️', '🎧', '🏆', '🔥'],
    aesthetic: ['✨', '☕', '🌅', '🍂', '🎞️', '🎨', '🌙'],
    tech: ['💻', '⚙️', '🤖', '🚀', '🧠', '🛠️', '📱'],
    travel: ['✈️', '🌍', '🌅', '🏝️', '🎒', '📸', '🗺️'],
    luxury: ['💎', '🥂', '🏎️', '⚜️', '👑', '🏛️', '⌚']
  };

  const key = Object.keys(map).find(k => category.toLowerCase().includes(k)) || 'aesthetic';
  return map[key] || ['✨', '🚀', '💡', '👇', '🎯'];
}

/**
 * Dynamic Hashtag Generator
 * Combines high-volume broad tags, niche tags, and seasonal 2026 tags
 */
export function generateHashtags(category: string, count: number = 5): string[] {
  const baseTags: Record<string, string[]> = {
    attitude: ['#AttitudeStatus', '#RoyalLook', '#AttitudeBio', '#KillerAttitude', '#SelfRespect', '#BoldVibes', '#AlphaMindset'],
    business: ['#Entrepreneurship', '#FounderLife', '#B2BGrowth', '#StartupDaily', '#BusinessMindset', '#DigitalMarketing', '#ScaleUp'],
    fitness: ['#FitnessJourney', '#WorkoutMotivation', '#GymAddict', '#FitLife2026', '#NaturalAthlete', '#CoachOnline', '#EatClean'],
    love: ['#LoveQuotes', '#RomanticVibes', '#PureLove', '#CoupleGoals', '#Heartstrings', '#Soulmates', '#ForeverMine'],
    gaming: ['#GamerForLife', '#EsportsLife', '#StreamerCommunity', '#GamingClips', '#SetupGoals', '#ProGamer', '#TwitchAffiliate'],
    aesthetic: ['#AestheticFeed', '#GoldenHourVibes', '#MoodyGrams', '#SoftAesthetic', '#CleanAesthetic', '#VisualPoetry', '#VibeCheck'],
    tech: ['#BuildInPublic', '#DevLife', '#FullStackDeveloper', '#AIRevolution', '#TechCommunity', '#CodingLife', '#SoftwareEngineer']
  };

  const key = Object.keys(baseTags).find(k => category.toLowerCase().includes(k)) || 'aesthetic';
  const list = baseTags[key] || ['#BioGenius', '#CreatorHacks', '#InstagramBio', '#ViralQuotes', '#ProfileMakeover'];

  // Shuffle and slice
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Anti-Abuse & 7 Zahar (Black-Hat SEO) Safety Verification
 * Checks for:
 * 1. Abusive words / profanity
 * 2. Keyword stuffing (repeated tokens > 4 times)
 * 3. Deceptive or dangerous promises (fake followers bots, phishing)
 */
export function checkSafetyAndQuality(text: string): { safe: boolean; reason?: string } {
  const lower = text.toLowerCase();

  // Check disallowed abusive or spam tokens
  for (const term of DISALLOWED_TERMS) {
    if (lower.includes(term)) {
      return {
        safe: false,
        reason: `Flagged keyword detected ("${term}"). Please keep bios authentic and ethical.`
      };
    }
  }

  // Check keyword stuffing (repeating any word > 4 times)
  const words = lower.split(/\s+/).filter(w => w.length > 3);
  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
    if (freq[w] >= 5) {
      return {
        safe: false,
        reason: `Keyword stuffing detected for word "${w}". Keep bio natural for human audience.`
      };
    }
  }

  return { safe: true };
}
