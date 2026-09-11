import React from 'react';
import { Layers } from 'lucide-react';
import ArchitectureDiagram from '../components/model/ArchitectureDiagram';
import ModelInfo from '../components/model/ModelInfo';

export default function Model() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider uppercase">
          <Layers className="h-4.5 w-4.5" />
          <span>Model Architecture Detail</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Model Pipeline Architecture
        </h1>
        <p className="text-slate-450 text-sm mt-1">
          Explore the neural layers, embedding vectors, and attention calculations powering the prediction engine.
        </p>
      </div>

      {/* Diagram container */}
      <div className="glass-panel p-5 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
          Network Topology Flow
        </h3>
        <ArchitectureDiagram />
      </div>

      {/* Model Spec details */}
      <ModelInfo />
    </div>
  );
}
