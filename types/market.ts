export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface RawPolymarketMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource?: string;
  endDate: string;
  liquidity: string;
  startDate: string;
  image?: string;
  icon?: string;
  description?: string;
  outcomes: string; // JSON string: ["Yes","No"]
  outcomePrices: string; // JSON string: ["0.1975","0.8025"]
  volume: string;
  active?: boolean;
  closed?: boolean;
}

export interface MarketPricePoint {
  timestamp: number;
  probability: number;
}

export interface MarketSummary {
  id: string;
  title: string;
  probability: number;
  confidence: ConfidenceLevel;
  volume24h: number;
  liquidity: number;
  timeRemainingMs: number;
  spreadPercent: number | null;
  resolved: boolean;
  insufficientDepth: boolean;
  lastUpdated: number;
  trendDelta5m: number | null;
  history: MarketPricePoint[];
}