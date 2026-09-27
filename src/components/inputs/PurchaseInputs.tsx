import React from 'react';
import { Tag, Wallet, Percent, ShieldCheck, FileText, Wrench, TrendingDown } from 'lucide-react';
import { InputField } from './InputField';
import { formatCurrency } from '../../utils/formatters';
import type { CarCalculatorInputs } from '../../types/calculator';

interface PurchaseInputsProps {
  prezzoAuto: number;
  anticipoAcquisto: number;
  tassoTaeg: number;
  assicurazioneAnnua: number;
  bolloAnnuo: number;
  manutenzioneAnnua: number;
  valoreResiduoPercentuale: number;
  rataFinanziamentoMensile: number;
  totaleInteressi: number;
  onChange: <K extends keyof CarCalculatorInputs>(field: K, value: CarCalculatorInputs[K]) => void;
}

export const PurchaseInputs: React.FC<PurchaseInputsProps> = ({
  prezzoAuto,
  anticipoAcquisto,
  tassoTaeg,
  assicurazioneAnnua,
  bolloAnnuo,
  manutenzioneAnnua,
  valoreResiduoPercentuale,
  rataFinanziamentoMensile,
  totaleInteressi,
  onChange,
}) => {
  const importoFinanziato = Math.max(0, prezzoAuto - anticipoAcquisto);
  const valoreResiduoEuro = prezzoAuto * (valoreResiduoPercentuale / 100);
  const costiGestioneAnnui = assicurazioneAnnua + bolloAnnuo + manutenzioneAnnua;

  return (
    <div className="space-y-3.5">
      {/* Prezzo e Finanziamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField
          label="Prezzo di Listino Auto"
          value={prezzoAuto}
          onChange={(v) => onChange('prezzoAuto', v)}
          min={5000}
          max={200000}
          step={500}
          unit="€"
          icon={<Tag className="w-4 h-4 text-amber-500" />}
          tooltip="Prezzo di acquisto concordato su strada (chiavi in mano)."
        />

        <InputField
          label="Anticipo Iniziale"
          value={anticipoAcquisto}
          onChange={(v) => onChange('anticipoAcquisto', v)}
          min={0}
          max={prezzoAuto}
          step={500}
          unit="€"
          icon={<Wallet className="w-4 h-4 text-amber-600" />}
          tooltip="Quota versata in contanti al momento dell'acquisto o permuta dell'usato."
          subtitle={prezzoAuto > 0 ? `${((anticipoAcquisto / prezzoAuto) * 100).toFixed(0)}% del prezzo` : undefined}
        />
      </div>

      {/* Finanziamento & Tasso TAEG */}
      <div className="bg-amber-500/5 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-300">
          <span>Dettagli Finanziamento</span>
          <span>Da finanziare: {formatCurrency(importoFinanziato)}</span>
        </div>

        <InputField
          label="Tasso TAEG"
          value={tassoTaeg}
          onChange={(v) => onChange('tassoTaeg', v)}
          min={0}
          max={20}
          step={0.1}
          unit="%"
          icon={<Percent className="w-4 h-4 text-amber-500" />}
          tooltip="Tasso Annuo Effettivo Globale che include interessi e spese accessorie di istruttoria."
          showSlider
          subtitle={importoFinanziato > 0 ? `Rata: ~${formatCurrency(rataFinanziamentoMensile)}/mese` : 'Acquisto in contanti'}
        />

        {importoFinanziato > 0 && totaleInteressi > 0 && (
          <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80 flex justify-between px-1">
            <span>Interessi passivi totali stimati:</span>
            <span className="font-semibold">{formatCurrency(totaleInteressi)}</span>
          </div>
        )}
      </div>

      {/* Costi Annuali di Gestione e Manutenzione */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Costi Operativi & Manutenzione</span>
          <span className="text-slate-500 dark:text-slate-400 font-normal">
            Totale: {formatCurrency(costiGestioneAnnui)}/anno (~{formatCurrency(costiGestioneAnnui / 12)}/mese)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <InputField
            label="Assicurazione"
            value={assicurazioneAnnua}
            onChange={(v) => onChange('assicurazioneAnnua', v)}
            min={0}
            max={5000}
            step={50}
            unit="€/a"
            icon={<ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
            tooltip="RC Auto + Incendio/Furto/Kasko annuale."
          />

          <InputField
            label="Bollo Auto"
            value={bolloAnnuo}
            onChange={(v) => onChange('bolloAnnuo', v)}
            min={0}
            max={2000}
            step={20}
            unit="€/a"
            icon={<FileText className="w-3.5 h-3.5 text-indigo-500" />}
            tooltip="Tassa automobilistica annuale regionale di possesso."
          />

          <InputField
            label="Manutenzione"
            value={manutenzioneAnnua}
            onChange={(v) => onChange('manutenzioneAnnua', v)}
            min={0}
            max={4000}
            step={50}
            unit="€/a"
            icon={<Wrench className="w-3.5 h-3.5 text-orange-500" />}
            tooltip="Tagliandi ordinari, cambio gomme stagionali, revisione e usura."
          />
        </div>
      </div>

      {/* Valore Residuo Stimato */}
      <div className="pt-1">
        <InputField
          label="Valore Residuo Stimato a fine periodo"
          value={valoreResiduoPercentuale}
          onChange={(v) => onChange('valoreResiduoPercentuale', v)}
          min={10}
          max={80}
          step={1}
          unit="%"
          icon={<TrendingDown className="w-4 h-4 text-emerald-500" />}
          tooltip="Percentuale del prezzo di listino a cui potrai rivendere l'auto a fine periodo (recupero di capitale)."
          showSlider
          subtitle={`Valore stimato: ${formatCurrency(valoreResiduoEuro)}`}
        />
      </div>
    </div>
  );
};
