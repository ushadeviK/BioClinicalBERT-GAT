# BioClinicalBERT-GAT Framework with Explainable AI and Confidence Estimation for Accurate Clinical Disease Prediction

An academic research prototype that integrates deep clinical text representation, graph-structured relationship learning, local prediction explainability, and calibrated output probability scores for reliable, human-interpretable clinical disease classification.

---

## 1. Problem Statement

Clinical text in Electronic Health Records (EHR) contains rich, unstructured narratives of patient conditions. However, typical disease prediction models struggle with:
1. **Isolated Patient Inference:** Treating each record independently, ignoring common patient-disease clusters and hidden relational dynamics (e.g. patients sharing similar cohorts or symptoms).
2. **Black-Box Architecture:** Lacking semantic-level and feature-level explanations for patient classification.
3. **Overconfidence & Poor Calibration:** Expressing high confidence in predictions that are incorrect, which is a major barrier for clinical decision-support deployment.

---

## 2. Proposed Architecture

```mermaid
graph TD
    A[Clinical Note Text] --> B[BioClinicalBERT Embedder]
    B --> C[[CLS] Embeddings (768-dim)]
    C --> D[Patient Node Features]
    D --> E[Clinical Graph Construction]
    E --> F[Graph Attention Network (GAT)]
    F --> G[Raw Logits]
    G --> H[Temperature Scaling Calibration]
    H --> I[Calibrated Probabilities]
    I --> J[SHAP / Captum Explanations]
```

---

## 3. Technology Stack

* **Machine Learning & Core GNN:** PyTorch, PyTorch Geometric (PyG), scikit-learn
* **Clinical Language Representation:** Hugging Face `transformers` (BioClinicalBERT)
* **Explainable AI (XAI):** SHAP, Captum
* **Backend API Server:** FastAPI, Uvicorn, Pydantic
* **Frontend Interface:** React, Vite, Tailwind CSS
* **Database Management:** PostgreSQL, SQLAlchemy

---

## 4. Project Folder Structure

```text
bioclinicalbert-gat/
│
├── data/
│   ├── raw/                  # Raw medical texts & labels (Excluded from Git)
│   ├── processed/            # Preprocessed embeddings & graph graphs
│   └── external/             # Clinical taxonomies or external lookup charts
│
├── notebooks/                # Development and exploration notebooks (01 to 09)
│
├── src/                      # Core pipeline modules
│   ├── config/               # Reproducibility & variables loader
│   ├── data/                 # Cleaners, loader, & loaders split
│   ├── models/               # BioClinicalBERT wrapper, GAT model, and Hybrid
│   ├── graph/                # Patient similarity graph constructors
│   ├── confidence/           # Temperature scaling & calibration metrics
│   ├── explainability/       # SHAP and Captum attribution explainers
│   └── evaluation/           # Performance metrics and plots
│
├── backend/                  # FastAPI prediction endpoints
├── frontend/                 # React UI visual dashboard
├── tests/                    # Project validation unit tests
├── scripts/                  # Command-line environment checks and verification
├── configs/                  # Yaml configs containing hyperparams
└── requirements.txt          # Python package definitions
```

---

## 5. Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/username/bioclinicalbert-gat.git
   cd bioclinicalbert-gat
   ```

2. **Set up the virtual environment:**
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```

3. **Install Dependencies:**
   Since local development on this machine runs on **CPU**, install using the CPU PyTorch index:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up PostgreSQL Database:**
   Install PostgreSQL locally and configure the connection URL in `.env`:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/bioclinicalbert_gat
   ```

---

## 6. Environment Verification

Ensure the environment works correctly by running the validation suite:

```bash
# 1. Environment & Hardware Diagnostics
python scripts/check_environment.py

# 2. Verify BioClinicalBERT Extraction
python scripts/test_bioclinicalbert.py

# 3. Verify GAT Conv Forward Pass
python scripts/test_gat.py

# 4. Verify Explainability Imports
python scripts/test_explainability.py

# 5. Verify Confidence Calibration ECE Logic
python scripts/test_calibration.py
```

---

## 7. How to Run

### Run Unit Tests
```bash
pytest tests/
```

### Start Backend API Server
```bash
uvicorn backend.main:app --reload --port 8000
```
API Documentation will be accessible at: `http://127.0.5.1:8000/docs`

### Start Frontend UI Dev Server
```bash
cd frontend
npm install
npm run dev
```

---

## 8. Development Roadmap

1. **Phase 1-14: Setup and Verification** (Status: **Complete**)
2. **Phase 15: BioClinicalBERT Baseline**
3. **Phase 16: Clinical Patient Graph Construction**
4. **Phase 17: GAT Classifier Implementation**
5. **Phase 18: Integrated Hybrid Framework**
6. **Phase 19: Explainability Verification & Visualization**
7. **Phase 20: Confidence Calibration & Dashboard Deployment**

---

## 9. Ethical and Privacy Considerations

> [!WARNING]
> * **Patient Data Protection:** Never commit or upload actual clinical records (e.g. MIMIC-III, MIMIC-IV, or private hospital charts) to Git. The `.gitignore` file must always exclude `data/raw/` and `data/processed/`.
> * **No External Data Exposure:** Sensitive patient data must NOT be sent to external LLM services or public API endpoints. All models (BioClinicalBERT and GAT) run locally.
> * **Decision Support Only:** This system is an academic research prototype. It is designed to assist clinicians by providing attributions and calibrated confidence values, NOT to replace medical professionals.
