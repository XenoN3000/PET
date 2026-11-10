import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';

interface AcceptanceBadgeProps {
  isPass: boolean;
  parameterName: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  comparisonOperator: string;
  toleranceDescription: string;
  remedialAction?: string;
}

export const AcceptanceBadge: React.FC<AcceptanceBadgeProps> = ({
  isPass,
  parameterName,
  currentValue,
  targetValue,
  unit,
  comparisonOperator,
  toleranceDescription,
  remedialAction
}) => {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isPass
        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
        : 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isPass ? (
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {parameterName}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Standard: {toleranceDescription}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            isPass
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
          }`}>
            {isPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>{isPass ? 'PASS' : 'FAIL'}</span>
          </span>
          <p className="text-xs font-mono font-bold mt-1 text-slate-700 dark:text-slate-200">
            {currentValue} {unit} <span className="text-slate-400 font-normal">({comparisonOperator} {targetValue} {unit})</span>
          </p>
        </div>
      </div>

      {!isPass && remedialAction && (
        <div className="mt-3 p-3 rounded-xl bg-red-100/70 dark:bg-red-900/30 text-red-900 dark:text-red-200 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          <div className="space-y-0.5">
            <span className="font-bold block">Recommended Remedial Action:</span>
            <p className="leading-relaxed">{remedialAction}</p>
          </div>
        </div>
      )}
    </div>
  );
};
