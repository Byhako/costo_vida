import { useApp } from '../context/AppContext';
import {
  X,
  BookOpen,
  Calculator,
  Compass,
  Clock,
  HeartHandshake,
} from 'lucide-preact';

export function ExplanationModal() {
  const { isExplanationOpen, closeExplanation } = useApp();

  if (!isExplanationOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeExplanation}>
      <div
        className="modal-content"
        style={{ maxWidth: '750px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              className="btn-icon"
              style={{
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-500)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                Filosofía, Origen y Fórmulas
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                El fundamento detrás del Costo de Vida en Tiempo Laboral
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={closeExplanation}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Quote Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: '2rem', lineHeight: 1, color: 'var(--primary-500)', marginBottom: '0.5rem' }}>
              “
            </div>
            <p
              style={{
                fontSize: '1.05rem',
                fontStyle: 'italic',
                fontWeight: 600,
                lineHeight: 1.5,
                color: 'var(--text-main)',
                margin: 0,
              }}
            >
              No pagamos las cosas con dinero, las pagamos con el tiempo de vida que entregamos para ganar ese dinero.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1rem',
                borderTop: '1px solid rgba(99, 102, 241, 0.2)',
                paddingTop: '0.75rem',
              }}
            >
              <span style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '0.9rem' }}>
                — José 'Pepe' Mujica
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Ex-Presidente de Uruguay & Filósofo
              </span>
            </div>
          </div>

          {/* Section 1: The Core Concept */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Compass size={18} style={{ color: 'var(--primary-500)' }} />
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
                1. ¿Por qué creamos esta aplicación?
              </h4>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Vivimos bajo la ilusión del precio en etiquetas: creemos que un teléfono cuesta $800 dólares o $3.000.000 de pesos. Sin embargo, el dinero es solo un intermediario de intercambio. Lo que realmente entregamos a cambio de cada producto es una porción irreemplazable de nuestra <strong>energía vital y tiempo biológico</strong>.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
              Inspirados en la filosofía de <em>"Your Money or Your Life"</em> (Vicki Robin y Joe Dominguez) y las reflexiones de José Mujica, esta herramienta busca desarmar el autoengaño del sueldo nominal para devolverte la claridad sobre el precio verdadero de tus decisiones.
            </p>
          </div>

          {/* Section 2: Real Wage vs Nominal Wage */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Clock size={18} style={{ color: 'var(--warning-500)' }} />
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
                2. La Trampa del Sueldo Nominal vs. La Tarifa Real
              </h4>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Si ganas $4.000.000 COP al mes y trabajas 40 horas a la semana (173h al mes), parece que ganas <strong>$23.000 COP por hora</strong>. Pero eso es una ilusión por dos factores críticos:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>
                <strong>Gastos y deducciones obligatorios:</strong> Impuestos, salud, pensión, transporte/gasolina para ir a la oficina, vestimenta de trabajo y comidas forzadas. Ese dinero se gasta únicamente para poder trabajar.
              </li>
              <li>
                <strong>Horas no pagadas de tu vida:</strong> El tiempo diario de trancones en transporte público o auto, más el tiempo de preparación matutina. Si gastas 2 horas diarias viajando, son 43 horas mensuales adicionales dedicadas al trabajo sin recibir compensación.
              </li>
            </ul>
          </div>

          {/* Section 3: Exact Formulas */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Calculator size={18} style={{ color: 'var(--success-500)' }} />
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
                3. Fórmulas Matemáticas Utilizadas
              </h4>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                fontFamily: 'monospace',
                fontSize: '0.825rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--primary-500)', fontWeight: 700 }}>
                  A. Tarifa Hora Real (Neto Real):
                </span>
                <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px', marginTop: '4px', border: '1px solid var(--border-subtle)' }}>
                  Tarifa Real = (Ingreso Mensual - Deducciones y Gastos) / (Horas Pagadas + Horas de Conmuta y Prep)
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--success-600)', fontWeight: 700 }}>
                  B. Costo de un Artículo en Horas de Vida:
                </span>
                <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px', marginTop: '4px', border: '1px solid var(--border-subtle)' }}>
                  Horas de Vida = Precio del Artículo / Tarifa Hora Real
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--warning-600)', fontWeight: 700 }}>
                  C. Equivalencia en Jornadas Laborales:
                </span>
                <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px', marginTop: '4px', border: '1px solid var(--border-subtle)' }}>
                  Días Laborales = Horas de Vida / 8 horas (jornada estándar)
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--danger-500)', fontWeight: 700 }}>
                  D. Descuento de Realidad (% Brecha):
                </span>
                <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px', marginTop: '4px', border: '1px solid var(--border-subtle)' }}>
                  Descuento (%) = ((Tarifa Nominal - Tarifa Real) / Tarifa Nominal) × 100
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Key Insights */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <HeartHandshake size={18} style={{ color: 'var(--primary-500)' }} />
              <h4 style={{ fontSize: '1rem', margin: 0 }}>
                Cómo usar esta aplicación para mejorar tu vida
              </h4>
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>Antes de una compra por impulso:</strong> Convierte el precio a horas de vida. Pregúntate: <em>"¿Realmente vale este par de tenis 3 días completos de mi vida laboral?"</em>.
              </li>
              <li>
                <strong>Teletrabajo y traslados:</strong> Eliminar 2 horas diarias de transporte público puede equivaler a un aumento real del 25% en tu tarifa hora neta, incluso si tu salario nominal no cambia.
              </li>
              <li>
                <strong>Comparativas internacionales:</strong> Usa la pestaña de <em>Comparativa General</em> para comparar ofertas de trabajo en distintos países o ciudades considerando costos reales y horas de vida.
              </li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={closeExplanation}>
            ¡Entendido, volver a la aplicación!
          </button>
        </div>
      </div>
    </div>
  );
}
