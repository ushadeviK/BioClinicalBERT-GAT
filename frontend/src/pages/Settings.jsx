import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Activity, 
  RefreshCw, 
  Database,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth';
import { env } from '../config/env';

export default function Settings() {
  const { status, details, isConnected, refetch } = useHealth();
  const [theme, setTheme] = useState('dark'); // ClinAI runs dark mode default

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider uppercase">
          <SettingsIcon className="h-4.5 w-4.5" />
          <span>System management</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Settings
        </h1>
        <p className="text-slate-450 text-sm mt-1">
          Monitor API connections, model status, and customize the prototype workspace.
        </p>
      </div>

      {/* API Connection Health Panel */}
      <div className="glass-panel p-6 rounded-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              API Server Configuration
            </h3>
            <p className="text-slate-500 text-[10px] mt-0.5">
              Status of connection to the FastAPI ML backend
            </p>
          </div>
          
          <button
            onClick={refetch}
            className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-xs"
            title="Recheck health connection"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Verify Connection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Status logs */}
          <div className="space-y-4 font-mono text-xs text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-905">
              <span>Endpoint Target</span>
              <span className="text-slate-250 font-semibold">{env.apiBaseUrl}</span>
            </div>
            
            <div className="flex justify-between py-1 border-b border-slate-905">
              <span>API Connection Status</span>
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`h-2 w-2 rounded-full ${
                  env.useMockApi 
                    ? 'bg-amber-500' 
                    : isConnected 
                      ? 'bg-emerald-500' 
                      : 'bg-red-500'
                }`}></span>
                <span className={
                  env.useMockApi 
                    ? 'text-amber-400' 
                    : isConnected 
                      ? 'text-emerald-400' 
                      : 'text-red-400'
                }>
                  {env.useMockApi ? 'Demo Mode (Mock API)' : status}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-1">
              <span>Calibration Server</span>
              <span className="text-slate-250 font-semibold">Online (ECE Scaler Ready)</span>
            </div>
          </div>

          {/* Model state details */}
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-900 text-xs font-mono text-slate-400 space-y-2">
            <span className="text-indigo-350 font-bold block uppercase tracking-wide">
              Backend Metadata
            </span>
            {details ? (
              <pre className="text-[10px] text-slate-500 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(details, null, 2)}
              </pre>
            ) : (
              <span className="text-slate-650 italic">
                No active details returned. Make sure FastAPI server at {env.apiBaseUrl} is online or set VITE_USE_MOCK_API=true.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Theme preferences */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Appearance Preferences
          </h3>
          <p className="text-slate-500 text-[10px] mt-0.5">
            Configure visual styling theme variables
          </p>
        </div>

        <div className="flex gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark (Default)', icon: Moon },
            { id: 'system', label: 'System', icon: Laptop },
          ].map((opt) => {
            const Icon = opt.icon;
            const active = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setTheme(opt.id);
                  if (opt.id === 'light') {
                    alert('ClinAI uses high-contrast dark theme optimized for diagnostic monitors. Light theme configuration is disabled on this research build.');
                    setTheme('dark');
                  }
                }}
                className={`flex-1 py-3 px-4 rounded-lg border text-xs font-medium font-mono flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  active 
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                    : 'bg-slate-900/40 border-slate-800 text-slate-450 hover:text-slate-300 hover:border-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
