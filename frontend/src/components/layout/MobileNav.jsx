import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  PlusCircle, 
  Clock, 
  Menu, 
  X,
  Info,
  Settings,
  Layers
} from 'lucide-react';

export default function MobileNav({ isOpen, setIsOpen }) {
  const primaryTabs = [
    { path: '/', label: 'Dash', icon: Activity },
    { path: '/predict', label: 'Predict', icon: PlusCircle },
    { path: '/history', label: 'History', icon: Clock },
  ];

  return (
    <>
      {/* Bottom Sticky Nav for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-t border-slate-900 flex sm:hidden items-center justify-around px-4 z-40">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 transition-all ${
                  isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium font-mono uppercase tracking-wider">{tab.label}</span>
            </NavLink>
          );
        })}
        
        {/* Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex flex-col items-center gap-1 py-1 transition-all ${
            isOpen ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="text-[10px] font-medium font-mono uppercase tracking-wider">Menu</span>
        </button>
      </div>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Sidebar Menu */}
      <div 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-950 border-r border-slate-900 z-50 transform transition-transform duration-300 ease-in-out sm:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full py-6 px-4 justify-between">
          <div>
            {/* Header branding */}
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm">
                C
              </div>
              <div>
                <h1 className="font-bold text-base text-slate-100">ClinAI</h1>
                <p className="text-[9px] text-slate-500 font-mono">BioClinicalBERT-GAT</p>
              </div>
            </div>

            {/* Links */}
            <nav className="mt-8 space-y-1">
              {[
                { path: '/', label: 'Dashboard', icon: Activity },
                { path: '/predict', label: 'Predict Disease', icon: PlusCircle },
                { path: '/history', label: 'Runs History', icon: Clock },
                { path: '/model', label: 'Model Pipeline', icon: Layers },
                { path: '/about', label: 'About Research', icon: Info },
                { path: '/settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
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
          </div>

          {/* Footer warning */}
          <div className="px-2 pt-4 border-t border-slate-900 text-[10px] text-slate-600 font-mono">
            <div>AI Prototype Sandbox</div>
            <div>Strictly Educational</div>
          </div>
        </div>
      </div>
    </>
  );
}
