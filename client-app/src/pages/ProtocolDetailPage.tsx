import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { QcProtocolDto } from '../types/protocol';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sliders, 
  CheckSquare, 
  AlertTriangle, 
  AlertCircle,
  FileText,
  Radio
} from 'lucide-react';

export const ProtocolDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [protocol, setProtocol] = useState<QcProtocolDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiService.getProtocolById(id, i18n.language)
      .then(data => {
        setProtocol(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, i18n.language]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  if (loading) {
    return <div className="p-16 text-center text-sm text-slate-400">{t('dashboard.loading')}</div>;
  }

  if (error || !protocol) {
    return (
      <div className="space-y-4">
        <Link to="/protocols" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('protocolDetail.back')}</span>
        </Link>
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error || t('protocolDetail.notFound')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/protocols"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('protocolDetail.back')}</span>
        </Link>
      </div>

      {/* Protocol Header */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            {protocol.code}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            protocol.frequency === 'Daily'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              : protocol.frequency === 'Periodic'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
          }`}>
            {t(`protocols.${protocol.frequency.toLowerCase()}`, protocol.frequency)}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-2 rtl:ml-0 rtl:mr-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            {protocol.standard}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          {protocol.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {protocol.description}
        </p>
      </div>

      {/* Two Column Section: Clinical Purpose & Acquisition Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <FileText className="w-4 h-4" />
            <span>{t('protocolDetail.purpose')}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {protocol.clinicalPurpose}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Sliders className="w-4 h-4" />
            <span>{t('protocolDetail.parameters')}</span>
          </div>
          <p className="text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
            {protocol.acquisitionParameters}
          </p>
        </div>
      </div>

      {/* Phantom Specification */}
      {protocol.phantom && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
              <Radio className="w-4 h-4" />
              <span>{t('protocolDetail.phantomSetup')}</span>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900">
              {protocol.phantom.type}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="text-slate-400 block text-[11px] mb-1">{t('protocols.phantom')}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{protocol.phantom.name}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="text-slate-400 block text-[11px] mb-1">{t('protocolDetail.isotope')}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{protocol.phantom.recommendedIsotope}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="text-slate-400 block text-[11px] mb-1">{t('protocolDetail.activity')}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{protocol.phantom.activityLevel}</span>
            </div>
          </div>

          <div className="text-xs space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p><strong>{t('protocolDetail.dimensions')}:</strong> {protocol.phantom.dimensions}</p>
            <p><strong>{t('protocolDetail.preparation')}:</strong> {protocol.phantom.preparationInstructions}</p>
          </div>
        </div>
      )}

      {/* Step by Step Checklist */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <CheckSquare className="w-4 h-4" />
            <span>{t('protocolDetail.procedure')}</span>
          </div>
          <span className="text-xs text-slate-400">
            {Object.values(completedSteps).filter(Boolean).length} / {protocol.steps.length}
          </span>
        </div>

        <div className="space-y-3">
          {protocol.steps.map((step) => {
            const isDone = !!completedSteps[step.id];
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isDone 
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
                    : 'bg-slate-50/70 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleStep(step.id)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 pointer-events-none"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{step.stepNumber}</span>
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{step.title}</span>
                    {step.isCritical && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 uppercase tracking-wider">
                        {t('protocolDetail.critical')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.instruction}
                  </p>
                  {step.cautionNote && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{step.cautionNote}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acceptance Criteria Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('protocolDetail.acceptance')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3 px-3">{t('protocolDetail.paramName')}</th>
                <th className="pb-3 px-3">{t('protocolDetail.operatorCol')}</th>
                <th className="pb-3 px-3">{t('protocolDetail.operator')}</th>
                <th className="pb-3 px-3">{t('protocolDetail.tolerance')}</th>
                <th className="pb-3 px-3">{t('protocolDetail.remedyAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {protocol.acceptanceCriteria.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{c.parameterName}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{c.comparisonOperator}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">{c.targetValue} {c.unit}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{c.toleranceDescription}</td>
                  <td className="py-3 px-3 text-red-600 dark:text-red-400 font-medium">{c.remedialAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
