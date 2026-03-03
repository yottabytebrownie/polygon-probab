'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import type { MarketSummary } from '../types/market';
import { EventCard } from '../components/EventCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { ProbabilityHistoryChart } from '../components/ProbabilityHistoryChart';

interface ApiResponse {
  markets: MarketSummary[];
  updatedAt: number;
}

const POLL_INTERVAL_MS = 5000;

export default function HomePage() {
  const [markets, setMarkets] = useState<MarketSummary[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch('/api/markets', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setMarkets(data.markets);
      setLastUpdated(data.updatedAt);
      setError(null);
    } catch (err) {
      if (!markets) {
        setError('Unable to load markets. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [markets]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (cancelled) return;
      await fetchMarkets();
    };

    load();

    const id = setInterval(() => {
      void fetchMarkets();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [fetchMarkets]);

  const { mostCertain, fastestMoving } = useMemo(() => {
    if (!markets) {
      return {
        mostCertain: [] as MarketSummary[],
        fastestMoving: [] as MarketSummary[]
      };
    }

    const active = markets.filter((m) => !m.resolved);

    const mostCertain = [...active]
      .sort(
        (a, b) =>
          Math.abs(b.probability - 50) - Math.abs(a.probability - 50)
      )
      .slice(0, 6);

    const fastestMoving = [...active]
      .filter((m) => m.trendDelta5m != null)
      .sort(
        (a, b) =>
          Math.abs(b.trendDelta5m ?? 0) -
          Math.abs(a.trendDelta5m ?? 0)
      )
      .slice(0, 6);

    return { mostCertain, fastestMoving };
  }, [markets]);

  const formattedUpdatedAt = useMemo(() => {
    if (!lastUpdated) return null;
    const d = new Date(lastUpdated);
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, [lastUpdated]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 lg:py-10">
        <header className="flex flex-col gap-3 border-b border-slate-900 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              ProbabMarket — Live Event Probabilities
            </h1>
            <p className="mt-1 max-w-xl text-xs text-slate-400 md:text-sm">
              Real-time probabilities from Polymarket, with confidence scores
              based on liquidity, volume, spread, and time to resolution.
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 text-xs text-slate-400 md:items-end">
            <span className="rounded-full bg-slate-900/70 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-300">
              Polling every {Math.round(POLL_INTERVAL_MS / 1000)}s
            </span>
            {formattedUpdatedAt && (
              <span>Last updated: {formattedUpdatedAt}</span>
            )}
          </div>
        </header>

        {loading && !markets && <LoadingSkeleton />}

        {!loading && error && !markets && (
          <ErrorState message={error} onRetry={fetchMarkets} />
        )}

        {!loading && markets && (
          <>
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium text-slate-200 md:text-base">
                  All Events
                </h2>
                <span className="text-xs text-slate-500">
                  Showing {markets.length} markets
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {markets.map((m) => (
                  <div key={m.id} className="flex flex-col gap-2">
                    <EventCard market={m} />
                    <ProbabilityHistoryChart points={m.history} />
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-slate-200 md:text-base">
                  Most Certain Events
                </h2>
                {mostCertain.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Not enough data yet.
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {mostCertain.map((m) => (
                      <EventCard key={m.id} market={m} />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-medium text-slate-200 md:text-base">
                  Fastest Moving Events (5m)
                </h2>
                {fastestMoving.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Not enough history yet to compute movement.
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {fastestMoving.map((m) => (
                      <EventCard key={m.id} market={m} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}