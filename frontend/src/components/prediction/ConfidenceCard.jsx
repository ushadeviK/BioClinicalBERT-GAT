import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export default function ConfidenceCard({ calibration, confidence, probability }) {
  const percentProb = (probability * 100).toFixed(1);
  const rawProb = calibration?.raw_probability 
    ? (calibration.raw_probability * 100).toFixed(1) 
    : null;

  return (
    <div className="glass-panel p-5 rounded-xl border-l-4 border-l-indigo-400 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Confidence Calibration
          </h3>
        </div>
        
        {/* Tooltip help bubble */}
        <Tooltip content="Confidence represents the model's calibrated prediction probability. It should not be interpreted as medical certainty." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Prob */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase">Calibrated Probability</span>
          <div className="text-2xl font-black text-slate-100">{percentProb}%</div>
          {rawProb && (
            <span className="text-[10px] text-slate-500 font-mono">
              Raw: {rawProb}%
            </span>
          )}
        </div>

        {/* Level */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase">Confidence Level</span>
          <div className="mt-0.5">
            <span className={`inline-flex px-2.5 py-1 rounded text-xs font-bold font-mono tracking-wider ${
              confidence === 'High' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                : confidence === 'Medium' 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/25'
            }`}>
              {confidence || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Method */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase">Calibration Method</span>
          <div className="text-sm font-bold text-slate-300 mt-1">
            {calibration?.method || 'Temperature Scaling'}
          </div>
        </div>
      </div>
    </div>
  );
}
