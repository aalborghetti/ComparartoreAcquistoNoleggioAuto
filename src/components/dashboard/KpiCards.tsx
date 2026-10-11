import { ShoppingCart, CarFront, KeyRound, CheckCircle2, Award } from 'lucide-react';
import type { CalculatorSummary, CarCalculatorInputs } from '../../types/calculator';
import { formatCurrency, formatCostPerKm } from '../../utils/formatters';

interface KpiCardsProps {
  summary: CalculatorSummary;
  inputs: CarCalculatorInputs;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary, inputs }) => {
  const isNuovoBest = summary.opzionePiuConveniente === 'acquisto';
  const isUsatoBest = summary.opzionePiuConveniente === 'usato';
  const isNltBest = summary.opzionePiuConveniente === 'nlt';

  return (
    <div className="space-y-3.5">
      {/* 3 Card Riassuntive in alto (Nuovo vs Usato vs NLT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Card Auto Nuova */}
        <div
          className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
            isNuovoBest
              ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-400 dark:border-amber-600 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          {isNuovoBest && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Best TCO</span>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Auto Nuova
              </h3>
            </div>

            <div className="mt-2">
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight block">
                {formatCurrency(summary.costoTotaleRealeAcquisto)}
              </span>
              <span className="text-[10px] text-slate-400">
                TCO Reale ({inputs.durataMesi}m)
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Medio/mese:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(summary.costoMensileMedioAcquisto)}/m</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Costo/km:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCostPerKm(summary.costoAlKmAcquisto)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-emerald-600 dark:text-emerald-400 pt-0.5">
              <span>Valore residuo:</span>
              <span>-{formatCurrency(summary.valoreResiduoEuro)}</span>
            </div>
          </div>
        </div>

        {/* 2. Card Auto Usata */}
        <div
          className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
            isUsatoBest
              ? 'bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-400 dark:border-purple-600 shadow-md ring-2 ring-purple-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          {isUsatoBest && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Best TCO</span>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <CarFront className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Auto Usata
              </h3>
            </div>

            <div className="mt-2">
              <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight block">
                {formatCurrency(summary.usatoCostoTotaleReale)}
              </span>
              <span className="text-[10px] text-slate-400">
                TCO Reale ({inputs.durataMesi}m)
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Medio/mese:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(summary.usatoCostoMensileMedio)}/m</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Costo/km:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCostPerKm(summary.usatoCostoAlKm)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-purple-600 dark:text-purple-400 pt-0.5">
              <span>Manutenzione usura:</span>
              <span>{formatCurrency(inputs.usatoManutenzioneAnnua)}/anno</span>
            </div>
          </div>
        </div>

        {/* 3. Card NLT */}
        <div
          className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
            isNltBest
              ? 'bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-400 dark:border-cyan-600 shadow-md ring-2 ring-cyan-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          {isNltBest && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-cyan-600 text-white text-[9px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Best TCO</span>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Noleggio NLT
              </h3>
            </div>

            <div className="mt-2">
              <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 tracking-tight block">
                {formatCurrency(summary.costoTotaleNlt)}
              </span>
              <span className="text-[10px] text-slate-400">
                Costo Totale ({inputs.durataMesi}m)
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Medio/mese:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(summary.costoMensileMedioNlt)}/m</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Costo/km:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCostPerKm(summary.costoAlKmNlt)}</span>
            </div>
            {summary.costoTotaleKmEccedentiNlt > 0 ? (
              <div className="flex justify-between text-[10px] text-amber-600 dark:text-amber-400 pt-0.5">
                <span>Penale km eccedenti:</span>
                <span>+{formatCurrency(summary.costoTotaleKmEccedentiNlt)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-[10px] text-emerald-600 dark:text-emerald-400 pt-0.5">
                <span>Km inclusi:</span>
                <span>{inputs.kmInclusiAnnuiNlt} km/anno</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verdetto 3-Way Comparativo */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isUsatoBest
            ? 'bg-purple-500/10 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/50 text-purple-950 dark:text-purple-200'
            : isNuovoBest
            ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-950 dark:text-amber-200'
            : 'bg-cyan-500/10 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800/50 text-cyan-950 dark:text-cyan-200'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <div
            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
              isUsatoBest
                ? 'bg-purple-600 text-white'
                : isNuovoBest
                ? 'bg-amber-500 text-white'
                : 'bg-cyan-600 text-white'
            }`}
          >
            <Award className="w-4 h-4" />
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-bold">
              🏆 L'opzione economicamente più conveniente è: {summary.migliorOpzioneNome}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              Risparmio massimo fino a <strong>{formatCurrency(summary.risparmioRispettoAlPeggiorCaso)} ({summary.risparmioPercentuale}%)</strong> sull'arco dei {inputs.durataMesi} mesi rispetto alla formula più onerosa.
            </p>
          </div>
        </div>

        <div className="shrink-0 font-bold text-xs px-2.5 py-1 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 self-end sm:self-center">
          Vantaggio TCO: {formatCurrency(summary.risparmioRispettoAlPeggiorCaso)}
        </div>
      </div>
    </div>
  );
};
