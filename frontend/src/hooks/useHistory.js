import { useState, useEffect } from 'react';

/**
 * Hook to manage recent prediction histories in a session-safe container.
 */
export function useHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load from sessionStorage
    try {
      const stored = sessionStorage.getItem('clinai_prediction_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Populate default mock history if empty
        const initialMock = [
          {
            id: 'demo-1',
            date: '2026-08-29 14:32',
            prediction: 'Pneumonia',
            probability: 0.914,
            confidence: 'High',
            model: 'BioClinicalBERT + GAT',
            status: 'Completed'
          },
          {
            id: 'demo-2',
            date: '2026-08-29 10:15',
            prediction: 'Asthma',
            probability: 0.785,
            confidence: 'Medium',
            model: 'BioClinicalBERT + GAT',
            status: 'Completed'
          },
          {
            id: 'demo-3',
            date: '2026-08-28 16:45',
            prediction: 'Migraine',
            probability: 0.892,
            confidence: 'High',
            model: 'BioClinicalBERT + GAT',
            status: 'Completed'
          }
        ];
        sessionStorage.setItem('clinai_prediction_history', JSON.stringify(initialMock));
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
        sessionStorage.setItem('clinai_prediction_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save prediction history', e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    try {
      sessionStorage.removeItem('clinai_prediction_history');
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear prediction history', e);
    }
  };

  return {
    history,
    addHistoryItem,
    clearHistory
  };
}
