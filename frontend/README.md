# ClinAI — Clinical Disease Prediction Frontend Dashboard

ClinAI is a web application designed for research and decision-support modeling. It serves as the frontend for the **"BioClinicalBERT-GAT Framework with Explainable AI and Confidence Estimation for Accurate Clinical Disease Prediction"** system.

It integrates state-of-the-art Natural Language Processing (NLP) embeddings, Graph Attention Networks (GAT), prediction confidence calibration curves, and deep neural layer explanation tools.

---

## 1. Technology Stack

- **Framework**: React (v19) (JavaScript / JSX)
- **Tooling**: Vite (v8)
- **Styling**: Tailwind CSS (v3) with Custom Design Tokens
- **Routing**: React Router (v6)
- **Charts & Graphs**: Recharts (v2) & Scalable SVG Vectors
- **Icons**: Lucide React
- **API Communication**: Axios (v1)

---

## 2. Main Features

1. **Research Dashboard**: Summary stats, recent prediction archives, and an interactive step-by-step neural processing pipeline.
2. **Clinical Predictor Form**: Robust patient forms (Age, Gender, Symptoms chips search, Clinical narrative text area) with full validation constraints.
3. **Calibrated Results View**: Displays prediction outputs with Temperature-Scaled probabilities and confidence indicators.
4. **Explainable AI (XAI) Panel**:
   - **GAT Graph Visualizer**: Bipartite SVG graph drawing GAT attention edge weights between Patient, Symptoms, and Target classification nodes.
   - **Integrated Gradients Heatmap**: Token-level attribution weights highlighting words driving BioClinicalBERT's classifiers.
   - **Clinical Evidence Chart**: SHAP importance weights displayed as progress meters.
5. **Technical Spec sheet**: Visual representation of the dual BERT-GAT encoder network and parameters list.
6. **Safety & Privacy Compliance**: Zero logging or disk storage of sensitive clinical text descriptions; history logs are secured in temporary memory (`sessionStorage`).

---

## 3. Folder Structure

```text
frontend/
├── public/              # Static assets
├── src/
│   ├── api/             # Client configuration and prediction services
│   ├── components/
│   │   ├── layout/      # AppShell, Sidebar, Header, MobileNav
│   │   ├── ui/          # Buttons, Cards, Badges, Tooltips
│   │   ├── prediction/  # Form, selector chips, result charts, calibration cards
│   │   ├── explainability/# Evidence bars, token attribution heatmaps, SVG graphs
│   │   └── model/       # Flow diagrams and specs panels
│   ├── config/          # Environment variables loaders
│   ├── hooks/           # usePrediction, useHealth, useHistory custom hooks
│   ├── layouts/         # Routing layout wrapper
│   ├── pages/           # Page containers (Dashboard, Predict, Results, XAI, Specs, History, About, Settings)
│   ├── routes/          # Navigation routes registry
│   ├── utils/           # Formatters and text handlers
│   ├── App.jsx          # App root
│   ├── main.jsx         # App mounting
│   └── index.css        # Tailwind styles & CSS variables
├── .env.example         # Template for environment settings
├── .env                 # Local environment overrides
├── package.json         # Package configuration
├── vite.config.js       # Vite configuration
└── README.md            # Setup documentation
```

---

## 4. Setup & Running Locally

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation
Run the following command in the `frontend` folder to install dependencies:
```bash
npm install
```

### Environment Variables
Configure the API settings by creating a `.env` file in the `frontend` root:
```env
# URL target of FastAPI server
VITE_API_BASE_URL=http://localhost:8000

# Toggle Mock API simulation mode (true/false)
VITE_USE_MOCK_API=true
```

### Running Development Server
Start the local server with hot-reload:
```bash
npm run dev
```

### Building for Production
Compile optimized static assets in the `dist/` directory:
```bash
npm run build
```

### Previewing Production Build
Run a local server to preview the built assets:
```bash
npm run preview
```

---

## 5. API Contracts

### Prediction Endpoint (`POST /api/v1/predict`)

**Request Payload**:
```json
{
  "age": 62,
  "gender": "male",
  "symptoms": ["Fever", "Cough", "Shortness of breath"],
  "clinical_text": "62-year-old male presents with acute onset of high fever..."
}
```

**Response Payload**:
```json
{
  "prediction": "Pneumonia",
  "probability": 0.914,
  "confidence": "High",
  "probabilities": [
    { "disease": "Pneumonia", "probability": 0.914 },
    { "disease": "Asthma", "probability": 0.052 },
    { "disease": "Other", "probability": 0.034 }
  ],
  "evidence": [
    { "feature": "fever", "importance": 0.31 },
    { "feature": "cough", "importance": 0.28 }
  ],
  "graph_evidence": [
    { "source": "Patient", "relation": "has symptom", "target": "Fever", "importance": 0.35 }
  ],
  "calibration": {
    "raw_probability": 0.94,
    "calibrated_probability": 0.914,
    "method": "Temperature Scaling"
  },
  "model": {
    "name": "BioClinicalBERT + GAT",
    "version": "1.0"
  },
  "request_id": "req-9a3b8c"
}
```

### Health Check Endpoint (`GET /health` or `GET /api/v1/health`)

**Response Payload**:
```json
{
  "status": "healthy"
}
```
