import React from 'react';

export default function Badge({ 
  children, 
  variant = 'info', 
  className = "",
  ...props 
}) {
  const baseStyles = "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border";
  
  const variants = {
    info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-slate-900 text-slate-400 border-slate-800"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
