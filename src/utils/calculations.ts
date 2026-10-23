import type { IncomeConfig, ItemTimeImpact, ScenarioCalculations } from '../types';

export const WEEKS_PER_MONTH = 4.3333;
export const STANDARD_WORKDAY_HOURS = 8;
export const STANDARD_WORKWEEK_HOURS = 40;

export function calculateScenario(config: IncomeConfig): ScenarioCalculations {
  const weeklyWorkHours = Math.max(1, config.weeklyWorkHours || 40);
  const monthlyPaidHours = weeklyWorkHours * WEEKS_PER_MONTH;

  // Monthly gross income
  const monthlyGrossIncome =
    config.incomeFrequency === 'monthly'
      ? Math.max(0, config.nominalAmount || 0)
      : Math.max(0, (config.nominalAmount || 0) * monthlyPaidHours);

  // Total monthly work expenses & deductions
  const totalDeductions =
    Math.max(0, config.taxDeductionsMonthly || 0) +
    Math.max(0, config.commuteExpensesMonthly || 0) +
    Math.max(0, config.workOtherExpensesMonthly || 0);

  // Monthly Net Income (can't be negative)
  const monthlyNetIncome = Math.max(0, monthlyGrossIncome - totalDeductions);

  // Unpaid life time spent on work (commute + prep)
  const weeklyUnpaidHours =
    Math.max(0, config.commuteHoursWeekly || 0) +
    Math.max(0, config.prepHoursWeekly || 0);
  const monthlyCommuteHours = weeklyUnpaidHours * WEEKS_PER_MONTH;

  // Total life hours given to work
  const monthlyTotalLifeHours = monthlyPaidHours + monthlyCommuteHours;

  // Nominal hourly rate (apparent)
  const nominalHourlyRate =
    monthlyPaidHours > 0 ? monthlyGrossIncome / monthlyPaidHours : 0;

  // Real hourly rate: Net Income / Total Life Hours given to work
  const realHourlyRate =
    monthlyTotalLifeHours > 0 ? monthlyNetIncome / monthlyTotalLifeHours : 0;

  // Reality discount %: how much the apparent wage was reduced by expenses & unpaid hours
  const realityDiscountPct =
    nominalHourlyRate > 0
      ? Math.max(0, ((nominalHourlyRate - realHourlyRate) / nominalHourlyRate) * 100)
      : 0;

  // Percentage of income consumed directly by the act of working
  const expensePercentage =
    monthlyGrossIncome > 0
      ? Math.min(100, (totalDeductions / monthlyGrossIncome) * 100)
      : 0;

  return {
    monthlyGrossIncome,
    monthlyNetIncome,
    monthlyPaidHours,
    monthlyCommuteHours,
    monthlyTotalLifeHours,
    nominalHourlyRate,
    realHourlyRate,
    realityDiscountPct,
    expensePercentage,
  };
}

export function calculateItemImpact(
  price: number,
  realHourlyRate: number
): ItemTimeImpact {
  if (realHourlyRate <= 0 || price <= 0) {
    return {
      hours: 0,
      days: 0,
      weeks: 0,
      months: 0,
      emotionalText: 'El valor por hora real debe ser mayor a 0 para calcular el costo en tiempo de vida.',
      intensity: 'low',
    };
  }

  const hours = price / realHourlyRate;
  const days = hours / STANDARD_WORKDAY_HOURS;
  const weeks = hours / STANDARD_WORKWEEK_HOURS;
  const months = hours / (STANDARD_WORKWEEK_HOURS * WEEKS_PER_MONTH);

  // Determine intensity
  let intensity: ItemTimeImpact['intensity'] = 'low';
  if (hours > 80) intensity = 'critical';
  else if (hours > 16) intensity = 'high';
  else if (hours >= 4) intensity = 'moderate';

  // Build empathetic, emotional narrative
  const emotionalText = generateEmotionalNarrative(hours, days, weeks);

  return {
    hours,
    days,
    weeks,
    months,
    emotionalText,
    intensity,
  };
}

function generateEmotionalNarrative(
  hours: number,
  days: number,
  weeks: number
): string {
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `Trabajas aproximadamente ${mins} minutos para adquirir este artículo. Un intercambio de tiempo leve y accesible.`;
  }

  if (hours <= 4) {
    const roundedHours = hours.toFixed(1);
    return `Requiere ${roundedHours} horas de tu vida. Equivale a trabajar media jornada (ej. toda la mañana del lunes de 8:00 AM a 12:00 PM) dedicado únicamente a este objeto.`;
  }

  if (hours <= 8) {
    return `Requiere 1 jornada completa de trabajo (${hours.toFixed(1)}h). Te levantas, viajas, trabajas todo el día y vuelves a casa solo para pagar esto.`;
  }

  if (days <= 5) {
    const fullDays = Math.floor(days);
    const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
    const finishDay = dayNames[Math.min(4, Math.max(0, fullDays))];
    
    return `Para comprar esto trabajas ${days.toFixed(1)} días laborales (${hours.toFixed(1)}h). Si empiezas el lunes a las 8:00 AM, trabajarás hasta el ${finishDay} exclusivamente para conseguirlo.`;
  }

  if (weeks <= 4) {
    return `Implica entregar ${weeks.toFixed(1)} semanas completas de tu vida (${hours.toFixed(0)} horas de esfuerzo y traslado). Son casi ${Math.round(days)} días despertando con la alarma para costear este artículo.`;
  }

  const months = weeks / WEEKS_PER_MONTH;
  return `¡Impacto mayúsculo! Este artículo te exige ${months.toFixed(1)} meses enteros de tu existencia laboral (${hours.toFixed(0)} horas reales invertidas). Todo tu sudor, transporte y estrés de ese periodo van a este pago.`;
}
