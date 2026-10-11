import React from 'react';
import { Tag, Wallet, Percent, ShieldCheck, FileText, Wrench, TrendingDown, AlertCircle, Coins, Receipt, Lock } from 'lucide-react';
import { InputField } from './InputField';
import { formatCurrency } from '../../utils/formatters';
import type { CarCalculatorInputs, MetodoPagamento } from '../../types/calculator';

interface UsedCarInputsProps {
  metodoPagamentoUsato?: MetodoPagamento;
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
  metodoPagamentoUsato = 'finanziamento',
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
  const isFinanziamento = metodoPagamentoUsato !== 'tutto_subito';
  const importoFinanziato = isFinanziamento ? Math.max(0, usatoPrezzoAuto - usatoAnticipoAcquisto) : 0;
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

      {/* Selettore Modalità di Pagamento: Tutto Subito vs Finanziamento */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-purple-500" />
            <span>Modalità di Acquisto Auto Usata</span>
          </span>
          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
            {isFinanziamento ? 'Rate mensili con TAEG' : 'Saldato 100% all\'acquisto'}
          </span>
        </label>
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onChange('metodoPagamentoUsato', 'tutto_subito')}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              !isFinanziamento
                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Tutto subito</span>
          </button>

          <button
            type="button"
            onClick={() => onChange('metodoPagamentoUsato', 'finanziamento')}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              isFinanziamento
                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Finanziamento</span>
          </button>
        </div>
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
          subtitle={!isFinanziamento ? 'Saldato interamente subito' : undefined}
        />

        <InputField
          label="Anticipo Iniziale Usato"
          value={usatoAnticipoAcquisto}
          onChange={(v) => onChange('usatoAnticipoAcquisto', v)}
          min={0}
          max={usatoPrezzoAuto}
          step={500}
          unit="€"
          disabled={!isFinanziamento}
          icon={<Wallet className="w-4 h-4 text-purple-600" />}
          tooltip={isFinanziamento ? "Quota versata in contanti al momento dell'acquisto o permuta." : "Disabilitato: l'intero importo dell'auto usata viene saldato subito."}
          subtitle={
            !isFinanziamento
              ? 'Non applicabile (Tutto subito)'
              : usatoPrezzoAuto > 0
              ? `${((usatoAnticipoAcquisto / usatoPrezzoAuto) * 100).toFixed(0)}% del prezzo`
              : undefined
          }
        />
      </div>

      {/* Finanziamento Usato & TAEG */}
      <div
        className={`p-3.5 rounded-xl border transition-all space-y-3 ${
          isFinanziamento
            ? 'bg-purple-500/5 dark:bg-purple-950/20 border-purple-200/60 dark:border-purple-900/40'
            : 'bg-slate-100/60 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/40 opacity-70'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-purple-900 dark:text-purple-300">
          <span className="flex items-center gap-1.5">
            {!isFinanziamento && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>Finanziamento Auto Usata</span>
            {!isFinanziamento && (
              <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Disabilitato
              </span>
            )}
          </span>
          <span>
            {isFinanziamento ? `Da finanziare: ${formatCurrency(importoFinanziato)}` : 'Nessun debito / rate'}
          </span>
        </div>

        {!isFinanziamento && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            ℹ️ <strong>Pagamento Tutto Subito selezionato:</strong> l'auto usata viene saldata interamente all'acquisto. I parametri di finanziamento sono disabilitati (0 € di rate o interessi).
          </div>
        )}

        <InputField
          label="Tasso TAEG Usato"
          value={usatoTassoTaeg}
          onChange={(v) => onChange('usatoTassoTaeg', v)}
          min={0}
          max={20}
          step={0.1}
          unit="%"
          disabled={!isFinanziamento}
          icon={<Percent className="w-4 h-4 text-purple-500" />}
          tooltip={isFinanziamento ? "I finanziamenti per auto usate hanno tipicamente tassi lievemente superiori al nuovo (media 7-8%)." : "Disabilitato in modalità Tutto Subito."}
          showSlider
          subtitle={
            !isFinanziamento
              ? 'Disabilitato (0% interessi)'
              : importoFinanziato > 0
              ? `Rata: ~${formatCurrency(rataFinanziamentoMensile)}/mese`
              : 'Nessun importo da finanziare'
          }
        />

        {isFinanziamento && importoFinanziato > 0 && totaleInteressi > 0 && (
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
