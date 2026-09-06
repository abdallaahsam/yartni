/**
 * Generates an SEO-friendly URL slug supporting Arabic and English characters
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return 'advice';
  
  return text
    .toString()
    .trim()
    .toLowerCase()
    // Remove diacritics / tashkeel
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize arabic alef
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    // Replace non-alphanumeric chars (preserving Arabic and English letters and numbers)
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
    // Replace multiple spaces or dashes with a single dash
    .replace(/[\s-]+/g, '-')
    // Trim leading/trailing dashes
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'advice';
}
