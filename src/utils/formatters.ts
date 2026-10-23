import type { CurrencyCode } from '../types';
import { CURRENCIES } from '../constants/currencies';
import { STANDARD_WORKDAY_HOURS, STANDARD_WORKWEEK_HOURS, WEEKS_PER_MONTH } from './calculations';

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

export function formatNumber(value: number, maxDigits = 1): string {
  return (Object.is(value, -0) ? 0 : value).toLocaleString('es-CO', { maximumFractionDigits: maxDigits });
}

export function formatHours(hours: number): string {
  if (!Number.isFinite(hours)) return '—';
  const totalMin = Math.round(hours * 60);
  if (totalMin < 60) return `${Math.max(1, totalMin)} min`;
  if (hours < 10) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m > 0 ? `${h} h ${m} min` : `${h} h`;
  }
  return `${formatNumber(hours, 0)} h`;
}

export function humanizeHours(hours: number): string {
  if (!Number.isFinite(hours)) return '—';
  if (hours < STANDARD_WORKDAY_HOURS) return formatHours(hours);
  const days = hours / STANDARD_WORKDAY_HOURS;
  if (days < 10) return `${formatNumber(days)} días`;
  const weeks = hours / STANDARD_WORKWEEK_HOURS;
  const months = weeks / WEEKS_PER_MONTH;
  if (months < 2) return `${formatNumber(weeks)} semanas`;
  return `${formatNumber(months)} meses`;
}

export function formatRateValue(value: number): number | '' {
  if (!(Number.isFinite(value) && value > 0)) return '';
  if (value >= 1) return Math.round(value * 10000) / 10000;
  return Number(value.toPrecision(6));
}
