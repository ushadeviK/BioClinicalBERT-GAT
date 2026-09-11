import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  PlusCircle, 
  Clock, 
  Layers, 
  Info, 
  Settings,
  BrainCircuit
} from 'lucide-react';

export default function Sidebar({ className = "" }) {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Activity },
    { path: '/predict', label: 'Predict', icon: PlusCircle },
    { path: '/history', label: 'History', icon: Clock },
    { path: '/model', label: 'Model Info', icon: Layers },
    { path: '/about', label: 'About', icon: Info },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between py-6 ${className}`}>
      {/* Brand Header */}
      <div className="px-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-white text-base">
            C
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-lg text-slate-100 flex items-center gap-1">
              ClinAI
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-tight">BioClinicalBERT-GAT</p>
          </div>
        </div>

        {/* Prototype Warning Badge */}
        <div className="mt-4 px-2.5 py-1 rounded bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono inline-block">
          AI Research Prototype
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-8 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/40'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="px-6 border-t border-slate-900 pt-4 text-[10px] text-slate-600 font-mono">
        <div>Version 1.0.0</div>
        <div>PyTorch CUDA 11.8</div>
      </div>
    </aside>
  );
}
