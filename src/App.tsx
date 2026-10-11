import { useState, useEffect } from 'react';
import { useCarCalculator } from './hooks/useCarCalculator';
import { Header } from './components/Header';
import { InputSection } from './components/inputs/InputSection';
import { KpiCards } from './components/dashboard/KpiCards';
import { ComparisonChart } from './components/dashboard/ComparisonChart';
import { CostBreakdown } from './components/dashboard/CostBreakdown';
import { DetailedTable } from './components/dashboard/DetailedTable';
import { InfoModal } from './components/common/InfoModal';
import { ShieldCheck, Zap } from 'lucide-react';

export function App() {
  // Gestione Dark Mode con memorizzazione locale
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('autocalc_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('autocalc_dark_mode', String(darkMode));
  }, [darkMode]);

  // Hook principale di calcolo finanziario
  const {
    inputs,
    updateInput,
    loadPreset,
    resetDefaults,
    monthlyData,
    summary,
  } = useCarCalculator();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Sticky */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* Main Container a 2 Colonne */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Colonna Sinistra (Input Form a Tab: Generali, Acquisto, Noleggio) */}
          <div className="lg:col-span-5 xl:col-span-5 sticky top-20">
            <InputSection
              inputs={inputs}
              summary={summary}
              onUpdateInput={updateInput}
              onLoadPreset={loadPreset}
              onReset={resetDefaults}
            />
          </div>

          {/* Colonna Destra (Dashboard Risultati in Tempo Reale: KPI, Grafico, Analisi) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* KPI Cards & Verdetto a fine periodo */}
            <KpiCards summary={summary} inputs={inputs} />

            {/* Grafico di confronto con Break-even point */}
            <ComparisonChart
              data={monthlyData}
              summary={summary}
              inputs={inputs}
              breakEvenCashflow={summary.breakEvenCashflow}
              breakEvenNetTco={summary.breakEvenNetTco}
              breakEvenUsatoVsNlt={summary.breakEvenUsatoVsNlt}
              durataMesi={inputs.durataMesi}
            />

            {/* Composizione dei Costi (Breakdown) */}
            <CostBreakdown summary={summary} inputs={inputs} />

            {/* Tabella di avanzamento temporale espandibile */}
            <DetailedTable data={monthlyData} />
          </div>
        </div>
      </main>

      {/* Modal Guida Metodologia */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>100% Client-Side SPA</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Nessun dato inviato a server (Privacy garantita)</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Pronto per deploy su Netlify / Vercel / GitHub Pages</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
