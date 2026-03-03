'use client';

import React from 'react';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<Props> = ({
  message = 'Something went wrong while loading markets.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-900/60 bg-red-950/40 p-6 text-center text-sm text-red-100">
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-500"
        >
          Retry
        </button>
      )}
    </div>
  );
};