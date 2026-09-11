import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Settings, 
  User, 
  Activity, 
  Database,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { useHealth } from '../../hooks/useHealth';
import { env } from '../../config/env';

export default function Header() {
  const navigate = useNavigate();
  const { status, isConnected } = useHealth();
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-slate-900 bg-slate-950 px-6 flex justify-between items-center z-10">
      {/* Search / Context Indicator */}
      <div className="flex items-center gap-4">
        {/* Dynamic Health State badge */}
        <div 
          onClick={() => navigate('/settings')}
          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono select-none hover:border-slate-700 transition-colors"
        >
          <span className={`h-2 w-2 rounded-full ${
            env.useMockApi 
              ? 'bg-amber-500' 
              : isConnected 
                ? 'bg-emerald-500' 
                : 'bg-red-500 animate-pulse'
          }`}></span>
          <span className="text-slate-400">
            Backend: {env.useMockApi ? 'Demo Mode' : status}
          </span>
        </div>
      </div>

      {/* Utilities / Clock */}
      <div className="flex items-center gap-4">
        {/* Digital Time */}
        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          System Time: {time}
        </span>

        {/* Action icons */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 rounded-lg text-slate-450 hover:text-slate-200 hover:bg-slate-900/60 transition-all border border-transparent hover:border-slate-800"
            title="Settings"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
          
          <div className="h-8 w-px bg-slate-900 hidden sm:block"></div>
          
          {/* User profile cue */}
          <div className="flex items-center gap-2 pl-1 cursor-pointer">
            <div className="h-7 w-7 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <User className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-slate-350 hidden md:block">Clinical Investigator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
