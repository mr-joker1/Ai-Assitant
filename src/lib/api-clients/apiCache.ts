/**
 * API Cache Layer — Free Tier Guardian
 *
 * Strategy:
 *  1. In-memory cache (fast, zero DB reads) with per-key TTL
 *  2. Request deduplication (concurrent calls for same key wait on one fetch)
 *  3. Stale-while-revalidate pattern (return stale instantly, refresh in background)
 *
 * TTLs tuned against free-tier limits:
 *  FMP:        250 req/day  → cache 4 h (stock profiles), 8 h (financials)
 *  CoinGecko:  30 req/min   → cache 15 min (prices), 2 h (full profiles)
 *  GNews:      100 req/day  → cache 6 h (news)
 *  NewsAPI:    100 req/day  → cache 6 h (news)
 *  OpenAI:     pay-per-use  → cache AI responses 24 h for identical prompts
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry<any>>();
const inFlight = new Map<string, Promise<any>>();

export const TTL = {
  FMP_PROFILE:    4  * 60 * 60 * 1000,  // 4 hours
  FMP_FINANCIALS: 8  * 60 * 60 * 1000,  // 8 hours
  FMP_SEGMENTS:   12 * 60 * 60 * 1000,  // 12 hours
  FMP_ETF:        6  * 60 * 60 * 1000,  // 6 hours
  CG_PROFILE:     2  * 60 * 60 * 1000,  // 2 hours
  CG_PRICE:       15 * 60 * 1000,       // 15 minutes
  CG_HISTORY:     30 * 60 * 1000,       // 30 minutes
  NEWS:           6  * 60 * 60 * 1000,  // 6 hours
  OPENAI:         24 * 60 * 60 * 1000,  // 24 hours (same-prompt cache)
  SHORT:          5  * 60 * 1000,        // 5 minutes (generic short)
} as const;

/**
 * Get from in-memory cache — returns null if missing or expired
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

/**
 * Set in-memory cache
 */
export function setCached<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
    fetchedAt: Date.now(),
  });
}

/**
 * Check if a cached entry is stale (but still present)
 */
export function isStale(key: string, staleAfterMs: number): boolean {
  const entry = cache.get(key);
  if (!entry) return true;
  return Date.now() > entry.fetchedAt + staleAfterMs;
}

/**
 * Deduplicated cached fetch — the core workhorse.
 *
 * - If fresh cache exists: return immediately (0 API calls)
 * - If another call is in-flight for same key: await it (0 extra API calls)
 * - Otherwise: execute fetcher, cache result, return it
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
): Promise<T> {
  // 1. Fresh cache hit
  const hit = getCached<T>(key);
  if (hit !== null) return hit;

  // 2. Deduplicate concurrent requests for the same key
  if (inFlight.has(key)) {
    return inFlight.get(key) as Promise<T>;
  }

  // 3. Execute fetch, cache, clean up
  const promise = fetcher()
    .then((result) => {
      setCached(key, result, ttlMs);
      inFlight.delete(key);
      return result;
    })
    .catch((err) => {
      inFlight.delete(key);
      throw err;
    });

  inFlight.set(key, promise);
  return promise;
}

/**
 * Stale-while-revalidate: return stale data immediately and refresh in background.
 * Good for news and prices where slightly old data is acceptable.
 */
export function cachedFetchSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
  staleMs: number,
): Promise<T> {
  const entry = cache.get(key);

  if (entry) {
    const now = Date.now();
    // Return stale data and kick off background refresh
    if (now < entry.expiresAt) {
      if (now > entry.fetchedAt + staleMs && !inFlight.has(key)) {
        // Background refresh without awaiting
        const refresh = fetcher()
          .then((r) => { setCached(key, r, ttlMs); inFlight.delete(key); })
          .catch(() => { inFlight.delete(key); });
        inFlight.set(key, refresh);
      }
      return Promise.resolve(entry.data as T);
    }
    cache.delete(key);
  }

  return cachedFetch(key, fetcher, ttlMs);
}

/**
 * Clear all cache entries matching a prefix
 */
export function invalidatePrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

/**
 * Cache stats for admin panel
 */
export function getCacheStats(): {
  totalEntries: number;
  inFlightRequests: number;
  keys: string[];
} {
  return {
    totalEntries: cache.size,
    inFlightRequests: inFlight.size,
    keys: [...cache.keys()],
  };
}
