import { calculateProbability } from '../utils/probability';

describe('calculateProbability', () => {
  it('handles 0–1 inputs', () => {
    expect(calculateProbability(0)).toBe(0);
    expect(calculateProbability(0.5)).toBe(50);
    expect(calculateProbability(1)).toBe(100);
  });

  it('handles 0–100 inputs', () => {
    expect(calculateProbability(0)).toBe(0);
    expect(calculateProbability(50)).toBe(50);
    expect(calculateProbability(100)).toBe(100);
  });

  it('returns NaN for out-of-range values', () => {
    expect(Number.isNaN(calculateProbability(-0.1))).toBe(true);
    expect(Number.isNaN(calculateProbability(101))).toBe(true);
  });

  it('returns NaN for invalid inputs', () => {
    expect(Number.isNaN(calculateProbability(NaN))).toBe(true);
    // @ts-expect-error runtime check
    expect(Number.isNaN(calculateProbability(undefined))).toBe(true);
  });
});