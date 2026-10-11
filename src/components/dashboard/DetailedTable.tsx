import React, { useState } from 'react';
import { Table, ChevronDown, ChevronUp } from 'lucide-react';
import type { MonthlyDataPoint } from '../../types/calculator';
import { formatCurrency } from '../../utils/formatters';

interface DetailedTableProps {
  data: MonthlyDataPoint[];
}

export const DetailedTable: React.FC<DetailedTableProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const lastIndex = data.length - 1;
  const filteredRows = data.filter((row, idx) => {
    if (idx === 0 || idx === lastIndex) return true;
    if (data.length > 40) return row.mese % 12 === 0;
    return row.mese % 6 === 0;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Tabella Dettaglio Avanzamento Temporale (Checkpoint Mese per Mese)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{isOpen ? 'Nascondi' : 'Mostra tabella'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 overflow-x-auto border-t border-slate-100 dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Mese</th>
                <th className="py-2.5 px-3 text-right">Auto Nuova (Netto)</th>
                <th className="py-2.5 px-3 text-right">Auto Usata (Netto)</th>
                <th className="py-2.5 px-3 text-right">Noleggio NLT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRows.map((row) => {
                const isFinal = row.mese === data[data.length - 1].mese;

                return (
                  <tr
                    key={row.mese}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                      isFinal ? 'font-bold bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-medium">
                      {row.label}
                      {isFinal && (
                        <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-blue-500 text-white font-semibold">
                          Fine
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-600 dark:text-amber-400">
                      {formatCurrency(row.acquistoNetto)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-purple-600 dark:text-purple-400">
                      {formatCurrency(row.usatoNetto)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(row.nltCumulato)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
