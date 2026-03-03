'use client';

import React from 'react';
import type { MarketSummary } from '../types/market';
import { formatTimeRemaining } from '../utils/time';

interface Props {
  market: MarketSummary;
}

const probabilityColor = (p: number): string => {
  if (p < 30) return 'text-red-500';
  if (p < 60) return 'text-yellow-500';
  return 'text-emerald-500';
};

const probabilityBgColor = (p: number): string => {
  if (p < 30) return 'bg-red-500/10';
  if (p < 60) return 'bg-yellow-500/10';
  return 'bg-emerald-500/10';
};

const confidenceClass: Record<string, string> = {
  Low: 'bg-red-500/10 text-red-500 border-red-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  High: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
};

export const EventCard: React.FC<Props> = ({ market }) => {
  const {
    title,
    probability,
    confidence,
    volume24h,
    liquidity,
    timeRemainingMs,
    spreadPercent,
    resolved,
    insufficientDepth,
    trendDelta5m
  } = market;

  const probColor = probabilityColor(probability);
  const probBg = probabilityBgColor(probability);

  let trendIcon = '→';
  let trendClass = 'text-slate-400';

  if (trendDelta5m != null) {
    if (trendDelta5m > 0.5) {
      trendIcon = '↑';
      trendClass = 'text-emerald-500';
    } else if (trendDelta5m < -0.5) {
      trendIcon = '↓';
      trendClass = 'text-red-500';
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm shadow-slate-900 transition-colors hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-slate-100 line-clamp-2">
            {title}
          </h2>
        </div>
        <div
          className={`flex flex-col items-end rounded-md px-3 py-1 ${probBg}`}
        >
          <span
            className={`text-2xl font-semibold tracking-tight ${probColor}`}
          >
            {probability.toFixed(1)}%
          </span>
          <span className="text-[10px] uppercase tracking-wide text-slate-400">
            Probability
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${confidenceClass[confidence]}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              confidence === 'High'
                ? 'bg-emerald-500'
                : confidence === 'Medium'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          />
          Confidence: {confidence}
        </span>

        {spreadPercent != null && (
          <span className="rounded-full bg-slate-900/70 px-2.5 py-0.5 text-xs text-slate-300">
            Spread: {spreadPercent.toFixed(1)}%
          </span>
        )}

        <span className="rounded-full bg-slate-900/70 px-2.5 py-0.5 text-xs text-slate-300">
          24h Vol: ${volume24h.toLocaleString()}
        </span>

        <span className="rounded-full bg-slate-900/70 px-2.5 py-0.5 text-xs text-slate-300">
          Liquidity: ${liquidity.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Time remaining:</span>
          <span className="font-medium text-slate-200">
            {formatTimeRemaining(timeRemainingMs)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={trendClass}>{trendIcon}</span>
          {trendDelta5m != null ? (
            <span className="text-slate-300">
              {trendDelta5m > 0 ? '+' : ''}
              {trendDelta5m.toFixed(1)} pts (5m)
            </span>
          ) : (
            <span className="text-slate-500">No trend yet</span>
          )}
        </div>
      </div>

      {resolved && (
        <div className="mt-1 text-xs font-medium text-emerald-400">
          Market resolved
        </div>
      )}

      {insufficientDepth && (
        <div className="mt-1 text-xs text-amber-400">
          Insufficient market depth
        </div>
      )}
    </div>
  );
};