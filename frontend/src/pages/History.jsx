import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Search, 
  Trash2, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  FileText
} from 'lucide-react';
import { useHistory } from '../hooks/useHistory';

export default function History() {
  const navigate = useNavigate();
  const { history, clearHistory } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConfidence, setFilterConfidence] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter history runs
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.prediction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterConfidence === 'All' || item.confidence === filterConfidence;
    return matchesSearch && matchesFilter;
  });

  // Calculate pagination boundaries
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear the recent predictions history list?')) {
      clearHistory();
      setCurrentPage(1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider uppercase">
            <Clock className="h-4.5 w-4.5" />
            <span>Archive logs</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Prediction History
          </h1>
          <p className="text-slate-450 text-sm mt-1">
            Browse, search, and recall previously analyzed patient evaluation logs.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-center px-4 py-2 text-xs border border-red-500/35 hover:border-red-500 bg-transparent hover:bg-red-500/10 text-red-400 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        /* Empty State */
        <div className="glass-panel p-12 text-center rounded-xl max-w-xl mx-auto space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Predictions Yet</h3>
            <p className="text-slate-500 text-sm mt-1">
              Start your first clinical analysis to populate this archive registry.
            </p>
          </div>
          <button
            onClick={() => navigate('/predict')}
            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-550 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 mx-auto active:scale-[0.98] transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Prediction</span>
          </button>
        </div>
      ) : (
        /* History logs table */
        <div className="glass-panel rounded-xl overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-900 bg-slate-950/20 flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search predictions (e.g. Asthma)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500/80 outline-none transition-colors"
              />
            </div>

            {/* Filter by confidence */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-[10px] text-slate-500 font-mono uppercase">Confidence:</span>
              <select
                value={filterConfidence}
                onChange={(e) => {
                  setFilterConfidence(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500/80 transition-colors"
              >
                <option value="All">All Levels</option>
                <option value="High">High Only</option>
                <option value="Medium">Medium Only</option>
                <option value="Low">Low Only</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/30 text-slate-500 font-mono text-[10px] uppercase">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Prediction Output</th>
                  <th className="p-4 font-semibold text-center">Probability</th>
                  <th className="p-4 font-semibold text-center">Confidence Level</th>
                  <th className="p-4 font-semibold">Model Pipeline</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="p-4 text-slate-400 text-xs font-mono">{item.date}</td>
                      <td className="p-4 font-bold text-slate-100 uppercase tracking-wide">{item.prediction}</td>
                      <td className="p-4 text-center font-semibold text-slate-300">
                        {(item.probability * 100).toFixed(1)}%
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider ${
                          item.confidence === 'High' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                        }`}>
                          {item.confidence}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-450">{item.model}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => navigate(`/results/${item.id}`)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline inline-flex items-center gap-1"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>View Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-xs text-slate-500 italic">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-900 bg-slate-950/20 flex justify-between items-center text-xs font-mono text-slate-500">
              <span>
                Showing page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
