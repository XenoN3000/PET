import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  FileText, 
  FlaskConical, 
  Cpu, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface NavItem {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { to: '/', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
    { to: '/protocols', labelKey: 'sidebar.protocols', icon: FileText },
    { to: '/labs', labelKey: 'sidebar.labs', icon: FlaskConical },
    { to: '/ai-modern', labelKey: 'sidebar.aiModern', icon: Cpu },
    { to: '/quizzes', labelKey: 'sidebar.quizzes', icon: HelpCircle },
  ];

  const quickCategories = [
    { name: t('sidebar.dailyRoutine'), filter: 'Daily' },
    { name: t('sidebar.periodicNema'), filter: 'Periodic' },
    { name: t('sidebar.annualAssessment'), filter: 'Annual' },
  ];

  return (
    <aside className="w-64 border-r rtl:border-r-0 rtl:border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            {t('sidebar.nav')}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{t(item.labelKey)}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            {t('sidebar.quickFilters')}
          </p>
          <div className="space-y-1">
            {quickCategories.map((cat) => (
              <NavLink
                key={cat.filter}
                to={`/protocols?frequency=${cat.filter}`}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cat.name}</span>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>IAEA & NEMA NU 2</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {t('navbar.subtitle')}
        </p>
      </div>
    </aside>
  );
};
