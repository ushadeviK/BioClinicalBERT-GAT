import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Activity,
  Layers,
  Brain,
  Network,
  ChevronRight,
  ArrowRight,
  Shield,
  Sliders,
  CheckCircle,
  Database,
  ArrowRightLeft,
  FileText,
  Target
} from 'lucide-react';
import { useHistory } from '../hooks/useHistory';
import { useHealth } from '../hooks/useHealth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { history } = useHistory();
  const { status: healthStatus } = useHealth();
  const [activePipelineStep, setActivePipelineStep] = useState(null);

  const pieData = [
    { name: 'Pneumonia', value: 25, color: '#8b5cf6' },
    { name: 'Asthma', value: 18, color: '#3b82f6' },
    { name: 'Migraine', value: 15, color: '#10b981' },
    { name: 'Diabetes', value: 12, color: '#f59e0b' },
    { name: 'Hypertension', value: 10, color: '#ef4444' },
    { name: 'COVID-19', value: 8, color: '#ec4899' },
    { name: 'Anemia', value: 7, color: '#14b8a6' },
    { name: 'Bronchitis', value: 5, color: '#6366f1' },
  ];

  const lineData = [
    { name: 'Mon', predictions: 40 },
    { name: 'Tue', predictions: 65 },
    { name: 'Wed', predictions: 85 },
    { name: 'Thu', predictions: 55 },
    { name: 'Fri', predictions: 110 },
    { name: 'Sat', predictions: 124 },
    { name: 'Sun', predictions: 95 },
  ];

  // Model Pipeline steps with explanations for the interactive component
  const pipelineSteps = [
    { id: 'evidence', label: 'Clinical Evidence', desc: 'Raw patient narrative and observations.', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'bert', label: 'BioClinicalBERT', desc: 'Extracting semantic embeddings from text.', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'embeddings', label: 'Clinical Embeddings', desc: 'Dense vectors representing patient state.', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { id: 'gat', label: 'Graph Attention Network', desc: 'Message passing to learn relations.', icon: Network, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { id: 'prediction', label: 'Disease Prediction', desc: 'Softmax probabilities for output classes.', icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { id: 'xai', label: 'XAI + Confidence', desc: 'SHAP attributions and Temperature Scaling.', icon: Shield, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider uppercase">
          <Activity className="h-4.5 w-4.5 animate-pulse" />
          <span>Decision-Support Dashboard</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Clinical AI Dashboard
        </h1>
        <p className="text-slate-450 text-sm mt-1">
          BioClinicalBERT + GAT Explainable Disease Prediction
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Predictions */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">Total Predictions</span>
            <div className="text-lg font-bold text-slate-100 mt-1">124 <span className="text-xs text-slate-400 font-normal">Today</span></div>
          </div>
          <Activity className="h-8 w-8 text-slate-700" />
        </div>

        {/* Average Confidence */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">Avg Confidence</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">89.5%</div>
          </div>
          <Sliders className="h-8 w-8 text-slate-700" />
        </div>

        {/* Top Disease */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 border-l-violet-500">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">Top Disease</span>
            <div className="text-lg font-bold text-slate-100 mt-1">Pneumonia</div>
          </div>
          <Brain className="h-8 w-8 text-slate-700" />
        </div>

        {/* Model Accuracy */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 border-l-indigo-500">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">Test Accuracy</span>
            <div className="text-lg font-bold text-indigo-400 mt-1">94.2%</div>
          </div>
          <CheckCircle className="h-8 w-8 text-slate-700" />
        </div>
      </div>

      {/* Mini Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="glass-panel p-5 rounded-xl flex flex-row items-center justify-between">
          <div className="flex-[0.4]">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono mb-2 block">Disease Distribution</span>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex-[0.6] grid grid-cols-2 gap-x-2 gap-y-2.5 ml-4 pr-2">
             {pieData.map(d => (
               <div key={d.name} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-200">
                 <span className="w-2 h-2 rounded-full shadow-sm shrink-0" style={{backgroundColor: d.color}}></span>
                 <span className="truncate" title={d.name}>{d.name}</span> <span className="text-slate-400 font-mono ml-0.5">({d.value}%)</span>
               </div>
             ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="glass-panel p-5 rounded-xl">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono mb-2 block">Activity (Last 7 Days)</span>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line type="monotone" dataKey="predictions" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Prediction */}
          <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Brain className="h-32 w-32" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Quick Prediction</h2>
            <p className="text-slate-450 text-sm max-w-xl mb-6">
              Enter demographic information, clinical observations, and patient narratives to execute the calibrated disease prediction pipeline.
            </p>
            <button
              onClick={() => navigate('/predict')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all"
            >
              <span>Start New Prediction</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Recent Predictions */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Recent Predictions</h2>
              <button
                onClick={() => navigate('/history')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View All History</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500 text-sm">No predictions yet.</p>
                <button
                  onClick={() => navigate('/predict')}
                  className="mt-3 text-xs text-indigo-400 hover:underline"
                >
                  Start your first clinical analysis
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs uppercase">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Prediction</th>
                      <th className="pb-3 font-semibold text-center">Confidence</th>
                      <th className="pb-3 font-semibold text-center">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {history.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3.5 text-slate-400 text-xs font-mono">{item.date}</td>
                        <td className="py-3.5 font-semibold text-slate-100">{item.prediction}</td>
                        <td className="py-3.5 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${item.confidence === 'High'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                            {item.confidence} ({(item.probability * 100).toFixed(1)}%)
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => navigate(`/results/${item.id}`)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
                          >
                            View Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column - Model Pipeline */}
        <div>
          <div className="glass-panel p-6 rounded-xl h-full flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Model Pipeline</h2>
              <p className="text-slate-450 text-xs mb-4">
                Interactive diagram representing our hybrid NLP + Graph Network decision support architecture.
              </p>

              {/* Grid flow map */}
              <div className="grid grid-cols-3 gap-y-6 gap-x-2 relative mt-8 mb-2">
                {pipelineSteps.map((step, idx) => {
                  const isLastInRow = (idx + 1) % 3 === 0;
                  const isLast = idx === pipelineSteps.length - 1;
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className="relative cursor-pointer group flex flex-col items-center text-center"
                      onMouseEnter={() => setActivePipelineStep(step)}
                      onMouseLeave={() => setActivePipelineStep(null)}
                    >
                      {/* Icon Circle */}
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all z-10 border ${step.bg} ${step.border} ${step.color}
                      ${activePipelineStep?.id === step.id ? 'ring-2 ring-indigo-400 scale-110' : ''}
                    `}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Arrow to next item */}
                      {!isLastInRow && !isLast && (
                        <div className="absolute top-4 left-[65%] w-[70%] flex items-center justify-center text-slate-600">
                          <ArrowRight className={`h-4 w-4 transition-colors ${activePipelineStep?.id === step.id ? 'text-indigo-400' : ''}`} />
                        </div>
                      )}

                      <div className="mt-3 px-1">
                        <span className={`text-[11px] font-bold leading-tight block transition-colors
                        ${activePipelineStep?.id === step.id ? 'text-indigo-300' : 'text-slate-300'}
                      `}>
                          {step.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pipeline Step Detail display */}
            <div className="mt-4 p-3.5 rounded-lg bg-slate-950/60 border border-slate-900 text-xs font-mono text-slate-400 min-h-[90px]">
              {activePipelineStep ? (
                <>
                  <span className="text-indigo-300 font-bold uppercase tracking-wider block mb-1">
                    {activePipelineStep.label}
                  </span>
                  <span>{activePipelineStep.desc}</span>
                </>
              ) : (
                <span className="text-slate-500 italic block text-center py-4">
                  Hover over pipeline steps to explore the BioClinicalBERT-GAT workflow phases.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
