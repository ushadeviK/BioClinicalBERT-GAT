import { apiClient } from './client';
import { env } from '../config/env';

// List of available symptoms in the prototype config
export const SYMPTOMS_LIST = [
  'Fever', 'Cough', 'Shortness of breath', 'Chest pain', 'Fatigue', 
  'Headache', 'Nausea', 'Vomiting', 'Diarrhea', 'Loss of taste/smell',
  'Sore throat', 'Congestion', 'Runny nose', 'Muscle aches', 'Joint pain',
  'Chills', 'Dizziness', 'Confusion', 'Wheezing', 'Skin rash'
];

// Presets/Example cases to load easily in the UI
export const PRESET_CASES = [
  {
    name: 'Pneumonia Case Study (High Confidence)',
    age: 62,
    gender: 'male',
    symptoms: ['Fever', 'Cough', 'Shortness of breath', 'Chest pain'],
    clinical_text: '62-year-old male presents with acute onset of high fever (102.4F), productive cough with rust-colored sputum, and sharp pleuritic chest pain on the right side. On auscultation, decreased breath sounds and crackles are noted in the right lower lobe. Patient complains of moderate dyspnea at rest.'
  },
  {
    name: 'Asthma Exacerbation (Medium Confidence)',
    age: 28,
    gender: 'female',
    symptoms: ['Cough', 'Shortness of breath', 'Wheezing'],
    clinical_text: '28-year-old female with a history of mild persistent asthma presents with worsening cough and breathing difficulty over the past 48 hours. Symptoms triggered by a recent upper respiratory infection. Expiratory wheezes heard bilaterally. Speak in partial sentences.'
  },
  {
    name: 'Atypical Migraine (High Confidence)',
    age: 35,
    gender: 'female',
    symptoms: ['Headache', 'Nausea', 'Dizziness'],
    clinical_text: '35-year-old female complains of severe, throbbing unilateral headache accompanied by nausea and photophobia. Pain has lasted for 18 hours. Patient describes seeing visual aura (scintillating scotoma) prior to headache onset.'
  }
];

export const predictionApi = {
  /**
   * Run disease prediction
   */
  async predict(predictionRequest) {
    if (env.useMockApi) {
      // Simulate network request latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const textLower = (predictionRequest.clinical_text || '').toLowerCase();
      const hasHeadache = textLower.includes('headache') || textLower.includes('migraine') || predictionRequest.symptoms.includes('Headache');
      const hasAsthma = textLower.includes('asthma') || textLower.includes('wheez') || predictionRequest.symptoms.includes('Wheezing');
      
      let predictedDisease = 'Pneumonia';
      let probability = 0.914;
      let rawProb = 0.94;
      let confidence = 'High';
      let calibrationMethod = 'Temperature Scaling';

      if (hasHeadache) {
        predictedDisease = 'Migraine';
        probability = 0.892;
        rawProb = 0.91;
        confidence = 'High';
      } else if (hasAsthma) {
        predictedDisease = 'Asthma';
        probability = 0.785;
        rawProb = 0.84;
        confidence = 'Medium';
      }

      // Generate structured demo response matching clinical contract
      const response = {
        prediction: predictedDisease,
        probability: probability,
        confidence: confidence,
        probabilities: [
          { disease: predictedDisease, probability: probability },
          { disease: predictedDisease === 'Pneumonia' ? 'Asthma' : 'Pneumonia', probability: Math.max(0.01, (1 - probability) * 0.6) },
          { disease: predictedDisease === 'Migraine' ? 'Tension Headache' : 'Migraine', probability: Math.max(0.01, (1 - probability) * 0.25) },
          { disease: 'Other', probability: Math.max(0.01, (1 - probability) * 0.15) }
        ].sort((a, b) => b.probability - a.probability),
        
        evidence: predictionRequest.symptoms.map((symptom, idx) => ({
          feature: symptom.toLowerCase(),
          importance: parseFloat((0.35 - (idx * 0.08) + Math.random() * 0.05).toFixed(2))
        })).concat([
          { feature: 'clinical description text embedding', importance: 0.45 }
        ]).sort((a, b) => b.importance - a.importance),

        graph_evidence: [
          { source: 'Patient', relation: 'has symptom', target: predictionRequest.symptoms[0] || 'Fever', importance: 0.35 },
          { source: predictionRequest.symptoms[0] || 'Fever', relation: 'co-occurs', target: predictionRequest.symptoms[1] || 'Cough', importance: 0.24 },
          { source: predictionRequest.symptoms[1] || 'Cough', relation: 'indicates', target: predictedDisease, importance: 0.42 }
        ].filter(e => e.target !== undefined),

        calibration: {
          raw_probability: rawProb,
          calibrated_probability: probability,
          method: calibrationMethod
        },
        model: {
          name: 'BioClinicalBERT + GAT',
          version: '1.0'
        },
        request_id: `req-${Math.random().toString(36).substr(2, 9)}`
      };

      return response;
    }

    // Call real FastAPI server
    const response = await apiClient.post('/api/v1/predict', predictionRequest);
    return response.data;
  },

  /**
   * Check API health status
   */
  async checkHealth() {
    if (env.useMockApi) {
      return { status: 'healthy', database: 'connected', model: 'available', mock: true };
    }
    try {
      // First try standard /health endpoint as configured in our main.py
      const response = await apiClient.get('/health');
      return response.data;
    } catch (err) {
      // Fallback in case api/v1 prefix is applied by routers
      const fallback = await apiClient.get('/api/v1/health');
      return fallback.data;
    }
  }
};
