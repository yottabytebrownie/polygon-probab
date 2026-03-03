'use client';

import React, { useMemo } from 'react';
import type { MarketPricePoint } from '../types/market';

interface Props {
  points: MarketPricePoint[];
}

export const ProbabilityHistoryChart: React.FC<Props> = ({ points }) => {
  const { path, viewBox } = useMemo(() => {
    if (points.length === 0) {
      return { path: '', viewBox: '0 0 100 40' };
    }

    const sorted = [...points].sort((a, b) => a.timestamp - b.timestamp);
    const firstTs = sorted[0].timestamp;
    const lastTs = sorted[sorted.length - 1].timestamp || firstTs;
    const dt = lastTs - firstTs || 1;

    const coords = sorted.map((p) => {
      const x = ((p.timestamp - firstTs) / dt) * 100;
      const y = 40 - (p.probability / 100) * 40;
      return { x, y };
    });

    const d = coords
      .map((c, idx) =>
        idx === 0
          ? `M ${c.x.toFixed(2)} ${c.y.toFixed(2)}`
          : `L ${c.x.toFixed(2)} ${c.y.toFixed(2)}`
      )
      .join(' ');

    return { path: d, viewBox: '0 0 100 40' };
  }, [points]);

  if (!path) {
    return (
      <div className="h-10 w-full rounded-md bg-slate-900/60" aria-hidden />
    );
  }

  return (
    <svg
      viewBox={viewBox}
      className="h-10 w-full text-emerald-500"
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};