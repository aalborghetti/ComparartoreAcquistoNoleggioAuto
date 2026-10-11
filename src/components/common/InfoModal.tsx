import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calculator, ShieldCheck, Scale, LineChart } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-5"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Metodologia di Calcolo & TCO (Total Cost of Ownership)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
              <Scale className="w-4 h-4 text-blue-500" />
              1. Come viene calcolato il Costo Totale Reale dell'Acquisto?
            </h4>
            <p>
              Nel caso di acquisto con finanziamento, il calcolo della rata mensile applica la formula matematica standard dell'<strong>Ammortamento alla Francese</strong> a rata costante sul capitale residuo al tasso TAEG specificato.
            </p>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg font-mono text-[11px] text-slate-800 dark:text-slate-200">
              Esborso Totale = Anticipo + (Rata x Mesi) + [(Assicurazione + Bollo + Manutenzione) / 12 x Mesi]
              <br />
              Costo Totale Reale (Net TCO) = Esborso Totale - Valore Residuo Veicolo
            </div>
            <p>
              Al termine del periodo di possesso, l'auto è un bene di tua proprietà con un valore commerciale. Vendendola o permutandola recuperi il <strong>Valore Residuo</strong>, che va quindi sottratto dall'esborso complessivo.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              2. Come viene calcolato il Noleggio a Lungo Termine (NLT)?
            </h4>
            <p>
              Il NLT è una formula "tutto compreso" che azzera i rischi di svalutazione e spese impreviste. Il costo è dato da:
            </p>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg font-mono text-[11px] text-slate-800 dark:text-slate-200">
              Costo Totale NLT = Anticipo + (Canone Mensile x Mesi) + (Km Eccedenti x Tariffa/km)
            </div>
            <p>
              Se i chilometri annui percorsi superano la soglia contrattuale inclusa (es. 10.000 km/anno), viene conteggiata e rateizzata la penale per i km eccedenti (es. 0,05 €/km = 5 cent/km).
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
              <LineChart className="w-4 h-4 text-emerald-500" />
              3. Cos'è il Break-Even Point (Punto di Pareggio)?
            </h4>
            <p>
              È il mese esatto in cui le curve dei costi cumulativi si incrociano sul grafico. Prima di quel mese risulta più economica un'opzione, dopo quel mese subentra l'altra.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Ho capito, torna al comparatore
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
