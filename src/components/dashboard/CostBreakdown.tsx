import React from 'react';
import type { CalculatorSummary, CarCalculatorInputs } from '../../types/calculator';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, Sparkles } from 'lucide-react';

interface CostBreakdownProps {
  summary: CalculatorSummary;
  inputs: CarCalculatorInputs;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ summary, inputs }) => {
  const svalutazioneAuto = inputs.prezzoAuto - summary.valoreResiduoEuro;
  const totaleAssicurazione = (inputs.assicurazioneAnnua / 12) * inputs.durataMesi;
  const totaleBollo = (inputs.bolloAnnuo / 12) * inputs.durataMesi;
  const totaleManutenzione = (inputs.manutenzioneAnnua / 12) * inputs.durataMesi;

  const totaleNltCanoni = inputs.canoneMensileNlt * inputs.durataMesi;

  // Percentuali Acquisto Reale
  const tcoAcquisto = Math.max(1, summary.costoTotaleRealeAcquisto);
  const pSvalutazione = Math.max(0, Math.min(100, (svalutazioneAuto / tcoAcquisto) * 100));
  const pInteressi = Math.max(0, Math.min(100, (summary.totaleInteressiFinanziamento / tcoAcquisto) * 100));
  const pAssicurazione = Math.max(0, Math.min(100, (totaleAssicurazione / tcoAcquisto) * 100));
  const pBollo = Math.max(0, Math.min(100, (totaleBollo / tcoAcquisto) * 100));
  const pManutenzione = Math.max(0, Math.min(100, (totaleManutenzione / tcoAcquisto) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-blue-500" />
          <span>Composizione del Costo (Cost Breakdown)</span>
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Orizzonte: {inputs.durataMesi} mesi
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Breakdown Acquisto */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-amber-800 dark:text-amber-300">
            <span>Dettaglio Voci Acquisto Reale</span>
            <span className="font-bold">{formatCurrency(summary.costoTotaleRealeAcquisto)}</span>
          </div>

          {/* Progress bar composta */}
          <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 flex overflow-hidden">
            <div style={{ width: `${pSvalutazione}%` }} className="bg-amber-500" title={`Svalutazione: ${pSvalutazione.toFixed(0)}%`} />
            <div style={{ width: `${pInteressi}%` }} className="bg-red-400" title={`Interessi: ${pInteressi.toFixed(0)}%`} />
            <div style={{ width: `${pAssicurazione}%` }} className="bg-blue-400" title={`Assicurazione: ${pAssicurazione.toFixed(0)}%`} />
            <div style={{ width: `${pBollo}%` }} className="bg-indigo-400" title={`Bollo: ${pBollo.toFixed(0)}%`} />
            <div style={{ width: `${pManutenzione}%` }} className="bg-orange-400" title={`Manutenzione: ${pManutenzione.toFixed(0)}%`} />
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Svalutazione veicolo:
              </span>
              <span className="font-semibold">{formatCurrency(svalutazioneAuto)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                Interessi finanziamento (TAEG {inputs.tassoTaeg}%):
              </span>
              <span className="font-semibold">{formatCurrency(summary.totaleInteressiFinanziamento)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Assicurazione ({inputs.durataMesi} mesi):
              </span>
              <span className="font-semibold">{formatCurrency(totaleAssicurazione)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                Bollo auto ({inputs.durataMesi} mesi):
              </span>
              <span className="font-semibold">{formatCurrency(totaleBollo)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                Manutenzione stimata:
              </span>
              <span className="font-semibold">{formatCurrency(totaleManutenzione)}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Noleggio */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold text-cyan-800 dark:text-cyan-300">
            <span>Dettaglio Voci NLT</span>
            <span className="font-bold">{formatCurrency(summary.costoTotaleNlt)}</span>
          </div>

          {/* Progress bar composta */}
          {summary.costoTotaleNlt > 0 && (
            <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 flex overflow-hidden">
              <div
                style={{ width: `${(inputs.anticipoNlt / summary.costoTotaleNlt) * 100}%` }}
                className="bg-cyan-700"
                title="Anticipo"
              />
              <div
                style={{ width: `${(totaleNltCanoni / summary.costoTotaleNlt) * 100}%` }}
                className="bg-cyan-500"
                title="Canoni Mensili"
              />
              {summary.costoTotaleKmEccedentiNlt > 0 && (
                <div
                  style={{ width: `${(summary.costoTotaleKmEccedentiNlt / summary.costoTotaleNlt) * 100}%` }}
                  className="bg-amber-500"
                  title="Penale Km Eccedenti"
                />
              )}
            </div>
          )}

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
                Anticipo contrattuale:
              </span>
              <span className="font-semibold">{formatCurrency(inputs.anticipoNlt)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
                Canoni mensili ({inputs.durataMesi} x {formatCurrency(inputs.canoneMensileNlt)}):
              </span>
              <span className="font-semibold">{formatCurrency(totaleNltCanoni)}</span>
            </div>

            {summary.costoTotaleKmEccedentiNlt > 0 && (
              <div className="flex justify-between items-center text-amber-700 dark:text-amber-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Penale km eccedenti (+{summary.kmEccedentiTotaliNlt} km a {(inputs.costoKmEccedenteNlt * 100).toFixed(0)} cent/km):
                </span>
                <span className="font-bold">+{formatCurrency(summary.costoTotaleKmEccedentiNlt)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nel NLT tutte le voci di bollo, Kasko, manutenzione e svalutazione sono già inglobate nel canone.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
