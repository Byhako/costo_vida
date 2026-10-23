import type { CurrencyCode, ExchangeRates } from '../types';
import { CURRENCIES } from '../constants/currencies';

export const RATES_URL = 'https://open.er-api.com/v6/latest/USD';

export function convert(amount: number, from: CurrencyCode, to: CurrencyCode, rates: ExchangeRates): number {
  if (from === to) return amount;
  const rFrom = rates[from];
  const rTo = rates[to];
  if (!(Number.isFinite(rFrom) && rFrom > 0) || !(Number.isFinite(rTo) && rTo > 0)) return NaN;
  return (amount / rFrom) * rTo;
}

export function sanitizeRates(input: unknown): Partial<ExchangeRates> {
  if (typeof input !== 'object' || input === null) return {};
  const source = input as Record<string, unknown>;
  const result: Partial<ExchangeRates> = {};
  for (const code of Object.keys(CURRENCIES) as CurrencyCode[]) {
    const value = source[code];
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      result[code] = value;
    }
  }
  return result;
}

export async function fetchRates(): Promise<Partial<ExchangeRates>> {
  const res = await fetch(RATES_URL);
  if (!res.ok) throw new Error(`el servicio respondió ${res.status}`);
  const data: unknown = await res.json();
  if (
    typeof data !== 'object' ||
    data === null ||
    (data as { result?: unknown }).result !== 'success' ||
    !('rates' in data)
  ) {
    throw new Error('respuesta de tasas no válida');
  }
  return sanitizeRates((data as { rates: unknown }).rates);
}
