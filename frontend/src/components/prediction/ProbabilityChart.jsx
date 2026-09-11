import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

export default function ProbabilityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-sm font-mono text-slate-500 bg-slate-950/40 border border-slate-900 rounded-xl">
        Detailed class probabilities unavailable.
      </div>
    );
  }

  // Format data for chart display (probabilities to percentages)
  const chartData = data.map(item => ({
    name: item.disease,
    percentage: parseFloat((item.probability * 100).toFixed(1)),
    raw: item.probability
  })).sort((a, b) => b.percentage - a.percentage);

  // Custom tooltips inside the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded shadow-xl text-xs font-mono">
          <p className="font-bold text-slate-100">{payload[0].payload.name}</p>
          <p className="text-indigo-400 mt-0.5">Calibrated Prob: {payload[0].value}%</p>
        </div>
      );
    };
    return null;
  };

  return (
    <div className="w-full h-64 font-sans text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
        >
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            tickFormatter={(val) => `${val}%`}
            stroke="#475569" 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={{ stroke: '#1e293b' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#475569"
            tick={{ fill: '#f1f5f9', fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={{ stroke: '#1e293b' }}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(51, 65, 85, 0.15)' }} />
          <Bar 
            dataKey="percentage" 
            radius={[0, 4, 4, 0]}
            barSize={18}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? 'url(#primaryGrad)' : 'url(#secondaryGrad)'} 
              />
            ))}
          </Bar>
          
          {/* Custom linear gradients definition */}
          <defs>
            <linearGradient id="primaryGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="secondaryGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
