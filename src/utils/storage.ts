import type { Scenario } from '../types';
import { DEFAULT_SCENARIOS } from '../constants/defaults';

const STORAGE_KEY = 'costo_vida_tiempo_scenarios_v2';
const ACTIVE_TAB_KEY = 'costo_vida_tiempo_active_tab_v2';
const THEME_KEY = 'costo_vida_tiempo_theme_v2';

export function loadSavedScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SCENARIOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
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
