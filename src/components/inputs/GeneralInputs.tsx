import React from 'react';
import { Calendar, Gauge } from 'lucide-react';
import { InputField } from './InputField';
import { formatKm } from '../../utils/formatters';

interface GeneralInputsProps {
  durataMesi: number;
  kmAnnui: number;
  onChangeDurata: (val: number) => void;
  onChangeKm: (val: number) => void;
}

export const GeneralInputs: React.FC<GeneralInputsProps> = ({
  durataMesi,
  kmAnnui,
  onChangeDurata,
  onChangeKm,
}) => {
  const quickDurations = [24, 36, 48, 60];
  const quickKms = [10000, 15000, 20000, 30000];

  return (
    <div className="space-y-4">
      {/* Durata in mesi */}
      <div className="space-y-2">
        <InputField
          label="Durata Contratto / Possesso"
          value={durataMesi}
          onChange={onChangeDurata}
          min={12}
          max={84}
          step={6}
          unit="mesi"
          icon={<Calendar className="w-4 h-4 text-blue-500" />}
          tooltip="La durata temporale su cui calcolare l'ammortamento del veicolo e i costi cumulativi."
          showSlider
          subtitle={`${(durataMesi / 12).toFixed(1)} anni`}
        />
        <div className="flex gap-1.5 pt-0.5">
          {quickDurations.map((months) => (
            <button
              key={months}
              type="button"
              onClick={() => onChangeDurata(months)}
              className={`flex-1 py-1 px-2 text-xs font-medium rounded-lg border transition-all ${
                durataMesi === months
                  ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-700/50 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {months} mesi ({months / 12}a)
            </button>
          ))}
        </div>
      </div>

      {/* Chilometri annui */}
      <div className="space-y-2">
        <InputField
          label="Chilometraggio Annuo"
          value={kmAnnui}
          onChange={onChangeKm}
          min={5000}
          max={60000}
          step={1000}
          sliderStep={2500}
          unit="km"
          icon={<Gauge className="w-4 h-4 text-emerald-500" />}
          tooltip="I km percorsi all'anno influenzano la svalutazione dell'auto, l'usura e la soglia contrattuale del noleggio."
          showSlider
          subtitle={`Totale: ${formatKm((kmAnnui / 12) * durataMesi)}`}
        />
        <div className="flex gap-1.5 pt-0.5">
          {quickKms.map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => onChangeKm(km)}
              className={`flex-1 py-1 px-2 text-xs font-medium rounded-lg border transition-all ${
                kmAnnui === km
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-700/50 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {km / 1000}k km
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
