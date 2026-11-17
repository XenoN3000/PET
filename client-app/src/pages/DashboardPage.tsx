import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { QcProtocolDto } from '../types/protocol';
import { 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const [protocols, setProtocols] = useState<QcProtocolDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiService.getProtocols(undefined, i18n.language)
      .then(data => {
        setProtocols(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [i18n.language]);

  const dailyCount = protocols.filter(p => p.frequency === 'Daily').length;
  const periodicCount = protocols.filter(p => p.frequency === 'Periodic' || p.frequency === 'Annual').length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-8 md:p-10 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('dashboard.heroBadge')}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t('dashboard.heroTitle')}
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-2xl">
            {t('dashboard.heroDesc')}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/protocols"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-xs md:text-sm shadow-md hover:bg-blue-50 transition-all cursor-pointer"
            >
              <span>{t('dashboard.exploreProtocols')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
            <Link
              to="/labs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs md:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <span>{t('dashboard.interactiveLabs')}</span>
            </Link>
            <Link
              to="/ai-modern"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs md:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <span>{t('dashboard.aiDenoising')}</span>
            </Link>
            <Link
              to="/quizzes"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs md:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <span>{t('dashboard.quizzesTraining')}</span>
            </Link>
          </div>
        </div>

        {/* Background decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-48 h-48 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dashboard.totalProtocols')}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{loading ? '...' : protocols.length}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> {t('dashboard.fullyDocumented')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dashboard.dailyRoutines')}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{loading ? '...' : dailyCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">{t('dashboard.preclinicalChecks')}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dashboard.nemaTests')}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{loading ? '...' : periodicCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">{t('dashboard.periodicAnnual')}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dashboard.aiDenoising')}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">AI & PVC</p>
            <p className="text-[11px] text-indigo-500 dark:text-indigo-400 mt-1">{t('navbar.standardBadge')}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* QC Protocols Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('protocols.title')}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('protocols.subtitle')}</p>
          </div>
          <Link
            to="/protocols"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{t('protocols.all')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">{t('dashboard.loading')}</div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {protocols.map((protocol) => (
              <Link
                key={protocol.id}
                to={`/protocols/${protocol.id}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {protocol.code}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      protocol.frequency === 'Daily'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : protocol.frequency === 'Periodic'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                    }`}>
                      {t(`protocols.${protocol.frequency.toLowerCase()}`, protocol.frequency)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {protocol.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {protocol.clinicalPurpose}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 truncate max-w-[180px]">{protocol.standard}</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                    <span>{t('protocols.viewDetails')}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
