import { useState, useMemo } from 'preact/hooks';
import type { Scenario } from '../types';
import { useApp } from '../context/AppContext';
import { ItemCard } from './ItemCard';
import { COMMON_CATEGORIES } from '../constants/currencies';
import {
  Plus,
  Search,
  ShoppingBag,
} from 'lucide-preact';

interface ItemListProps {
  scenario: Scenario;
}

export function ItemList({ scenario }: ItemListProps) {
  const { openItemModal } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return scenario.items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [scenario.items, search, selectedCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header bar: title, actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
            Artículos y Gastos ({scenario.items.length})
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Mira cuántas horas o días de tu vida laboral te cuesta cada cosa
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => openItemModal(scenario.id)}
          id="btn-add-item"
        >
          <Plus size={16} />
          <span>Añadir Artículo</span>
        </button>
      </div>

      {/* Search & Categories Filter */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Buscar artículo..."
            value={search}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory((e.target as HTMLSelectElement).value)}
        >
          <option value="all">Todas las categorías</option>
          {COMMON_CATEGORIES.map((cat) => (
            <option key={cat.label} value={cat.label}>
              {cat.emoji} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Items Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-page)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <ShoppingBag size={28} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.35rem 0' }}>No hay artículos aquí</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto' }}>
              {search
                ? 'No encontramos ningún artículo que coincida con tu búsqueda.'
                : 'Añade artículos que desees comprar o gastos comunes para ver cuánto tiempo de tu vida representan.'}
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => openItemModal(scenario.id)}
          >
            <Plus size={15} />
            <span>Crear primer artículo</span>
          </button>
        </div>
      ) : (
        <div className="grid-cols-auto">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} scenario={scenario} />
          ))}
        </div>
      )}
    </div>
  );
}
