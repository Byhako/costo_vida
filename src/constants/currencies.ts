import type { CurrencyCode, CurrencyInfo, ExchangeRates } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dólar Estadounidense (USD)',
  },
  COP: {
    code: 'COP',
    symbol: '$',
    name: 'Peso Colombiano (COP)',
  },
  CAD: {
    code: 'CAD',
    symbol: '$',
    name: 'Dólar Canadiense (CAD)',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Peso Mexicano (MXN)',
  },
  CLP: {
    code: 'CLP',
    symbol: '$',
    name: 'Peso Chileno (CLP)',
  },
  ARS: {
    code: 'ARS',
    symbol: '$',
    name: 'Peso Argentino (ARS)',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'Libra Esterlina (GBP)',
  },
};

/** Valores aproximados de ejemplo (unidades por 1 USD), para usar la app sin conexión (D2). */
export const DEFAULT_RATES: ExchangeRates = {
  USD: 1,
  COP: 4150,
  CAD: 1.36,
  EUR: 0.92,
  MXN: 19.5,
  CLP: 935,
  ARS: 1200,
  GBP: 0.79,
};

export const COMMON_CATEGORIES = [
  { label: 'Tecnología', emoji: '📱' },
  { label: 'Ropa y Calzado', emoji: '👟' },
  { label: 'Alimentación y Salidas', emoji: '☕' },
  { label: 'Transporte y Viajes', emoji: '✈️' },
  { label: 'Vivienda y Hogar', emoji: '🏠' },
  { label: 'Suscripciones y Ocio', emoji: '🎮' },
  { label: 'Salud y Cuidado', emoji: '💊' },
  { label: 'Otros', emoji: '📦' },
];
