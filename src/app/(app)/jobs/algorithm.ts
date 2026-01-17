export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  // Create a 2D matrix to store distances
  const matrix: number[][] = [];

  // Initialize first column (distance from empty string)
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  // Initialize first row (distance from empty string)
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

export function isSkillMatch(
  userSkill: string,
  requiredSkill: string,
  threshold: number = 2
): boolean {
  const normalizedUserSkill = userSkill.toLowerCase().trim();
  const normalizedRequiredSkill = requiredSkill.toLowerCase().trim();

  // case-insensitive
  if (normalizedUserSkill === normalizedRequiredSkill) {
    return true;
  }

  // Fuzzy match using Levenshtein distance
  const distance = levenshteinDistance(
    normalizedUserSkill,
    normalizedRequiredSkill
  );

  return distance <= threshold;
}
