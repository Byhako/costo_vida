export type CurrencyCode = 'COP' | 'USD' | 'CAD' | 'EUR' | 'MXN' | 'CLP' | 'ARS' | 'GBP';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // e.g. 1 USD = rateToUSD in local currency (e.g. 4000 for COP, 1.36 for CAD)
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
  customRateToUSD?: number; // User override for exchange rate to USD
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
