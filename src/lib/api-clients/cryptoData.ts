export interface CryptoProfile {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  logoUrl: string;
  consensusType: string; // PoW, PoS, DPoS, DAG, etc.
  description: string;
  stakingAvailable: boolean;
  whitepaperUrl: string;
}

const CG_KEY = process.env.COINGECKO_API_KEY;

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 6000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Fetch list of coins from CoinGecko to map symbol to ID
 */
export async function getCoinIdFromSymbol(symbol: string): Promise<string> {
  const cleanSymbol = symbol.toLowerCase().trim();
  
  // Hardcoded mappings for top 50 to avoid extra API hits and rate limits
  const topCoins: Record<string, string> = {
    btc: "bitcoin",
    eth: "ethereum",
    sol: "solana",
    ada: "cardano",
    xrp: "ripple",
    dot: "polkadot",
    avax: "avalanche-2",
    matic: "matic-network",
    link: "chainlink",
    uni: "uniswap",
    ltc: "litecoin",
    algo: "algorand",
    xlm: "stellar",
    vet: "vechain",
    near: "near",
    fil: "filecoin",
    trx: "tron",
    atom: "cosmos",
    doge: "dogecoin",
    shib: "shiba-inu",
    usdt: "tether",
    usdc: "usd-coin",
    bnd: "binancecoin",
    bnb: "binancecoin"
  };

  if (topCoins[cleanSymbol]) {
    return topCoins[cleanSymbol];
  }

  try {
    const url = CG_KEY 
      ? `https://api.coingecko.com/api/v3/coins/list?x_cg_demo_api_key=${CG_KEY}`
      : `https://api.coingecko.com/api/v3/coins/list`;
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const data = await res.json();
      const match = data.find((c: any) => c.symbol === cleanSymbol);
      if (match) return match.id;
    }
  } catch (e) {
    console.error("CoinGecko ID lookup failed", e);
  }

  // default fallback to matching lowercase symbol
  return cleanSymbol;
}

/**
 * Get detailed crypto profile
 */
export async function getCryptoProfile(symbolOrId: string): Promise<CryptoProfile> {
  let coingeckoId = symbolOrId.toLowerCase().trim();
  
  // If user passed a symbol (e.g. BTC), fetch the actual CoinGecko ID
  if (symbolOrId.length <= 5) {
    coingeckoId = await getCoinIdFromSymbol(symbolOrId);
  }

  try {
    const url = CG_KEY
      ? `https://api.coingecko.com/api/v3/coins/${coingeckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=${CG_KEY}`
      : `https://api.coingecko.com/api/v3/coins/${coingeckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    const res = await fetchWithTimeout(url);
    
    if (res.ok) {
      const data = await res.json();
      const md = data.market_data || {};
      
      // Determine consensus type using description/categories heuristics
      const desc = data.description?.en || "";
      let consensus = "Unknown";
      let staking = false;

      const normDesc = desc.toLowerCase();
      if (normDesc.includes("proof of work") || normDesc.includes("proof-of-work") || normDesc.includes("pow") || ["bitcoin", "litecoin", "dogecoin"].includes(data.id)) {
        consensus = "Proof of Work (PoW)";
        staking = false;
      } else if (normDesc.includes("proof of stake") || normDesc.includes("proof-of-stake") || normDesc.includes("pos") || ["ethereum", "solana", "cardano", "polkadot", "avalanche-2"].includes(data.id)) {
        consensus = "Proof of Stake (PoS)";
        staking = true;
      } else if (normDesc.includes("delegated proof of stake") || normDesc.includes("dpos")) {
        consensus = "Delegated Proof of Stake (DPoS)";
        staking = true;
      } else if (data.categories?.some((c: string) => c.toLowerCase().includes("proof of stake") || c.toLowerCase().includes("pos"))) {
        consensus = "Proof of Stake (PoS)";
        staking = true;
      }

      return {
        id: data.id,
        symbol: data.symbol?.toUpperCase(),
        name: data.name,
        price: md.current_price?.usd || 0,
        marketCap: md.market_cap?.usd || 0,
        volume24h: md.total_volume?.usd || 0,
        logoUrl: data.image?.large || data.image?.small || "",
        consensusType: consensus,
        description: desc.replace(/<[^>]*>/g, ""), // strip HTML
        stakingAvailable: staking,
        whitepaperUrl: data.links?.homepage?.[0] || "",
      };
    }
  } catch (e) {
    console.error(`CoinGecko details fetch failed for ${coingeckoId}`, e);
  }

  // Fallback profile generator if CoinGecko is completely down or rate-limited
  return getSimulatedCryptoProfile(symbolOrId);
}

/**
 * Fetch CoinGecko prices for list of coin ids
 */
export async function getCryptoPrices(ids: string[]): Promise<Record<string, { price: number; marketCap: number }>> {
  if (ids.length === 0) return {};
  const idStr = ids.join(",");
  try {
    const url = CG_KEY
      ? `https://api.coingecko.com/api/v3/simple/price?ids=${idStr}&vs_currencies=usd&include_market_cap=true&x_cg_demo_api_key=${CG_KEY}`
      : `https://api.coingecko.com/api/v3/simple/price?ids=${idStr}&vs_currencies=usd&include_market_cap=true`;
    
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const data = await res.json();
      const result: Record<string, { price: number; marketCap: number }> = {};
      for (const id of ids) {
        if (data[id]) {
          result[id] = {
            price: data[id].usd || 0,
            marketCap: data[id].usd_market_cap || 0,
          };
        }
      }
      return result;
    }
  } catch (e) {
    console.error("CoinGecko simple price fetch failed", e);
  }
  return {};
}

