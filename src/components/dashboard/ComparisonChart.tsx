import React, { useState, useMemo } from 'react';
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
import type { MonthlyDataPoint, BreakEvenPoint, CalculatorSummary, CarCalculatorInputs } from '../../types/calculator';
import { formatCurrency } from '../../utils/formatters';
import { Target, HelpCircle, Coins } from 'lucide-react';

interface ComparisonChartProps {
  data: MonthlyDataPoint[];
  summary: CalculatorSummary;
  inputs: CarCalculatorInputs;
  breakEvenCashflow: BreakEvenPoint | null;
  breakEvenNetTco: BreakEvenPoint | null;
  breakEvenUsatoVsNlt: BreakEvenPoint | null;
  durataMesi: number;
}

type ViewMode = 'cashflow' | 'netTco';

interface DetectedIntersection {
  id: string;
  mese: number;
  valore: number;
  pairName: string;
  color: string;
  descrizione: string;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  data,
  summary,
  durataMesi,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('cashflow');
  const [showResaleDrop, setShowResaleDrop] = useState<boolean>(true);

  // Costruzione serie dati con punto di vendita finale opzionale
  const chartData = useMemo(() => {
    if (!showResaleDrop || viewMode === 'netTco' || data.length === 0) {
      return data;
    }

    const lastPoint = data[data.length - 1];
    if (!lastPoint) return data;

    // Aggiunge il punto speciale "Vendita Auto" che mostra il recupero del valore residuo
    const resalePoint: MonthlyDataPoint & { isResaleDrop?: boolean } = {
      mese: durataMesi + 0.1,
      label: 'Vendita Auto',
      isResaleDrop: true,
      nltCumulato: summary.costoTotaleNlt,
      acquistoCumulato: summary.costoTotaleRealeAcquisto,
      valoreAutoStimato: 0,
      acquistoNetto: summary.costoTotaleRealeAcquisto,
      usatoCumulato: summary.usatoCostoTotaleReale,
      usatoValoreAutoStimato: 0,
      usatoNetto: summary.usatoCostoTotaleReale,
      differenzaCumulata: summary.costoTotaleRealeAcquisto - summary.costoTotaleNlt,
    };

    return [...data, resalePoint];
  }, [data, showResaleDrop, viewMode, summary, durataMesi]);

  // Rilevamento dinamico di tutti i punti di incrocio (Break-Even) tra le curve visibili a video
  const detectedIntersections = useMemo<DetectedIntersection[]>(() => {
    if (chartData.length < 2) return [];

    const pairs = [
      {
        id: 'usato-vs-nlt',
        pairName: 'Auto Usata vs NLT',
        color: '#9333ea', // Viola
        getVal1: (d: MonthlyDataPoint) => (viewMode === 'cashflow' ? d.usatoCumulato : d.usatoNetto),
        getVal2: (d: MonthlyDataPoint) => d.nltCumulato,
        name1: 'Auto Usata',
        name2: 'Noleggio NLT',
      },
      {
        id: 'nuovo-vs-nlt',
        pairName: 'Auto Nuova vs NLT',
        color: '#d97706', // Ambra
        getVal1: (d: MonthlyDataPoint) => (viewMode === 'cashflow' ? d.acquistoCumulato : d.acquistoNetto),
        getVal2: (d: MonthlyDataPoint) => d.nltCumulato,
        name1: 'Auto Nuova',
        name2: 'Noleggio NLT',
      },
      {
        id: 'nuovo-vs-usato',
        pairName: 'Auto Nuova vs Auto Usata',
        color: '#3b82f6', // Blu
        getVal1: (d: MonthlyDataPoint) => (viewMode === 'cashflow' ? d.acquistoCumulato : d.acquistoNetto),
        getVal2: (d: MonthlyDataPoint) => (viewMode === 'cashflow' ? d.usatoCumulato : d.usatoNetto),
        name1: 'Auto Nuova',
        name2: 'Auto Usata',
      },
    ];

    const results: DetectedIntersection[] = [];

    for (const pair of pairs) {
      for (let i = 0; i < chartData.length - 1; i++) {
        const p1 = chartData[i];
        const p2 = chartData[i + 1];

        const v1_1 = pair.getVal1(p1);
        const v2_1 = pair.getVal2(p1);

        const v1_2 = pair.getVal1(p2);
        const v2_2 = pair.getVal2(p2);

        const diff1 = v1_1 - v2_1;
        const diff2 = v1_2 - v2_2;

        // Se hanno segni opposti (o toccano lo zero), c'è un incrocio
        if ((diff1 < 0 && diff2 > 0) || (diff1 > 0 && diff2 < 0) || (diff1 !== 0 && diff2 === 0)) {
          const isDrop = Boolean(p2.mese > durataMesi);
          let exactMonth = p2.mese;
          let exactValue = v2_2;

          if (!isDrop) {
            const delta = diff2 - diff1;
            const fraction = delta !== 0 ? -diff1 / delta : 0.5;
            exactMonth = Number((p1.mese + fraction * (p2.mese - p1.mese)).toFixed(1));
            exactValue = Math.round(v1_1 + fraction * (v1_2 - v1_1));
          } else {
            exactMonth = durataMesi;
            exactValue = Math.round(v2_2);
          }

          const desc = isDrop
            ? `Incrocio con la vendita finale al mese ${durataMesi}: il realizzo dell'auto (${pair.name1}) supera la convenienza del ${pair.name2}`
            : `Al mese ${Math.round(exactMonth)} (${formatCurrency(exactValue)}), le curve di ${pair.name1} e ${pair.name2} raggiungono la parità economica`;

          results.push({
            id: `${pair.id}-${i}`,
            mese: exactMonth,
            valore: exactValue,
            pairName: pair.pairName,
            color: pair.color,
            descrizione: desc,
          });
        }
      }
    }

    return results;
  }, [chartData, viewMode, durataMesi]);

