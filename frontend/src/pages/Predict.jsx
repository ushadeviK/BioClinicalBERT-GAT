import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import ClinicalForm from '../components/prediction/ClinicalForm';
import { usePrediction } from '../hooks/usePrediction';
import { useHistory } from '../hooks/useHistory';

export default function Predict() {
  const navigate = useNavigate();
  const { submitPrediction, loading, error } = usePrediction();
  const { addHistoryItem } = useHistory();

  const handleFormSubmit = async (formData) => {
    try {
      const response = await submitPrediction(formData);
      // Save item to recent runs history
      addHistoryItem({
        id: response.request_id,
        patient_id: formData.patient_id || 'Unknown',
        age: formData.age,
        gender: formData.gender,
        has_file: formData.has_file,
        symptoms: formData.symptoms,
        vitals: formData.vitals,
        prediction: response.prediction,
        probability: response.probability,
        confidence: response.confidence,
        model: response.model
      });
      
      // Clear the saved draft form data so next time user clicks predict, it's a fresh form
      localStorage.removeItem('clinai_form_draft');

      // Redirect to results view
      navigate(`/results/${response.request_id}`);
    } catch (err) {
      console.error('Prediction submission failed', err);
    }
  };
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider uppercase">
          <Activity className="h-4.5 w-4.5" />
          <span>Disease Prediction Interface</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Clinical Disease Prediction
        </h1>

        <p className="text-slate-450 text-sm mt-1">
          Enter clinical information and symptoms for AI-based research analysis.
        </p>
      </div>


      {/* Form Container */}
      <div className="glass-panel p-6 rounded-xl">
        <ClinicalForm onSubmit={handleFormSubmit} loading={loading} error={error} />
      </div>
    </div>
  );
}
