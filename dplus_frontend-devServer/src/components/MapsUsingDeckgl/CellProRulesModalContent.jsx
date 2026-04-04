import { useEffect, useState } from 'react';
import Api from '../../utils/api';
import { Urls } from '../../utils/url';

const FILTERS = ['All', 'Issues only', 'Warnings', 'OK only', 'Accessibility', 'Capacity', 'Mobility', 'Integrity', 'Quality'];

const statusColor = (s = '') => {
  const v = s.toLowerCase();
  if (v.includes('issue'))   return '#dc2626';
  if (v.includes('warning')) return '#d97706';
  if (v === 'ok')            return '#16a34a';
  return '#374151';
};

const categoryColor = (c = '') => {
  switch (c.toLowerCase()) {
    case 'capacity':      return '#7c3aed';
    case 'integrity':     return '#0891b2';
    case 'mobility':      return '#0d9488';
    case 'accessibility': return '#2563eb';
    case 'quality':       return '#be185d';
    default:              return '#374151';
  }
};

const CellProRulesModalContent = ({ cellId, cellName }) => {
  const [cellData, setCellData]         = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [date, setDate]                 = useState(new Date().toISOString().slice(0, 10));
  const [filter, setFilter]             = useState('All');

  // tech is derived from response data, not selected
  const techFromData = cellData.length > 0 ? [...new Set(cellData.map(r => r.tech).filter(Boolean))].join(', ') : '-';

  useEffect(() => { if (cellName || cellId) fetchCellProRules(); }, [cellName, cellId]);
  useEffect(() => { applyFilter(); }, [cellData, filter]);

  const fetchCellProRules = async (overrideDate) => {
    const useDate = overrideDate ?? date;
    setLoading(true); setError(null);
    try {
      const response = await Api.get({
        url: `${Urls.cell_pro_rules}?cell_name=${encodeURIComponent(cellName || cellId)}&date=${encodeURIComponent(useDate)}`,
        inst: 0,
      });
      if (response?.status === 200 && response.data?.data) {
        setCellData(response.data.data);
      } else {
        setCellData([]); setError('No data returned from API');
      }
    } catch (err) {
      setError('Error fetching data');
      if (import.meta.env.DEV) console.warn('[cell-pro-rules]', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (!cellData?.length) { setFilteredData([]); return; }
    if (filter === 'All')  { setFilteredData(cellData); return; }
    const n = filter.toLowerCase();
    setFilteredData(cellData.filter((row) => {
      if (n === 'issues only') return row.status?.toLowerCase().includes('issue');
      if (n === 'warnings')    return row.status?.toLowerCase().includes('warning');
      if (n === 'ok only')     return row.status?.toLowerCase() === 'ok';
      return row.category?.toLowerCase() === n;
    }));
  };

  const ok       = cellData.filter((r) => r.status?.toLowerCase() === 'ok').length;
  const issues   = cellData.filter((r) => r.status?.toLowerCase().includes('issue')).length;
  const warnings = cellData.filter((r) => r.status?.toLowerCase().includes('warning')).length;
  const total    = cellData.length;
  const health   = total ? Math.round((ok / total) * 100) : 0;

  const displayName = cellName || cellId || 'N/A';

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Row 1: Cell Name */}
      <div>
        <label className="block text-xs text-slate-500 uppercase tracking-wide mb-1">Cell Name</label>
        <input
          value={displayName}
          readOnly
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-slate-50 font-medium text-slate-800"
        />
      </div>

      {/* Row 2: Technology + Date + Submit */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-slate-500 uppercase tracking-wide mb-1">Technology</label>
          <input value={techFromData} readOnly className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-slate-50 text-slate-600 font-semibold text-center" />
        </div>
        <div className="flex-[2]">
          <label className="block text-xs text-slate-500 uppercase tracking-wide mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => fetchCellProRules(date)}
            className="px-5 py-2 text-white text-sm rounded font-semibold"
            style={{ background: '#1f2937' }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'Rules OK',     value: ok,            color: '#16a34a' },
          { label: 'Issues',       value: issues,        color: '#dc2626' },
          { label: 'Warnings',     value: warnings,      color: '#d97706' },
          { label: 'Total rules',  value: total,         color: '#1e293b' },
          { label: 'Health score', value: `${health}%`,  color: '#4f46e5' },
        ].map(({ label, value, color }) => (
          <div key={label} className="border rounded p-2 text-center bg-white shadow-sm">
            <div style={{ color }} className="text-xl font-bold leading-tight">{value}</div>
            <div className="text-[11px] text-slate-400 uppercase mt-1 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Separator */}
      <hr className="border-slate-200" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-500 font-semibold mr-1">Filter:</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="py-1 px-2.5 text-xs rounded border transition-colors"
            style={filter === f
              ? { background: '#1f2937', color: '#fff', borderColor: '#1f2937' }
              : { background: '#fff', color: '#374151', borderColor: '#d1d5db' }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded flex-1" style={{ minHeight: '120px' }}>
        <table className="min-w-full text-left text-xs">
          <thead className="sticky top-0" style={{ background: '#1f2937', color: '#fff' }}>
            <tr>
              <th className="px-3 py-2.5 font-semibold">Tech</th>
              <th className="px-3 py-2.5 font-semibold">Rule name</th>
              <th className="px-3 py-2.5 font-semibold">Category</th>
              <th className="px-3 py-2.5 font-semibold">Details</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
              <th className="px-3 py-2.5 font-semibold">Issues / remarks</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center text-slate-400 py-8 text-sm">Loading...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-slate-400 py-8 text-sm">{error || 'No records found.'}</td></tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-3 py-2 border-b border-slate-100 font-medium">{item.tech || item.technology || '-'}</td>
                  <td className="px-3 py-2 border-b border-slate-100">{item.rule_name || '-'}</td>
                  <td className="px-3 py-2 border-b border-slate-100 font-semibold" style={{ color: categoryColor(item.category) }}>{item.category || '-'}</td>
                  <td className="px-3 py-2 border-b border-slate-100">{item.details || '-'}</td>
                  <td className="px-3 py-2 border-b border-slate-100 font-semibold" style={{ color: statusColor(item.status) }}>{item.status || '-'}</td>
                  <td className="px-3 py-2 border-b border-slate-100 text-slate-600">{item.issues || item.remarks || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CellProRulesModalContent;
