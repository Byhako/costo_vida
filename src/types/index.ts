export type CurrencyCode = 'COP' | 'USD' | 'CAD' | 'EUR' | 'MXN' | 'CLP' | 'ARS' | 'GBP';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export type IncomeFrequency = 'monthly' | 'hourly';

export interface IncomeConfig {
  incomeFrequency: IncomeFrequency;
  nominalAmount: number;        // Nominal monthly salary or nominal hourly wage
  weeklyWorkHours: number;      // Normal weekly work hours (e.g. 40, 44, 48)
  
  // Work-related expenses (monthly)
  taxDeductionsMonthly: number; // Income tax, pension, health deductions
  commuteExpensesMonthly: number; // Transit pass, gas, parking
  workOtherExpensesMonthly: number; // Gear, uniforms, mandatory eating out, work apps

  // Unpaid time associated with work (weekly)
  commuteHoursWeekly: number;   // Roundtrip commute time per week
  prepHoursWeekly: number;      // Prep, dressing, unpaid meetings per week
}

export interface ItemCost {
  id: string;
  name: string;
  price: number;
  category?: string;
  emoji?: string;
  notes?: string;
  createdAt: number;
}

export interface Scenario {
  id: string;
  name: string;
  currency: CurrencyCode;
  incomeConfig: IncomeConfig;
  items: ItemCost[];
  colorTheme?: string;
}

export interface ScenarioCalculations {
  monthlyGrossIncome: number;
  monthlyNetIncome: number; // after deductions and work expenses
  monthlyPaidHours: number; // weeklyWorkHours * 4.333
  monthlyCommuteHours: number; // (commuteHoursWeekly + prepHoursWeekly) * 4.333
  monthlyTotalLifeHours: number; // paid + commute/prep
  nominalHourlyRate: number; // gross / paid hours
  realHourlyRate: number; // net income / total life hours
  realityDiscountPct: number; // % drop from nominal to real
  expensePercentage: number; // % of income swallowed by working
}

export interface ItemTimeImpact {
  hours: number;
  days: number;      // 8-hour work days
  weeks: number;     // 40-hour work weeks
  months: number;    // ~173.33 work hours
  emotionalText: string;
  intensity: 'low' | 'moderate' | 'high' | 'critical';
}

/** Unidades de cada moneda por 1 USD (architecture D1, D3). */
export type ExchangeRates = Record<CurrencyCode, number>;

/** null = valores de ejemplo; 'manual' = editadas a mano; otro string = ISO del momento de la descarga (D6). */
export type RatesUpdatedAt = string | null;

export interface SavedRates {
  rates: ExchangeRates;
  ratesUpdatedAt: RatesUpdatedAt;
}

/** Entrada del índice de artículos agrupado por nombre normalizado (D10). */
export interface ItemIndexEntry {
  key: string;   // nombre sin espacios en los extremos y en minúsculas
  label: string; // nombre del primer artículo encontrado, sin espacios en los extremos
  byScenario: Map<string, { scenario: Scenario; item: ItemCost }>; // id de escenario -> primer artículo con esa clave
}
