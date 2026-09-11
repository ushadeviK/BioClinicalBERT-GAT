import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 border border-transparent",
    secondary: "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-850",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 border border-transparent",
    outline: "bg-transparent border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4.5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 shrink-0"></span>
          <span>Processing...</span>
        </>
      ) : children}
    </button>
  );
}
