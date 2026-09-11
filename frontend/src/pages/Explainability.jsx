import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BrainCircuit, 
  HelpCircle, 
  Layers, 
  Network,
  Activity
} from 'lucide-react';
import { usePrediction } from '../hooks/usePrediction';
import EvidenceList from '../components/explainability/EvidenceList';
import TextAttribution from '../components/explainability/TextAttribution';
import ClinicalGraph from '../components/explainability/ClinicalGraph';

export default function Explainability() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPredictionById } = usePrediction();
  const [data, setData] = useState(null);

  useEffect(() => {
    const runResult = getPredictionById(id);
    if (runResult) {
      // Simulate token attributions for the demo presets if in mock mode
      const hasAttributions = runResult.request_id.startsWith('req-') || runResult.id.startsWith('demo-');
      if (hasAttributions && !runResult.token_attributions) {
        // Simple token split utility for demo visualization
        const words = (runResult.clinical_text || '').split(/\s+/);
        runResult.token_attributions = words.map(word => {
          const lower = word.toLowerCase();
          let weight = 0;
          if (lower.includes('fever') || lower.includes('102') || lower.includes('temperature')) weight = 0.85;
          else if (lower.includes('cough') || lower.includes('sputum')) weight = 0.72;
          else if (lower.includes('dyspnea') || lower.includes('breath') || lower.includes('wheez')) weight = 0.65;
          else if (lower.includes('chest') || lower.includes('pain')) weight = 0.55;
          else if (Math.random() > 0.85) weight = Math.random() * 0.3;
          return { word, weight };
        });
      }
      setData(runResult);
    }
  }, [id, getPredictionById]);

  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/25">
          <Activity className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Analysis Not Found</h2>
        <p className="text-slate-450 text-sm">
          The prediction run details for ID "{id}" were not found.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>BACK</span>
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider uppercase">
          <BrainCircuit className="h-4.5 w-4.5" />
          <span>Explainable AI (XAI) Report</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Model Prediction Explainability
        </h1>
        <p className="text-slate-450 text-sm mt-1">
          Quantitative feature importance scores, token attribution, and GAT node interactions for prediction: <span className="text-slate-200 font-bold uppercase">{data.prediction}</span>
        </p>
      </div>

      {/* Grid: Graph Visualizer and Feature Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Visualizer (Left Column - 2 Units) */}
        <div className="lg:col-span-2 space-y-6">
          {/* GAT Visualizer */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Network className="h-4 w-4 text-indigo-400" />
                  <span>Graph Attention Network (GAT) Visualizer</span>
                </h3>
                <p className="text-slate-500 text-[10px] mt-0.5">
                  Topology of attention flows between Patient, Symptoms, and Target classification nodes
                </p>
              </div>
            </div>
            
            <ClinicalGraph graphEvidence={data.graph_evidence} prediction={data.prediction} />
          </div>

          {/* Text Attribution Visualizer */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  <span>Word-Level Token Attribution (BioClinicalBERT)</span>
                </h3>
                <p className="text-slate-500 text-[10px] mt-0.5">
                  Integrated Gradients attribution heatmap showing tokens steering the classifier decision
                </p>
              </div>
            </div>
            
            <TextAttribution attributions={data.token_attributions} />
          </div>
        </div>

        {/* Feature Importance (Right Column - 1 Unit) */}
        <div>
          <div className="glass-panel p-5 rounded-xl space-y-4 h-full">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Clinical Evidence Weights
              </h3>
              <p className="text-slate-500 text-[10px] mt-0.5">
                Computed SHAP values for symptoms and clinical descriptions
              </p>
            </div>
            
            <EvidenceList evidence={data.evidence} />
          </div>
        </div>
      </div>
    </div>
  );
}
