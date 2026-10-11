import React from 'react';
import { Tag, Wallet, Percent, ShieldCheck, FileText, Wrench, TrendingDown, Coins, Receipt, Lock } from 'lucide-react';
import { InputField } from './InputField';
import { formatCurrency } from '../../utils/formatters';
import type { CarCalculatorInputs, MetodoPagamento } from '../../types/calculator';

interface PurchaseInputsProps {
  metodoPagamentoNuovo?: MetodoPagamento;
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
  metodoPagamentoNuovo = 'finanziamento',
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
  const isFinanziamento = metodoPagamentoNuovo !== 'tutto_subito';
  const importoFinanziato = isFinanziamento ? Math.max(0, prezzoAuto - anticipoAcquisto) : 0;
  const valoreResiduoEuro = prezzoAuto * (valoreResiduoPercentuale / 100);
  const costiGestioneAnnui = assicurazioneAnnua + bolloAnnuo + manutenzioneAnnua;

  return (
    <div className="space-y-3.5">
      {/* Selettore Modalità di Pagamento: Tutto Subito vs Finanziamento */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>Modalità di Acquisto Auto Nuova</span>
          </span>
          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
            {isFinanziamento ? 'Rate mensili con TAEG' : 'Saldato 100% all\'acquisto'}
          </span>
        </label>
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onChange('metodoPagamentoNuovo', 'tutto_subito')}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              !isFinanziamento
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Tutto subito</span>
          </button>

          <button
            type="button"
            onClick={() => onChange('metodoPagamentoNuovo', 'finanziamento')}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              isFinanziamento
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Finanziamento</span>
          </button>
        </div>
      </div>

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
          subtitle={!isFinanziamento ? 'Saldato interamente subito' : undefined}
        />

        <InputField
          label="Anticipo Iniziale"
          value={anticipoAcquisto}
          onChange={(v) => onChange('anticipoAcquisto', v)}
          min={0}
          max={prezzoAuto}
          step={500}
          unit="€"
          disabled={!isFinanziamento}
          icon={<Wallet className="w-4 h-4 text-amber-600" />}
          tooltip={isFinanziamento ? "Quota versata in contanti al momento dell'acquisto o permuta dell'usato." : "Disabilitato: l'intero importo dell'auto viene saldato subito."}
          subtitle={
            !isFinanziamento
              ? 'Non applicabile (Tutto subito)'
              : prezzoAuto > 0
              ? `${((anticipoAcquisto / prezzoAuto) * 100).toFixed(0)}% del prezzo`
              : undefined
          }
        />
      </div>

      {/* Finanziamento & Tasso TAEG */}
      <div
        className={`p-3.5 rounded-xl border transition-all space-y-3 ${
          isFinanziamento
            ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-900/40'
            : 'bg-slate-100/60 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/40 opacity-70'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-300">
          <span className="flex items-center gap-1.5">
            {!isFinanziamento && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>Dettagli Finanziamento</span>
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
            ℹ️ <strong>Pagamento Tutto Subito selezionato:</strong> l'auto viene saldata al 100% all'acquisto. I campi anticipo parziale, TAEG e rate mensili sono disabilitati (0 € di interessi bancari).
          </div>
        )}

        <InputField
          label="Tasso TAEG"
          value={tassoTaeg}
          onChange={(v) => onChange('tassoTaeg', v)}
          min={0}
          max={20}
          step={0.1}
          unit="%"
          disabled={!isFinanziamento}
          icon={<Percent className="w-4 h-4 text-amber-500" />}
          tooltip={isFinanziamento ? "Tasso Annuo Effettivo Globale che include interessi e spese accessorie di istruttoria." : "Disabilitato in modalità Tutto Subito."}
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
      <div className="pt-1 space-y-1.5">
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
        <div className="flex gap-1.5">
          {[25, 50, 75].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => onChange('valoreResiduoPercentuale', pct)}
              className={`flex-1 py-1 px-2 text-xs font-medium rounded-lg border transition-all ${
                valoreResiduoPercentuale === pct
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-700/50 shadow-sm font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{pct}%</span>
              <span className="text-[10px] opacity-75 hidden sm:inline ml-1">
                ({formatCurrency(prezzoAuto * (pct / 100))})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
