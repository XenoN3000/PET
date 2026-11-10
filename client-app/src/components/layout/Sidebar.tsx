import React from 'react';
import { NavLink } from 'react-router-dom';
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
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const navItems: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/protocols', label: 'QC Protocols', icon: FileText },
    { to: '/labs', label: 'Interactive Labs', icon: FlaskConical },
    { to: '/ai-modern', label: 'AI & Denoising', icon: Cpu },
    { to: '/quizzes', label: 'Quizzes & Training', icon: HelpCircle },
  ];

  const quickCategories = [
    { name: 'Daily Routine', count: '1 protocol' },
    { name: 'Periodic / NEMA', count: '3 protocols' },
    { name: 'Annual Assessment', count: '1 protocol' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Navigation
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
                  <span>{item.label}</span>
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
            QC Frequency
          </p>
          <div className="space-y-1">
            {quickCategories.map((cat) => (
              <NavLink
                key={cat.name}
                to={`/protocols?filter=${encodeURIComponent(cat.name)}`}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cat.name}</span>
                </div>
                <span className="text-slate-400 text-[11px]">{cat.count}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Research Scope</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Based on medical physics standards: IAEA Human Health & NEMA NU 2 quality control.
        </p>
      </div>
    </aside>
  );
};
