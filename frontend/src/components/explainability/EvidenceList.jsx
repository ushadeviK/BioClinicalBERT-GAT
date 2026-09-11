import React from 'react';

export default function EvidenceList({ evidence }) {
  if (!evidence || evidence.length === 0) {
    return (
      <div className="py-6 text-center text-xs font-mono text-slate-550 bg-slate-950/40 border border-slate-900 rounded-lg">
        Clinical evidence data unavailable.
      </div>
    );
  }

  // Find max importance to scale relative widths
  const maxImportance = Math.max(...evidence.map(e => e.importance), 1);

  return (
    <div className="space-y-4">
      {evidence.map((item, index) => {
        // Calculate relative percentage weight
        const percentage = Math.max(5, Math.min(100, (item.importance / maxImportance) * 100));
        
        return (
          <div key={index} className="space-y-1.5">
            {/* Feature Label and Weight Value */}
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-semibold text-slate-200 capitalize">
                {item.feature}
              </span>
              <span className="text-indigo-400 font-bold">
                {item.importance.toFixed(2)}
              </span>
            </div>
            
            {/* Horizontal Bar */}
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/60">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
