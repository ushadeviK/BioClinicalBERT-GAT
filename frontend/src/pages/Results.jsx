import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BrainCircuit, 
  TrendingUp, 
  HelpCircle,
  FileText,
  Activity,
  Plus,
  User,
  Thermometer,
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import { usePrediction } from '../hooks/usePrediction';
import ProbabilityChart from '../components/prediction/ProbabilityChart';
import ConfidenceCard from '../components/prediction/ConfidenceCard';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPredictionById } = usePrediction();
  const [data, setData] = useState(null);

  useEffect(() => {
    const runResult = getPredictionById(id);
    if (runResult) {
      setData(runResult);
    }
  }, [id, getPredictionById]);

  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/25">
          <Activity className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Prediction Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested prediction run ID "{id}" was not found in your current session.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => navigate('/predict')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Start New Prediction
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { 
    prediction, probability, confidence, probabilities, 
    patient_id, age, gender, symptoms = [], vitals = {}
  } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>BACK</span>
      </button>

      {/* Main Results Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Result Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">
                Disease Prediction Output
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-indigo-400 mt-2 uppercase tracking-wide">
                {prediction}
              </h2>
            </div>

            {/* Probability summary */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-900 py-5">
              <div>
                <span className="text-slate-500 text-xs font-mono uppercase">Calibrated Probability</span>
                <div className="text-2xl font-black text-slate-100 mt-1">
                  {(probability * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-mono uppercase">Confidence Estimation</span>
                <div className="mt-1.5">
                  <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold font-mono uppercase tracking-wide border ${
                    confidence === 'High' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                  }`}>
                    {confidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions list */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/explainability/${id}`)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-600/15 active:scale-[0.98] transition-all"
              >
                <BrainCircuit className="h-4 w-4" />
                <span>Explainable AI (XAI)</span>
              </button>
              <button
                onClick={() => navigate('/model')}
                className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <FileText className="h-4 w-4" />
                <span>Model Pipeline</span>
              </button>
              <button
                onClick={() => navigate('/predict')}
                className="px-5 py-2.5 bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 active:scale-[0.98] transition-all ml-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Analyze New Case</span>
              </button>
            </div>
          </div>

          {/* Patient Profile & Clinical Summary */}
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-4">
              <div className="h-8 w-8 rounded bg-indigo-500/20 flex items-center justify-center">
                <User className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Patient Profile</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {patient_id || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="block text-[10px] text-slate-500 font-mono uppercase">Age / Gender</span>
                <span className="text-sm font-semibold text-slate-300 capitalize">{age ? `${age} yrs` : '-'} / {gender || '-'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-mono uppercase">SpO2</span>
                <span className="text-sm font-semibold text-slate-300">{vitals.spo2 ? `${vitals.spo2}%` : '-'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-mono uppercase">Temperature</span>
                <span className="text-sm font-semibold text-slate-300">{vitals.temperature ? `${vitals.temperature}°F` : '-'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-mono uppercase">Blood Pressure</span>
                <span className="text-sm font-semibold text-slate-300">{vitals.bloodPressure || '-'}</span>
              </div>
            </div>

            {symptoms.length > 0 && (
              <div className="pt-2">
                <span className="block text-[10px] text-slate-500 font-mono uppercase mb-2">Key Symptoms</span>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map(sym => (
                    <span key={sym} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Probabilities Chart */}
        <div>
          <div className="glass-panel p-5 rounded-xl h-full space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Probability Distribution
              </h3>
              <p className="text-slate-500 text-[10px] mt-0.5">
                Relative softmax probabilities scaled for classes
              </p>
            </div>
            
            <ProbabilityChart data={probabilities} />
          </div>
        </div>
      </div>
    </div>
  );
}
