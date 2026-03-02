export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  return matrix[len1][len2];
}

// Checks for substring containment after normalizing common suffixes.

function isSubstringMatch(a: string, b: string): boolean {
  //remove dots, dashes, spaces, and common suffixes like "js", "ts", ".js"
  const normalize = (s: string) =>
    s
      .replace(/[\s.\-_]/g, "")
      .replace(/(js|ts|script)$/i, "")
      .toLowerCase();

  const na = normalize(a);
  const nb = normalize(b);

  return na.includes(nb) || nb.includes(na);
}

/**
 * Returns a match score (0.0 to 1.0) between a user skill and a required skill.
 *
 * Scoring breakdown:
 * - Exact match (case-insensitive)  → 1.0
 * - Substring / normalized match    → 0.9
 * - Levenshtein fuzzy match         → proportional score based on distance and string length
 * - No match                        → 0.0
 */
export function skillMatchScore(
  userSkill: string,
  requiredSkill: string,
  threshold: number = 2,
): number {
  const a = userSkill.toLowerCase().trim();
  const b = requiredSkill.toLowerCase().trim();

  // 1. Exact match
  if (a === b) return 1.0;

  // 2. Substring / normalized match (e.g. "React" vs "React.js")
  if (isSubstringMatch(a, b)) return 0.9;

  // 3. Length-normalized Levenshtein fuzzy match
  const distance = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);

  // Avoid false positives for very short strings (e.g. "R" matching "C")
  // Require at least 4 characters and distance within threshold
  if (maxLen < 4 || distance > threshold) return 0.0;

  // Score decreases proportionally with distance: distance 0 = 1.0, distance 2 = ~0.33
  return 1 - distance / (threshold + 1);
}

/**
 * Checks all user skills against a required skill and returns the best match score.
 * Unlike a boolean .some() check, this evaluates every user skill to find
 * the highest quality match.
 */
export function bestSkillMatchScore(
  userSkills: string[],
  requiredSkill: string,
  threshold: number = 2,
): number {
  return userSkills.reduce((best, userSkill) => {
    const score = skillMatchScore(userSkill, requiredSkill, threshold);
    return Math.max(best, score);
  }, 0);
}

/**
 * Boolean helper — kept for backwards compatibility.
 * Returns true if any user skill matches the required skill well enough.
 */
export function isSkillMatch(
  userSkill: string,
  requiredSkill: string,
  threshold: number = 2,
): boolean {
  return skillMatchScore(userSkill, requiredSkill, threshold) > 0;
}
