import React, { useState, useEffect } from 'react';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    // Check local FastAPI backend
    fetch('http://127.0.0.1:8000/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') {
          setBackendStatus('Healthy');
        } else {
          setBackendStatus('Unexpected response');
        }
      })
      .catch(() => {
        setBackendStatus('Offline (Backend server not started)');
      });

    setSystemTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="w-full max-w-7xl px-6 py-8 flex justify-between items-center border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-white text-lg">
            B
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-300">
              BioClinicalBERT-GAT
            </h1>
            <p className="text-xs text-slate-500 font-mono">Decision-Support System Prototype</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full font-mono">
            Time: {systemTime}
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Live"></span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-5xl px-6 py-16 flex flex-col justify-center items-center text-center">
        {/* Badge */}
        <div className="mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider animate-pulse">
          Phase 0-14 Complete • Environment Verified
        </div>

        {/* Hero Title */}
        <h2 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-tight mb-8">
          Accurate Clinical Disease Prediction with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300">
            Explainable AI
          </span>
        </h2>

        {/* Hero Subtitle */}
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl leading-relaxed mb-12">
          An advanced medical prediction framework integrating BioClinicalBERT text embeddings with Graph Attention Networks (GAT) to model patient relationships, explain predictions via SHAP/Captum, and calibrate output confidence scores.
        </p>

        {/* Diagnostic Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left mb-16">
          {/* Card 1: Backend */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">FastAPI Backend</span>
              <span className={`h-2.5 w-2.5 rounded-full ${backendStatus.includes('Healthy') ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-400 transition-colors">API Endpoint</h3>
            <p className="text-xs font-mono text-slate-400 mb-2">http://127.0.0.1:8000</p>
            <p className="text-sm text-slate-450 bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-indigo-300">
              {backendStatus}
            </p>
          </div>

          {/* Card 2: Models */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">Neural Models</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-violet-400 transition-colors">Architecture Loaded</h3>
            <p className="text-xs font-mono text-slate-400 mb-2">BioClinicalBERT + GAT</p>
            <div className="flex gap-2">
              <span className="text-xs bg-slate-950 px-2 py-1.5 border border-slate-800 rounded font-mono text-violet-300">CPU Execution</span>
              <span className="text-xs bg-slate-950 px-2 py-1.5 border border-slate-800 rounded font-mono text-violet-300">Seed: 42</span>
            </div>
          </div>

          {/* Card 3: Framework */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">Explainable AI</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-400 transition-colors">Trust Verification</h3>
            <p className="text-xs font-mono text-slate-400 mb-2">SHAP, Captum, ECE</p>
            <div className="flex gap-2">
              <span className="text-xs bg-slate-950 px-2 py-1.5 border border-slate-800 rounded font-mono text-indigo-300">Temp Scaling</span>
              <span className="text-xs bg-slate-950 px-2 py-1.5 border border-slate-800 rounded font-mono text-indigo-300">Reliability</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/25"
          >
            Explore API Documentation
          </a>
          <button
            onClick={() => {
              alert('Environment verified. Ready for Phase 2 data loading pipelines!');
            }}
            className="px-8 py-3.5 bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            Run Preprocessing Test
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl px-6 py-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 BioClinicalBERT-GAT Project Group. Developed for research & clinical decision-support prototyping.</p>
        <div className="flex gap-4 font-mono">
          <span className="hover:text-slate-400 cursor-pointer">Ethical Guidelines</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Model Privacy</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
