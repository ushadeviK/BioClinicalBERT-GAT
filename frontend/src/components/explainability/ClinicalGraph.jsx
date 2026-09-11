import React, { useState } from 'react';

export default function ClinicalGraph({ graphEvidence, prediction }) {
  const [selectedEdge, setSelectedEdge] = useState(null);

  if (!graphEvidence || graphEvidence.length === 0) {
    return (
      <div className="py-8 text-center text-xs font-mono text-slate-500 bg-slate-950/40 border border-slate-900 rounded-lg">
        Graph explanation unavailable for this prediction.
      </div>
    );
  }

  // Define SVG canvas layout details
  const width = 500;
  const height = 300;

  // Extract unique symptoms from edges
  const symptoms = Array.from(new Set(
    graphEvidence
      .filter(edge => edge.relation === 'has symptom')
      .map(edge => edge.target)
  ));

  // If no symptoms parsed, fall back to warning message
  if (symptoms.length === 0) {
    return (
      <div className="py-8 text-center text-xs font-mono text-slate-550 bg-slate-955 border border-slate-900 rounded-lg">
        Graph explanation unavailable for this prediction.
      </div>
    );
  }

  // Pre-calculate positions of elements in GAT bipartite structure
  const patientPos = { x: 60, y: height / 2 };
  const diseasePos = { x: 420, y: height / 2 };
  
  const symptomPositions = {};
  symptoms.forEach((symptom, idx) => {
    const spacing = height / (symptoms.length + 1);
    symptomPositions[symptom] = {
      x: 240,
      y: spacing * (idx + 1)
    };
  });

  // Collect visual edge lines to draw
  const edges = [];
  graphEvidence.forEach((edge, idx) => {
    let start = null;
    let end = null;

    if (edge.source === 'Patient') {
      start = patientPos;
      end = symptomPositions[edge.target];
    } else if (symptomPositions[edge.source] && edge.target === prediction) {
      start = symptomPositions[edge.source];
      end = diseasePos;
    } else if (symptomPositions[edge.source] && symptomPositions[edge.target]) {
      start = symptomPositions[edge.source];
      end = symptomPositions[edge.target];
    }

    if (start && end) {
      edges.push({
        id: idx,
        start,
        end,
        sourceLabel: edge.source,
        targetLabel: edge.target,
        relation: edge.relation,
        importance: edge.importance || 0.2
      });
    }
  });

  return (
    <div className="space-y-4">
      {/* SVG Canvas Container */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-900 p-4 overflow-x-auto">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full min-w-[450px] h-auto select-none"
        >
          {/* Edge Drawing Paths */}
          {edges.map((edge) => {
            const isHovered = selectedEdge?.id === edge.id;
            // Map weight to thickness
            const strokeWidth = edge.importance * 6;
            
            return (
              <g 
                key={edge.id}
                onMouseEnter={() => setSelectedEdge(edge)}
                onMouseLeave={() => setSelectedEdge(null)}
                className="cursor-pointer"
              >
                {/* Visual Line Shadow background */}
                <line
                  x1={edge.start.x}
                  y1={edge.start.y}
                  x2={edge.end.x}
                  y2={edge.end.y}
                  stroke={isHovered ? 'rgba(99, 102, 241, 0.4)' : 'rgba(51, 65, 85, 0.2)'}
                  strokeWidth={strokeWidth + 6}
                />
                
                {/* Active edge line */}
                <line
                  x1={edge.start.x}
                  y1={edge.start.y}
                  x2={edge.end.x}
                  y2={edge.end.y}
                  stroke={isHovered ? '#6366f1' : 'rgba(99, 102, 241, 0.5)'}
                  strokeWidth={strokeWidth}
                  className="transition-all"
                />

                {/* Animated signal pulse along the line */}
                <line
                  x1={edge.start.x}
                  y1={edge.start.y}
                  x2={edge.end.x}
                  y2={edge.end.y}
                  stroke="#818cf8"
                  strokeWidth={strokeWidth * 0.6}
                  className="animate-signal"
                  style={{ animationDuration: `${2.5 - edge.importance * 2}s` }}
                />
              </g>
            );
          })}

          {/* Node: Patient */}
          <g>
            <circle
              cx={patientPos.x}
              cy={patientPos.y}
              r={16}
              fill="#1e1b4b"
              stroke="#6366f1"
              strokeWidth={2}
            />
            <text
              x={patientPos.x}
              y={patientPos.y + 4}
              fill="#fff"
              textAnchor="middle"
              className="text-[10px] font-bold font-mono"
            >
              P
            </text>
            <text
              x={patientPos.x}
              y={patientPos.y + 30}
              fill="#94a3b8"
              textAnchor="middle"
              className="text-[10px] font-semibold font-mono"
            >
              Patient
            </text>
          </g>

          {/* Nodes: Symptoms */}
          {symptoms.map((symptom) => {
            const pos = symptomPositions[symptom];
            return (
              <g key={symptom}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={12}
                  fill="#020617"
                  stroke="#334155"
                  strokeWidth={1.5}
                />
                <text
                  x={pos.x}
                  y={pos.y + 20}
                  fill="#cbd5e1"
                  textAnchor="middle"
                  className="text-[9px] font-mono capitalize"
                >
                  {symptom}
                </text>
              </g>
            );
          })}

          {/* Node: Target Disease Prediction */}
          <g>
            <circle
              cx={diseasePos.x}
              cy={diseasePos.y}
              r={18}
              fill="#2e1065"
              stroke="#a78bfa"
              strokeWidth={2}
            />
            <text
              x={diseasePos.x}
              y={diseasePos.y + 4}
              fill="#fff"
              textAnchor="middle"
              className="text-[10px] font-bold font-mono"
            >
              D
            </text>
            <text
              x={diseasePos.x}
              y={diseasePos.y + 32}
              fill="#a78bfa"
              textAnchor="middle"
              className="text-[10px] font-bold font-mono uppercase"
            >
              {prediction}
            </text>
          </g>
        </svg>
      </div>

      {/* Dynamic Edge detail display */}
      <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-lg text-xs font-mono text-slate-450 min-h-[48px] flex items-center justify-center">
        {selectedEdge ? (
          <div>
            Edge: <span className="text-indigo-400 capitalize">{selectedEdge.sourceLabel}</span>
            {' '}&rarr;{' '}
            <span className="text-slate-400 italic">[{selectedEdge.relation}]</span>
            {' '}&rarr;{' '}
            <span className="text-violet-400 uppercase">{selectedEdge.targetLabel}</span>
            {' '}• Attention weight: <span className="text-emerald-400 font-bold">{selectedEdge.importance.toFixed(2)}</span>
          </div>
        ) : (
          <span className="text-slate-500 italic">
            Hover over edges to view GAT network attention parameters.
          </span>
        )}
      </div>
    </div>
  );
}
