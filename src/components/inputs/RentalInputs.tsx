import React from 'react';
import { CreditCard, Landmark, CheckCircle2, Gauge, AlertTriangle, Coins } from 'lucide-react';
import { InputField } from './InputField';
import { formatCurrency, formatKm } from '../../utils/formatters';
import type { CarCalculatorInputs, CalculatorSummary } from '../../types/calculator';

interface RentalInputsProps {
  anticipoNlt: number;
  canoneMensileNlt: number;
  kmInclusiAnnuiNlt: number;
  costoKmEccedenteNlt: number;
  kmAnnui: number;
  durataMesi: number;
  summary: CalculatorSummary;
  onChange: <K extends keyof CarCalculatorInputs>(field: K, value: CarCalculatorInputs[K]) => void;
}

export const RentalInputs: React.FC<RentalInputsProps> = ({
  anticipoNlt,
  canoneMensileNlt,
  kmInclusiAnnuiNlt,
  costoKmEccedenteNlt,
  kmAnnui,
  durataMesi,
  summary,
  onChange,
}) => {
  const totaleCanoni = canoneMensileNlt * durataMesi;
  const isEccedenza = summary.kmEccedentiTotaliNlt > 0;

  return (
    <div className="space-y-3.5">
      {/* Costi Fissi del Contratto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField
          label="Anticipo Richiesto NLT"
          value={anticipoNlt}
          onChange={(v) => onChange('anticipoNlt', v)}
          min={0}
          max={20000}
          step={250}
          unit="€"
          icon={<Landmark className="w-4 h-4 text-cyan-500" />}
          tooltip="Quota iniziale una-tantum per l'attivazione del contratto (può essere anche 0 per offerte ad anticipo zero)."
        />

        <InputField
          label="Canone Mensile (IVA inclusa)"
          value={canoneMensileNlt}
          onChange={(v) => onChange('canoneMensileNlt', v)}
          min={100}
          max={3000}
          step={10}
          unit="€/m"
          icon={<CreditCard className="w-4 h-4 text-cyan-600" />}
          tooltip="Canone tutto compreso (bollo, assicurazione kasko/furto, manutenzione ordinaria e straordinaria, soccorso stradale)."
        />
      </div>

      {/* Condizioni Chilometriche & Penale Km Eccedenti */}
      <div className="bg-cyan-500/5 dark:bg-cyan-950/20 p-3.5 rounded-xl border border-cyan-200/60 dark:border-cyan-800/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-cyan-900 dark:text-cyan-200">
          <span className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Condizioni Chilometriche NLT
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Percorrenza stimata: <strong>{formatKm(kmAnnui)}/anno</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="Km Inclusi da Contratto"
            value={kmInclusiAnnuiNlt}
            onChange={(v) => onChange('kmInclusiAnnuiNlt', v)}
            min={5000}
            max={60000}
            step={2500}
            unit="km/a"
            icon={<Gauge className="w-3.5 h-3.5 text-cyan-500" />}
            tooltip="Chilometraggio annuo massimo previsto dall'offerta base di noleggio (default tipico: 10.000 km/anno)."
            subtitle={`Totale contrattuale: ${formatKm(summary.kmInclusiTotaliNlt)}`}
          />

          <InputField
            label="Costo Km Eccedenti"
            value={costoKmEccedenteNlt}
            onChange={(v) => onChange('costoKmEccedenteNlt', v)}
            min={0.01}
            max={0.50}
            step={0.01}
            unit="€/km"
            icon={<Coins className="w-3.5 h-3.5 text-amber-500" />}
            tooltip="Tariffa addebitata a conguaglio per ogni chilometro percorso oltre la soglia (es. 0,05 €/km = 5 centesimi a km)."
            subtitle={`${(costoKmEccedenteNlt * 100).toFixed(0)} cent/km`}
          />
        </div>

        {/* Avviso o rassicurazione sul conguaglio chilometrico */}
        {isEccedenza ? (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                Superamento soglia chilometrica: +{formatKm(summary.kmEccedentiTotaliNlt)} totali
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                Stai percorrendo {formatKm(kmAnnui)}/anno contro i {formatKm(kmInclusiAnnuiNlt)}/anno inclusi. Penale stimata:{' '}
                <strong>+{formatCurrency(summary.costoTotaleKmEccedentiNlt)}</strong> (+{formatCurrency(summary.costoTotaleKmEccedentiNlt / durataMesi)}/mese calcolata nel TCO totale).
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-300 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Chilometraggio entro la soglia contrattuale ({formatKm(kmAnnui)} ≤ {formatKm(kmInclusiAnnuiNlt)}/anno). Nessun costo di eccedenza.</span>
          </div>
        )}
      </div>

      {/* Recap rapido NLT */}
      <div className="bg-cyan-500/10 dark:bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-200 dark:border-cyan-800/50 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-cyan-900 dark:text-cyan-200">
          <span>Riepilogo Costi Noleggio</span>
          <span className="font-bold text-sm text-cyan-700 dark:text-cyan-300">{formatCurrency(summary.costoTotaleNlt)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
          <div>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">Totale canoni ({durataMesi} mesi):</span>
            <span className="font-medium">{formatCurrency(totaleCanoni)}</span>
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">Costo medio mensile reale:</span>
            <span className="font-medium">{formatCurrency(summary.costoMensileMedioNlt)}/m</span>
          </div>
        </div>

        <div className="pt-2 border-t border-cyan-200/60 dark:border-cyan-800/50">
          <p className="text-[11px] font-medium text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Nessun rischio di svalutazione dell'auto, rivendita o guasti meccanici imprevisti.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
