import { CONFIG } from './env';
import type { ConfidenceLevel } from '../types/market';

export interface ConfidenceInput {
  volume24h: number;
  liquidity: number;
  spreadPercent: number | null;
  timeToEventMs: number;
}

export function calculateConfidence(input: ConfidenceInput): ConfidenceLevel {
  const { volume24h, liquidity, spreadPercent, timeToEventMs } = input;
  const daysToEvent = timeToEventMs / (1000 * 60 * 60 * 24);

  if (
    volume24h < CONFIG.confidence.minVolumeAny ||
    liquidity < CONFIG.confidence.minLiquidityAny
  ) {
    return 'Low';
  }

  const spreadOk =
    spreadPercent !== null &&
    spreadPercent <= CONFIG.confidence.maxSpreadPercentHigh;
  const liquidityOk = liquidity >= CONFIG.confidence.minLiquidityHigh;
  const volumeOk = volume24h >= CONFIG.confidence.minVolumeHigh;
  const timeOk =
    daysToEvent <= CONFIG.confidence.maxDaysToEventHigh && daysToEvent >= 0;

  if (spreadOk && liquidityOk && volumeOk && timeOk) {
    return 'High';
  }

  return 'Medium';
}