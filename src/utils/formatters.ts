import type { CurrencyCode } from '../types';
import { CURRENCIES } from '../constants/currencies';

export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  showDecimals = false
): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const isHighDenomination = currencyCode === 'COP' || currencyCode === 'CLP' || currencyCode === 'ARS';

  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: isHighDenomination || !showDecimals ? 0 : 2,
      minimumFractionDigits: isHighDenomination || !showDecimals ? 0 : 2,
    }).format(amount);
  } catch {
    const formattedNum = isHighDenomination || !showDecimals
      ? Math.round(amount).toLocaleString('es-CO')
      : amount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${currency.symbol} ${formattedNum}`;
  }
}

export function formatTimeSpan(hours: number): {
  short: string;
  detailed: string;
} {
  if (hours <= 0) {
    return { short: '0 h', detailed: '0 horas' };
  }

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  let short = `${wholeHours}h`;
  if (minutes > 0) {
    short += ` ${minutes}m`;
  }

  const days = hours / 8;
  const weeks = hours / 40;

  let detailed = '';
  if (hours < 8) {
    detailed = `${hours.toFixed(1)} horas`;
  } else if (days < 5) {
    detailed = `${days.toFixed(1)} días laborales (${hours.toFixed(1)}h)`;
  } else if (weeks < 4) {
    detailed = `${weeks.toFixed(1)} semanas laborales (~${days.toFixed(0)} días)`;
  } else {
    const months = weeks / 4.3333;
    detailed = `${months.toFixed(1)} meses laborales (${hours.toFixed(0)} horas)`;
  }

  return { short, detailed };
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
