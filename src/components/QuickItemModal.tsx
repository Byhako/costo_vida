import { useState, useEffect } from 'preact/hooks';
import { useApp } from '../context/AppContext';
import { COMMON_CATEGORIES, CURRENCIES } from '../constants/currencies';
import { calculateScenario, calculateItemImpact } from '../utils/calculations';
import { X, Clock } from 'lucide-preact';

const POPULAR_EMOJIS = ['📱', '👟', '🚗', '✈️', '☕', '🎮', '🏠', '🍷', '💻', '🏋️', '🎧', '🛵', '🍔', '📚', '👕'];

export function QuickItemModal() {
  const { editingItemInfo, closeItemModal, saveItem, scenarios } = useApp();

  if (!editingItemInfo) return null;

  const currentScenario = scenarios.find((s) => s.id === editingItemInfo.scenarioId);
  const existingItem = editingItemInfo.item;

  const [name, setName] = useState(existingItem?.name || '');
  const [price, setPrice] = useState<number>(existingItem?.price || 0);
  const [category, setCategory] = useState(existingItem?.category || COMMON_CATEGORIES[0].label);
  const [emoji, setEmoji] = useState(existingItem?.emoji || '📱');
  const [notes, setNotes] = useState(existingItem?.notes || '');

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setPrice(existingItem.price);
      setCategory(existingItem.category || COMMON_CATEGORIES[0].label);
      setEmoji(existingItem.emoji || '📱');
      setNotes(existingItem.notes || '');
    } else {
      setName('');
      setPrice(0);
      setCategory(COMMON_CATEGORIES[0].label);
      setEmoji('📱');
      setNotes('');
    }
  }, [existingItem]);

  if (!currentScenario) return null;

  const calc = calculateScenario(currentScenario.incomeConfig);
  const impact = calculateItemImpact(price, calc.realHourlyRate);
  const currencyInfo = CURRENCIES[currentScenario.currency] || CURRENCIES.USD;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveItem(currentScenario.id, {
      id: existingItem?.id,
      name: name.trim(),
      price: Math.max(0, price),
      category,
      emoji,
      notes: notes.trim() || undefined,
    });

    closeItemModal();
  };

  return (
    <div className="modal-overlay" onClick={closeItemModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
              {existingItem ? 'Editar Artículo' : 'Añadir Nuevo Artículo'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Para el escenario: <strong>{currentScenario.name}</strong>
            </span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={closeItemModal}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Name & Emoji */}
            <div className="form-group">
              <label className="form-label">Nombre del Artículo / Gasto</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '56px', textAlign: 'center', fontSize: '1.25rem', padding: '0.4rem' }}
                  value={emoji}
                  onInput={(e) => setEmoji((e.target as HTMLInputElement).value)}
                  title="Emoji"
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. iPhone 16 Pro, Cena romántica, Tenis Nike..."
                  value={name}
                  onInput={(e) => setName((e.target as HTMLInputElement).value)}
                  autoFocus
                  required
                />
              </div>

              {/* Emoji quick pick */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                {POPULAR_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    style={{
                      border: 'none',
                      background: emoji === em ? 'var(--primary-100)' : 'transparent',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2px 5px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">
                <span>Precio en moneda local ({currentScenario.currency})</span>
              </label>
              <div className="input-with-symbol">
                <span className="input-prefix">{currencyInfo.symbol}</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="form-input input-with-prefix"
                  placeholder="0"
                  value={price || ''}
                  onInput={(e) => setPrice(parseFloat((e.target as HTMLInputElement).value) || 0)}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory((e.target as HTMLSelectElement).value)}
              >
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Impact Preview */}
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Clock size={16} style={{ color: 'var(--primary-500)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Impacto estimado en tu vida laboral:
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-500)', fontFamily: 'var(--font-heading)' }}>
                  {impact.hours < 1 ? `${Math.round(impact.hours * 60)} min` : `${impact.hours.toFixed(1)} horas`}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  (~{impact.days.toFixed(1)} días laborales de 8h)
                </span>
              </div>

              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                {impact.emotionalText}
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeItemModal}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {existingItem ? 'Guardar Cambios' : 'Añadir Artículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
