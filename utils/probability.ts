export function calculateProbability(yesPrice: number): number {
  if (yesPrice == null || Number.isNaN(yesPrice)) {
    return NaN;
  }

  let normalized = yesPrice;

  if (yesPrice > 1) {
    normalized = yesPrice / 100;
  }

  if (normalized < 0 || normalized > 1) {
    return NaN;
  }

  const pct = normalized * 100;
  return Math.round(pct * 10) / 10;
}