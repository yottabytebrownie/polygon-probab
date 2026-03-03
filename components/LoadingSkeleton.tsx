'use client';

import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-xl border border-slate-900 bg-slate-950/60 p-4"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded bg-slate-800" />
              <div className="h-3 w-1/2 rounded bg-slate-900" />
            </div>
            <div className="h-10 w-20 rounded bg-slate-800" />
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <div className="h-5 w-20 rounded-full bg-slate-900" />
            <div className="h-5 w-16 rounded-full bg-slate-900" />
            <div className="h-5 w-24 rounded-full bg-slate-900" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-24 rounded bg-slate-900" />
            <div className="h-3 w-20 rounded bg-slate-900" />
          </div>
        </div>
      ))}
    </div>
  );
};