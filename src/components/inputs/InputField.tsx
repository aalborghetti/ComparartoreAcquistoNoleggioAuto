import React from 'react';
import { Tooltip } from '../common/Tooltip';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  showSlider?: boolean;
  sliderStep?: number;
  subtitle?: string;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100000,
  step = 1,
  unit,
  tooltip,
  icon,
  showSlider = false,
  sliderStep,
  subtitle,
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange(0);
      return;
    }
    const num = parseFloat(rawVal);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div
      className={`space-y-1.5 p-3.5 rounded-xl border transition-all ${
        disabled
          ? 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/50 opacity-60 cursor-not-allowed'
          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <label
          className={`text-xs font-semibold flex items-center gap-1.5 ${
            disabled ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {icon && (
            <span className={disabled ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}>
              {icon}
            </span>
          )}
          <span>{label}</span>
          {tooltip && <Tooltip content={tooltip} />}
        </label>
        {subtitle && (
          <span
            className={`text-[11px] font-medium ${
              disabled ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value === 0 ? '' : value}
          placeholder="0"
          disabled={disabled}
          onChange={handleInputChange}
          className={`w-full pl-3 pr-12 py-2 text-sm font-medium border rounded-lg transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            disabled
              ? 'bg-slate-100 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          }`}
        />
        {unit && (
          <div
            className={`absolute right-3 text-xs font-bold pointer-events-none ${
              disabled ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {unit}
          </div>
        )}
      </div>

      {showSlider && (
        <div className="pt-1.5">
          <input
            type="range"
            min={min}
            max={max}
            step={sliderStep || step}
            value={value}
            disabled={disabled}
            onChange={(e) => !disabled && onChange(parseFloat(e.target.value))}
            className={`w-full h-1.5 rounded-lg appearance-none ${
              disabled
                ? 'bg-slate-200/60 dark:bg-slate-800/50 cursor-not-allowed opacity-40'
                : 'bg-slate-200 dark:bg-slate-800 cursor-pointer'
            }`}
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            <span>{min} {unit}</span>
            <span>{max} {unit}</span>
          </div>
        </div>
      )}
    </div>
  );
};
