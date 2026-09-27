import { useState, useEffect } from 'react';

/**
 * Hook to manage recent prediction histories in a session-safe container.
 */
export function useHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem('clinai_prediction_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Populate default mock history if empty
        const initialMock = [
          {
            id: 'demo-1',
            date: '2026-08-29 14:32',
            patient_id: 'P-10204',
            age: 62,
            gender: 'Male',
            has_file: true,
            prediction: 'Pneumonia',
            probability: 0.914,
            confidence: 'High',
            model: 'BioClinicalBERT + GAT',
            status: 'Completed'
          },
          {
            id: 'demo-2',
            date: '2026-08-29 10:15',
            patient_id: 'P-10293',
            age: 24,
            gender: 'Female',
            has_file: false,
            prediction: 'Asthma',
            probability: 0.785,
            confidence: 'Medium',
            model: 'BioClinicalBERT + GAT',
            status: 'Completed'
          },
          {
            id: 'demo-3',
            date: '2026-08-28 16:45',
            patient_id: 'P-09384',
            age: 45,
            gender: 'Female',
            has_file: true,
            prediction: 'Migraine',
            probability: 0.892,
            confidence: 'High',
            model: 'BioClinicalBERT + GAT',
            status: 'Completed'
          }
        ];
        localStorage.setItem('clinai_prediction_history', JSON.stringify(initialMock));
        setHistory(initialMock);
      }
    } catch (e) {
      console.error('Failed to parse prediction history', e);
    }
  }, []);

  const addHistoryItem = (item) => {
    const newItem = {
      id: item.id || Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      patient_id: item.patient_id,
      age: item.age,
      gender: item.gender,
      has_file: item.has_file,
      symptoms: item.symptoms || [],
      vitals: item.vitals || {},
      prediction: item.prediction,
      probability: item.probability,
      confidence: item.confidence,
      model: item.model?.name || 'BioClinicalBERT + GAT',
      status: 'Completed',
      // We explicitly exclude clinical_text to comply with security requirements
    };
    
    setHistory((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('clinai_prediction_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save prediction history', e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem('clinai_prediction_history');
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear prediction history', e);
    }
  };

  const deleteHistoryItem = (id) => {
    setHistory((prev) => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('clinai_prediction_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete history item', e);
      }
      return updated;
    });
  };

  return {
    history,
    addHistoryItem,
    clearHistory,
    deleteHistoryItem
  };
}
