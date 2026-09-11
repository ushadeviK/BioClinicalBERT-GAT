import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ 
  content, 
  children, 
  position = 'top',
  className = "" 
}) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  return (
    <div className={`relative inline-block group ${className}`}>
      {children || <HelpCircle className="h-4 w-4 text-slate-500 hover:text-slate-350 cursor-help" />}
      
      {/* Tooltip Content Bubble */}
      <div className={`absolute hidden group-hover:block z-30 w-52 p-2 bg-slate-900 border border-slate-800 rounded shadow-xl text-[11px] leading-relaxed text-slate-300 font-mono ${positionClasses[position]}`}>
        {content}
      </div>
    </div>
  );
}
