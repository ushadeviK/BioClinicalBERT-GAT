import React from 'react';
import { Settings, Shield, HelpCircle, Code } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export default function ModelInfo() {
  const specs = [
    { label: 'Model Architecture', value: 'BioClinicalBERT + Graph Attention Network (GAT)' },
    { label: 'Classification Classes', value: '3 Target Diseases (Pneumonia, Asthma, Migraine)' },
    { label: 'Embedding Vector Size', value: '768 Dimensions (BERT) + 128 Dimensions (GAT)' },
    { label: 'Graph Parameters', value: 'Bipartite relation graph, GAT Attention heads: 4' },
    { label: 'Confidence Calibration', value: 'Temperature Scaling (ECE Optimization)' },
    { label: 'Explainable AI methods', value: 'SHAP (Attribution) + Attention Edge Weights' },
    { label: 'Deep Learning Backend', value: 'PyTorch v2.1.2 + PyTorch Geometric' },
    { label: 'Training Hardware', value: 'Google Colab (Tesla T4 GPU)' }
  ];

  return (
    <div className="glass-panel p-5 rounded-xl space-y-4">
      <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
          <Code className="h-4 w-4 text-indigo-400" />
          <span>Technical Model Specifications</span>
        </h3>
        <Tooltip content="Official parameters of the BioClinicalBERT-GAT neural checkpoint." />
      </div>

      <div className="divide-y divide-slate-900">
        {specs.map((spec, idx) => (
          <div key={idx} className="py-2.5 flex justify-between gap-4 text-xs font-mono">
            <span className="text-slate-550">{spec.label}</span>
            <span className="text-slate-200 font-semibold text-right">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
