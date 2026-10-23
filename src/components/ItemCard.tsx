import type { ItemCost, Scenario } from '../types';
import { useApp } from '../context/AppContext';
import { calculateScenario, calculateItemImpact } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import {
  Clock,
  Edit2,
  Copy,
  Trash2,
  Sparkles,
} from 'lucide-preact';

interface ItemCardProps {
  item: ItemCost;
  scenario: Scenario;
}

export function ItemCard({ item, scenario }: ItemCardProps) {
  const { openItemModal, duplicateItem, deleteItem } = useApp();

  const calc = calculateScenario(scenario.incomeConfig);
  const impact = calculateItemImpact(item.price, calc.realHourlyRate);

  // Meter percentage relative to 1 full work month (~160h)
  const monthPercentage = Math.min(100, (impact.hours / 160) * 100);

  let meterColor = 'linear-gradient(90deg, #10b981, #34d399)';
  let badgeColor = 'badge-success';

  if (impact.intensity === 'critical') {
    meterColor = 'linear-gradient(90deg, #f43f5e, #be123c)';
    badgeColor = 'badge-danger';
  } else if (impact.intensity === 'high') {
    meterColor = 'linear-gradient(90deg, #f59e0b, #d97706)';
    badgeColor = 'badge-warning';
  } else if (impact.intensity === 'moderate') {
    meterColor = 'linear-gradient(90deg, #6366f1, #3b82f6)';
    badgeColor = 'badge-primary';
  }

  return (
    <div className="item-card" id={`item-${item.id}`}>
      <div>
        {/* Header: Emoji, Name, Category, Price */}
        <div className="item-card-header">
          <div className="item-title-row">
            <span className="item-emoji">{item.emoji || '📦'}</span>
            <div>
              <h4 className="item-name">{item.name}</h4>
              {item.category && (
                <span className="item-category-tag">{item.category}</span>
              )}
            </div>
          </div>
          <div className="item-price-tag">
            {formatCurrency(item.price, scenario.currency)}
          </div>
        </div>

        {/* Life-time metrics hero */}
        <div className="item-time-hero" style={{ marginTop: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div className="time-hero-number">
                {impact.hours < 1
                  ? `${Math.round(impact.hours * 60)} min`
                  : `${impact.hours.toFixed(1)} h`}
              </div>
              <div className="time-hero-subtitle">
                {impact.days < 1
                  ? 'Menos de 1 jornada laboral'
                  : `${impact.days.toFixed(1)} días laborales (${(impact.days / 5).toFixed(1)} sem)`}
              </div>
            </div>

            <span className={`badge ${badgeColor}`}>
              <Clock size={12} />
              <span>
                {impact.intensity === 'critical'
                  ? 'Alto Sacrificio'
                  : impact.intensity === 'high'
                  ? 'Esfuerzo Mayor'
                  : impact.intensity === 'moderate'
                  ? 'Gasto Moderado'
                  : 'Fácil Adquisición'}
              </span>
            </span>
          </div>

          {/* Life-Time Meter */}
          <div style={{ marginTop: '0.35rem' }}>
            <div className="lifetime-meter-bar">
              <div
                className="lifetime-meter-fill"
                style={{
                  width: `${monthPercentage}%`,
                  background: meterColor,
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: 'var(--text-dim)',
                marginTop: '0.2rem',
              }}
            >
              <span>0 h</span>
              <span>
                {monthPercentage >= 100
                  ? `Excede 1 mes completo (${impact.months.toFixed(1)} meses)`
                  : `${monthPercentage.toFixed(0)}% de tu mes laboral`}
              </span>
              <span>160 h</span>
            </div>
          </div>
        </div>

        {/* Narrative / Emotional Context */}
        <div className="item-narrative-box" style={{ marginTop: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
            <Sparkles size={14} style={{ color: 'var(--primary-500)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, fontSize: '0.78rem' }}>{impact.emotionalText}</p>
          </div>
        </div>
      </div>

      {/* Actions footer */}
      <div className="item-actions-row">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => duplicateItem(scenario.id, item.id)}
          title="Duplicar artículo"
        >
          <Copy size={13} />
          <span>Duplicar</span>
        </button>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => openItemModal(scenario.id, item)}
          title="Editar artículo"
        >
          <Edit2 size={13} />
          <span>Editar</span>
        </button>

        <button
          className="btn btn-danger-ghost btn-sm btn-icon"
          onClick={() => {
            if (confirm(`¿Eliminar "${item.name}"?`)) {
              deleteItem(scenario.id, item.id);
            }
          }}
          title="Eliminar artículo"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
