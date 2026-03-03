import { calculateConfidence } from '../utils/confidence';
import type { ConfidenceInput } from '../utils/confidence';

describe('calculateConfidence', () => {
  const base: ConfidenceInput = {
    volume24h: 10000,
    liquidity: 25000,
    spreadPercent: 2,
    timeToEventMs: 3 * 24 * 60 * 60 * 1000
  };

  it('returns Low when thinly traded', () => {
    expect(
      calculateConfidence({
        ...base,
        volume24h: 100
      })
    ).toBe('Low');

    expect(
      calculateConfidence({
        ...base,
        liquidity: 100
      })
    ).toBe('Low');
  });

  it('returns High when all conditions are met', () => {
    expect(calculateConfidence(base)).toBe('High');
  });

  it('returns Medium otherwise', () => {
    expect(
      calculateConfidence({
        ...base,
        spreadPercent: null
      })
    ).toBe('Medium');

    expect(
      calculateConfidence({
        ...base,
        timeToEventMs: 20 * 24 * 60 * 60 * 1000
      })
    ).toBe('Medium');
  });
});