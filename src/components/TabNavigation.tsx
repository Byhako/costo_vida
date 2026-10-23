import { useState } from 'preact/hooks';
import { useApp } from '../context/AppContext';
import type { CurrencyCode } from '../types';
import { CURRENCIES } from '../constants/currencies';
import {
  BarChart3,
  Plus,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Check,
  X,
} from 'lucide-preact';

export function TabNavigation() {
  const {
    scenarios,
    activeTab,
    setActiveTab,
    addScenario,
    renameScenario,
    duplicateScenario,
    deleteScenario,
    requestConfirm,
  } = useApp();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Scenario form state
  const [newName, setNewName] = useState('');
  const [newCurrency, setNewCurrency] = useState<CurrencyCode>('USD');
  const [baseScenarioId, setBaseScenarioId] = useState<string>('');

  const handleOpenMenu = (e: MouseEvent, scenarioId: string) => {
    e.stopPropagation();
    if (activeMenuId === scenarioId) {
      setActiveMenuId(null);
      setMenuPosition(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const dropdownWidth = 180;
    const leftPos = Math.max(10, Math.min(window.innerWidth - dropdownWidth - 10, rect.right - dropdownWidth + 20));
    setMenuPosition({
      top: rect.bottom + 6,
      left: leftPos,
    });
    setActiveMenuId(scenarioId);
  };

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
    setActiveMenuId(null);
    setMenuPosition(null);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      renameScenario(id, editingName.trim());
    }
    setEditingId(null);
  };

  const handleCreateNew = (e: Event) => {
    e.preventDefault();
    addScenario(
      newName || `Perfil en ${newCurrency}`,
      newCurrency,
      baseScenarioId || undefined
    );
    setNewName('');
    setIsNewModalOpen(false);
  };

  return (
    <nav className="tabs-wrapper" aria-label="Escenarios de Costo de Vida">
      <div className="tabs-nav-bar">
        <div className="tabs-list">
          {/* Scenario Tabs */}
          {scenarios.map((scenario) => {
            const isActive = activeTab === scenario.id;
            const isEditing = editingId === scenario.id;

            if (isEditing) {
              return (
                <div
                  key={scenario.id}
                  className="tab-button active"
                  style={{ padding: '0.4rem 0.6rem' }}
                >
                  <input
                    type="text"
                    value={editingName}
                    onInput={(e) => setEditingName((e.target as HTMLInputElement).value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(scenario.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    className="form-input"
                    style={{
                      height: '28px',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.85rem',
                      width: '180px',
                    }}
                  />
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => handleSaveRename(scenario.id)}
                    title="Guardar nombre"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => setEditingId(null)}
                    title="Cancelar"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={scenario.id}
                style={{ position: 'relative', display: 'inline-flex' }}
              >
                <button
                  type="button"
                  className={`tab-button ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(scenario.id)}
                  id={`tab-${scenario.id}`}
                >
                  <span>{scenario.name}</span>
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      backgroundColor: isActive
                        ? 'rgba(255, 255, 255, 0.25)'
                        : 'var(--bg-surface-hover)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {scenario.currency}
                  </span>

                  {/* Options trigger */}
                  <span
                    role="button"
                    tabIndex={0}
                    className="tab-actions-trigger"
                    style={{
                      padding: '2px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={(e) => handleOpenMenu(e as any, scenario.id)}
                    title="Opciones del escenario"
                  >
                    <MoreVertical size={14} />
                  </span>
                </button>
              </div>
            );
          })}

          {/* Add Scenario Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsNewModalOpen(true)}
            id="btn-add-scenario"
            title="Crear un nuevo escenario o perfil financiero"
          >
            <Plus size={15} />
            <span>Nuevo Escenario</span>
          </button>
        </div>

        {/* Static General Comparison Tab */}
        <button
          type="button"
          className={`tab-button tab-comparison ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('comparison');
            setActiveMenuId(null);
          }}
          id="tab-comparison-general"
          title="Ver tablero de contraste general"
        >
          <BarChart3 size={16} />
          <span>📊 Comparativa General</span>
        </button>
      </div>

      {/* New Scenario Modal */}
      {isNewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Crear Nuevo Escenario</h3>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setIsNewModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateNew}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Nombre del Escenario / Perfil</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej. Mi trabajo remoto en EE.UU., Mi vida en España..."
                    value={newName}
                    onInput={(e) => setNewName((e.target as HTMLInputElement).value)}
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Moneda Principal</label>
                  <select
                    className="form-select"
                    value={newCurrency}
                    onChange={(e) => setNewCurrency((e.target as HTMLSelectElement).value as CurrencyCode)}
                  >
                    {Object.values(CURRENCIES).map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.name} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Copiar configuración desde (opcional)</label>
                  <select
                    className="form-select"
                    value={baseScenarioId}
                    onChange={(e) => setBaseScenarioId((e.target as HTMLSelectElement).value)}
                  >
                    <option value="">En blanco (valores por defecto)</option>
                    {scenarios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.currency})
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Puedes clonar la estructura de gastos o empezar de cero.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsNewModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Escenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Options Menu (rendered with high z-index and click outside dismissal) */}
      {activeMenuId && menuPosition && (() => {
        const targetScenario = scenarios.find((s) => s.id === activeMenuId);
        if (!targetScenario) return null;

        return (
          <>
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuId(null);
                setMenuPosition(null);
              }}
            />
            <div
              className="card-elevated"
              style={{
                position: 'fixed',
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                zIndex: 9999,
                minWidth: '180px',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', width: '100%' }}
                onClick={() => startRename(targetScenario.id, targetScenario.name)}
              >
                <Edit2 size={13} />
                <span>Renombrar</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', width: '100%' }}
                onClick={() => {
                  duplicateScenario(targetScenario.id);
                  setActiveMenuId(null);
                  setMenuPosition(null);
                }}
              >
                <Copy size={13} />
                <span>Duplicar</span>
              </button>

              {scenarios.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger-ghost btn-sm"
                  style={{ justifyContent: 'flex-start', width: '100%' }}
                  onClick={async () => {
                    const { id, name } = targetScenario;
                    setActiveMenuId(null);
                    setMenuPosition(null);
                    const ok = await requestConfirm({
                      title: 'Eliminar escenario',
                      message: `Se eliminará el escenario "${name}" con todos sus artículos. Esta acción no se puede deshacer.`,
                      confirmLabel: 'Eliminar',
                    });
                    if (ok) deleteScenario(id);
                  }}
                >
                  <Trash2 size={13} />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          </>
        );
      })()}
    </nav>
  );
}
