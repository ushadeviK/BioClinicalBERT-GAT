import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, HelpCircle, FileText, Upload, Check, Trash2 } from 'lucide-react';
import SymptomSelector from './SymptomSelector';

export default function ClinicalForm({ onSubmit, loading, error }) {
  // Load draft from session storage
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem('clinai_form_draft');
      return draft ? JSON.parse(draft) : {};
    } catch { return {}; }
  };
  const draft = loadDraft();

  const [patientId, setPatientId] = useState(draft.patientId || '');
  const [age, setAge] = useState(draft.age || '');
  const [gender, setGender] = useState(draft.gender || '');
  const [illnessDuration, setIllnessDuration] = useState(draft.illnessDuration || '');
  const [illnessDurationUnit, setIllnessDurationUnit] = useState(draft.illnessDurationUnit || 'days');
  const [selectedSymptoms, setSelectedSymptoms] = useState(draft.selectedSymptoms || []);
  const [clinicalText, setClinicalText] = useState(draft.clinicalText || '');
  const [validationError, setValidationError] = useState('');

  // Vitals
  const [spo2, setSpo2] = useState(draft.spo2 || '');
  const [temperature, setTemperature] = useState(draft.temperature || '');
  const [bloodPressure, setBloodPressure] = useState(draft.bloodPressure || '');
  const [heartRate, setHeartRate] = useState(draft.heartRate || '');

  // Comorbidities
  const [diabetes, setDiabetes] = useState(draft.diabetes || false);
  const [hypertension, setHypertension] = useState(draft.hypertension || false);
  const [smoking, setSmoking] = useState(draft.smoking || false);
  const [heartDisease, setHeartDisease] = useState(draft.heartDisease || false);
  const [obesity, setObesity] = useState(draft.obesity || false);
  const [asthmaHistory, setAsthmaHistory] = useState(draft.asthmaHistory || false);
  const [alcohol, setAlcohol] = useState(draft.alcohol || false);
  const [thyroid, setThyroid] = useState(draft.thyroid || false);
  const [tbHistory, setTbHistory] = useState(draft.tbHistory || false);

  // Save to session storage whenever form changes
  useEffect(() => {
    const draftState = {
      patientId, age, gender, illnessDuration, illnessDurationUnit,
      selectedSymptoms, clinicalText,
      spo2, temperature, bloodPressure, heartRate,
      diabetes, hypertension, smoking, heartDisease, obesity, asthmaHistory, alcohol, thyroid, tbHistory
    };
    localStorage.setItem('clinai_form_draft', JSON.stringify(draftState));
  }, [patientId, age, gender, illnessDuration, illnessDurationUnit, selectedSymptoms, clinicalText, spo2, temperature, bloodPressure, heartRate, diabetes, hypertension, smoking, heartDisease, obesity, asthmaHistory, alcohol, thyroid, tbHistory]);


  // File Upload Demo State
  const [fileNames, setFileNames] = useState([]);
  const fileInputRef = useRef(null);


  // Submit handler with frontend validations
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!patientId.trim()) {
      setValidationError('Please enter a valid Patient ID or MRN.');
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      setValidationError('Please enter a valid age between 0 and 120.');
      return;
    }

    const parsedDuration = parseInt(illnessDuration, 10);
    let totalDays = 0;
    if (illnessDuration) {
      if (isNaN(parsedDuration) || parsedDuration < 0) {
        setValidationError('Please enter a valid number for illness duration.');
        return;
      }
      if (illnessDurationUnit === 'days') totalDays = parsedDuration;
      else if (illnessDurationUnit === 'weeks') totalDays = parsedDuration * 7;
      else if (illnessDurationUnit === 'months') totalDays = parsedDuration * 30;
      else if (illnessDurationUnit === 'years') totalDays = parsedDuration * 365;
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
      patient_id: patientId,
      age: parsedAge,
      gender,
      illness_duration_days: totalDays,
      symptoms: selectedSymptoms,
      clinical_text: clinicalText,
      vitals: { spo2, temperature, bloodPressure, heartRate },
      history: { 
        diabetes, hypertension, smoking,
        heartDisease, obesity, asthmaHistory, alcohol, thyroid, tbHistory 
      },
      has_file: fileNames.length > 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient ID */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Patient ID / MRN *
          </label>
          <input
            type="text"
            placeholder="e.g. MRN-849201"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:border-indigo-500/80 outline-none transition-colors"
          />
        </div>

        {/* Basic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Illness Duration
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="e.g. 5"
                value={illnessDuration}
                onChange={(e) => setIllnessDuration(e.target.value)}
                disabled={loading}
                className="w-1/2 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:border-indigo-500/80 outline-none transition-colors"
              />
              <select
                value={illnessDurationUnit}
                onChange={(e) => setIllnessDurationUnit(e.target.value)}
                disabled={loading}
                className="w-1/2 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:border-indigo-500/80 outline-none transition-colors"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vitals Section */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-800 pb-2">
            Vitals
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 font-mono uppercase">SpO2 (%)</label>
              <input type="number" placeholder="e.g. 98" value={spo2} onChange={(e) => setSpo2(e.target.value)} disabled={loading} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:border-indigo-500/80 outline-none transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 font-mono uppercase">Temp (°F)</label>
              <input type="number" step="0.1" placeholder="e.g. 98.6" value={temperature} onChange={(e) => setTemperature(e.target.value)} disabled={loading} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:border-indigo-500/80 outline-none transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 font-mono uppercase">BP (mmHg)</label>
              <input type="text" placeholder="e.g. 120/80" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} disabled={loading} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:border-indigo-500/80 outline-none transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 font-mono uppercase">Heart Rate</label>
              <input type="number" placeholder="e.g. 72" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} disabled={loading} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-650 focus:border-indigo-500/80 outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Past Medical History */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-800 pb-2">
            Comorbidities
          </label>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-2">
            <label className="flex items-center gap-2 cursor-pointer group w-[45%] sm:w-[30%]">
              <input type="checkbox" checked={diabetes} onChange={(e) => setDiabetes(e.target.checked)} disabled={loading} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">Diabetes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group w-[45%] sm:w-[30%]">
              <input type="checkbox" checked={hypertension} onChange={(e) => setHypertension(e.target.checked)} disabled={loading} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">Hypertension</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group w-[45%] sm:w-[30%]">
              <input type="checkbox" checked={smoking} onChange={(e) => setSmoking(e.target.checked)} disabled={loading} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">Smoking Habit</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group w-[45%] sm:w-[30%]">
              <input type="checkbox" checked={heartDisease} onChange={(e) => setHeartDisease(e.target.checked)} disabled={loading} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">Heart Disease</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group w-[45%] sm:w-[30%]">
              <input type="checkbox" checked={obesity} onChange={(e) => setObesity(e.target.checked)} disabled={loading} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">Obesity</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group w-[45%] sm:w-[30%]">
              <input type="checkbox" checked={asthmaHistory} onChange={(e) => setAsthmaHistory(e.target.checked)} disabled={loading} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">Asthma / COPD</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group w-[45%] sm:w-[30%]">
              <input type="checkbox" checked={alcohol} onChange={(e) => setAlcohol(e.target.checked)} disabled={loading} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">Alcoholism</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group w-[45%] sm:w-[30%]">
              <input type="checkbox" checked={tbHistory} onChange={(e) => setTbHistory(e.target.checked)} disabled={loading} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">TB History</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group w-[45%] sm:w-[30%]">
              <input type="checkbox" checked={thyroid} onChange={(e) => setThyroid(e.target.checked)} disabled={loading} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">Thyroid Disorder</span>
            </label>
          </div>
        </div>

        {/* Symptoms Selector */}
        <SymptomSelector 
          selectedSymptoms={selectedSymptoms} 
          setSelectedSymptoms={setSelectedSymptoms} 
        />

        {/* File Upload Option */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Medical Reports
          </label>
          <input 
            type="file" 
            multiple
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                if (e.target.files.length > 50) {
                  setValidationError('Maximum 50 files can be uploaded at once.');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                  return;
                }
                setValidationError(''); // Clear any previous error
                const names = Array.from(e.target.files).map(file => file.name);
                setFileNames(names);
              }
            }}
          />
          <div 
            onClick={() => {
              if (loading) return;
              if (fileNames.length > 0) {
                setFileNames([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
              } else {
                fileInputRef.current?.click();
              }
            }}
            className={`p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer group flex flex-col items-center justify-center text-center ${
              fileNames.length > 0 
                ? 'border-emerald-500/50 bg-emerald-500/5' 
                : 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/50'
            }`}
          >
            {fileNames.length > 0 ? (
              <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-200">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    {fileNames.length === 1 ? fileNames[0] : `${fileNames.length} files`} Attached
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Click to remove attachments</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  <Upload className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Upload Lab Reports (PDF/Text)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Click to browse (Max 50 files)</p>
                </div>
              </div>
            )}
          </div>
        </div>

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
