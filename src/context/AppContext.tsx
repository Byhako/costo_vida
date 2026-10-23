import { createContext } from 'preact';
import { useContext, useEffect, useState, useMemo, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import type { Scenario, ItemCost, CurrencyCode, ExchangeRates, RatesUpdatedAt, SavedRates } from '../types';
import {
  loadSavedScenarios,
  saveScenarios,
  loadSavedTab,
  saveActiveTab,
  loadSavedTheme,
  saveTheme,
  exportDataAsJSON,
  loadSavedRates,
  saveRates,
  stripLegacyScenarioFields,
} from '../utils/storage';
import { DEFAULT_SCENARIOS } from '../constants/defaults';
import confetti from 'canvas-confetti';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string; // por defecto 'Confirmar'
  cancelLabel?: string;  // por defecto 'Cancelar'
}

interface AppContextType {
  scenarios: Scenario[];
  activeTab: string; // scenario id or 'comparison'
  theme: 'dark' | 'light';
  isExplanationOpen: boolean;
  toasts: ToastMessage[];
  editingItemInfo: { scenarioId: string; item?: ItemCost } | null;

  setActiveTab: (tabId: string) => void;
  toggleTheme: () => void;
  openExplanation: () => void;
  closeExplanation: () => void;
  openItemModal: (scenarioId: string, item?: ItemCost) => void;
  closeItemModal: () => void;
  showToast: (text: string, type?: ToastMessage['type']) => void;
  confirmRequest: ConfirmOptions | null;
  requestConfirm: (options: ConfirmOptions) => Promise<boolean>;
  resolveConfirm: (result: boolean) => void;

  // Scenario operations
  addScenario: (name: string, currency: CurrencyCode, baseOnScenarioId?: string) => void;
  updateScenario: (id: string, updates: Partial<Scenario>) => void;
  renameScenario: (id: string, newName: string) => void;
  duplicateScenario: (id: string) => void;
  deleteScenario: (id: string) => void;
  resetAllToDefaults: () => void;
  importScenariosData: (imported: Scenario[]) => void;
  exportData: () => void;

  // Item operations
  saveItem: (scenarioId: string, itemData: Omit<ItemCost, 'id' | 'createdAt'> & { id?: string }) => void;
  deleteItem: (scenarioId: string, itemId: string) => void;
  duplicateItem: (scenarioId: string, itemId: string) => void;

