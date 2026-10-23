import type { CurrencyCode, CurrencyInfo } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dólar Estadounidense (USD)',
    rateToUSD: 1.0,
  },
  COP: {
    code: 'COP',
    symbol: '$',
    name: 'Peso Colombiano (COP)',
    rateToUSD: 4150.0,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Dólar Canadiense (CAD)',
    rateToUSD: 1.36,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    rateToUSD: 0.92,
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Peso Mexicano (MXN)',
    rateToUSD: 19.5,
  },
  CLP: {
    code: 'CLP',
    symbol: '$',
    name: 'Peso Chileno (CLP)',
    rateToUSD: 935.0,
  },
  ARS: {
    code: 'ARS',
    symbol: '$',
    name: 'Peso Argentino (ARS)',
    rateToUSD: 1200.0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'Libra Esterlina (GBP)',
    rateToUSD: 0.79,
  },
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
