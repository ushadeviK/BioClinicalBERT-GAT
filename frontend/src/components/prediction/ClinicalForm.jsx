import React, { useState } from 'react';
import { AlertCircle, HelpCircle, FileText } from 'lucide-react';
import SymptomSelector from './SymptomSelector';
import { PRESET_CASES } from '../../api/predictionApi';

export default function ClinicalForm({ onSubmit, loading, error }) {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [clinicalText, setClinicalText] = useState('');
  const [validationError, setValidationError] = useState('');

  // Load a demo preset case
  const loadPreset = (preset) => {
    setAge(preset.age);
    setGender(preset.gender);
    setSelectedSymptoms(preset.symptoms);
    setClinicalText(preset.clinical_text);
    setValidationError('');
  };

  // Submit handler with frontend validations
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      setValidationError('Please enter a valid age between 0 and 120.');
      return;
    }

    if (!gender) {
      setValidationError('Please select a gender option.');
      return;
    }

    if (selectedSymptoms.length === 0) {
      setValidationError('Please search and select at least one symptom.');
      return;
    }

    if (!clinicalText || clinicalText.trim().length < 10) {
      setValidationError('Please provide a clinical description (minimum 10 characters).');
      return;
    }

    if (clinicalText.length > 5000) {
      setValidationError('Clinical description exceeds maximum length of 5000 characters.');
      return;
    }

    // Submit valid data
    onSubmit({
      age: parsedAge,
      gender,
      symptoms: selectedSymptoms,
      clinical_text: clinicalText
    });
  };

  return (
    <div className="space-y-6">
      {/* Presets Selection */}
      <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-800/60 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-mono uppercase">
          <HelpCircle className="h-4 w-4 text-indigo-400" />
          <span>Demo Presets (Optional)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_CASES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(preset)}
              className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Age and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Patient Age *
            </label>
            <input
              type="number"
              placeholder="e.g. 45"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:border-indigo-500/80 outline-none transition-colors"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Patient Gender *
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:border-indigo-500/80 outline-none transition-colors"
            >
              <option value="">Select Gender...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Symptoms Selector */}
        <SymptomSelector 
          selectedSymptoms={selectedSymptoms} 
          setSelectedSymptoms={setSelectedSymptoms} 
        />

        {/* Clinical Text Description */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Clinical Narrative *
            </label>
            <span className="text-[10px] text-slate-500 font-mono">
              {clinicalText.length} / 5000 Chars
            </span>
          </div>
          <textarea
            rows={6}
            placeholder="Describe clinical findings, patient complaint history, physical examination notes..."
            value={clinicalText}
            onChange={(e) => setClinicalText(e.target.value)}
            disabled={loading}
            maxLength={5000}
            className="w-full px-3.5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:border-indigo-500/80 outline-none transition-colors resize-y min-h-[120px]"
          />
        </div>

        {/* Validation or API Errors */}
        {(validationError || error) && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <div>
              <p className="font-semibold">Validation Check failed</p>
              <p className="mt-0.5">{validationError || error}</p>
            </div>
          </div>
        )}

        {/* Submission Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition-all ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Analyzing Clinical Data...</span>
            </>
          ) : (
            <>
              <FileText className="h-4.5 w-4.5" />
              <span>Analyze Clinical Data</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
