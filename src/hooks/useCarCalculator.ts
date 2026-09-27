import { useState, useMemo } from 'react';
import type { CarCalculatorInputs, CalculatorSummary, MonthlyDataPoint } from '../types/calculator';
import { calculateCarTco } from '../utils/calculator';
import { DEFAULT_INPUTS, PRESET_SCENARIOS } from '../utils/presets';

export interface UseCarCalculatorReturn {
  inputs: CarCalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CarCalculatorInputs>>;
  updateInput: <K extends keyof CarCalculatorInputs>(field: K, value: CarCalculatorInputs[K]) => void;
  loadPreset: (presetId: string) => void;
  resetDefaults: () => void;
  monthlyData: MonthlyDataPoint[];
  summary: CalculatorSummary;
  costoCumulatoNltArray: number[];
  costoCumulatoAcquistoArray: number[];
}

export function useCarCalculator(initialInputs: CarCalculatorInputs = DEFAULT_INPUTS): UseCarCalculatorReturn {
  const [inputs, setInputs] = useState<CarCalculatorInputs>(initialInputs);

  const updateInput = <K extends keyof CarCalculatorInputs>(field: K, value: CarCalculatorInputs[K]) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadPreset = (presetId: string) => {
    const preset = PRESET_SCENARIOS.find(p => p.id === presetId);
    if (preset) {
      setInputs({ ...preset.inputs });
    }
  };

  const resetDefaults = () => {
    setInputs({ ...DEFAULT_INPUTS });
  };

  const { monthlyData, summary } = useMemo(() => {
    return calculateCarTco(inputs);
  }, [inputs]);

  const costoCumulatoNltArray = useMemo(() => {
    return monthlyData.map(d => d.nltCumulato);
  }, [monthlyData]);

  const costoCumulatoAcquistoArray = useMemo(() => {
    return monthlyData.map(d => d.acquistoCumulato);
  }, [monthlyData]);

  return {
    inputs,
    setInputs,
    updateInput,
    loadPreset,
    resetDefaults,
    monthlyData,
    summary,
    costoCumulatoNltArray,
    costoCumulatoAcquistoArray,
  };
}
