import { useState, useMemo } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { useApp } from '../context/AppContext';
import { calculateScenario, buildItemIndex, hoursForPrice } from '../utils/calculations';
import { formatCurrency, formatPercent, formatHours, humanizeHours, formatNumber, formatRateValue } from '../utils/formatters';
import { convert, fetchRates } from '../utils/exchangeRates';
import { CURRENCIES } from '../constants/currencies';
import type { CurrencyCode, ExchangeRates, ItemIndexEntry, Scenario, ScenarioCalculations } from '../types';
import { Scale, Table2, Coins, RefreshCw } from 'lucide-preact';

const CUSTOM = '__custom__';
const METER_GRADIENT = 'linear-gradient(90deg, #6366f1, #3b82f6)';

interface ScenarioRow {
  scenario: Scenario;
  calc: ScenarioCalculations;
}

function SectionTitle({ icon, title, subtitle }: { icon: ComponentChildren; title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div
        className="btn-icon"
        style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-500)', borderRadius: 'var(--radius-md)' }}
      >
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h3>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export function ComparisonView() {
  const { scenarios, rates } = useApp();

  const [baselineId, setBaselineId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [refCurrency, setRefCurrency] = useState<CurrencyCode>('USD');
  const [customName, setCustomName] = useState<string>('Tenis');
  const [customPrice, setCustomPrice] = useState<string>('100');
  const [customCurrency, setCustomCurrency] = useState<CurrencyCode | null>(null);

  const rows = useMemo(
    () => scenarios.map((scenario) => ({ scenario, calc: calculateScenario(scenario.incomeConfig) })),
    [scenarios]
  );
  const validRows = rows.filter((r) => r.calc.realHourlyRate > 0);
  const itemIndex = useMemo(() => buildItemIndex(scenarios), [scenarios]);
  const comparableIndex = itemIndex.filter((e) => validRows.some((r) => e.byScenario.has(r.scenario.id)));
  const effectiveBaselineId = validRows.some((r) => r.scenario.id === baselineId)
    ? baselineId
    : (validRows[0]?.scenario.id ?? null);
  const usedCurrencies: CurrencyCode[] = [...new Set(scenarios.map((s) => s.currency))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {validRows.length >= 2 && (
        <ItemComparator
          validRows={validRows}
          itemIndex={comparableIndex}
          rates={rates}
          baselineId={effectiveBaselineId}
          onBaselineChange={setBaselineId}
          selectedItem={selectedItem}
          onSelectedItemChange={setSelectedItem}
          refCurrency={refCurrency}
          customName={customName}
          onCustomNameChange={setCustomName}
          customPrice={customPrice}
          onCustomPriceChange={setCustomPrice}
          customCurrency={customCurrency}
          onCustomCurrencyChange={setCustomCurrency}
        />
      )}

      <Matrix validRows={validRows} itemIndex={comparableIndex} />

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
              {rows.map(({ scenario, calc }) => (
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

      <RatesPanel usedCurrencies={usedCurrencies} refCurrency={refCurrency} onRefCurrencyChange={setRefCurrency} />
    </div>
  );
}

interface ItemComparatorProps {
  validRows: ScenarioRow[];
  itemIndex: ItemIndexEntry[];
  rates: ExchangeRates;
  baselineId: string | null;
  onBaselineChange: (id: string) => void;
  selectedItem: string | null;
  onSelectedItemChange: (key: string) => void;
  refCurrency: CurrencyCode;
  customName: string;
  onCustomNameChange: (v: string) => void;
  customPrice: string;
  onCustomPriceChange: (v: string) => void;
  customCurrency: CurrencyCode | null;
  onCustomCurrencyChange: (c: CurrencyCode) => void;
}

function ItemComparator({
  validRows,
  itemIndex,
  rates,
  baselineId,
  onBaselineChange,
  selectedItem,
  onSelectedItemChange,
  refCurrency,
  customName,
  onCustomNameChange,
  customPrice,
  onCustomPriceChange,
  customCurrency,
  onCustomCurrencyChange,
}: ItemComparatorProps) {
  const title = (
    <SectionTitle
      icon={<Scale size={20} />}
      title="Un mismo artículo, distintas vidas"
      subtitle="Cuánto tiempo de vida laboral cuesta el mismo artículo en cada escenario"
    />
  );

  const effectiveSelected =
    selectedItem === CUSTOM
      ? CUSTOM
      : itemIndex.some((e) => e.key === selectedItem)
        ? (selectedItem as string)
        : (itemIndex[0]?.key ?? CUSTOM);
  const isCustom = effectiveSelected === CUSTOM;
  const entry = isCustom ? undefined : itemIndex.find((e) => e.key === effectiveSelected);
  const customCur = customCurrency ?? refCurrency;

  const source = isCustom
    ? { name: customName.trim() || 'Artículo', price: parseFloat(customPrice), currency: customCur }
    : { name: entry!.label, price: NaN, currency: refCurrency };

  const itemRows = isCustom ? validRows : validRows.filter((r) => entry!.byScenario.has(r.scenario.id));
  const itemBaselineId = itemRows.some((r) => r.scenario.id === baselineId)
    ? baselineId
    : (itemRows[0]?.scenario.id ?? null);
  const baselineFallback = itemBaselineId !== baselineId;

  const results = itemRows.map((r) => {
    const price = isCustom
      ? convert(source.price, source.currency, r.scenario.currency, rates)
      : entry!.byScenario.get(r.scenario.id)!.item.price;
    const converted = isCustom && r.scenario.currency !== source.currency;
    const hours = hoursForPrice(price, r.calc.realHourlyRate);
    return { scenario: r.scenario, price, converted, hours };
  });

  const timed = results.filter((r) => Number.isFinite(r.hours));
  const maxHours = Math.max(0, ...timed.map((r) => r.hours));
  const baseline = results.find((r) => r.scenario.id === itemBaselineId) ?? results[0];

  return (
    <section className="card">
      {title}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div className="form-group">
          <label className="form-label">Escenario de referencia</label>
          <select
            className="form-select"
            value={baselineId ?? ''}
            onChange={(e) => onBaselineChange((e.target as HTMLSelectElement).value)}
          >
            {validRows.map(({ scenario }) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Artículo a comparar</label>
          <select
            className="form-select"
            value={effectiveSelected}
            onChange={(e) => {
              const value = (e.target as HTMLSelectElement).value;
              if (value === CUSTOM && effectiveSelected !== CUSTOM) {
                onCustomCurrencyChange(refCurrency);
              }
              onSelectedItemChange(value);
            }}
          >
            {itemIndex.map((e) => {
              const n = validRows.filter((r) => e.byScenario.has(r.scenario.id)).length;
              return (
                <option key={e.key} value={e.key}>
                  {n > 1 ? `${e.label} (en ${n} escenarios)` : e.label}
                </option>
              );
            })}
            <option value={CUSTOM}>Otro artículo con precio propio…</option>
          </select>
        </div>

        {isCustom && (
          <>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-input"
                value={customName}
                onInput={(e) => onCustomNameChange((e.target as HTMLInputElement).value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Precio</label>
              <input
                type="number"
                min="0"
                step="any"
                className="form-input"
                value={customPrice}
                onInput={(e) => onCustomPriceChange((e.target as HTMLInputElement).value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Moneda del precio</label>
              <select
                className="form-select"
                value={customCur}
                onChange={(e) => onCustomCurrencyChange((e.target as HTMLSelectElement).value as CurrencyCode)}
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {`${c.code} (${c.symbol})`}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      <p style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>
        <strong>{source.name}</strong>
        {isCustom && Number.isFinite(source.price) && source.price > 0 && (
          <>
            {' de '}
            <strong>{formatCurrency(source.price, source.currency, true)}</strong>
          </>
        )}
        {results.map((r, i) => (
          <span key={r.scenario.id}>
            {i === 0 ? ' :\u2003' : '\u2003|\u2003'}
            {r.scenario.name} <strong>{formatHours(r.hours)}</strong>
          </span>
        ))}
      </p>

      {baselineFallback && itemBaselineId && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
          {`${validRows.find((r) => r.scenario.id === baselineId)?.scenario.name ?? 'El escenario de referencia'} no tiene este artículo; se compara contra ${results.find((r) => r.scenario.id === itemBaselineId)?.scenario.name}.`}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '40px' }}>
        {results.map((r) => {
          let badge: ComponentChildren = null;
          if (r === baseline) {
            badge = <span className="badge badge-primary">Referencia</span>;
          } else if (Number.isFinite(r.hours) && Number.isFinite(baseline.hours) && baseline.hours > 0) {
            const diff = r.hours - baseline.hours;
            const pct = (diff / baseline.hours) * 100;
            badge =
              diff <= 0 ? (
                <span className="badge badge-success">
                  {`Ahorras ${formatHours(Math.abs(diff))} de vida (${formatNumber(Math.abs(pct), 0)}% menos)`}
                </span>
              ) : (
                <span className="badge badge-danger">
                  {`Te cuesta ${formatHours(diff)} más (+${formatNumber(pct, 0)}%)`}
                </span>
              );
          }

          return (
            <div key={r.scenario.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontWeight: 700 }}>{r.scenario.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {!(Number.isFinite(r.price) && r.price > 0)
                    ? '—'
                    : `${formatCurrency(r.price, r.scenario.currency, r.converted)}${r.converted ? ' (convertido)' : ''}`}
                </span>
              </div>
              <div className="lifetime-meter-bar" style={{ marginTop: '0.35rem' }}>
                <div
                  className="lifetime-meter-fill"
                  style={{
                    width: `${Number.isFinite(r.hours) && maxHours > 0 ? (r.hours / maxHours) * 100 : 0}%`,
                    background: METER_GRADIENT,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.35rem',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{humanizeHours(r.hours)}</span>
                {badge}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface MatrixProps {
  validRows: ScenarioRow[];
  itemIndex: ItemIndexEntry[];
}

function Matrix({ validRows, itemIndex }: MatrixProps) {
  if (itemIndex.length === 0 || validRows.length === 0) return null;

  return (
    <section className="card">
      <SectionTitle icon={<Table2 size={20} />} title="Todos los artículos en horas de trabajo" />
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
        Cada celda indica cuántas horas de trabajo cuesta el artículo en ese escenario con su precio local. "—"
        indica que el artículo no está en ese escenario. En verde, el escenario donde cuesta menos tiempo.
      </p>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Artículo</th>
              {validRows.map(({ scenario }) => (
                <th key={scenario.id}>{scenario.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {itemIndex.map((entry) => {
              const cells = validRows.map((r) => {
                const local = entry.byScenario.get(r.scenario.id);
                const hours = local ? hoursForPrice(local.item.price, r.calc.realHourlyRate) : NaN;
                return { id: r.scenario.id, hours };
              });
              const finite = cells.map((c) => c.hours).filter((h) => Number.isFinite(h));
              const min = finite.length ? Math.min(...finite) : NaN;

              return (
                <tr key={entry.key}>
                  <td style={{ fontWeight: 700 }}>{entry.label}</td>
                  {cells.map((c) => {
                    const best = finite.length > 1 && Number.isFinite(c.hours) && c.hours === min;
                    return (
                      <td
                        key={c.id}
                        className={`${best ? 'best-value' : ''}`}
                        style={{
                          ...(best
                            ? { backgroundColor: 'var(--success-50)', color: 'var(--success-600)', fontWeight: 700 }
                            : {}),
                        }}
                      >
                        {Number.isFinite(c.hours) ? formatHours(c.hours) : '—'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface RatesPanelProps {
  usedCurrencies: CurrencyCode[];
  refCurrency: CurrencyCode;
  onRefCurrencyChange: (c: CurrencyCode) => void;
}

function RatesPanel({ usedCurrencies, refCurrency, onRefCurrencyChange }: RatesPanelProps) {
  const { rates, ratesUpdatedAt, setManualRate, applyDownloadedRates } = useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const statusText =
    ratesUpdatedAt === 'manual'
      ? 'Editadas a mano.'
      : typeof ratesUpdatedAt === 'string'
        ? `Actualizadas: ${new Date(ratesUpdatedAt).toLocaleDateString()}.`
        : 'Valores aproximados de ejemplo. Actualízalos antes de sacar conclusiones.';

  const refresh = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const fresh = await fetchRates();
      applyDownloadedRates(fresh);
    } catch (err) {
      setError(
        `No se pudieron descargar las tasas (${err instanceof Error ? err.message : String(err)}). Puedes editarlas a mano.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <SectionTitle icon={<Coins size={20} />} title="Tasas de cambio" />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{statusText}</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={refresh}
          disabled={loading}
          style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
        >
          <RefreshCw size={16} />
          <span>{loading ? 'Actualizando…' : 'Actualizar tasas'}</span>
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: 'var(--danger-500)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
          {error}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Moneda de referencia</label>
          <select
            className="form-select"
            value={refCurrency}
            onChange={(e) => onRefCurrencyChange((e.target as HTMLSelectElement).value as CurrencyCode)}
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {`${c.code} (${c.symbol})`}
              </option>
            ))}
          </select>
        </div>

        {usedCurrencies
          .filter((c) => c !== refCurrency)
          .map((code) => {
            const perRef = convert(1, refCurrency, code, rates);
            return (
              <div className="form-group" key={code}>
                <label className="form-label">{`1 ${refCurrency} en ${code}`}</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="form-input"
                  value={formatRateValue(perRef)}
                  onChange={(e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    const v = parseFloat(input.value);
                    if (!(Number.isFinite(v) && v > 0)) {
                      input.value = String(formatRateValue(perRef));
                      return;
                    }
                    setManualRate(code, v * rates[refCurrency]);
                  }}
                />
              </div>
            );
          })}
      </div>
    </section>
  );
}
