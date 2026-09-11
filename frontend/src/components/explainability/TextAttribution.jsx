import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function TextAttribution({ attributions }) {
  // If the backend does not provide token-level attribution data, show the warning
  if (!attributions || attributions.length === 0) {
    return (
      <div className="p-5 text-center bg-slate-900/30 border border-slate-900 rounded-lg space-y-2">
        <div className="flex justify-center">
          <AlertTriangle className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-xs font-mono text-slate-450 leading-relaxed max-w-sm mx-auto">
          Text-level explanation is not available for this prediction.
        </p>
        <p className="text-[10px] text-slate-600 font-mono italic max-w-xs mx-auto">
          Do not falsely represent ordinary BERT attention weights as a validated clinical explanation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-lg font-serif text-sm text-slate-200 leading-relaxed">
        {attributions.map((token, index) => {
          // Calculate opacity based on weight
          const weight = token.weight || 0;
          const bgOpacity = Math.min(0.8, weight);
          const fontColor = bgOpacity > 0.4 ? 'text-white' : 'text-slate-250';
          
          return (
            <span
              key={index}
              className={`relative inline-block mx-0.5 px-1 rounded transition-colors group cursor-help ${fontColor}`}
              style={{
                backgroundColor: weight > 0 ? `rgba(99, 102, 241, ${bgOpacity})` : 'transparent',
              }}
              title={`Importance: ${weight.toFixed(3)}`}
            >
              {token.word}
              
              {/* Micro Hover Attributor */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 border border-slate-800 text-[9px] font-mono text-indigo-300 py-0.5 px-1.5 rounded shadow-xl whitespace-nowrap z-10">
                Score: {weight.toFixed(3)}
              </span>
            </span>
          );
        })}
      </div>
      
      <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-5 bg-indigo-500/20 rounded border border-indigo-500/10"></span>
          <span>Low Importance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-5 bg-indigo-500/80 rounded border border-indigo-500/10"></span>
          <span>High Importance</span>
        </div>
      </div>
    </div>
  );
}
