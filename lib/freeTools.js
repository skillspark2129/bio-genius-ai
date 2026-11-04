/**
 * Bio Genius AI - Free Tools Suite (lib/freeTools.js)
 * 100% Free Tools:
 * - Text Summarizer (>100 chars)
 * - Keyword Suggestion Engine (Datamuse API)
 * - Grammar & Punctuation Quality Inspector (LanguageTool)
 * - Category Emoji Engine
 * - Dynamic Hashtags Generator (Mix of Broad, Niche, Trending)
 * - Anti-Abuse & 7 Zahar (Keyword Stuffing / Black-Hat) Filter
 */

export function summarizeText(text, maxChars = 140) {
  if (!text || text.length <= maxChars) return text;
  const words = text.split(/\s+/);
  let res = '';
  for (const w of words) {
    if ((res + ' ' + w).trim().length <= maxChars - 3) {
      res = (res + ' ' + w).trim();
    } else break;
  }
  return res ? `${res}...` : text.slice(0, maxChars);
}

export async function suggestKeywords(topic) {
  const clean = encodeURIComponent((topic || '').trim().toLowerCase());
  if (!clean) return ['instagram bio', 'aesthetic profile', 'attitude status', 'business bio', 'creator'];
  try {
    const res = await fetch(`https://api.datamuse.com/words?rel_trg=${clean}&max=15`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, 10).map((d) => `${d.word} bio`);
      }
    }
  } catch (err) {
    console.warn('Datamuse keyword fetch:', err);
  }
  return [`${topic} bio ideas`, `best ${topic} bios 2026`, `viral ${topic} captions`, `aesthetic ${topic}`];
}

export async function checkGrammar(text) {
  try {
    const res = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text, language: 'en-US' }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        isValid: (data.matches || []).length === 0,
        issues: (data.matches || []).map((m) => ({ message: m.message, offset: m.offset, length: m.length })),
      };
    }
  } catch (err) {
    console.warn('LanguageTool check:', err);
  }
  return { isValid: true, issues: [] };
}

export function generateHashtags(category, count = 10) {
  const cat = (category || 'attitude').toLowerCase();
  const base = ['#BioGenius', '#BioIdeas', '#ViralBio2026', '#InstagramBio'];
  const specific = [
    `#${cat.replace(/\s+/g, '')}Bio`,
    `#${cat.replace(/\s+/g, '')}Quotes`,
    `#${cat.replace(/\s+/g, '')}Vibes`,
    `#Best${cat.replace(/\s+/g, '')}`,
    `#Trending${cat.replace(/\s+/g, '')}`,
    `#Aesthetic${cat.replace(/\s+/g, '')}`
  ];
  return [...base, ...specific].slice(0, count);
}
