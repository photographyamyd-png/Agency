export function suggestKeywordPhrases(
  seed: string,
  serviceArea: string,
  modifiers: string[] = ["Emergency", "Affordable", "Licensed", "Top-Rated"]
) {
  const geo = serviceArea.trim();
  return modifiers.map((mod) => `${mod} ${seed} ${geo}`.trim());
}
