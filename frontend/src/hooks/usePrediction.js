import { useState, useCallback } from 'react';
import { predictionApi } from '../api/predictionApi';

/**
 * Hook to manage submission, loading, and recovery of prediction runs.
 */
export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Submit a prediction request
  const submitPrediction = useCallback(async (requestData) => {
    setLoading(true);
    setError(null);
    try {
      // Validate inputs on the frontend first
      if (!requestData.clinical_text || requestData.clinical_text.trim().length < 10) {
        throw { status: 400, message: 'Please enter clinical information before analysis.' };
      }
      if (requestData.age === undefined || requestData.age === null || requestData.age < 0 || requestData.age > 120) {
        throw { status: 400, message: 'Please enter a valid age between 0 and 120.' };
      }
      if (requestData.symptoms.length === 0) {
        throw { status: 400, message: 'Please select at least one clinical symptom.' };
      }

      const response = await predictionApi.predict(requestData);
      
      // Merge input data with response so that Results page has access to patient details
      const completeResult = {
        ...response,
        patient_id: requestData.patient_id,
        age: requestData.age,
        gender: requestData.gender,
        symptoms: requestData.symptoms,
        vitals: requestData.vitals,
        clinical_text: requestData.clinical_text
      };

      // Save result to localStorage so it can be queried by ID
      const savedPredictions = JSON.parse(localStorage.getItem('clinai_predictions_data') || '{}');
      savedPredictions[response.request_id] = completeResult;
      localStorage.setItem('clinai_predictions_data', JSON.stringify(savedPredictions));

      setResult(completeResult);
      setLoading(false);
      return completeResult;
    } catch (err) {
      setLoading(false);
      const userMessage = err.message || 'Unable to complete the prediction. The prediction service may be temporarily unavailable. Please try again.';
      setError(userMessage);
      throw err;
    }
  }, []);

  // Retrieve details of a prediction by ID
  const getPredictionById = useCallback((id) => {
    try {
      const savedPredictions = JSON.parse(localStorage.getItem('clinai_predictions_data') || '{}');
      return savedPredictions[id] || null;
    } catch (e) {
      console.error('Failed to retrieve prediction detail', e);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    result,
    submitPrediction,
    getPredictionById
  };
}
