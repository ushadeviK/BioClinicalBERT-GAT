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
      </div>

      {/* Utilities / Clock */}
      <div className="flex items-center gap-4">
        {/* Digital Time */}
        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          System Time: {time}
        </span>

        {/* Action icons */}
        <div className="flex items-center gap-2.5">

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
