import { CONFIG } from '../utils/env';
import { calculateProbability } from '../utils/probability';
import { calculateConfidence } from '../utils/confidence';
import { getTimeRemainingMs } from '../utils/time';
import type {
  RawPolymarketMarket,
  MarketSummary,
  MarketPricePoint
} from '../types/market';

async function fetchWithTimeout(
  url: string,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchMarketsFromPolymarket(): Promise<MarketSummary[]> {
  const url = new URL(
    '/markets?closed=false&limit=200',
    CONFIG.polymarketBaseUrl
  ).toString();

  const res = await fetchWithTimeout(url, CONFIG.requestTimeoutMs);

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status}`);
  }

  const raw = await res.json();

  const markets: RawPolymarketMarket[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as any).markets)
    ? ((raw as any).markets as RawPolymarketMarket[])
    : [];

  const now = Date.now();
  const summaries: MarketSummary[] = [];

  for (const market of markets) {
    const active = (market as any).active ?? !market.closed;
    if (!active) continue;

    const endDate = market.endDate;
    if (!endDate) continue;

    let outcomeNames: string[] = [];
    let outcomePrices: string[] = [];

    try {
      outcomeNames = JSON.parse(market.outcomes) as string[];
      outcomePrices = JSON.parse(market.outcomePrices) as string[];
    } catch {
      continue;
    }

    if (!outcomeNames.length || !outcomePrices.length) continue;

    const yesIndex = outcomeNames.indexOf('Yes');
    const yesPriceStr =
      yesIndex >= 0
        ? outcomePrices[yesIndex]
        : outcomePrices[0] ?? undefined;

    if (!yesPriceStr) continue;

    const yesPrice = Number(yesPriceStr);
    if (!Number.isFinite(yesPrice)) continue;

    const probability = calculateProbability(yesPrice);
    if (Number.isNaN(probability)) continue;

    const liquidity = Number(market.liquidity ?? '0');
    const volume24h = Number(market.volume ?? '0');

    const timeRemainingMs = getTimeRemainingMs(endDate);
    const resolved = timeRemainingMs === 0;

    const spreadPercent: number | null = null;

    const confidence = calculateConfidence({
      volume24h,
      liquidity,
      spreadPercent,
      timeToEventMs: timeRemainingMs
    });

    const insufficientDepth =
      liquidity < CONFIG.confidence.minLiquidityAny ||
      volume24h < CONFIG.confidence.minVolumeAny;

    const point: MarketPricePoint = {
      timestamp: now,
      probability
    };

    summaries.push({
      id: market.id,
      title: market.question,
      probability,
      confidence,
      volume24h,
      liquidity,
      timeRemainingMs,
      spreadPercent,
      resolved,
      insufficientDepth,
      lastUpdated: now,
      trendDelta5m: null,
      history: [point]
    });
  }

  return summaries;
}