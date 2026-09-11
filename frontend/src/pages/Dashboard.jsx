import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowRightLeft
} from 'lucide-react';
import { useHistory } from '../hooks/useHistory';
import { useHealth } from '../hooks/useHealth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { history } = useHistory();
  const { status: healthStatus } = useHealth();
  const [activePipelineStep, setActivePipelineStep] = useState(null);

  // Model Pipeline steps with explanations for the interactive component
  const pipelineSteps = [
    { id: 'input', label: 'Clinical Input', desc: 'Symptom selection and raw clinical narrative input.' },
    { id: 'preprocess', label: 'Preprocessing', desc: 'Tokenization, text normalization, and GAT node mapping.' },
    { id: 'bert', label: 'BioClinicalBERT', desc: 'Extracting rich clinical word and text-level embeddings.' },
    { id: 'graph', label: 'Clinical Graph', desc: 'Constructing Patient-to-Symptom bipartite node relations.' },
    { id: 'gat', label: 'GAT Conv', desc: 'Message passing via Graph Attention Network to learn topological features.' },
    { id: 'fusion', label: 'Feature Fusion', desc: 'Concatenating dense BERT text vectors with GAT node embeddings.' },
    { id: 'classifier', label: 'Classifier', desc: 'Feedforward softmax layer outputting raw disease probabilities.' },
    { id: 'calibration', label: 'Calibration', desc: 'Temperature Scaling scaling to align probabilities with real-world accuracy.' },
    { id: 'explainability', label: 'Explainability', desc: 'Calculating SHAP token attributions & GAT attention edge weights.' },
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
        {/* Model Status */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">Model Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-lg font-bold text-slate-100">Ready</span>
            </div>
          </div>
          <Shield className="h-8 w-8 text-slate-700" />
        </div>

        {/* Model Version */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 border-l-indigo-500">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">Model Version</span>
            <div className="text-lg font-bold text-slate-100 mt-1">v1.0</div>
          </div>
          <Layers className="h-8 w-8 text-slate-700" />
        </div>

        {/* Diseases */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 border-l-violet-500">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">Diseases</span>
            <div className="text-lg font-bold text-slate-100 mt-1">3 Classes</div>
          </div>
          <Brain className="h-8 w-8 text-slate-700" />
        </div>

        {/* Calibration */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 border-l-indigo-400">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">Calibration</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">Enabled</div>
          </div>
          <Sliders className="h-8 w-8 text-slate-700" />
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
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            item.confidence === 'High' 
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

              {/* Vertical flow map */}
              <div className="relative pl-6 space-y-3.5 border-l border-slate-800 ml-3 py-1">
                {pipelineSteps.map((step, idx) => (
                  <div 
                    key={step.id} 
                    className="relative cursor-pointer group"
                    onMouseEnter={() => setActivePipelineStep(step)}
                    onMouseLeave={() => setActivePipelineStep(null)}
                  >
                    {/* Node Dot */}
                    <div className="absolute -left-[30px] top-1 h-3.5 w-3.5 rounded-full bg-slate-950 border-2 border-slate-700 group-hover:border-indigo-400 transition-colors flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-800 group-hover:bg-indigo-400" />
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/40 group-hover:border-slate-700/60 group-hover:bg-slate-900/80 transition-all">
                      <div className="text-xs font-bold text-slate-300 group-hover:text-indigo-300 flex items-center justify-between">
                        <span>{step.label}</span>
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                ))}
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
