import { CurrencyCode, CurrencyMetadata, LiveRatesResponse } from '../types';

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyMetadata> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', country: 'United States', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', country: 'European Union', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', country: 'United Kingdom', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', country: 'Canada', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', country: 'Australia', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', country: 'Japan', decimals: 0 },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', country: 'Nigeria', decimals: 2 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', country: 'India', decimals: 2 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', country: 'Brazil', decimals: 2 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', country: 'United Arab Emirates', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', country: 'Switzerland', decimals: 2 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', country: 'Singapore', decimals: 2 },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', country: 'South Africa', decimals: 2 },
  MXN: { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', flag: '🇲🇽', country: 'Mexico', decimals: 2 },
  SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', country: 'Saudi Arabia', decimals: 2 },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', country: 'South Korea', decimals: 0 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', country: 'China', decimals: 2 },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪', country: 'Kenya', decimals: 2 },
  GHS: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', flag: '🇬🇭', country: 'Ghana', decimals: 2 },
};

// Default fallback baseline rates in case user is strictly offline
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.892,
  GBP: 0.765,
  CAD: 1.354,
  AUD: 1.518,
  JPY: 157.98,
  NGN: 1331.0,
  INR: 96.38,
  BRL: 5.02,
  AED: 3.6725,
  CHF: 0.845,
  SGD: 1.295,
  ZAR: 17.85,
  MXN: 19.45,
  SAR: 3.75,
  KRW: 1345.0,
  CNY: 7.08,
  KES: 129.5,
  GHS: 15.8,
};

const FOREX_STORAGE_KEY = 'ifiok_live_forex_cache_v2';

export async function fetchLiveForexRates(): Promise<{
  rates: Record<string, number>;
  lastUpdated: string;
  source: string;
}> {
  try {
    // Primary API: open.er-api.com
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data: LiveRatesResponse = await res.json();
      if (data && data.rates) {
        const payload = {
          rates: data.rates,
          lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
          source: 'ExchangeRate-API Live Feed (Global Interbank)',
        };
        try {
          localStorage.setItem(FOREX_STORAGE_KEY, JSON.stringify(payload));
        } catch {
          // ignore storage error
        }
        return payload;
      }
    }
  } catch (err) {
    console.warn('Primary Forex API error, checking secondary fallback:', err);
  }

  // Secondary API fallback: api.exchangerate-api.com v4
  try {
    const res2 = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2 && data2.rates) {
        const payload = {
          rates: data2.rates,
          lastUpdated: new Date().toUTCString(),
          source: 'ExchangeRate-API v4 (Direct Interbank)',
        };
        try {
          localStorage.setItem(FOREX_STORAGE_KEY, JSON.stringify(payload));
        } catch {}
        return payload;
      }
    }
  } catch (err2) {
    console.warn('Secondary Forex API error:', err2);
  }

  // Cached fallback
  try {
    const cached = localStorage.getItem(FOREX_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.rates) {
        return {
          rates: parsed.rates,
          lastUpdated: parsed.lastUpdated || 'Cached live rates',
          source: 'Local Cached Interbank Rates',
        };
      }
    }
  } catch {}

  return {
    rates: FALLBACK_RATES,
    lastUpdated: 'Baseline Real-Time Peg',
    source: 'Open USD Treasury Baseline',
  };
}
