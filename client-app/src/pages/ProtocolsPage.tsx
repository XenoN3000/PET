import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import type { QcProtocolDto, QcFrequency } from '../types/protocol';
import { Search, Filter, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const ProtocolsPage = () => {
  const [protocols, setProtocols] = useState<QcProtocolDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFrequency = searchParams.get('frequency') || 'All';

  useEffect(() => {
    apiService.getProtocols()
      .then(data => {
        setProtocols(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const frequencies: ('All' | QcFrequency)[] = ['All', 'Daily', 'Periodic', 'Annual'];

  const filtered = protocols.filter(p => {
    const matchesFreq = activeFrequency === 'All' || p.frequency.toLowerCase() === activeFrequency.toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.standard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFreq && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quality Control Protocols Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete clinical specifications, procedures, and tolerance criteria</p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search code, title, standard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
        {frequencies.map((freq) => (
          <button
            key={freq}
            onClick={() => {
              if (freq === 'All') {
                searchParams.delete('frequency');
              } else {
                searchParams.set('frequency', freq);
              }
              setSearchParams(searchParams);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFrequency.toLowerCase() === freq.toLowerCase()
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {freq}
          </button>
        ))}
      </div>

      {/* Protocols List */}
      {loading ? (
        <div className="p-16 text-center text-sm text-slate-400">Loading QC protocols catalog...</div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
          No QC protocols found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((protocol) => (
            <Link
              key={protocol.id}
              to={`/protocols/${protocol.id}`}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                    {protocol.code}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    protocol.frequency === 'Daily'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : protocol.frequency === 'Periodic'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                  }`}>
                    {protocol.frequency}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {protocol.standard}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {protocol.title}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
                  {protocol.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {protocol.phantom && (
                    <span><strong>Phantom:</strong> {protocol.phantom.name} ({protocol.phantom.recommendedIsotope})</span>
                  )}
                  <span><strong>Steps:</strong> {protocol.steps?.length || 0} stages</span>
                  <span><strong>Acceptance Criteria:</strong> {protocol.acceptanceCriteria?.length || 0} thresholds</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 shrink-0 group-hover:translate-x-1 transition-transform">
                <span>View Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
