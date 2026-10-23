import { useState, useMemo } from 'preact/hooks';
import { useApp } from '../context/AppContext';
import { calculateScenario } from '../utils/calculations';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { CURRENCIES } from '../constants/currencies';
import {
  Scale,
  Sparkles,
  Award,
} from 'lucide-preact';

interface BenchmarkPreset {
  id: string;
  name: string;
  priceUSD: number;
  emoji: string;
}

const BENCHMARK_PRESETS: BenchmarkPreset[] = [
  { id: 'shoes', name: 'Tenis Deportivos de Marca', priceUSD: 100, emoji: '👟' },
  { id: 'phone', name: 'Smartphone Gama Media-Alta', priceUSD: 700, emoji: '📱' },
  { id: 'dinner', name: 'Cena Gourmet para Dos', priceUSD: 60, emoji: '🍷' },
  { id: 'car', name: 'Vehículo Usado Confiable', priceUSD: 5000, emoji: '🚗' },
  { id: 'rent', name: 'Mes de Alquiler Promedio', priceUSD: 600, emoji: '🏠' },
  { id: 'gym', name: 'Año de Gimnasio', priceUSD: 400, emoji: '🏋️' },
];

export function ComparisonView() {
  const { scenarios } = useApp();

  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('shoes');
  const [customUSD, setCustomUSD] = useState<number>(100);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Active benchmark amount in USD
  const activeAmountUSD = isCustom
    ? customUSD
    : BENCHMARK_PRESETS.find((b) => b.id === selectedBenchmarkId)?.priceUSD || 100;

  const activeBenchmarkName = isCustom
    ? `Artículo Personalizado ($${customUSD} USD)`
    : BENCHMARK_PRESETS.find((b) => b.id === selectedBenchmarkId)?.name || 'Artículo';

  const activeBenchmarkEmoji = isCustom
    ? '✨'
    : BENCHMARK_PRESETS.find((b) => b.id === selectedBenchmarkId)?.emoji || '📦';

  // Calculate scenario metrics for this benchmark
  const scenarioResults = useMemo(() => {
    return scenarios.map((scenario) => {
      const calc = calculateScenario(scenario.incomeConfig);
      const currency = CURRENCIES[scenario.currency] || CURRENCIES.USD;
      const rateToUSD = scenario.customRateToUSD || currency.rateToUSD || 1;

      // Local price converted from USD benchmark
      const localPrice = activeAmountUSD * rateToUSD;

      // Required life hours
      const hoursRequired =
        calc.realHourlyRate > 0 ? localPrice / calc.realHourlyRate : 0;
      const daysRequired = hoursRequired / 8;
      const weeksRequired = hoursRequired / 40;

      return {
        scenario,
        calc,
        rateToUSD,
        localPrice,
        hoursRequired,
        daysRequired,
        weeksRequired,
      };
    });
  }, [scenarios, activeAmountUSD]);

  // Find min and max hours for comparison
  const minHours = Math.min(...scenarioResults.map((r) => r.hoursRequired).filter((h) => h > 0));
  const maxHours = Math.max(...scenarioResults.map((r) => r.hoursRequired));
  const bestScenario = scenarioResults.find((r) => r.hoursRequired === minHours);
  const worstScenario = scenarioResults.find((r) => r.hoursRequired === maxHours);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Banner */}
      <div className="comparison-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            className="btn-icon"
            style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-600)', borderRadius: 'var(--radius-md)' }}
          >
            <Scale size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
              Tablero de Contraste Side-by-Side
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Compara el esfuerzo de vida real que exige el mismo producto o servicio en diferentes realidades
            </p>
          </div>
        </div>

        {scenarioResults.length >= 2 && worstScenario && bestScenario && worstScenario !== bestScenario && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <Sparkles size={24} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '0.95rem' }}>
                Contraste Clave para “{activeBenchmarkName}” (${activeAmountUSD} USD):
              </strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                En <strong>{worstScenario.scenario.name}</strong> necesitas{' '}
                <span style={{ color: 'var(--danger-500)', fontWeight: 700 }}>
                  {worstScenario.hoursRequired.toFixed(1)} horas
                </span>{' '}
                de trabajo, mientras que en <strong>{bestScenario.scenario.name}</strong> solo{' '}
                <span style={{ color: 'var(--success-500)', fontWeight: 700 }}>
                  {bestScenario.hoursRequired.toFixed(1)} horas
                </span>
                . ¡Una brecha de{' '}
                <strong style={{ color: 'var(--text-main)' }}>
                  {(worstScenario.hoursRequired - bestScenario.hoursRequired).toFixed(1)} horas de vida laboral
                </strong>{' '}
                ({(worstScenario.hoursRequired / (bestScenario.hoursRequired || 1)).toFixed(1)}x más tiempo)!
              </p>
            </div>
          </div>
        )}
      </div>



      {/* Matrix Table: Complete financial contrast */}
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.85rem' }}>
          Matriz Financiera & Descuento de Realidad
        </h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Escenario</th>
                <th>Moneda</th>
                <th>Ingreso Nominal</th>
                <th>Deducciones + Gastos</th>
                <th>Horas de Viaje/Mes</th>
                <th>Tarifa Nominal</th>
                <th>Tarifa Hora Real</th>
                <th>Descuento de Realidad</th>
              </tr>
            </thead>
            <tbody>
              {scenarioResults.map(({ scenario, calc }) => (
                <tr key={scenario.id}>
                  <td style={{ fontWeight: 700 }}>{scenario.name}</td>
                  <td>
                    <span className="badge badge-primary">{scenario.currency}</span>
                  </td>
                  <td>{formatCurrency(calc.monthlyGrossIncome, scenario.currency)}/mes</td>
                  <td style={{ color: 'var(--danger-500)' }}>
                    {formatCurrency(calc.monthlyGrossIncome - calc.monthlyNetIncome, scenario.currency)}
                  </td>
                  <td>{calc.monthlyCommuteHours.toFixed(0)} h/mes</td>
                  <td>{formatCurrency(calc.nominalHourlyRate, scenario.currency, true)}/h</td>
                  <td style={{ fontWeight: 800, color: 'var(--success-500)' }}>
                    {formatCurrency(calc.realHourlyRate, scenario.currency, true)}/h
                  </td>
                  <td>
                    <span className="badge badge-warning">
                      -{formatPercent(calc.realityDiscountPct)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
