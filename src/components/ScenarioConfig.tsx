import { useState } from 'preact/hooks';
import type { Scenario, CurrencyCode } from '../types';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../constants/currencies';
import { calculateScenario } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/formatters';
import {
  Wallet,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-preact';

interface ScenarioConfigProps {
  scenario: Scenario;
}

export function ScenarioConfig({ scenario }: ScenarioConfigProps) {
  const { updateScenario } = useApp();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const calc = calculateScenario(scenario.incomeConfig);
  const currencyInfo = CURRENCIES[scenario.currency] || CURRENCIES.USD;

  const updateConfig = (key: keyof typeof scenario.incomeConfig, value: any) => {
    updateScenario(scenario.id, {
      incomeConfig: {
        ...scenario.incomeConfig,
        [key]: value,
      },
    });
  };

  const handleCurrencyChange = (newCurr: CurrencyCode) => {
    updateScenario(scenario.id, { currency: newCurr });
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Scenario Header & Currency */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            className="btn-icon"
            style={{
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-500)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Wallet size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Parámetros de Ingresos</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Calcula tu valor por hora neto y real
            </p>
          </div>
        </div>

        {/* Currency selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            className="form-select"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem', width: 'auto' }}
            value={scenario.currency}
            onChange={(e) => handleCurrencyChange((e.target as HTMLSelectElement).value as CurrencyCode)}
            id={`select-currency-${scenario.id}`}
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol}) - {c.name.split('(')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Metric: Tarifa Hora Real */}
      <div className="metrics-hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              TARIFA HORA REAL (NETO REAL)
            </span>
            <div className="wage-value-large">
              {formatCurrency(calc.realHourlyRate, scenario.currency, true)}
              <span className="wage-unit">/ hora</span>
            </div>
          </div>

          <div
            className={`reality-gap-tag ${
              calc.realityDiscountPct > 25 ? 'badge-danger' : 'badge-warning'
            }`}
            title="Diferencia entre lo que crees que ganas por hora y lo que realmente te queda en tu bolsillo y tiempo de vida"
          >
            <TrendingDown size={14} />
            <span>-{formatPercent(calc.realityDiscountPct)} brecha real</span>
          </div>
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 1rem 0' }}>
          Nominal aparente:{' '}
          <strong style={{ color: 'var(--text-main)' }}>
            {formatCurrency(calc.nominalHourlyRate, scenario.currency, true)}/h
          </strong>{' '}
          (reducido por impuestos, gastos de transporte y horas de conmuta no remuneradas).
        </p>

        {/* Mini stats grid */}
        <div className="mini-stats-grid">
          <div className="mini-stat-item">
            <div className="mini-stat-label">Ingreso Bruto</div>
            <div className="mini-stat-value">
              {formatCurrency(calc.monthlyGrossIncome, scenario.currency)}
            </div>
          </div>

          <div className="mini-stat-item">
            <div className="mini-stat-label">Ingreso Neto de Bolsillo</div>
            <div className="mini-stat-value" style={{ color: 'var(--success-500)' }}>
              {formatCurrency(calc.monthlyNetIncome, scenario.currency)}
            </div>
          </div>

          <div className="mini-stat-item">
            <div className="mini-stat-label">Tiempo Total al Trabajo</div>
            <div className="mini-stat-value">
              {calc.monthlyTotalLifeHours.toFixed(0)} h
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              ({calc.monthlyPaidHours.toFixed(0)}h laboral + {calc.monthlyCommuteHours.toFixed(0)}h viaje)
            </div>
          </div>

          <div className="mini-stat-item">
            <div className="mini-stat-label">Gasto en Trabajar</div>
            <div className="mini-stat-value" style={{ color: 'var(--danger-500)' }}>
              {formatPercent(calc.expensePercentage)}
            </div>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Frequency & Nominal Amount */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Tipo de Remuneración</span>
            </label>
            <select
              className="form-select"
              value={scenario.incomeConfig.incomeFrequency}
              onChange={(e) =>
                updateConfig(
                  'incomeFrequency',
                  (e.target as HTMLSelectElement).value
                )
              }
            >
              <option value="monthly">Sueldo Mensual</option>
              <option value="hourly">Tarifa por Hora</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>
                {scenario.incomeConfig.incomeFrequency === 'monthly'
                  ? 'Ingreso Mensual Nominal'
                  : 'Tarifa Hora Nominal'}
              </span>
            </label>
            <div className="input-with-symbol">
              <span className="input-prefix">{currencyInfo.symbol}</span>
              <input
                type="number"
                min="0"
                step="any"
                className="form-input input-with-prefix"
                value={scenario.incomeConfig.nominalAmount || ''}
                onInput={(e) =>
                  updateConfig(
                    'nominalAmount',
                    parseFloat((e.target as HTMLInputElement).value) || 0
                  )
                }
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Work Hours */}
        <div className="form-group">
          <label className="form-label">
            <span>Horas Laborales por Semana</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              (~{(scenario.incomeConfig.weeklyWorkHours * 4.333).toFixed(0)} horas al mes)
            </span>
          </label>
          <input
            type="number"
            min="1"
            max="168"
            step="1"
            className="form-input"
            value={scenario.incomeConfig.weeklyWorkHours ?? 40}
            onInput={(e) =>
              updateConfig(
                'weeklyWorkHours',
                parseFloat((e.target as HTMLInputElement).value) || 0
              )
            }
            placeholder="40"
          />
        </div>

        {/* Deductions & Expenses (Collapsible / Organized) */}
        <div
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            backgroundColor: 'var(--bg-page)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingDown size={16} style={{ color: 'var(--danger-500)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                Deducciones, Gastos de Trabajo y Conmuta
              </span>
            </div>
            <button className="btn btn-ghost btn-sm" type="button">
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {showAdvanced && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Taxes & Legal Deductions */}
              <div className="form-group">
                <label className="form-label">
                  <span>Impuestos y Deducciones Mensuales (Salud, Pensión, Renta)</span>
                </label>
                <div className="input-with-symbol">
                  <span className="input-prefix">{currencyInfo.symbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="form-input input-with-prefix"
                    value={scenario.incomeConfig.taxDeductionsMonthly || ''}
                    onInput={(e) =>
                      updateConfig(
                        'taxDeductionsMonthly',
                        parseFloat((e.target as HTMLInputElement).value) || 0
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Commute Expenses */}
              <div className="form-group">
                <label className="form-label">
                  <span>Gasto en Transporte Mensual (Gasolina, Pasajes, Parqueadero)</span>
                </label>
                <div className="input-with-symbol">
                  <span className="input-prefix">{currencyInfo.symbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="form-input input-with-prefix"
                    value={scenario.incomeConfig.commuteExpensesMonthly || ''}
                    onInput={(e) =>
                      updateConfig(
                        'commuteExpensesMonthly',
                        parseFloat((e.target as HTMLInputElement).value) || 0
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Other work expenses */}
              <div className="form-group">
                <label className="form-label">
                  <span>Otros Gastos Requeridos por el Empleo (Almuerzos fuera, Ropa/Herramientas)</span>
                </label>
                <div className="input-with-symbol">
                  <span className="input-prefix">{currencyInfo.symbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="form-input input-with-prefix"
                    value={scenario.incomeConfig.workOtherExpensesMonthly || ''}
                    onInput={(e) =>
                      updateConfig(
                        'workOtherExpensesMonthly',
                        parseFloat((e.target as HTMLInputElement).value) || 0
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Commute & Prep Hours */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Horas Viaje / Conmuta Semanal</span>
                  </label>
                  <div className="input-with-symbol">
                    <input
                      type="number"
                      min="0"
                      max="40"
                      className="form-input"
                      value={scenario.incomeConfig.commuteHoursWeekly || ''}
                      onInput={(e) =>
                        updateConfig(
                          'commuteHoursWeekly',
                          parseFloat((e.target as HTMLInputElement).value) || 0
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Ida y vuelta (~{((scenario.incomeConfig.commuteHoursWeekly || 0) / 5).toFixed(1)}h/día)
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Horas Preparación Semanal</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    className="form-input"
                    value={scenario.incomeConfig.prepHoursWeekly || ''}
                    onInput={(e) =>
                      updateConfig(
                        'prepHoursWeekly',
                        parseFloat((e.target as HTMLInputElement).value) || 0
                      )
                    }
                    placeholder="0"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Vestirse, alistarse, llamadas
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
