import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { ScenarioConfig } from './components/ScenarioConfig';
import { ItemList } from './components/ItemList';
import { ComparisonView } from './components/ComparisonView';
import { QuickItemModal } from './components/QuickItemModal';
import { ExplanationModal } from './components/ExplanationModal';
import { ToastContainer } from './components/Toast';
import './app.css';

function MainLayout() {
  const { scenarios, activeTab } = useApp();

  const activeScenario = scenarios.find((s) => s.id === activeTab) || scenarios[0];

  return (
    <div className="app-container">
      {/* Header */}
      <Header />

      {/* Tabs navigation */}
      <TabNavigation />

      {/* Main Content Area */}
      <main>
        {activeTab === 'comparison' ? (
          <ComparisonView />
        ) : activeScenario ? (
          <div className="grid-2">
            {/* Left: Income & Wage Configuration */}
            <div>
              <ScenarioConfig scenario={activeScenario} />
            </div>

            {/* Right: Items & Life Cost Calculator */}
            <div>
              <ItemList scenario={activeScenario} />
            </div>
          </div>
        ) : null}
      </main>

      {/* Modals & Toasts */}
      <QuickItemModal />
      <ExplanationModal />
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