  // Custom Tooltip Formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as MonthlyDataPoint & { isResaleDrop?: boolean };
      const isResale = Boolean(point.isResaleDrop || point.mese > durataMesi);

      if (isResale) {
        return (
          <div className="bg-slate-900/95 text-slate-100 p-3.5 rounded-xl shadow-xl border border-emerald-500/60 text-xs space-y-2.5 backdrop-blur-md max-w-xs">
            <div className="font-bold text-emerald-400 pb-1 border-b border-slate-800 flex justify-between items-center">
              <span>💰 Realizzo Vendita a Fine Periodo</span>
              <span className="text-[10px] text-slate-400 font-normal">Mese {durataMesi}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-800/80 space-y-0.5">
                <div className="flex justify-between items-center text-amber-400 font-bold">
                  <span>Auto Nuova:</span>
                  <span className="font-mono text-sm">{formatCurrency(summary.costoTotaleRealeAcquisto)}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Esborso {formatCurrency(summary.costoTotaleEsborsoAcquisto)}</span>
                  <span className="text-emerald-400 font-semibold">Vendita: -{formatCurrency(summary.valoreResiduoEuro)}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-800/80 space-y-0.5">
                <div className="flex justify-between items-center text-purple-400 font-bold">
                  <span>Auto Usata:</span>
                  <span className="font-mono text-sm">{formatCurrency(summary.usatoCostoTotaleReale)}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Esborso {formatCurrency(summary.usatoCostoTotaleEsborso)}</span>
                  <span className="text-emerald-400 font-semibold">Vendita: -{formatCurrency(summary.usatoValoreResiduoEuro)}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-800/80 space-y-0.5">
                <div className="flex justify-between items-center text-cyan-400 font-bold">
                  <span>Noleggio (NLT):</span>
                  <span className="font-mono text-sm">{formatCurrency(summary.costoTotaleNlt)}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Canoni + anticipo</span>
                  <span>Restituzione auto (0 €)</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

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
            Confronto cumulativo mese per mese con effetto vendita finale
          </p>
        </div>

        {/* View Mode Switcher e Toggle Vendita */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {viewMode === 'cashflow' && (
            <button
              type="button"
              onClick={() => setShowResaleDrop(!showResaleDrop)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                showResaleDrop
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Mostra l'incasso derivante dalla vendita dell'auto a fine periodo con recupero del Valore Residuo"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-500" />
              <span>{showResaleDrop ? 'Vendita finale attiva' : 'Mostra vendita finale'}</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
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
      </div>

      {/* Break-even Points Banner (Tutti i pareggi rilevati tra le curve) */}
      {detectedIntersections.length > 0 ? (
        <div className="space-y-1.5">
          {detectedIntersections.map((inter) => (
            <div
              key={inter.id}
              className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="p-1 rounded-lg text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: inter.color }}
                >
                  <Target className="w-3.5 h-3.5" />
                </span>
                <span>
                  <strong>Punto di Pareggio ({inter.pairName}):</strong> {inter.descrizione}.
                </span>
              </div>
              <span className="hidden sm:inline-block font-mono text-[11px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 font-bold shadow-xs border border-slate-200/80 dark:border-slate-700/80">
                Mese {Math.round(inter.mese)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Nessun punto di incrocio nei {durataMesi} mesi tra le opzioni: le curve mantengono costi distanziati senza sovrapporsi.
          </span>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="mese"
              tickLine={false}
              axisLine={{ stroke: '#94a3b8', opacity: 0.3 }}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(m) => {
                if (m === 0) return 'Start';
                if (m > durataMesi) return 'Vendita 💰';
                return `m${m}`;
              }}
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
              dot={false}
              activeDot={{ r: 5, fill: '#9333ea', stroke: '#fff', strokeWidth: 2 }}
            />

            {/* Indicatori grafici per tutti i punti di incrocio rilevati */}
            {detectedIntersections.map((inter) => (
              <React.Fragment key={inter.id}>
                <ReferenceLine
                  x={Math.round(inter.mese)}
                  stroke={inter.color}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  opacity={0.8}
                />
                <ReferenceDot
                  x={Math.round(inter.mese)}
                  y={inter.valore}
                  r={5}
                  fill={inter.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              </React.Fragment>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-end text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
        <span>Asse X: progressione mensile | Asse Y: costo cumulativo in €</span>
      </div>
    </div>
  );
};
