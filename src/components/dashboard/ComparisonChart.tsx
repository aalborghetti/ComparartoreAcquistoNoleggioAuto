import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import type { MonthlyDataPoint, BreakEvenPoint } from '../../types/calculator';
import { formatCurrency } from '../../utils/formatters';
import { Target, HelpCircle } from 'lucide-react';

interface ComparisonChartProps {
  data: MonthlyDataPoint[];
  breakEvenCashflow: BreakEvenPoint | null;
  breakEvenNetTco: BreakEvenPoint | null;
  breakEvenUsatoVsNlt: BreakEvenPoint | null;
  durataMesi: number;
}

type ViewMode = 'cashflow' | 'netTco';

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  data,
  breakEvenCashflow,
  breakEvenNetTco,
  durataMesi,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('cashflow');

  const activeBreakEven = viewMode === 'netTco' ? breakEvenNetTco : breakEvenCashflow;

  // Custom Tooltip Formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as MonthlyDataPoint;

      return (
        <div className="bg-slate-900/95 text-slate-100 p-3.5 rounded-xl shadow-xl border border-slate-700/80 text-xs space-y-2 backdrop-blur-md">
          <div className="font-bold text-slate-300 pb-1 border-b border-slate-800 flex justify-between">
            <span>{point.label}</span>
            <span className="text-[11px] text-slate-400 font-normal">Mese {point.mese} di {durataMesi}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                Noleggio (NLT):
              </span>
              <span className="font-bold font-mono">{formatCurrency(point.nltCumulato)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                {viewMode === 'cashflow' ? 'Auto Nuova (Esborso):' : 'Auto Nuova (Net TCO):'}
              </span>
              <span className="font-bold font-mono">
                {formatCurrency(viewMode === 'cashflow' ? point.acquistoCumulato : point.acquistoNetto)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-purple-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
                {viewMode === 'cashflow' ? 'Auto Usata (Esborso):' : 'Auto Usata (Net TCO):'}
              </span>
              <span className="font-bold font-mono">
                {formatCurrency(viewMode === 'cashflow' ? point.usatoCumulato : point.usatoNetto)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header Grafico & Switcher Modalità */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Evoluzione dei Costi nel Tempo (Nuovo vs Usato vs NLT)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Confronto cumulativo mese per mese delle 3 alternative
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cashflow')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'cashflow'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Esborso Cassa
          </button>
          <button
            type="button"
            onClick={() => setViewMode('netTco')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'netTco'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Costo Netto (TCO)
          </button>
        </div>
      </div>

      {/* Break-even Point Banner */}
      {activeBreakEven && activeBreakEven.esiste ? (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-2.5 rounded-xl flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-500 text-white shrink-0">
              <Target className="w-3.5 h-3.5" />
            </span>
            <span>
              <strong>Punto di Pareggio (Break-Even Nuovo/NLT):</strong> Al mese <strong>{Math.round(activeBreakEven.mese)}</strong>{' '}
              ({formatCurrency(activeBreakEven.valore)}), le curve hanno lo stesso costo cumulativo.
            </span>
          </div>
          <span className="hidden md:inline-block font-mono text-[11px] px-2 py-0.5 rounded bg-blue-200/60 dark:bg-blue-900/60">
            Mese {activeBreakEven.mese}
          </span>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Nessun punto di incrocio diretto nei {durataMesi} mesi tra Nuovo e NLT: le curve mantengono un andamento parallelo o distanziato.
          </span>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="mese"
              tickLine={false}
              axisLine={{ stroke: '#94a3b8', opacity: 0.3 }}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(m) => (m === 0 ? 'Start' : `m${m}`)}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#94a3b8', opacity: 0.3 }}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
            />

            {/* Linea NLT */}
            <Line
              type="monotone"
              dataKey="nltCumulato"
              name="Noleggio (NLT)"
              stroke="#0891b2"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: '#0891b2', stroke: '#fff', strokeWidth: 2 }}
            />

            {/* Linea Auto Nuova */}
            <Line
              type="monotone"
              dataKey={viewMode === 'cashflow' ? 'acquistoCumulato' : 'acquistoNetto'}
              name={viewMode === 'cashflow' ? 'Auto Nuova (Esborso)' : 'Auto Nuova (Net TCO)'}
              stroke="#d97706"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#d97706', stroke: '#fff', strokeWidth: 2 }}
            />

            {/* Linea Auto Usata */}
            <Line
              type="monotone"
              dataKey={viewMode === 'cashflow' ? 'usatoCumulato' : 'usatoNetto'}
              name={viewMode === 'cashflow' ? 'Auto Usata (Esborso)' : 'Auto Usata (Net TCO)'}
              stroke="#9333ea"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 5, fill: '#9333ea', stroke: '#fff', strokeWidth: 2 }}
            />

            {/* Break-even point marker per Nuovo/NLT se presente */}
            {activeBreakEven && activeBreakEven.esiste && (
              <>
                <ReferenceLine
                  x={Math.round(activeBreakEven.mese)}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <ReferenceDot
                  x={Math.round(activeBreakEven.mese)}
                  y={activeBreakEven.valore}
                  r={5}
                  fill="#ef4444"
                  stroke="#fff"
                  strokeWidth={2}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
        <span>* Curva tratteggiata viola: Auto Usata (prezzo d'acquisto minore, manutenzione superiore).</span>
        <span>Asse X: progressione mensile | Asse Y: costo cumulativo in €</span>
      </div>
    </div>
  );
};
