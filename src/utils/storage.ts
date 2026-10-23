import type { SavedRates, Scenario } from '../types';
import { DEFAULT_SCENARIOS } from '../constants/defaults';
import { DEFAULT_RATES } from '../constants/currencies';
import { sanitizeRates } from './exchangeRates';

const STORAGE_KEY = 'costo_vida_tiempo_scenarios_v2';
const ACTIVE_TAB_KEY = 'costo_vida_tiempo_active_tab_v2';
const THEME_KEY = 'costo_vida_tiempo_theme_v2';
const RATES_KEY = 'costo_vida_tiempo_rates_v1';

export function stripLegacyScenarioFields(scenarios: Scenario[]): Scenario[] {
  return scenarios.map((s) => {
    const copy = { ...s } as Scenario & { customRateToUSD?: unknown };
    delete copy.customRateToUSD;
    return copy;
  });
}

export function loadSavedScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SCENARIOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return stripLegacyScenarioFields(parsed);
    }
    return DEFAULT_SCENARIOS;
  } catch (error) {
    console.error('Error loading scenarios from localStorage:', error);
    return DEFAULT_SCENARIOS;
  }
}

export function saveScenarios(scenarios: Scenario[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  } catch (error) {
    console.error('Error saving scenarios to localStorage:', error);
  }
}

export function loadSavedRates(): SavedRates {
  try {
    const raw = localStorage.getItem(RATES_KEY);
    if (!raw) {
      return { rates: { ...DEFAULT_RATES }, ratesUpdatedAt: null };
    }
    const parsed = JSON.parse(raw);
    return {
      rates: { ...DEFAULT_RATES, ...sanitizeRates(parsed?.rates) },
      ratesUpdatedAt: typeof parsed?.ratesUpdatedAt === 'string' ? parsed.ratesUpdatedAt : null,
    };
  } catch (error) {
    console.error('Error loading rates from localStorage:', error);
    return { rates: { ...DEFAULT_RATES }, ratesUpdatedAt: null };
  }
}

export function saveRates(data: SavedRates): void {
  try {
    localStorage.setItem(RATES_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving rates to localStorage:', error);
  }
}

export function loadSavedTab(defaultTab: string): string {
  try {
    const tab = localStorage.getItem(ACTIVE_TAB_KEY);
    return tab || defaultTab;
  } catch {
    return defaultTab;
  }
}

export function saveActiveTab(tabId: string): void {
  try {
    localStorage.setItem(ACTIVE_TAB_KEY, tabId);
  } catch {
    // ignore
  }
}

export function loadSavedTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

export function exportDataAsJSON(scenarios: Scenario[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scenarios, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `costo-de-vida-tiempo-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
