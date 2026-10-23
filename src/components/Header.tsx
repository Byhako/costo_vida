import { useRef } from 'preact/hooks';
import { useApp } from '../context/AppContext';
import {
  Hourglass,
  Moon,
  Sun,
  BookOpen,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-preact';

export function Header() {
  const {
    theme,
    toggleTheme,
    openExplanation,
    exportData,
    importScenariosData,
    resetAllToDefaults,
    showToast,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        importScenariosData(parsed);
      } catch (err) {
        showToast('Archivo JSON no válido o corrupto', 'error');
      }
    };
    reader.readAsText(file);
    target.value = ''; // Reset input
  };

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-logo-badge" title="Costo de Vida en Tiempo Laboral">
          <Hourglass size={26} />
        </div>
        <div>
          <h1 className="brand-title">Costo de Vida en Tiempo Laboral</h1>
          <p className="brand-subtitle">
            Calcula el verdadero costo de tus gastos en tiempo de vida y compara escenarios
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={openExplanation}
          id="btn-manifesto"
          title="Ver fundamentos, fórmulas y filosofía"
        >
          <BookOpen size={16} />
          <span>Filosofía & Fórmulas</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={exportData}
          id="btn-export"
          title="Descargar tus datos en un archivo JSON"
        >
          <Download size={15} />
          <span>Exportar</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => fileInputRef.current?.click()}
          id="btn-import"
          title="Cargar archivo JSON previo"
        >
          <Upload size={15} />
          <span>Importar</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleFileUpload}
        />

        <button
          className="btn btn-ghost btn-icon"
          onClick={() => {
            if (confirm('¿Restablecer los escenarios a los valores de ejemplo iniciales? Perderás cambios no guardados.')) {
              resetAllToDefaults();
            }
          }}
          title="Restablecer escenarios de ejemplo"
        >
          <RotateCcw size={17} />
        </button>

        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTheme}
          id="btn-theme-toggle"
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