  // Exchange rates (global, persisted)
  rates: ExchangeRates;
  ratesUpdatedAt: RatesUpdatedAt;
  setManualRate: (code: CurrencyCode, ratePerUSD: number) => void;
  applyDownloadedRates: (fresh: Partial<ExchangeRates>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ComponentChildren }) {
  const [scenarios, setScenarios] = useState<Scenario[]>(loadSavedScenarios);
  const [activeTab, setActiveTabState] = useState<string>(() => loadSavedTab('scen-colombia'));
  const [theme, setThemeState] = useState<'dark' | 'light'>(loadSavedTheme);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [editingItemInfo, setEditingItemInfo] = useState<{ scenarioId: string; item?: ItemCost } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [savedRates, setSavedRates] = useState<SavedRates>(loadSavedRates);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmOptions | null>(null);
  const confirmResolverRef = useRef<((result: boolean) => void) | null>(null);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // Persist scenarios
  useEffect(() => {
    saveScenarios(scenarios);
  }, [scenarios]);

  // Persist exchange rates
  useEffect(() => {
    saveRates(savedRates);
  }, [savedRates]);

  // Handle active tab change
  const setActiveTab = (tabId: string) => {
    setActiveTabState(tabId);
    saveActiveTab(tabId);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const openExplanation = () => setIsExplanationOpen(true);
  const closeExplanation = () => setIsExplanationOpen(false);

  const openItemModal = (scenarioId: string, item?: ItemCost) => {
    setEditingItemInfo({ scenarioId, item });
  };
  const closeItemModal = () => setEditingItemInfo(null);

  const requestConfirm = (options: ConfirmOptions): Promise<boolean> => {
    confirmResolverRef.current?.(false); // una petición previa sin responder se da por cancelada
    return new Promise<boolean>((resolve) => {
      confirmResolverRef.current = resolve;
      setConfirmRequest(options);
    });
  };

  const resolveConfirm = (result: boolean) => {
    const resolve = confirmResolverRef.current;
    confirmResolverRef.current = null;
    setConfirmRequest(null);
    resolve?.(result);
  };

  // Scenario operations
  const addScenario = (name: string, currency: CurrencyCode, baseOnScenarioId?: string) => {
    let baseScenario = scenarios.find((s) => s.id === baseOnScenarioId);
    const newId = 'scen-' + Date.now();

    const newScenario: Scenario = {
      id: newId,
      name: name.trim() || `Nuevo Escenario (${currency})`,
      currency,
      incomeConfig: baseScenario
        ? JSON.parse(JSON.stringify(baseScenario.incomeConfig))
        : {
            incomeFrequency: 'monthly',
            nominalAmount: currency === 'COP' ? 3500000 : currency === 'CAD' ? 4500 : 3000,
            weeklyWorkHours: 40,
            taxDeductionsMonthly: 0,
            commuteExpensesMonthly: 0,
            workOtherExpensesMonthly: 0,
            commuteHoursWeekly: 5,
            prepHoursWeekly: 2,
          },
      items: baseScenario
        ? JSON.parse(JSON.stringify(baseScenario.items)).map((item: ItemCost) => ({
            ...item,
            id: 'item-' + Date.now() + Math.random().toString(36).substring(2, 5),
          }))
        : [],
    };

    setScenarios((prev) => [...prev, newScenario]);
    setActiveTab(newId);
    showToast(`Escenario "${newScenario.name}" creado con éxito`, 'success');
  };

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const renameScenario = (id: string, newName: string) => {
    if (!newName.trim()) return;
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName.trim() } : s))
    );
    showToast('Nombre del escenario actualizado', 'info');
  };

  const duplicateScenario = (id: string) => {
    const target = scenarios.find((s) => s.id === id);
    if (!target) return;

    const newId = 'scen-' + Date.now();
    const duplicated: Scenario = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      name: `${target.name} (Copia)`,
      items: target.items.map((it) => ({
        ...it,
        id: 'item-' + Date.now() + Math.random().toString(36).substring(2, 5),
      })),
    };

    setScenarios((prev) => [...prev, duplicated]);
    setActiveTab(newId);
    showToast(`Copia creada: "${duplicated.name}"`, 'success');
  };

  const deleteScenario = (id: string) => {
    if (scenarios.length <= 1) {
      showToast('Debes mantener al menos un escenario activo', 'warning');
      return;
    }

    const target = scenarios.find((s) => s.id === id);
    const updated = scenarios.filter((s) => s.id !== id);
    setScenarios(updated);

    if (activeTab === id) {
      setActiveTab(updated[0]?.id || 'comparison');
    }
    showToast(`Escenario "${target?.name || ''}" eliminado`, 'info');
  };

  const resetAllToDefaults = () => {
    setScenarios(DEFAULT_SCENARIOS);
    setActiveTab(DEFAULT_SCENARIOS[0].id);
    showToast('Escenarios restaurados a los valores iniciales', 'info');
  };

  const importScenariosData = (imported: Scenario[]) => {
    if (!Array.isArray(imported) || imported.length === 0) {
      showToast('El archivo no contiene un formato de escenarios válido', 'error');
      return;
    }
    setScenarios(stripLegacyScenarioFields(imported));
    setActiveTab(imported[0].id);
    showToast('¡Datos importados con éxito!', 'success');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const exportData = () => {
    exportDataAsJSON(scenarios);
    showToast('Datos exportados a archivo JSON', 'success');
  };

  // Item operations
  const saveItem = (
    scenarioId: string,
    itemData: Omit<ItemCost, 'id' | 'createdAt'> & { id?: string }
  ) => {
    setScenarios((prev) =>
      prev.map((scen) => {
        if (scen.id !== scenarioId) return scen;

        if (itemData.id) {
          // Update
          return {
            ...scen,
            items: scen.items.map((it) =>
              it.id === itemData.id ? { ...it, ...itemData } : it
            ),
          };
        } else {
          // Create new
          const newItem: ItemCost = {
            id: 'item-' + Date.now() + Math.random().toString(36).substring(2, 5),
            name: itemData.name,
            price: itemData.price,
            category: itemData.category || 'Otros',
            emoji: itemData.emoji || '📦',
            notes: itemData.notes,
            createdAt: Date.now(),
          };
          return {
            ...scen,
            items: [newItem, ...scen.items],
          };
        }
      })
    );

    showToast(itemData.id ? 'Artículo actualizado' : 'Artículo añadido', 'success');
  };

  const deleteItem = (scenarioId: string, itemId: string) => {
    setScenarios((prev) =>
      prev.map((scen) => {
        if (scen.id !== scenarioId) return scen;
        return {
          ...scen,
          items: scen.items.filter((it) => it.id !== itemId),
        };
      })
    );
    showToast('Artículo eliminado', 'info');
  };

  const duplicateItem = (scenarioId: string, itemId: string) => {
    setScenarios((prev) =>
      prev.map((scen) => {
        if (scen.id !== scenarioId) return scen;
        const target = scen.items.find((it) => it.id === itemId);
        if (!target) return scen;

        const copy: ItemCost = {
          ...target,
          id: 'item-' + Date.now() + Math.random().toString(36).substring(2, 5),
          name: `${target.name} (Copia)`,
          createdAt: Date.now(),
        };

        return {
          ...scen,
          items: [copy, ...scen.items],
        };
      })
    );
    showToast('Artículo duplicado', 'info');
  };

  // Exchange rates
  const setManualRate = (code: CurrencyCode, ratePerUSD: number) => {
    if (!(Number.isFinite(ratePerUSD) && ratePerUSD > 0)) return;
    setSavedRates((prev) => ({
      rates: { ...prev.rates, [code]: ratePerUSD },
      ratesUpdatedAt: 'manual',
    }));
  };

  const applyDownloadedRates = (fresh: Partial<ExchangeRates>) => {
    setSavedRates((prev) => ({
      rates: { ...prev.rates, ...fresh },
      ratesUpdatedAt: new Date().toISOString(),
    }));
  };

  const value = useMemo(
    () => ({
      scenarios,
      activeTab,
      theme,
      isExplanationOpen,
      toasts,
      editingItemInfo,
      setActiveTab,
      toggleTheme,
      openExplanation,
      closeExplanation,
      openItemModal,
      closeItemModal,
      showToast,
      confirmRequest,
      requestConfirm,
      resolveConfirm,
      addScenario,
      updateScenario,
      renameScenario,
      duplicateScenario,
      deleteScenario,
      resetAllToDefaults,
      importScenariosData,
      exportData,
      saveItem,
      deleteItem,
      duplicateItem,
      rates: savedRates.rates,
      ratesUpdatedAt: savedRates.ratesUpdatedAt,
      setManualRate,
      applyDownloadedRates,
    }),
    [scenarios, activeTab, theme, isExplanationOpen, toasts, editingItemInfo, confirmRequest, savedRates]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
