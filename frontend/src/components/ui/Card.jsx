import React from 'react';

export default function Card({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className = "", 
  headerClassName = "",
  ...props 
}) {
  return (
    <div className={`glass-panel rounded-xl p-5 ${className}`} {...props}>
      {(title || subtitle || actions) && (
        <div className={`flex items-start justify-between mb-4 border-b border-slate-900 pb-3 gap-4 ${headerClassName}`}>
          <div>
            {title && <h3 className="text-base font-bold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 font-mono mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
