import React, { useState } from 'react';
import { 
  Printer, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  User, 
  Building2, 
  ShieldCheck, 
  FileCheck2,
  RefreshCw
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  testName: string;
  standard: string;
  tolerance: string;
  status: 'pass' | 'fail' | 'pending';
  measuredValue: string;
  notes: string;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  {
    id: 'c1',
    category: 'Daily Routine',
    testName: 'Detector Morning Blank Scan',
    standard: 'IAEA HHS No. 1 Section 3.1',
    tolerance: 'No blocked sinogram channels or crystal PMT drift',
    status: 'pass',
    measuredValue: 'Normal baseline profile',
    notes: 'All detector buckets verified within baseline'
  },
  {
    id: 'c2',
    category: 'Daily Routine',
    testName: 'Daily Integral Uniformity (IU)',
    standard: 'IAEA HHS No. 1 Section 3.2',
    tolerance: 'IU <= 5.0%',
    status: 'pass',
    measuredValue: '3.6%',
    notes: 'Ge-68 uniform cylinder'
  },
  {
    id: 'c3',
    category: 'Daily Routine',
    testName: 'Daily Differential Uniformity (DU)',
    standard: 'IAEA HHS No. 1 Section 3.2',
    tolerance: 'DU <= 3.5%',
    status: 'pass',
    measuredValue: '2.8%',
    notes: 'Within clinical threshold'
  },
  {
    id: 'c4',
    category: 'Daily Routine',
    testName: 'Gantry Alignment Laser Precision',
    standard: 'AAPM Report 108',
    tolerance: '<= +/- 1.0 mm axial/sagittal/coronal',
    status: 'pass',
    measuredValue: '0.5 mm offset',
    notes: 'Laser marks aligned with phantom markers'
  },
  {
    id: 'c5',
    category: 'Environmental & Hardware',
    testName: 'Gantry Room HVAC Temperature',
    standard: 'Vendor Specs (Siemens / GE / Philips)',
    tolerance: '20.0 - 22.0 °C (drift < 1.0 °C/hr)',
    status: 'pass',
    measuredValue: '21.2 °C',
    notes: 'Air conditioning functioning normally'
  },
  {
    id: 'c6',
    category: 'Environmental & Hardware',
    testName: 'Detector Gantry Relative Humidity',
    standard: 'Vendor Specifications',
    tolerance: '40% - 60% non-condensing',
    status: 'pass',
    measuredValue: '48%',
    notes: 'Normal operational humidity'
  },
  {
    id: 'c7',
    category: 'Weekly / Periodic',
    testName: 'Well Counter Cross-Calibration (SUV)',
    standard: 'AAPM Report 108 / NEMA NU 2',
    tolerance: 'Calibration Factor Error <= +/- 5.0%',
    status: 'pass',
    measuredValue: '+1.8%',
    notes: 'F-18 solution dose calibrator vs PET image counts'
  },
  {
    id: 'c8',
    category: 'Network & Compliance',
    testName: 'DICOM PACS & System Clock Sync',
    standard: 'IHE Radiology & Hospital Protocol',
    tolerance: 'Time clock drift <= 1.0 s against NTP',
    status: 'pass',
    measuredValue: 'Synchronized (0.2s drift)',
    notes: 'Critical for radiotracer decay calculation accuracy'
  }
];

