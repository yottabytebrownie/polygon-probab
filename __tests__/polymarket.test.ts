import { fetchMarketsFromPolymarket } from '../services/polymarket';
import type { RawPolymarketMarket } from '../types/market';

describe('fetchMarketsFromPolymarket', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn();
  });

  it('maps Polymarket response into MarketSummary', async () => {
    const mockMarket: RawPolymarketMarket = {
      id: '531202',
      question: 'BitBoy convicted?',
      conditionId:
        '0xb48621f7eba07b0a3eeabc6afb09ae42490239903997b9d412b0f69aeb040c8b',
      slug: 'bitboy-convicted',
      resolutionSource: '',
      endDate: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(),
      liquidity: '788.9516',
      startDate: new Date().toISOString(),
      image: '',
      icon: '',
      description: '',
      outcomes: '["Yes","No"]',
      outcomePrices: '["0.1975","0.8025"]',
      volume: '43070.385628',
      active: true,
      closed: false
    };

    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [mockMarket]
    });

    const markets = await fetchMarketsFromPolymarket();
    expect(markets).toHaveLength(1);
    const m = markets[0];

    expect(m.id).toBe('531202');
    expect(m.title).toBe('BitBoy convicted?');
    expect(m.probability).toBeGreaterThan(0);
    expect(m.volume24h).toBeGreaterThan(0);
    expect(m.liquidity).toBeGreaterThan(0);
    expect(m.resolved).toBe(false);
  });

  it('filters out inactive markets', async () => {
    const mockMarket: RawPolymarketMarket = {
      id: '2',
      question: 'Inactive market',
      conditionId: '0x0',
      slug: 'inactive',
      resolutionSource: '',
      endDate: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(),
      liquidity: '0',
      startDate: new Date().toISOString(),
      image: '',
      icon: '',
      description: '',
      outcomes: '["Yes","No"]',
      outcomePrices: '["0.5","0.5"]',
      volume: '0',
      active: false,
      closed: true
    };

    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [mockMarket]
    });

    const markets = await fetchMarketsFromPolymarket();
    expect(markets).toHaveLength(0);
  });
});