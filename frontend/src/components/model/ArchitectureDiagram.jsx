import React, { useState } from 'react';
import { Layers, HelpCircle, Network, ArrowRight } from 'lucide-react';

export default function ArchitectureDiagram() {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Architecture blocks details for hover actions
  const nodes = [
    { id: 'text', label: 'Clinical Text', x: 20, y: 20, w: 90, h: 32, type: 'text', desc: 'Raw physician descriptions, symptoms transcripts, and clinical narrative files.' },
    { id: 'tok', label: 'Tokenizer', x: 130, y: 20, w: 90, h: 32, type: 'text', desc: 'Splits raw text strings into vocabulary tokens for BERT embedding lookups.' },
    { id: 'bert', label: 'BioClinicalBERT', x: 240, y: 20, w: 100, h: 32, type: 'text', desc: 'Transformer architecture pre-trained on MIMIC-III notes, outputting 768d token features.' },
    
    { id: 'graph', label: 'Clinical Graph', x: 20, y: 120, w: 90, h: 32, type: 'graph', desc: 'Constructed bipartite node connections linking Patient representations and Symptom indicators.' },
    { id: 'gat', label: 'GAT Conv', x: 130, y: 120, w: 90, h: 32, type: 'graph', desc: 'Graph Attention Network aggregating neighbor nodes with multi-head attention weights.' },
    { id: 'gemb', label: 'Graph Embed', x: 240, y: 120, w: 100, h: 32, type: 'graph', desc: 'Topological node vector representation (128 dimensions).' },

    { id: 'fusion', label: 'Feature Fusion', x: 360, y: 70, w: 100, h: 32, type: 'fusion', desc: 'Concatenates BERT NLP embeddings with GAT topological embeddings.' },
    { id: 'mlp', label: 'MLP Classifier', x: 480, y: 70, w: 90, h: 32, type: 'fusion', desc: 'Softmax classifier returning raw probability scores across diseases.' },
    { id: 'calib', label: 'ECE Calibration', x: 590, y: 70, w: 90, h: 32, type: 'fusion', desc: 'Temperature Scaling algorithm optimizing prediction credibility curves.' }
  ];

  return (
    <div className="space-y-4">
      {/* Diagram Canvas Container */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-900 p-4 overflow-x-auto">
        <svg 
          viewBox="0 0 710 180" 
          className="w-full min-w-[650px] h-auto select-none"
        >
          {/* Connector Arrows */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#475569" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#6366f1" />
            </marker>
          </defs>

          {/* Text Flow lines */}
          <path d="M 110 36 L 124 36" stroke="#475569" strokeWidth={1.5} markerEnd="url(#arrow)" />
          <path d="M 220 36 L 234 36" stroke="#475569" strokeWidth={1.5} markerEnd="url(#arrow)" />
          <path d="M 340 36 L 350 36 L 350 86 L 354 86" stroke="#475569" strokeWidth={1.5} markerEnd="url(#arrow)" />

          {/* Graph Flow lines */}
          <path d="M 110 136 L 124 136" stroke="#475569" strokeWidth={1.5} markerEnd="url(#arrow)" />
          <path d="M 220 136 L 234 136" stroke="#475569" strokeWidth={1.5} markerEnd="url(#arrow)" />
          <path d="M 340 136 L 350 136 L 350 86 L 354 86" stroke="#475569" strokeWidth={1.5} markerEnd="url(#arrow)" />

          {/* Fusion Flow lines */}
          <path d="M 460 86 L 474 86" stroke="#475569" strokeWidth={1.5} markerEnd="url(#arrow)" />
          <path d="M 570 86 L 584 86" stroke="#475569" strokeWidth={1.5} markerEnd="url(#arrow)" />

          {/* Nodes boxes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            
            // Dynamic theme selection
            const borderCol = node.type === 'text' 
              ? (isHovered ? 'stroke-indigo-400' : 'stroke-indigo-600/35') 
              : node.type === 'graph' 
                ? (isHovered ? 'stroke-violet-400' : 'stroke-violet-600/35')
                : (isHovered ? 'stroke-indigo-400' : 'stroke-slate-800');

            const fillCol = node.type === 'text'
              ? 'fill-indigo-900/40'
              : node.type === 'graph'
                ? 'fill-violet-900/40'
                : 'fill-slate-800/40';

            return (
              <g 
                key={node.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Box */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={6}
                  className={`${borderCol} ${fillCol} transition-colors duration-205`}
                  strokeWidth={1.5}
                />
                {/* Node Text Label */}
                <text
                  x={node.x + node.w / 2}
                  y={node.y + node.h / 2 + 4}
                  className={`text-[10px] font-bold font-mono text-center fill-slate-300 transition-colors ${
                    isHovered ? 'fill-white' : ''
                  }`}
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Description display box */}
      <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-lg text-xs font-mono text-slate-450 min-h-[64px] flex items-center justify-center">
        {hoveredNode ? (
          <div>
            <span className={`font-bold mr-1.5 uppercase ${
              hoveredNode.type === 'text' 
                ? 'text-indigo-400' 
                : hoveredNode.type === 'graph' 
                  ? 'text-violet-400' 
                  : 'text-indigo-300'
            }`}>
              {hoveredNode.label}:
            </span>
            <span>{hoveredNode.desc}</span>
          </div>
        ) : (
          <span className="text-slate-500 italic">
            Hover over pipeline nodes to read details about the network layers.
          </span>
        )}
      </div>
    </div>
  );
}
