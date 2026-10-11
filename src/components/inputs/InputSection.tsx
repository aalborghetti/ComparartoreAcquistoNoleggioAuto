import React, { useState } from 'react';
import { Sliders, ShoppingCart, CarFront, KeyRound, RotateCcw, Sparkles } from 'lucide-react';
import type { CarCalculatorInputs, CalculatorSummary, PresetScenario } from '../../types/calculator';
import { GeneralInputs } from './GeneralInputs';
import { PurchaseInputs } from './PurchaseInputs';
import { UsedCarInputs } from './UsedCarInputs';
import { RentalInputs } from './RentalInputs';
import { PRESET_SCENARIOS } from '../../utils/presets';
import { ConfirmModal } from '../common/ConfirmModal';

interface InputSectionProps {
  inputs: CarCalculatorInputs;
  summary: CalculatorSummary;
  onUpdateInput: <K extends keyof CarCalculatorInputs>(field: K, value: CarCalculatorInputs[K]) => void;
  onLoadPreset: (presetId: string) => void;
  onReset: () => void;
}

type TabType = 'generali' | 'acquisto' | 'usato' | 'noleggio';

export const InputSection: React.FC<InputSectionProps> = ({
  inputs,
  summary,
  onUpdateInput,
  onLoadPreset,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('acquisto');
  const [pendingScenario, setPendingScenario] = useState<PresetScenario | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header Sezione Input con Presets rapidi */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Parametri di Calcolo
            </h2>
          </div>
          
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            title="Ripristina valori predefiniti"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Preset Car Models */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Scenari:
          </span>
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setPendingScenario(preset)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
            >
              {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs di navigazione (4 Tab: Generali, Nuovo, Usato, Noleggio) */}
      <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50 p-1.5 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('generali')}
          className={`flex items-center justify-center gap-1 py-2 px-1 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'generali'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Generali</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('acquisto')}
          className={`flex items-center justify-center gap-1 py-2 px-1 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'acquisto'
              ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Nuovo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('usato')}
          className={`flex items-center justify-center gap-1 py-2 px-1 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'usato'
              ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <CarFront className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Usato</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('noleggio')}
          className={`flex items-center justify-center gap-1 py-2 px-1 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'noleggio'
              ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">NLT</span>
        </button>
      </div>

      {/* Contenuto Tab */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
        {activeTab === 'generali' && (
          <GeneralInputs
            durataMesi={inputs.durataMesi}
            kmAnnui={inputs.kmAnnui}
            onChangeDurata={(val) => onUpdateInput('durataMesi', val)}
            onChangeKm={(val) => onUpdateInput('kmAnnui', val)}
          />
        )}

        {activeTab === 'acquisto' && (
          <PurchaseInputs
            prezzoAuto={inputs.prezzoAuto}
            anticipoAcquisto={inputs.anticipoAcquisto}
            tassoTaeg={inputs.tassoTaeg}
            assicurazioneAnnua={inputs.assicurazioneAnnua}
            bolloAnnuo={inputs.bolloAnnuo}
            manutenzioneAnnua={inputs.manutenzioneAnnua}
            valoreResiduoPercentuale={inputs.valoreResiduoPercentuale}
            rataFinanziamentoMensile={summary.rataFinanziamentoMensile}
            totaleInteressi={summary.totaleInteressiFinanziamento}
            onChange={onUpdateInput}
          />
        )}

        {activeTab === 'usato' && (
          <UsedCarInputs
            usatoPrezzoAuto={inputs.usatoPrezzoAuto}
            usatoAnticipoAcquisto={inputs.usatoAnticipoAcquisto}
            usatoTassoTaeg={inputs.usatoTassoTaeg}
            usatoAssicurazioneAnnua={inputs.usatoAssicurazioneAnnua}
            usatoBolloAnnuo={inputs.usatoBolloAnnuo}
            usatoManutenzioneAnnua={inputs.usatoManutenzioneAnnua}
            usatoValoreResiduoPercentuale={inputs.usatoValoreResiduoPercentuale}
            rataFinanziamentoMensile={summary.usatoRataFinanziamentoMensile}
            totaleInteressi={summary.usatoTotaleInteressiFinanziamento}
            onChange={onUpdateInput}
          />
        )}

        {activeTab === 'noleggio' && (
          <RentalInputs
            anticipoNlt={inputs.anticipoNlt}
            canoneMensileNlt={inputs.canoneMensileNlt}
            kmInclusiAnnuiNlt={inputs.kmInclusiAnnuiNlt}
            costoKmEccedenteNlt={inputs.costoKmEccedenteNlt}
            kmAnnui={inputs.kmAnnui}
            durataMesi={inputs.durataMesi}
            summary={summary}
            onChange={onUpdateInput}
          />
        )}
      </div>

      {/* Footer tab con navigazione rapida */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
        <span>Sezione attiva: <strong className="capitalize text-slate-800 dark:text-slate-200">{activeTab}</strong></span>
        <div className="flex gap-2">
          {activeTab === 'generali' && (
            <button type="button" onClick={() => setActiveTab('acquisto')} className="text-blue-600 dark:text-blue-400 hover:underline">
              Nuovo →
            </button>
          )}
          {activeTab === 'acquisto' && (
            <button type="button" onClick={() => setActiveTab('usato')} className="text-purple-600 dark:text-purple-400 hover:underline">
              Usato →
            </button>
          )}
          {activeTab === 'usato' && (
            <button type="button" onClick={() => setActiveTab('noleggio')} className="text-cyan-600 dark:text-cyan-400 hover:underline">
              NLT →
            </button>
          )}
          {activeTab === 'noleggio' && (
            <button type="button" onClick={() => setActiveTab('generali')} className="text-blue-600 dark:text-blue-400 hover:underline">
              Generali ↺
            </button>
          )}
        </div>
      </div>

      {/* Modal di Conferma Cambio Scenario */}
      <ConfirmModal
        isOpen={pendingScenario !== null}
        title="Attenzione: i dati modificati andranno persi"
        message="Selezionando questo scenario, tutti i valori attualmente inseriti o modificati nei form verranno sovrascritti con i parametri predefiniti."
        scenarioName={pendingScenario ? pendingScenario.name : undefined}
        confirmText="Continua e carica scenario"
        cancelText="Annulla"
        onConfirm={() => {
          if (pendingScenario) {
            onLoadPreset(pendingScenario.id);
            setPendingScenario(null);
          }
        }}
        onCancel={() => setPendingScenario(null)}
      />

      {/* Modal di Conferma Reset */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Ripristinare i parametri iniziali?"
        message="Tutte le modifiche apportate ai parametri verranno perse e ripristinate alla configurazione iniziale predefinita."
        confirmText="Ripristina valori"
        cancelText="Annulla"
        onConfirm={() => {
          onReset();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