/**
 * Fetch historical prices for chart
 */
export async function getCryptoHistory(id: string, days = 30): Promise<{ date: string; price: number }[]> {
  try {
    const url = CG_KEY
      ? `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${CG_KEY}`
      : `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
    
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const data = await res.json();
      const prices: [number, number][] = data.prices || [];
      return prices.map(([ts, val]) => ({
        date: new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price: val,
      }));
    }
  } catch (e) {
    console.error(`CoinGecko history failed for ${id}`, e);
  }
  return [];
}

/**
 * Generate simulated crypto profiles for robust fallback support
 */
function getSimulatedCryptoProfile(symbol: string): CryptoProfile {
  const sym = symbol.toUpperCase().trim();
  
  const coinConfig: Record<string, Partial<CryptoProfile>> = {
    BTC: {
      id: "bitcoin", name: "Bitcoin", price: 68000, marketCap: 1300000000000, volume24h: 30000000000,
      consensusType: "Proof of Work (PoW)", stakingAvailable: false,
      description: "Bitcoin is a decentralized digital currency, without a central bank or single administrator..."
    },
    ETH: {
      id: "ethereum", name: "Ethereum", price: 3500, marketCap: 420000000000, volume24h: 15000000000,
      consensusType: "Proof of Stake (PoS)", stakingAvailable: true,
      description: "Ethereum is a decentralized, open-source blockchain with smart contract functionality..."
    },
    SOL: {
      id: "solana", name: "Solana", price: 150, marketCap: 68000000000, volume24h: 3500000000,
      consensusType: "Proof of Stake (PoS)", stakingAvailable: true,
      description: "Solana is a blockchain platform which uses a proof-of-stake mechanism to provide smart contract functionality..."
    }
  };

  const defaults = coinConfig[sym] || {
    id: sym.toLowerCase(),
    name: sym,
    price: 1.0,
    marketCap: 10000000,
    volume24h: 100000,
    consensusType: "Proof of Stake (PoS)",
    stakingAvailable: true,
    description: `${sym} is a decentralized public blockchain network.`,
  };

  return {
    id: defaults.id!,
    symbol: sym,
    name: defaults.name!,
    price: defaults.price!,
    marketCap: defaults.marketCap!,
    volume24h: defaults.volume24h!,
    logoUrl: `https://coinicons-api.vercel.app/api/icon/${sym.toLowerCase()}` || "",
    consensusType: defaults.consensusType!,
    description: defaults.description!,
    stakingAvailable: defaults.stakingAvailable!,
    whitepaperUrl: `https://whitepaper.io/coin/${defaults.id}`,
  };
}
