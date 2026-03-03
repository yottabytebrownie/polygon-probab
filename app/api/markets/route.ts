import { NextResponse } from 'next/server';
import { fetchMarketsFromPolymarket } from '../../../services/polymarket';
import { CONFIG } from '../../../utils/env';
import type { MarketSummary } from '../../../types/market';

function mergeHistory(
  previous: MarketSummary[] | undefined,
  current: MarketSummary[]
): MarketSummary[] {
  if (!previous || previous.length === 0) return current;

  const prevMap = new Map<string, MarketSummary>();
  for (const m of previous) prevMap.set(m.id, m);

  const now = Date.now();
  const windowMs = CONFIG.history.trendWindowMinutes * 60 * 1000;

  return current.map((cur) => {
    const prev = prevMap.get(cur.id);
    let history = prev?.history ?? [];

    history = [...history, ...cur.history];
    if (history.length > CONFIG.history.maxPointsPerMarket) {
      history = history.slice(-CONFIG.history.maxPointsPerMarket);
    }

    const threshold = now - windowMs;
    const pastPoint = [...history]
      .reverse()
      .find((p) => p.timestamp <= threshold);

    const trendDelta5m =
      pastPoint != null ? cur.probability - pastPoint.probability : null;

    return {
      ...cur,
      history,
      trendDelta5m
    };
  });
}

let lastSnapshot: MarketSummary[] | undefined;

export async function GET() {
  try {
    const current = await fetchMarketsFromPolymarket();
    const merged = mergeHistory(lastSnapshot, current);
    lastSnapshot = merged;

    return NextResponse.json(
      {
        markets: merged,
        updatedAt: Date.now()
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Polymarket API error:', error);
    }

    return NextResponse.json(
      {
        error: message
      },
      { status: 503 }
    );
  }
}