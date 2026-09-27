import React from 'react';
import { Tag, Wallet, Percent, ShieldCheck, FileText, Wrench, TrendingDown, AlertCircle } from 'lucide-react';
import { InputField } from './InputField';
import { formatCurrency } from '../../utils/formatters';
import type { CarCalculatorInputs } from '../../types/calculator';

interface UsedCarInputsProps {
  usatoPrezzoAuto: number;
  usatoAnticipoAcquisto: number;
  usatoTassoTaeg: number;
  usatoAssicurazioneAnnua: number;
  usatoBolloAnnuo: number;
  usatoManutenzioneAnnua: number;
  usatoValoreResiduoPercentuale: number;
  rataFinanziamentoMensile: number;
  totaleInteressi: number;
  onChange: <K extends keyof CarCalculatorInputs>(field: K, value: CarCalculatorInputs[K]) => void;
}

export const UsedCarInputs: React.FC<UsedCarInputsProps> = ({
  usatoPrezzoAuto,
  usatoAnticipoAcquisto,
  usatoTassoTaeg,
  usatoAssicurazioneAnnua,
  usatoBolloAnnuo,
  usatoManutenzioneAnnua,
  usatoValoreResiduoPercentuale,
  rataFinanziamentoMensile,
  totaleInteressi,
  onChange,
}) => {
  const importoFinanziato = Math.max(0, usatoPrezzoAuto - usatoAnticipoAcquisto);
  const valoreResiduoEuro = usatoPrezzoAuto * (usatoValoreResiduoPercentuale / 100);
  const costiGestioneAnnui = usatoAssicurazioneAnnua + usatoBolloAnnuo + usatoManutenzioneAnnua;

  return (
    <div className="space-y-3.5">
      {/* Banner Informativo Auto Usata */}
      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-200 dark:border-purple-800/50 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
        <span>
          <strong>Opzione Usato Garantito:</strong> Minore esborso di capitale e svalutazione più lenta, ma spese di manutenzione e tagliandi mediamente più elevate per usura componenti.
        </span>
      </div>

      {/* Prezzo e Anticipo Usato */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField
          label="Prezzo Acquisto Usato"
          value={usatoPrezzoAuto}
          onChange={(v) => onChange('usatoPrezzoAuto', v)}
          min={2000}
          max={150000}
          step={500}
          unit="€"
          icon={<Tag className="w-4 h-4 text-purple-500" />}
          tooltip="Prezzo di acquisto concordato dell'auto usata con voltura."
        />

        <InputField
          label="Anticipo Iniziale Usato"
          value={usatoAnticipoAcquisto}
          onChange={(v) => onChange('usatoAnticipoAcquisto', v)}
          min={0}
          max={usatoPrezzoAuto}
          step={500}
          unit="€"
          icon={<Wallet className="w-4 h-4 text-purple-600" />}
          tooltip="Quota versata in contanti al momento dell'acquisto o permuta."
          subtitle={usatoPrezzoAuto > 0 ? `${((usatoAnticipoAcquisto / usatoPrezzoAuto) * 100).toFixed(0)}% del prezzo` : undefined}
        />
      </div>

      {/* Finanziamento Usato & TAEG */}
      <div className="bg-purple-500/5 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-200/60 dark:border-purple-900/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-purple-900 dark:text-purple-300">
          <span>Finanziamento Auto Usata</span>
          <span>Da finanziare: {formatCurrency(importoFinanziato)}</span>
        </div>

        <InputField
          label="Tasso TAEG Usato"
          value={usatoTassoTaeg}
          onChange={(v) => onChange('usatoTassoTaeg', v)}
          min={0}
          max={20}
          step={0.1}
          unit="%"
          icon={<Percent className="w-4 h-4 text-purple-500" />}
          tooltip="I finanziamenti per auto usate hanno tipicamente tassi lievemente superiori al nuovo (media 7-8%)."
          showSlider
          subtitle={importoFinanziato > 0 ? `Rata: ~${formatCurrency(rataFinanziamentoMensile)}/mese` : 'Acquisto in contanti'}
        />

        {importoFinanziato > 0 && totaleInteressi > 0 && (
          <div className="text-[11px] text-purple-800/80 dark:text-purple-300/80 flex justify-between px-1">
            <span>Interessi passivi totali stimati:</span>
            <span className="font-semibold">{formatCurrency(totaleInteressi)}</span>
          </div>
        )}
      </div>

      {/* Costi Annuali di Gestione & Manutenzione Rimodulata */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Costi Operativi & Manutenzione Usato</span>
          <span className="text-slate-500 dark:text-slate-400 font-normal">
            Totale: {formatCurrency(costiGestioneAnnui)}/anno (~{formatCurrency(costiGestioneAnnui / 12)}/mese)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <InputField
            label="Assicurazione"
            value={usatoAssicurazioneAnnua}
            onChange={(v) => onChange('usatoAssicurazioneAnnua', v)}
            min={0}
            max={4000}
            step={50}
            unit="€/a"
            icon={<ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
            tooltip="RC Auto + garanzie accessorie parametrata al valore dell'usato."
          />

          <InputField
            label="Bollo Auto"
            value={usatoBolloAnnuo}
            onChange={(v) => onChange('usatoBolloAnnuo', v)}
            min={0}
            max={2000}
            step={20}
            unit="€/a"
            icon={<FileText className="w-3.5 h-3.5 text-indigo-500" />}
            tooltip="Tassa di possesso annuale regionale."
          />

          <InputField
            label="Manutenzione Maggiorata"
            value={usatoManutenzioneAnnua}
            onChange={(v) => onChange('usatoManutenzioneAnnua', v)}
            min={0}
            max={5000}
            step={50}
            unit="€/a"
            icon={<Wrench className="w-3.5 h-3.5 text-orange-500" />}
            tooltip="Manutenzione ordinaria e straordinaria più alta per via dell'usura (freni, frizione, sospensioni, cinghia, pneumatici)."
          />
        </div>
      </div>

      {/* Valore Residuo Stimato Usato */}
      <div className="pt-1">
        <InputField
          label="Valore Residuo Stimato a fine periodo"
          value={usatoValoreResiduoPercentuale}
          onChange={(v) => onChange('usatoValoreResiduoPercentuale', v)}
          min={5}
          max={70}
          step={1}
          unit="%"
          icon={<TrendingDown className="w-4 h-4 text-emerald-500" />}
          tooltip="Percentuale del prezzo pagato per l'usato recuperabile alla rivendita."
          showSlider
          subtitle={`Valore stimato: ${formatCurrency(valoreResiduoEuro)}`}
        />
      </div>
    </div>
  );
};