export const QcChecklistGenerator: React.FC = () => {
  const [hospitalName, setHospitalName] = useState('University Medical Center - Nuclear Medicine');
  const [scannerModel, setScannerModel] = useState('Biograph Vision 600 / Discovery MI');
  const [technologistName, setTechnologistName] = useState('N. Nahari, M.Sc.');
  const [supervisingPhysicist, setSupervisingPhysicist] = useState('Dr. A. Karimian');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [frequencyFilter, setFrequencyFilter] = useState<'All' | 'Daily Routine' | 'Environmental & Hardware' | 'Weekly / Periodic'>('All');
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS);

  const handleStatusChange = (id: string, newStatus: 'pass' | 'fail' | 'pending') => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const handleValueChange = (id: string, value: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, measuredValue: value } : item));
  };

  const handleNotesChange = (id: string, notes: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, notes } : item));
  };

  const handleReset = () => {
    setItems(DEFAULT_ITEMS);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredItems = frequencyFilter === 'All' 
    ? items 
    : items.filter(item => item.category === frequencyFilter);

  const passCount = items.filter(i => i.status === 'pass').length;
  const failCount = items.filter(i => i.status === 'fail').length;

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden during Print) */}
      <div className="print:hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Clinical PET Quality Control Routine Checklist
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure parameters, record daily inspection values, and export an official hospital compliance log sheet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Values
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Form Inputs for Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Department / Hospital
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={e => setHospitalName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              PET/CT Scanner Unit
            </label>
            <input
              type="text"
              value={scannerModel}
              onChange={e => setScannerModel(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Performing Technologist
            </label>
            <input
              type="text"
              value={technologistName}
              onChange={e => setTechnologistName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Supervising Physicist
            </label>
            <input
              type="text"
              value={supervisingPhysicist}
              onChange={e => setSupervisingPhysicist(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Inspection Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2">Filter Category:</span>
          {(['All', 'Daily Routine', 'Environmental & Hardware', 'Weekly / Periodic'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFrequencyFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                frequencyFilter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{passCount} PASS</span>
            {failCount > 0 && (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{failCount} FAIL</span>
            )}
          </div>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:p-0 print:border-none print:shadow-none dark:bg-slate-900 dark:text-slate-100">
        {/* Hospital Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100">
                {hospitalName}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Department of Nuclear Medicine & PET/CT Molecular Imaging
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Quality Assurance Program & Compliance Log (IAEA HHS No. 1 / AAPM Report 108)
              </p>
            </div>
            <div className="text-right text-xs space-y-0.5">
              <div><span className="font-semibold">Scanner:</span> {scannerModel}</div>
              <div><span className="font-semibold">Date:</span> {date}</div>
              <div><span className="font-semibold">Technologist:</span> {technologistName}</div>
            </div>
          </div>
        </div>

        {/* Table of Tests */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <th className="py-2.5 px-3 font-semibold w-12 text-center">#</th>
                <th className="py-2.5 px-3 font-semibold">Test Parameter & Protocol</th>
                <th className="py-2.5 px-3 font-semibold">Standard Tolerance</th>
                <th className="py-2.5 px-3 font-semibold w-28">Measured</th>
                <th className="py-2.5 px-3 font-semibold w-24 text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold">Remarks & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{item.testName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.standard}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {item.tolerance}
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={item.measuredValue}
                      onChange={e => handleValueChange(item.id, e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono print:border-none print:p-0"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 print:hidden">
                      <button
                        onClick={() => handleStatusChange(item.id, 'pass')}
                        className={`p-1 rounded transition-colors ${
                          item.status === 'pass'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold'
                            : 'text-slate-400 hover:text-emerald-600'
                        }`}
                        title="Mark Pass"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'fail')}
                        className={`p-1 rounded transition-colors ${
                          item.status === 'fail'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 font-bold'
                            : 'text-slate-400 hover:text-rose-600'
                        }`}
                        title="Mark Fail"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Print Status Label */}
                    <div className="hidden print:block font-bold">
                      {item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : 'PENDING'}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={item.notes}
                      onChange={e => handleNotesChange(item.id, e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 print:border-none print:p-0"
                      placeholder="Enter technologist observation..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clinical Sign-off Footer */}
        <div className="mt-10 pt-6 border-t-2 border-slate-300 dark:border-slate-700 grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Performing Nuclear Medicine Technologist:
            </p>
            <div className="mt-8 border-b border-slate-400 dark:border-slate-600 pb-1">
              <span className="font-medium">{technologistName}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Signature / Date</p>
          </div>

          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Supervising Lead Medical Physicist:
            </p>
            <div className="mt-8 border-b border-slate-400 dark:border-slate-600 pb-1">
              <span className="font-medium">{supervisingPhysicist}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Verification & Approval Signature / Date</p>
          </div>
        </div>
      </div>
    </div>
  );
};
