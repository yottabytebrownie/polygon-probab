const parseNumberEnv = (key: string, defaultValue: number): number => {
  const raw = process.env[key];
  if (!raw) return defaultValue;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

export const CONFIG = {
  polymarketBaseUrl:
    process.env.POLYMARKET_BASE_URL ?? 'https://gamma-api.polymarket.com',
  requestTimeoutMs: parseNumberEnv('REQUEST_TIMEOUT_MS', 8000),
  confidence: {
    minVolumeHigh: parseNumberEnv('CONFIDENCE_MIN_VOLUME_HIGH', 10000),
    minLiquidityHigh: parseNumberEnv('CONFIDENCE_MIN_LIQUIDITY_HIGH', 25000),
    maxSpreadPercentHigh: parseNumberEnv(
      'CONFIDENCE_MAX_SPREAD_PERCENT_HIGH',
      5
    ),
    maxDaysToEventHigh: parseNumberEnv(
      'CONFIDENCE_MAX_DAYS_TO_EVENT_HIGH',
      7
    ),
    minVolumeAny: parseNumberEnv('CONFIDENCE_MIN_VOLUME_ANY', 1000),
    minLiquidityAny: parseNumberEnv('CONFIDENCE_MIN_LIQUIDITY_ANY', 5000)
  },
  history: {
    maxPointsPerMarket: parseNumberEnv('HISTORY_MAX_POINTS_PER_MARKET', 50),
    trendWindowMinutes: parseNumberEnv('TREND_WINDOW_MINUTES', 5)
  }
};